// src/context/CartContext.js
import React, { createContext, useReducer, useContext, useEffect } from 'react';

// Initial state of the cart
const initialState = {
    items: JSON.parse(localStorage.getItem('cartItems')) || [],
};

const cartReducer = (state, action) => {
    let updatedItems;
    switch (action.type) {
        case 'ADD_TO_CART':
            // Check if the item already exists in the cart
            const existingItemIndex = state.items.findIndex(item => item.id === action.payload.id);
            if (existingItemIndex >= 0) {
                // Update quantity if the item exists
                updatedItems = state.items.map((item, index) =>
                    index === existingItemIndex ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                // Add new item with quantity 1 if it doesn't exist
                updatedItems = [...state.items, { ...action.payload, quantity: 1 }];
            }
            break;
        case 'DECREASE_QUANTITY':
            updatedItems = state.items.map(item =>
                item.id === action.payload.id ? { ...item, quantity: item.quantity - 1 } : item
            ).filter(item => item.quantity > 0);
            break;
        case 'REMOVE_FROM_CART':
            updatedItems = state.items.filter(item => item.id !== action.payload.id);
            break;
        case 'CLEAR_CART':
            updatedItems = [];
            break;
        case 'SET_CART':
            updatedItems = action.payload;
            break;
        default:
            return state;
    }
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
    return { ...state, items: updatedItems };
};


const CartContext = createContext();

export const useCart = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, initialState);

    useEffect(() => {
        const cartData = JSON.parse(localStorage.getItem('cartItems'));
        if (cartData) {
            dispatch({ type: 'SET_CART', payload: cartData });
        }
    }, []);

    return (
        <CartContext.Provider value={{ cart: state, dispatch }}>
            {children}
        </CartContext.Provider>
    );
};
