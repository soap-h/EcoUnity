// src/layouts/CartLayout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import { CartProvider } from '../contexts/CartContext';

const CartLayout = () => {
    return (
        <CartProvider>
            <Outlet />
        </CartProvider>
    );
};

export default CartLayout;
