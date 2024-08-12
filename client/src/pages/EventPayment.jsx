import React, { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Grid, Paper } from '@mui/material';
import { loadStripe } from '@stripe/stripe-js';
import UserContext from '../contexts/UserContext';
import http from '../http';

const stripePromise = loadStripe('pk_test_51PmSFiFpoOUPPAxlsyo5TmSRhjZOa1dsX7QkKYWRUAyVaILMCEknE9CqcUONBj6ah1bqYfSNAaaE9JsgOmcB8arE00UP5Y5YgG');

function EventPayment() {
    const location = useLocation();
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const { amount, currency, eventTitle, eventDetails, eventDate, eventTime, eventVenue, eventId } = location.state || {};

    if (!amount || !currency || !eventTitle || !eventId) {
        return <Typography>Error: Missing payment details</Typography>;
    }

    const handleCheckout = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        const stripe = await stripePromise;

        try {
            const response = await http.post('/payment/create-checkout-session', {
                eventTitle,
                amount,
                currency,
                email: user.email, // Pass the user's email for receipt
                eventId,  // Pass the event ID
            });

            const { id } = response.data;

            await stripe.redirectToCheckout({ sessionId: id });
        } catch (error) {
            console.error('Error during checkout:', error.message);
        }
    };

    return (
        <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
            <Grid item xs={12} sm={8} md={6}>
                <Paper elevation={3} sx={{ padding: 4, backgroundColor: 'rgba(232,225,225,0.85)', mt: 1, border: '1px solid rgba(0,0,0,0.1)' }}>
                    <Typography variant="h4" gutterBottom align="center">
                        {eventTitle}
                    </Typography>
                    <Typography variant="body1" align="center">
                        {eventDate} | {eventTime}
                    </Typography>
                    <Typography variant="body2" align="center" gutterBottom>
                        {eventVenue}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        {eventDetails}
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 3 }} align="center">
                        Total: {amount} {currency}
                    </Typography>

                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleCheckout}
                    >
                        Proceed to Payment
                    </Button>
                </Paper>
            </Grid>
        </Grid>
    );
}

export default EventPayment;
