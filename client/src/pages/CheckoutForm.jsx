import React from 'react';
import { CardElement } from '@stripe/react-stripe-js';
import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material';

function CheckoutForm({ totalAmount, handleCheckout, formik }) {
    return (
        <form onSubmit={formik.handleSubmit}>
            <Box sx={{ mt: 2 }}>
                <TextField
                    fullWidth
                    label="First Name"
                    name="firstName"
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                    helperText={formik.touched.firstName && formik.errors.firstName}
                    sx={{ mb: 2 }}
                />
                <TextField
                    fullWidth
                    label="Last Name"
                    name="lastName"
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                    helperText={formik.touched.lastName && formik.errors.lastName}
                    sx={{ mb: 2 }}
                />
                <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                    sx={{ mb: 2 }}
                />
                <TextField
                    fullWidth
                    label="Phone Number"
                    name="phoneNumber"
                    value={formik.values.phoneNumber}
                    onChange={formik.handleChange}
                    error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                    helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                    sx={{ mb: 2 }}
                />
                <TextField
                    fullWidth
                    label="Address"
                    name="address"
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    error={formik.touched.address && Boolean(formik.errors.address)}
                    helperText={formik.touched.address && formik.errors.address}
                    sx={{ mb: 2 }}
                />
                <TextField
                    fullWidth
                    label="Postal Code"
                    name="postalCode"
                    value={formik.values.postalCode}
                    onChange={formik.handleChange}
                    error={formik.touched.postalCode && Boolean(formik.errors.postalCode)}
                    helperText={formik.touched.postalCode && formik.errors.postalCode}
                    sx={{ mb: 2 }}
                />
            </Box>
            <Box sx={{ mt: 3 }}>
                <Typography variant="h6">Payment Details</Typography>
                <CardElement options={{ hidePostalCode: true }} />
            </Box>
            {formik.isSubmitting ? (
                <CircularProgress sx={{ mt: 3 }} />
            ) : (
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 3 }}
                    disabled={!formik.isValid || formik.isSubmitting}
                >
                    Pay {totalAmount}
                </Button>
            )}
        </form>
    );
}

export default CheckoutForm;
