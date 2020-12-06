const express = require("express");
const app = express();
const cors = require('cors')


const { resolve } = require("path");
// Replace if using a different env file or config
const env = require("dotenv").config({ path: "./.env" });
const stripe = require('stripe')(process.env.STRIPE_KEY);

app.use(express.static(process.env.STATIC_DIR));
app.use(express.json());
app.use(cors());

// Use body-parser to retrieve the raw body as a buffer
const bodyParser = require('body-parser');

const calculateOrderAmount = items => {
  return 1200 * parseInt(items, 10);
};

app.get("/", async (req, res) => {
  // Display checkout page
  const path = resolve(process.env.STATIC_DIR + "/index.html");
  res.sendFile(path);
});

app.post("/pay", async (req, res) => {
  const { items, currency } = req.body;
  const intent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: currency,
    metadata: {integration_check: 'item'},
  });
  res.json({clientSecret: intent.client_secret});
})

app.post("/webhook", bodyParser.raw({type: 'application/json'}), async (request, response) => {
  let event;
  const sig = request.headers['stripe-signature'];
  const endpointSecret = process.env.WEBHOOK_SIGNATURE;
  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
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
  response.json({received: true});
});

app.listen(4242, () => console.log(`Node server listening on port ${4242}!`));
