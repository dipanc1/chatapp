import React, { useState } from 'react';
import axios from 'axios';

import { backend_url, stripePublicKey } from '../baseApi';

const Checkout = () => {
  const [amount, setAmount] = useState(1000);  // The default amount is $10 (1000 cents)
  const [currency, setCurrency] = useState('inr');
  const [sessionId, setSessionId] = useState(null);

  const handleClick = async () => {
    // Create a checkout session on the server
    const response = await axios.post(`${backend_url}/checkout/create-checkout-session`, { amount, currency });

    console.log(response, "<---")
    // Redirect the user to the checkout page
    const sessionId = response.data.id;
    const stripe = await window.Stripe(stripePublicKey);
    const result = await stripe.redirectToCheckout({ sessionId });
    console.log(result, "<=--- result")
    if (result.error) {
      console.error(result.error);
    }
  };

  return (
    <div>
      <label>
        Amount:
        <input type="number" value={amount} onChange={event => setAmount(event.target.value)} />
      </label>
      <br />
      <label>
        Currency:
        <select value={currency} onChange={event => setCurrency(event.target.value)}>
          <option value="inr">INR</option>
          <option value="usd">USD</option>
          <option value="eur">EUR</option>
          <option value="gbp">GBP</option>
        </select>
      </label>
      <br />
      <button onClick={handleClick}>Checkout</button>
    </div>
  );
};

export default Checkout;