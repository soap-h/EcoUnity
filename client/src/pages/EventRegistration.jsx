import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import http from '../http';

function EventRegistration() {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await http.get(`/events/${id}`);
                setEvent(response.data);
            } catch (error) {
                console.error('Failed to fetch event:', error);
                setError('Failed to fetch event details.');
            }
        };

        fetchEvent();
    }, [id]);

    const handleRegister = async () => {
        if (event.registered < event.participants) {
            try {
                await http.put(`/events/${id}/register`);
                setEvent({ ...event, registered: event.registered + 1 });
            } catch (error) {
                console.error('Failed to register for event:', error);
                setError('Failed to register for event.');
            }
        } else {
            setError('Event is fully booked.');
        }
    };

    if (!event) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4">{event.title}</Typography>
            <Typography variant="body1">{event.details}</Typography>
            <Typography variant="body1">{new Date(event.date).toDateString()}</Typography>
            <Typography variant="body1">{`${event.timeStart} - ${event.timeEnd}`}</Typography>
            <Typography variant="body1">{event.venue}</Typography>
            <Typography variant="body1">{event.price}</Typography>
            <Typography variant="body1">Registered: {event.registered} / {event.participants}</Typography>
            {error && <Typography color="error">{error}</Typography>}
            <Button variant="contained" color="primary" onClick={handleRegister} disabled={event.registered >= event.participants}>
                {event.registered >= event.participants ? 'Full' : 'Register'}
            </Button>
            <Box sx={{ marginTop: 4 }}>
                <iframe
                    width="600"
                    height="450"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    src={`https://maps.google.com/maps?q=${1.3497},${103.8507}&z=15&output=embed`}
                ></iframe>
            </Box>
        </Box>
    );
}

export default EventRegistration;
