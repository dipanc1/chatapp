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
  // Use an existing Customer ID if this is a returning customer.
  const customer = await stripe.customers.create();
  const ephemeralKey = await stripe.ephemeralKeys.create(
    { customer: customer.id },
    { apiVersion: '2022-11-15' }
  );
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1099,
    currency: 'eur',
    customer: customer.id,
    payment_method_types: ['bancontact', 'card', 'ideal', 'klarna', 'sepa_debit', 'sofort'],
  });

  res.json({
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
    publishableKey: 'pk_test_51BTUDGJAJfZb9HEBwDg86TN1KNprHjkfipXmEDMb0gSCassK5T3ZfxsAbcgKVmAIXF7oZ6ItlZZbXO6idTHE67IM007EwQ4uN3'
  });
});

module.exports = router;