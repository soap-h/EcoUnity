// Success.jsx

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import http from '../http';

function Success() {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                // Retrieve session information from Stripe
                const { data } = await http.get(`/payment/checkout-session/${sessionId}`);
                
                if (data.payment_status === 'paid') {
                    // If payment is successful, send the receipt email
                    await http.post('/payment/send-receipt', { sessionId });
                    setSuccess(true);
                } else {
                    setError('Payment was not successful.');
                }
            } catch (err) {
                setError('Error verifying payment.');
            } finally {
                setLoading(false);
            }
        };

        if (sessionId) {
            verifyPayment();
        } else {
            setError('No session ID found.');
            setLoading(false);
        }
    }, [sessionId]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ padding: 4 }}>
                <Typography variant="h4" color="error" gutterBottom>
                    {error}
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" gutterBottom>
                Payment Successful!
            </Typography>
            <Typography variant="body1">
                Thank you for your purchase. A receipt has been sent to your email.
            </Typography>
        </Box>
    );
}

export default Success;
