import React from 'react';
import { Box, Typography, Button, Grid, Paper, List, ListItem } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useCart } from '../contexts/CartContext';
import { styled } from '@mui/system';
import CheckoutForm from '../components/CheckoutForm'; // Ensure you have the correct path

const stripePromise = loadStripe('pk_test_51PibywRwqbBNo0bk0Y04vn93VZZoeNxfBZzlbLy8KVwfvEAi0OnxZPtCfhbbjCG2rjVuJ0Wcg4cznTAE22QPP4Zo00WRmChZjd');

const validationSchema = yup.object({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    address: yup.string().required('Address is required'),
    postalCode: yup.number().required('Postal code is required'),
    phoneNumber: yup.number().required('Phone number is required'),
    email: yup.string().email('Enter a valid email').required('Email is required'),
});

function Payment() {
    const totalAmount = 9000; // Replace with your dynamic total amount
    const { cart, dispatch } = useCart();

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            address: '',
            postalCode: '',
            phoneNumber: '',
            email: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            formik.setSubmitting(true); // Trigger form submission
        },
    });

    const increaseQuantity = (id) => {
        dispatch({ type: 'ADD_TO_CART', payload: { id } });
    };

    const decreaseQuantity = (id) => {
        dispatch({ type: 'DECREASE_QUANTITY', payload: { id } });
    };

    const handleCheckout = () => {
        console.log("Checkout successful!");
        dispatch({ type: 'CLEAR_CART' });
    };

    return (
        <Elements stripe={stripePromise}>
            <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
                <Grid item xs={12} sm={8} md={6}>
                    <Paper elevation={3} sx={{ padding: 4, backgroundColor: 'rgba(232,225,225,0.85)', mt: 1, border: '1px solid rgba(0,0,0,0.1)' }}>
                        <Typography variant="h4" gutterBottom align="center">
                            Complete Your Purchase
                        </Typography>
                        <CheckoutForm totalAmount={totalAmount} handleCheckout={handleCheckout} formik={formik} />
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={4} md={3}>
                    <Paper elevation={3} sx={{ padding: 2, margin: 2, backgroundColor: 'rgba(232,225,225,0.85)', border: '1px solid rgba(0,0,0,0.1)' }}>
                        <Typography variant="h6" gutterBottom>
                            Your Cart
                        </Typography>
                        <List>
                            {cart.items.length > 0 ? (
                                cart.items.map((item) => (
                                    <ListItem key={item.id} sx={{ alignItems: 'center', mb: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', width: '60%' }}>
                                                <ItemImage src={`${import.meta.env.VITE_FILE_BASE_URL}/${item.image}`} alt={item.name} />
                                                <Box sx={{ ml: 2, width: 'calc(100% - 60px)', wordWrap: 'break-word' }}>
                                                    <Typography variant="body1">{item.name}</Typography>
                                                    <Typography variant="body2">{item.price} points</Typography>
                                                </Box>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20%' }}>
                                                <Typography variant="body2"sx={{ mx: 1 }}>{item.quantity} qty</Typography>
                                            </Box>
                                            <Typography variant="body2" sx={{ width: '20%', textAlign: 'right' }}>{item.price * item.quantity} pts</Typography>
                                        </Box>
                                    </ListItem>
                                ))
                            ) : (
                                <Typography variant="body1">Your cart is empty.</Typography>
                            )}
                        </List>

                        {cart.items.length > 0 && (
                            <Box display="flex" justifyContent="space-between" mt={2}>
                                <Typography>
                                    Total Cost: {cart.items.reduce((total, item) => total + item.price * item.quantity, 0)} points
                                </Typography>
                            </Box>
                        )}
                        <Typography> Your Balance after: 0 </Typography>
                        <Typography>Shipping: $2.50 SGD</Typography>
                        <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={formik.submitForm}>
                            Checkout
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
        </Elements>
    );
};

const ItemImage = styled('img')(({ theme }) => ({
    width: '50px',
    height: '50px',
    objectFit: 'cover',
    borderRadius: theme.shape?.borderRadius || '8px',
}));

export default Payment;
