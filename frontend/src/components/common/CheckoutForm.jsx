import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);

  const style = {
    base: {
      fontSize: '16px',
      color: '#32325d',
      fontFamily: 'Arial, sans-serif',
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });

    if (error) {
      setError(error.message);
    } else {
      // Handle the successful payment here
      console.log('Payment succeeded:', paymentMethod);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="payment-form">
        <label>
          Card details
          <CardElement options={{ style: style }} />
        </label>
        {error && <div className="error-message">{error}</div>}
        <button type="submit" className="pay-button">
          Pay
        </button>
      </div>
    </form>
  );
};

export default CheckoutForm;
