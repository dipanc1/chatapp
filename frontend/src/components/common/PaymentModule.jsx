import React, { useEffect, useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { Box, useToast } from "@chakra-ui/react";
import donationApi from "../../services/apis/donationApi";

export default function PaymentModule() {
  const stripe = useStripe();
  const elements = useElements();
  const toast = useToast();

  const user = JSON.parse(localStorage.getItem("user"));
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          handleContribution(paymentIntent);
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe]);

  const handleContribution = async (payload) => {
    console.log(payload, "<--- payload")
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    };
    const { data } = await donationApi.contributeToDonation(payload.description, { amount: payload.amount / 100 }, config);
    console.log(data, "<--our Api")
    if (data) {
      toast({
        title: "Donation Successful!",
        description: "Thank you for your contribution",
        status: "success",
        isClosable: true,
        position: "bottom",
        duration: 5000,
      });
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:3000/contribute",
      },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: "tabs"
  }

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" options={paymentElementOptions} />
      <Box textAlign="right" mt="20px">
          <button className="btn btn-primary" disabled={isLoading || !stripe || !elements} id="submit">
              <span id="button-text">
              {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
              </span>
          </button>
      </Box>
      {message && <div id="payment-message">{message}</div>}
    </form>
  )
}