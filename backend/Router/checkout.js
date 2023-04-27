const router = require("express").Router();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post('/create-checkout-session', async (req, res) => {
  const { subscribeData } = req.body;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: subscribeData.name,
        },
        unit_amount: subscribeData.amount,
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: 'https://chatapp.wildcrypto.com/subscribed-successfully',
    cancel_url: 'https://chatapp.wildcrypto.com/error-subscribing',
    customer_email: "sahil@gmail.com",
    metadata: {
      phone_number: '+1234567890',
    },
  });

  console.log(session, "<-- sesion server")

  res.json({ id: session.id });
});

module.exports = router;