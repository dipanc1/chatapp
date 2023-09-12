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
  });

  console.log(session, "<-- sesion server")

  res.json({ id: session.id });
});


router.post('/payment-sheet', async (req, res) => {
  const { amount } = req.body;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100,
    currency: 'usd',
    payment_method_types: ['card'],
  });

  res.json({
    paymentIntent: paymentIntent.client_secret,
    publishableKey: 'pk_test_51N136dLHtaKT8adL3kfRwpts2g1xBKHE9A1flPHC1eE5rQzHZHO6NcdCNZEmuQWJ2lZiqMJ0hdeqRUdWvaWnVkaa000amUm8tU'
  });
});

module.exports = router;