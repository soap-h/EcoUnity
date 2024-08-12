import React, { useState, useEffect } from 'react';
import { Box, Button, FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material';
import Carousel from 'react-material-ui-carousel';
import { Link } from 'react-router-dom';
import { CalendarToday, Place, AccessTime, AttachMoney } from '@mui/icons-material';
import bannerImage from '../assets/images/events-banner.png';
import http from '../http';

function Events() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await http.get('/events');
                const currentDateTime = new Date();

                // Filter the events to show only those that haven't ended yet
                const upcomingEvents = response.data.filter(event => {
                    const eventDate = new Date(event.date);
                    const [endHour, endMinute] = event.timeEnd.split(':').map(Number);
                    eventDate.setHours(endHour);
                    eventDate.setMinutes(endMinute);

                    return eventDate >= currentDateTime;
                });

                setEvents(upcomingEvents);
            } catch (error) {
                console.error('Failed to fetch events:', error);
            }
        };

        fetchEvents();
    }, []);

    return (
        <Box>
            <Box
                sx={{
                    backgroundImage: `url(${bannerImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    padding: '50px 0',
                    textAlign: 'center',
                    color: '#fff',
                }}
            >
                <Typography variant="h2">Events</Typography>
            </Box>
            <Box sx={{ textAlign: 'center', padding: '20px 0' }}>
                <Typography variant="h4">Explore sustainability events you’re interested in!</Typography>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '20px 0'
                    }}
                >
                    <FormControl variant="outlined" sx={{ minWidth: 120, marginRight: '20px' }}>
                        <InputLabel>Event Type / Category</InputLabel>
                        <Select label="Event Type / Category">
                            <MenuItem value="Education">Education</MenuItem>
                            <MenuItem value="Community">Community</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl variant="outlined" sx={{ minWidth: 120, marginRight: '20px' }}>
                        <InputLabel>Where</InputLabel>
                        <Select label="Where">
                            <MenuItem value="Bishan CC">Bishan CC</MenuItem>
                            <MenuItem value="Siglap CC">Siglap CC</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl variant="outlined" sx={{ minWidth: 120, marginRight: '20px' }}>
                        <InputLabel>When</InputLabel>
                        <Select label="When">
                            <MenuItem value="This month">This month</MenuItem>
                            <MenuItem value="Next month">Next month</MenuItem>
                        </Select>
                    </FormControl>
                    <Button variant="contained" color="primary">SEARCH</Button>
                </Box>
            </Box>
            <Box sx={{ padding: '20px 0', textAlign: 'center' }}>
                <Typography variant="h4">Upcoming Events</Typography>
                <Carousel
                    animation="slide"
                    indicators={false}
                    autoPlay={false}
                    navButtonsAlwaysVisible
                    sx={{ marginTop: '20px' }}
                >
                    {events.map((event, index) => (
                        <Box key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
                            {events.slice(index, index + 3).map((ev, idx) => (
                                <Box
                                    key={idx}
                                    sx={{
                                        margin: '10px',
                                        padding: '10px',
                                        maxWidth: '300px',
                                        boxShadow: 3,
                                        borderRadius: 2,
                                        backgroundColor: '#fff',
                                        textAlign: 'left',
                                        textDecoration: 'none',
                                    }}
                                    component={Link}
                                    to={`/event/${ev.id}`}
                                >
                                    <Box
                                        sx={{
                                            height: '200px',
                                            backgroundImage: `url(${import.meta.env.VITE_FILE_BASE_URL}/${ev.imageFile})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            borderRadius: '8px'
                                        }}
                                    />
                                    <Box sx={{ padding: '10px' }}>
                                        <Box sx={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
                                            <Typography variant="caption" sx={{ backgroundColor: '#8bc34a', color: '#fff', padding: '5px', borderRadius: '4px' }}>{ev.category}</Typography>
                                            <Typography variant="caption" sx={{ backgroundColor: '#03a9f4', color: '#fff', padding: '5px', borderRadius: '4px' }}>{ev.type}</Typography>
                                        </Box>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#075f6b' }}>{ev.title}</Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                            <CalendarToday sx={{ mr: 1, color: '#757575', fontSize: 18 }} />
                                            <Typography variant="body2" color="textSecondary">{new Date(ev.date).toDateString()}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                            <Place sx={{ mr: 1, color: '#757575', fontSize: 18 }} />
                                            <Typography variant="body2" color="textSecondary">{ev.venue}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                            <AccessTime sx={{ mr: 1, color: '#757575', fontSize: 18 }} />
                                            <Typography variant="body2" color="textSecondary">{`${ev.timeStart} - ${ev.timeEnd}`}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                            <AttachMoney sx={{ mr: 1, color: '#757575', fontSize: 18 }} />
                                            <Typography variant="body2" color="textSecondary">{ev.price}</Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    ))}
                </Carousel>
            </Box>
            <Box sx={{ textAlign: 'center', padding: '40px 0' }}>
                <Typography variant="h5">Propose your own Event</Typography>
                <Typography variant="body1">Have an idea? Make it happen!</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ marginTop: '20px' }}
                    component={Link}
                    to="/propose-event"
                >
                    PROPOSE EVENT
                </Button>
            </Box>
        </Box>
    );
}

export default Events;
