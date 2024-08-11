import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Card, CardContent, CardMedia, Grid, Divider, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Person, AttachMoney, CalendarToday, AccessTime, Room } from '@mui/icons-material';
import http from '../http';
import UserContext from '../contexts/UserContext';  // Assuming you have a UserContext to manage user state

function EventRegistration() {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [error, setError] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { user } = useContext(UserContext);  // Assuming UserContext provides the logged-in user
    const navigate = useNavigate();

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
        if (!user) {
            navigate('/login');  // Redirect to login if the user is not logged in
            return;
        }

        if (event.price === 0) {
            setIsDialogOpen(true);  // Open the confirmation dialog if the event is free
        } else {
            proceedWithRegistration();
        }
    };

    const proceedWithRegistration = async () => {
        if (event.registered < event.participants) {
            try {
                await http.put(`/events/${id}/register`);
                setEvent({ ...event, registered: event.registered + 1 });
                
                if (event.price === 0) {
                    // Navigate to a success page or a confirmation message if free
                    navigate('/success');
                } else {
                    // Navigate to the payment page if the event has a price
                    navigate(`/event-payment/${id}`, {
                        state: {
                            amount: event.price,
                            currency: 'SGD',
                            eventTitle: event.title,
                            eventDetails: event.details,
                            eventDate: new Date(event.date).toDateString(),
                            eventTime: `${event.timeStart} - ${event.timeEnd}`,
                            eventVenue: event.venue
                        }
                    });
                }
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
            <Grid container spacing={2}>
                {/* Event Image and Title */}
                <Grid item xs={12}>
                    <Card sx={{ position: 'relative', mb: 3, boxShadow: 'none', borderRadius: '0' }}>
                        <CardMedia
                            component="img"
                            height="350"
                            image={`${import.meta.env.VITE_FILE_BASE_URL}/${event.imageFile}`} // Adjust the image URL as necessary
                            alt={event.title}
                            sx={{ objectFit: 'cover' }} // Make sure the image covers the card without a weird border
                        />
                        <CardContent sx={{ position: 'absolute', bottom: 16, left: 16, color: 'white' }}>
                            <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }}>
                                {event.title}
                            </Typography>
                            <Typography variant="h6">
                                Organised by {event.userName}
                            </Typography>
                            <Box display="flex" alignItems="center">
                                <Person sx={{ mr: 1 }} />
                                <Typography>
                                    {event.registered} / {event.participants} registered
                                </Typography>
                            </Box>
                            <Box display="flex" alignItems="center">
                                <AttachMoney sx={{ mr: 1 }} />
                                <Typography>
                                    {event.price === 0 ? 'FREE' : event.price}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Event Details and Registration */}
                <Grid item xs={12} md={8}>
                    <Typography variant="h4" gutterBottom>
                        Details
                    </Typography>
                    <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                        <ul>
                            <li>{event.category}</li>
                            <li>{event.type}</li>
                        </ul>
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" sx={{ mb: 1 }}>
                        Programme Description:
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        {event.details}
                    </Typography>
                </Grid>

                {/* Date, Time, and Venue */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" color="textPrimary" gutterBottom>
                            Date & Time
                        </Typography>
                        <Box display="flex" alignItems="center">
                            <CalendarToday sx={{ mr: 1 }} />
                            <Typography variant="body2">
                                {new Date(event.date).toDateString()}
                            </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" mt={1}>
                            <AccessTime sx={{ mr: 1 }} />
                            <Typography variant="body2">
                                {event.timeStart} - {event.timeEnd}
                            </Typography>
                        </Box>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="h6" color="textPrimary" gutterBottom>
                            Venue <Room fontSize="small" />
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                            {event.venue}
                        </Typography>
                        <iframe
                            width="100%"
                            height="250"
                            style={{ border: 0, marginBottom: '10px' }}
                            loading="lazy"
                            allowFullScreen
                            src={`https://maps.google.com/maps?q=${event.latitude},${event.longitude}&z=15&output=embed`}
                        ></iframe>
                    </Card>

                    {/* Registration Information */}
                    <Card sx={{ p: 3 }}>
                        <Typography variant="h6" color="textPrimary" gutterBottom>
                            Registration
                        </Typography>
                        <Typography variant="body2">
                            Registration Closing Date: {new Date(event.registerEndDate).toDateString()}
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleRegister}
                            fullWidth
                            disabled={event.registered >= event.participants}
                        >
                            {user ? (event.registered >= event.participants ? 'Event Full' : 'Book') : 'Login to Book'}
                        </Button>
                    </Card>
                </Grid>
            </Grid>
            {error && (
                <Typography color="error" sx={{ mt: 2 }}>
                    {error}
                </Typography>
            )}

            {/* Confirmation Dialog */}
            <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
                <DialogTitle>Confirm Registration</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to register for this event?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsDialogOpen(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={proceedWithRegistration} color="primary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default EventRegistration;
