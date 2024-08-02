import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { Box, Typography, List, ListItem, ListItemText, Button, Divider } from '@mui/material';
import { styled } from '@mui/system';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

function Cart() {
    const { cart, dispatch } = useCart();
    const navigate = useNavigate();

    const handleRemoveFromCart = (id) => {
        dispatch({
            type: 'REMOVE_FROM_CART',
            payload: { id },
        });
        toast.success('Removed item from cart!')
    };

    const handleClearCart = () => {
        dispatch({ type: 'CLEAR_CART' });
    };

    const handlePayment = () => {
        navigate('/payment')
    };

    const increaseQuantity = (id) => {
        dispatch({ type: 'ADD_TO_CART', payload: { id } });
    };
    
    const decreaseQuantity = (id) => {
        dispatch({ type: 'DECREASE_QUANTITY', payload: { id } });
    };
    

    console.log('Current cart state:', cart);


    return (
        <CartContainer sx={{my: 5}}>
            <Typography variant="h4" gutterBottom>
                Shopping Cart
            </Typography>
            <Divider sx={{ my: 2 }} />
            <List>
                {cart.items.length > 0 ? (
                    cart.items.map((item) => (
                        <ListItem key={item.id} sx={{ alignItems: 'center', mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <ItemImage src={`${import.meta.env.VITE_FILE_BASE_URL}/${item.image}`} alt={item.name} />
                                <ListItemText
                                    primary={<Typography variant="h6">{item.name}</Typography>}
                                    secondary={<Typography variant="body2">{item.price} points</Typography>}
                                    sx={{ ml: 2 }}
                                />
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Button onClick={() => increaseQuantity(item.id)}>+</Button>
                                <Typography>{item.quantity}</Typography>
                                <Button onClick={() => decreaseQuantity(item.id)}>-</Button>
                                <Button variant="contained" color="error" onClick={() => handleRemoveFromCart(item.id)}>
                                    Remove
                                </Button>
                            </Box>
                        </ListItem>
                    ))
                ) : (
                    <Typography variant="body1">Your cart is empty.</Typography>
                )}
            </List>

            {cart.items.length > 0 && (
                <Box display="flex" justifyContent="flex-end">
                    <Typography variant="h6">
                        Total Cost: {cart.items.reduce((total, item) => total + item.price * item.quantity, 0)} points
                    </Typography>
                </Box>
            )}

            
            {cart.items.length > 0 && (
            <Box display="flex" justifyContent="space-between">
                <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleClearCart}>
                    Clear Cart
                </Button>
                <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handlePayment}>
                    Proceed to Payment
                </Button>
            </Box>
            )}
            <ToastContainer />
        </CartContainer>
    );
}

const CartContainer = styled(Box)(({ theme }) => ({
    maxWidth: '800px',
    margin: 'auto',
    padding: theme.spacing(4) || '32px',
    backgroundColor: '#f9f9f9',
    borderRadius: theme.shape?.borderRadius || '8px',
    boxShadow: theme.shadows?.[2] || '0px 1px 3px rgba(0, 0, 0, 0.2)',
}));

const ItemImage = styled('img')(({ theme }) => ({
    width: '100px',
    height: '100px',
    objectFit: 'cover',
    borderRadius: theme.shape?.borderRadius || '8px',
}));

export default Cart;
