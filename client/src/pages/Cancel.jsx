import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';

function Cancel() {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');

    return (
        <Box sx={{ padding: 4, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
                Booking has been cancelled.
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
                Wanna check out other events?
            </Typography>
            <Button
                variant="contained"
                color="primary"
                sx={{ mt: 3 }}
                href="/events"
            >
                Events
            </Button>
            <Button
                variant="contained"
                color="primary"
                sx={{ mt: 3 }}
                href="/"
            >
                Home
            </Button>
        </Box>
    );
}

export default Cancel;
