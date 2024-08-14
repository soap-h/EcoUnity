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
                    // Register the participant using the event ID from metadata
                    await http.put(`/events/${data.metadata.eventId}/register`);
                    
                    // Send the receipt email
                    await http.post('/payment/send-receipt', { sessionId });
                    setSuccess(true);
                } else {
                    setError('Payment was not successful.');
                }
            } finally {
                setLoading(false);
            }
        };

        if (sessionId) {
            verifyPayment();
        } else {
            setLoading(false);
            setSuccess(true); // Assuming the user is registering for a free event
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
                {sessionId ? 'Payment Successful!' : 'Registration Successful!'}
            </Typography>
            <Typography variant="body1">
                {sessionId 
                    ? 'Thank you for your purchase. A receipt has been sent to your email.' 
                    : 'You have successfully registered for the event.'
                }
            </Typography>
        </Box>
    );
}

export default Success;
