const stripe = require('stripe')(process.env.STRIPE_SK);
var express = require('express');
const bodyParser = require("body-parser")


const { getCost } = require("../../utils/cost")
const { addToSpreadsheet } = require("../../utils/afterPayment")
const { addToDatabase, getOrderFromDatabase } = require("../../utils/database")

var router = express.Router();

router.post('/createPayment', async (req, res) => {

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



module.exports = router;
