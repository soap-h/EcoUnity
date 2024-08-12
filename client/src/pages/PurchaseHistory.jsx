import React, { useState, useEffect, useContext } from 'react';
import { Box, ListItem, ListItemText, Typography } from '@mui/material';
import http from '../http';
import UserContext from '../contexts/UserContext';

function PurchaseHistory() {
    const [purchases, setPurchases] = useState([]);
    const { user } = useContext(UserContext);
    const userId = user.id;

    useEffect(() => {
        http.get('/purchase', { params: { userId } }) // Pass the userId as a query parameter
            .then(response => {
                setPurchases(response.data);
            }).catch(error => {
                console.error('Failed to fetch purchases:', error);
            });
    }, [userId]);

    return(
        <>
            {purchases.map((purchase, index) => (
                <ListItem key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                    {/* Product Image */}
                    <Box component="img"
                        src={`${import.meta.env.VITE_FILE_PRODUCTS_URL}/${purchase.Product.prod_img}`} // Assuming 'Product' contains 'prod_img'
                        alt={purchase.Product.prod_name}
                        sx={{ width: 100, height: 100, mr: 2 }} // Adjust size as needed
                    />
                    
                    <ListItemText
                        primary={`Product: ${purchase.Product.prod_name}`} // Assuming 'Product' is populated
                        secondary={
                            <>
                                <Typography variant="body2" color="textPrimary">
                                    Quantity: {purchase.quantity} 
                                </Typography>
                                <Typography variant="body2" color="textPrimary">
                                    Total Price: ${purchase.totalprice}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Purchased on: {new Date(purchase.createdAt).toLocaleDateString()} {/* Format date */}
                                </Typography>
                            </>
                        }
                        sx={{ ml: 2 }}
                    />
                </ListItem>
            ))}
        </>
    );
}

export default PurchaseHistory;
