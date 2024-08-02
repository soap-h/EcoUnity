import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, Paper } from '@mui/material';
import { useLocation } from 'react-router-dom'; // Assuming you're using react-router

function OrderConfirm() {
    const location = useLocation();
    const { orderNumber, items } = location.state; // Assuming you're passing state through the router

    return (
        <Box sx={{ maxWidth: '800px', margin: 'auto', padding: 4 }}>
            <Paper elevation={3} sx={{ padding: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Thank You for Your Purchase!
                </Typography>
                <Typography variant="h6" gutterBottom>
                    Order Confirmed
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Your order number is <strong>{orderNumber}</strong>. A confirmation email has been sent to you.
                </Typography>
                <Typography variant="h6" gutterBottom>
                    Order Summary
                </Typography>
                <List>
                    {items.map((item, index) => (
                        <ListItem key={index}>
                            <ListItemText
                                primary={item.name}
                                secondary={`Quantity: ${item.quantity} | Price: ${item.price} points`}
                            />
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Box>
    );
};

export default OrderConfirm;
