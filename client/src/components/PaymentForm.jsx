import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Box, Button, Typography } from '@mui/material';
import http from '../http';

const PaymentForm = ({ amount, currency, onPaymentSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        const { error: backendError, clientSecret } = await http.post('/create-payment-intent', { amount, currency })
            .then((response) => response.data)
            .catch((err) => {
                setError('Failed to create payment intent');
                return { error: err };
            });

        if (backendError) {
            setError(backendError.message);
            setIsLoading(false);
            return;
        }

        const cardElement = elements.getElement(CardElement);
        const { paymentIntent, error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement,
            },
        });

        if (stripeError) {
            setError(stripeError.message);
            setIsLoading(false);
            return;
        }

        if (paymentIntent.status === 'succeeded') {
            onPaymentSuccess(paymentIntent);
        } else {
            setError('Payment failed');
        }

        setIsLoading(false);
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <CardElement options={{ hidePostalCode: true }} />
            {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
            <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={!stripe || isLoading}
                sx={{ mt: 3 }}
            >
                {isLoading ? 'Processing...' : 'Pay Now'}
            </Button>
        </Box>
    );
};

export default PaymentForm;
