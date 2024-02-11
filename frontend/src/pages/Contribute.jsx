import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentModule from '../components/common/PaymentModule';
import { backend_url } from '../utils';
import { Box, Heading } from '@chakra-ui/react';

const stripePromise = loadStripe(
    'pk_test_51N136dLHtaKT8adL3kfRwpts2g1xBKHE9A1flPHC1eE5rQzHZHO6NcdCNZEmuQWJ2lZiqMJ0hdeqRUdWvaWnVkaa000amUm8tU',
);

const Contribute = () => {
    const [clientSecret, setClientSecret] = useState('');
    let donationId = '';
    useEffect(() => {
        let donationAmount = new URLSearchParams(window.location.search).get(
            'amount',
        );
        donationId = new URLSearchParams(window.location.search).get(
            'donationId',
        );
        if (!donationAmount) {
            donationAmount = 1;
        }
        if (!donationId) {
            donationId = null;
        }
        // Create PaymentIntent as soon as the page loads
        fetch(`${backend_url}/checkout/create-payment-intent`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                amount: parseInt(donationAmount),
                donationId,
            }),
        })
            .then((res) => res.json())
            .then((data) => setClientSecret(data.clientSecret));
    }, []);

    const appearance = {
        theme: 'stripe',
    };
    const options = {
        clientSecret,
        appearance,
    };

    return (
        <Box background='#f4f1ff' py='70px' minH='100vh'>
            <Box
                background='#fff'
                shadow='xl'
                maxW='450px'
                mx='auto'
                p='40px'
                borderRadius='10px'
            >
                <Heading as='h1' size='lg' textAlign='center' fontWeight='500'>
                    Contribute to Group
                </Heading>
                <Box mx='auto' mt='30px'>
                    <div className='App'>
                        {clientSecret && (
                            <Elements options={options} stripe={stripePromise}>
                                <PaymentModule />
                            </Elements>
                        )}
                    </div>
                </Box>
            </Box>
        </Box>
    );
};

export default Contribute;
