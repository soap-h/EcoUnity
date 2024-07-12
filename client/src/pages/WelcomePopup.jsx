import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const WelcomePopup = ({ userName, onClose }) => {
    return (
        <Box sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
        }}>
            <Box sx={{
                backgroundColor: 'white',
                borderRadius: 2,
                p: 3,
                textAlign: 'center',
                maxWidth: 400,
                width: '80%',
            }}>
                <Typography variant="h4">😊</Typography>
                <Typography variant="h6" sx={{ mt: 2 }}>Welcome back, {userName}.</Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                    We missed you blah blah blah
                </Typography>
                <Button variant="contained" sx={{ mt: 3 }} onClick={onClose}>Close</Button>
            </Box>
        </Box>
    );
};

export default WelcomePopup;
