import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, Grid, TextField, RadioGroup, FormControlLabel, Radio, Button } from '@mui/material';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import PayPalButton from '../components/PayPalButton';
import { styled } from '@mui/system';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import http from '../http';
import UserContext from '../contexts/UserContext';

const validationSchema = yup.object({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    address: yup.string().required('Address is required'),
    postalCode: yup.number().required('Postal code is required'),
    phoneNumber: yup.number().required('Phone number is required'),
    email: yup.string().email('Enter a valid email').required('Email is required'),
});

const CheckoutForm = ({ formik, totalAmount, handleCheckout }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('stripe');
    const navigate = useNavigate();
    const { cart } = useCart();
    const { user } = useContext(UserContext)

    const handleStripePayment = async (values) => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3001/create-payment-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    items: cart.items,
                    email: values.email,
                }),
            });

            const { clientSecret } = await response.json();
            console.log('Received clientSecret:', clientSecret); // Add this line

            const payload = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: {
                        name: `${values.firstName} ${values.lastName}`,
                        email: values.email,
                        address: {
                            line1: values.address,
                            postal_code: values.postalCode,
                        },
                    },
                },
            });

            setLoading(false);

            if (payload.error) {
                setError(`Payment failed: ${payload.error.message}`);
            } else {
                try {
                    setError(null);
                    alert('Payment Successful!');
                
                    // minus stock and add to purchase.
                    const data = { items: cart.items };
                    await http.patch(`/products`, data);

                    const purchaseData = {
                        userId: user.id,  // Assuming you have the user's ID
                        items: cart.items.map(item => ({
                            productId: item.id, 
                            quantity: item.quantity, 
                            totalPrice: item.price * item.quantity,  // Store the price at the time of purchase
                            // other necessary fields
                        })),
                    };
                    await http.post('/purchase', purchaseData);

                    handleCheckout(); // clears cart
                    navigate('/orderconfirm', { state: { orderNumber: payload.paymentIntent.id, items: cart.items } });
                } 
                catch (error) {
                    console.error('Error updating stock or recording purchase:', error);
                }
                
            }
        } catch (error) {
            setError(`Payment failed: ${error.message}`);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (formik.isSubmitting) {
            if (paymentMethod === 'stripe') {
                handleStripePayment(formik.values);
            } else {
                formik.setSubmitting(false);
            }
        }
    }, [formik.isSubmitting]);

    return (
        <form onSubmit={formik.handleSubmit}>
            <Typography variant="h6" gutterBottom>
                Payment Information
            </Typography>
            {paymentMethod === 'stripe' && (
                <Box>
                    <CardElementContainer>
                        <CardElement />
                    </CardElementContainer>
                    {error && (
                        <Typography color="error" mt={2}>
                            {error}
                        </Typography>
                    )}
                </Box>
            )}
            {paymentMethod === 'paypal' && <PayPalButton />}

            <Typography variant="h6" gutterBottom>
                Delivery Information
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        id="firstName"
                        name="firstName"
                        label="First Name"
                        value={formik.values.firstName}
                        onChange={formik.handleChange}
                        error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                        helperText={formik.touched.firstName && formik.errors.firstName}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        id="lastName"
                        name="lastName"
                        label="Last Name"
                        value={formik.values.lastName}
                        onChange={formik.handleChange}
                        error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                        helperText={formik.touched.lastName && formik.errors.lastName}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        id="address"
                        name="address"
                        label="Address"
                        value={formik.values.address}
                        onChange={formik.handleChange}
                        error={formik.touched.address && Boolean(formik.errors.address)}
                        helperText={formik.touched.address && formik.errors.address}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        id="postalCode"
                        name="postalCode"
                        label="Postal Code"
                        value={formik.values.postalCode}
                        onChange={formik.handleChange}
                        error={formik.touched.postalCode && Boolean(formik.errors.postalCode)}
                        helperText={formik.touched.postalCode && formik.errors.postalCode}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        id="phoneNumber"
                        name="phoneNumber"
                        label="Phone Number"
                        value={formik.values.phoneNumber}
                        onChange={formik.handleChange}
                        error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                        helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        id="email"
                        name="email"
                        label="E-mail address"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                    />
                </Grid>
            </Grid>
            <Box mt={3}>
                <Typography variant="h6" gutterBottom>
                    Select Payment Method
                </Typography>
                <RadioGroup
                    aria-label="paymentMethod"
                    name="paymentMethod"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                >
                    <FormControlLabel value="stripe" control={<Radio />} label="Stripe" />
                    <FormControlLabel value="paypal" control={<Radio />} label="PayPal" />
                </RadioGroup>
            </Box>
        </form>
    );
};

const CardElementContainer = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    border: `1px solid rgba(0,0,0,0.3)`,
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(2),
}));

export default CheckoutForm;
