const stripe = require('stripe')(process.env.STRIPE_SK);
var express = require('express');
const bodyParser = require("body-parser")


const { getCost } = require("../utils/cost")
const { addToSpreadsheet } = require("../utils/afterPayment")
const { addToDatabase, getOrderFromDatabase } = require("../utils/database")
const { isOpen } = require("../utils/changeHours")

var router = express.Router();

router.post('/createPayment', async (req, res) => {
  if(!(await isOpen())){
    res.json({ customError: "We were unable to process your order because we are no longer taking orders at this time. We are open Monday to Friday 11-6." })
    return
  }
  let _id = await addToDatabase(req.body.items, req.body.customerDetails)

  try{
      let totalCost = await getCost(req.body.items)
      if(req.body.delivery) totalCost += 349
      const paymentIntent = await stripe.paymentIntents.create({
          amount: totalCost,
          currency: 'cad',
          // Verify your integration in this guide by including this parameter
          metadata: {
            integration_check: 'accept_a_payment', // KEEP THIS
            _id
          },
      });
      const intent = await stripe.paymentIntents.retrieve(paymentIntent.id);
      res.json({client_secret: intent.client_secret});
  }catch(err){
    console.log("ERROR (/createPayment): ", err)
  }
  
});

router.post('/completed', bodyParser.raw({type: 'application/json'}), async (request, response) => {
    const event = request.body;
    console.log("hook activated")
    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log("PAYMENT COMPLETED")
        let order = await getOrderFromDatabase(paymentIntent.metadata._id)
        addToSpreadsheet(order.items, order.customerDetails)
        console.log('PaymentIntent was successful!');
        break;
      case 'payment_method.attached':
        const paymentMethod = event.data.object;
        console.log('PaymentMethod was attached to a Customer!');
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  
    // Return a 200 response to acknowledge receipt of the event
    response.json({received: true});
});

router.post('/create-payment-intent', async (req, res) => {
  console.log("Attempt")
  const { paymentMethodType, currency } = req.body;

  // Each payment method type has support for different currencies. In order to
  // support many payment method types and several currencies, this server
  // endpoint accepts both the payment method type and the currency as
  // parameters.
  //
  // Some example payment method types include `card`, `ideal`, and `alipay`.
  const params = {
    payment_method_types: [paymentMethodType],
    amount: 50,
    currency: currency,
  }

  // If this is for an ACSS payment, we add payment_method_options to create
  // the Mandate.
  if(paymentMethodType === 'acss_debit') {
    params.payment_method_options = {
      acss_debit: {
        mandate_options: {
          payment_schedule: 'sporadic',
          transaction_type: 'personal',
        },
      },
    }
  }

  // Create a PaymentIntent with the amount, currency, and a payment method type.
  //
  // See the documentation [0] for the full list of supported parameters.
  //
  // [0] https://stripe.com/docs/api/payment_intents/create
  try {
    const paymentIntent = await stripe.paymentIntents.create(params);

    // Send publishable key and PaymentIntent details to client
    res.send({
      clientSecret: paymentIntent.client_secret
    });

  } catch(e) {
    return res.status(400).send({
      error: {
        message: e.message
      }
    });
  }
});


module.exports = router;
