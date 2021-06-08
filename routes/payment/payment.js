const stripe = require('stripe')(process.env.STRIPE_SK);
var express = require('express');
const bodyParser = require("body-parser")

var router = express.Router();
const { getCost } = require("../../utils/cost")

// NOTE: Easiest solution would be to find a way to insert a custom attribute into the paymentIntent that sends over the data.  
// https://stripe.com/docs/api/payment_intents/object
// Then in /completed you can find the data in paymentIntent and upload it to mongo etc
// If that doesnt work then you can upload the data in /createPayment then send the _id through the paymentIntents

router.post('/createPayment', async (req, res) => {
    const paymentIntent = await stripe.paymentIntents.create({
        amount: await getCost(req.body),
        currency: 'cad',
        // Verify your integration in this guide by including this parameter
        metadata: {integration_check: 'accept_a_payment'},
    });
    const intent = await stripe.paymentIntents.retrieve(paymentIntent.id);
    res.json({client_secret: intent.client_secret});
    console.log("REACHeD HERE")
});

router.post('/completed', bodyParser.raw({type: 'application/json'}), (request, response) => {
    const event = request.body;
  
    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log("PAYMENT COMPLETED", paymentIntent)
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

module.exports = router;
