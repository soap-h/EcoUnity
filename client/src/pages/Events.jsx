import React, { useState, useEffect } from 'react';
import { Box, Button, FormControl, InputLabel, Select, MenuItem, Typography, Grid } from '@mui/material';
import Carousel from 'react-material-ui-carousel';
import { Link } from 'react-router-dom';
import { CalendarToday, Place, AccessTime, AttachMoney } from '@mui/icons-material';
import bannerImage from '../assets/images/events-banner.png';
import http from '../http';

function Events() {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [category, setCategory] = useState('All');
    const [priceRange, setPriceRange] = useState('All');
    const [when, setWhen] = useState('All');

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
                setFilteredEvents(upcomingEvents); // Initially show all upcoming events
            } catch (error) {
                console.error('Failed to fetch events:', error);
            }
        };

        fetchEvents();
    }, []);

    const handleFilterChange = () => {
        let filtered = events;

        // Filter by category
        if (category !== 'All') {
            filtered = filtered.filter(event => event.category === category);
        }

        // Filter by price range
        if (priceRange !== 'All') {
            if (priceRange === 'FREE') {
                filtered = filtered.filter(event => event.price === 0);
            } else if (priceRange === 'below 10') {
                filtered = filtered.filter(event => parseFloat(event.price) < 10);
            } else if (priceRange === 'below 20') {
                filtered = filtered.filter(event => parseFloat(event.price) < 20);
            }
        }

        // Filter by date
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        if (when !== 'All') {
            filtered = filtered.filter(event => {
                const eventDate = new Date(event.date);
                if (when === 'This month') {
                    return (
                        eventDate.getMonth() === currentMonth &&
                        eventDate.getFullYear() === currentYear
                    );
                } else if (when === 'Next month') {
                    return (
                        eventDate.getMonth() === (currentMonth + 1) % 12 &&
                        (currentMonth === 11 ? eventDate.getFullYear() === currentYear + 1 : eventDate.getFullYear() === currentYear)
                    );
                }
                return true;
            });
        }

        setFilteredEvents(filtered);
    };

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
                                        maxWidth: '250px',
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
                                            height: '150px',
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
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#075f6b', fontSize: '1rem' }}>{ev.title}</Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                            <CalendarToday sx={{ mr: 1, color: '#757575', fontSize: 16 }} />
                                            <Typography variant="body2" color="textSecondary">{new Date(ev.date).toDateString()}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                            <Place sx={{ mr: 1, color: '#757575', fontSize: 16 }} />
                                            <Typography variant="body2" color="textSecondary">{ev.venue}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                            <AccessTime sx={{ mr: 1, color: '#757575', fontSize: 16 }} />
                                            <Typography variant="body2" color="textSecondary">{`${ev.timeStart.slice(0, 5)} - ${ev.timeEnd.slice(0, 5)}`}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                            <AttachMoney sx={{ mr: 1, color: '#757575', fontSize: 16 }} />
                                            <Typography variant="body2" color="textSecondary">{ev.price}</Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    ))}
                </Carousel>
            </Box>

            <Box
                sx={{
                    textAlign: 'center',
                    padding: '40px 0',
                    backgroundColor: '#f9f2eb'  //  light beige
                }}
            >
                <Typography variant="h5">Propose your own Event</Typography>
                <Typography variant="body1">Have an idea? Make it happen!</Typography>
                <Button
                    variant="contained"
                    sx={{
                        marginTop: '20px',
                        backgroundColor: '#A37964',
                        '&:hover': {
                            backgroundColor: '#8f6752', 
                        }
                    }}
                    component={Link}
                    to="/propose-event"
                >
                    PROPOSE EVENT
                </Button>
            </Box>

            <Box sx={{ textAlign: 'center', padding: '20px 0' }}>
                <Typography variant="h4">Filter Events</Typography>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '20px 0'
                    }}
                >
                    <FormControl variant="outlined" sx={{ minWidth: 150, marginRight: '20px' }}>
                        <InputLabel>Event Category</InputLabel>
                        <Select
                            label="Event Category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <MenuItem value="All">All</MenuItem>
                            <MenuItem value="Education">Education</MenuItem>
                            <MenuItem value="Community">Community</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl variant="outlined" sx={{ minWidth: 150, marginRight: '20px' }}>
                        <InputLabel>Price Range</InputLabel>
                        <Select
                            label="Price Range"
                            value={priceRange}
                            onChange={(e) => setPriceRange(e.target.value)}
                        >
                            <MenuItem value="All">All</MenuItem>
                            <MenuItem value="FREE">FREE</MenuItem>
                            <MenuItem value="below 10">Below $10</MenuItem>
                            <MenuItem value="below 20">Below $20</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl variant="outlined" sx={{ minWidth: 150, marginRight: '20px' }}>
                        <InputLabel>When</InputLabel>
                        <Select
                            label="When"
                            value={when}
                            onChange={(e) => setWhen(e.target.value)}
                        >
                            <MenuItem value="All">All</MenuItem>
                            <MenuItem value="This month">This month</MenuItem>
                            <MenuItem value="Next month">Next month</MenuItem>
                        </Select>
                    </FormControl>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: '#075f6b',
                            '&:hover': {
                                backgroundColor: '#064a56',
                            },
                        }}
                        onClick={handleFilterChange}
                    >
                        SEARCH
                    </Button>
                </Box>
            </Box>
            <Box sx={{ padding: '20px 300px' }}>
                <Grid container spacing={2} direction="column">
                    {filteredEvents.map((event) => (  // Change this line to iterate over filteredEvents
                        <Grid item key={event.id}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    boxShadow: 3,
                                    borderRadius: 2,
                                    backgroundColor: '#fff',
                                    overflow: 'hidden',
                                }}
                            >
                                <Box
                                    sx={{
                                        width: '30%',
                                        minWidth: '200px',
                                        backgroundImage: `url(${import.meta.env.VITE_FILE_BASE_URL}/${event.imageFile})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                    }}
                                />
                                <Box sx={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%' }}>
                                    <Box>
                                        <Box sx={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
                                            <Typography variant="caption" sx={{ backgroundColor: '#8bc34a', color: '#fff', padding: '5px', borderRadius: '4px' }}>{event.category}</Typography>
                                            <Typography variant="caption" sx={{ backgroundColor: '#03a9f4', color: '#fff', padding: '5px', borderRadius: '4px' }}>{event.type}</Typography>
                                        </Box>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#075f6b' }}>{event.title}</Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                            <CalendarToday sx={{ mr: 1, color: '#757575', fontSize: 18 }} />
                                            <Typography variant="body2" color="textSecondary">{new Date(event.date).toDateString()}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                            <Place sx={{ mr: 1, color: '#757575', fontSize: 18 }} />
                                            <Typography variant="body2" color="textSecondary">{event.venue}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                            <AccessTime sx={{ mr: 1, color: '#757575', fontSize: 18 }} />
                                            <Typography variant="body2" color="textSecondary">{`${event.timeStart.slice(0, 5)} - ${event.timeEnd.slice(0, 5)}`}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                            <AttachMoney sx={{ mr: 1, color: '#757575', fontSize: 18 }} />
                                            <Typography variant="body2" color="textSecondary">{event.price === 0 ? 'FREE' : `${event.price}`}</Typography>
                                        </Box>
                                    </Box>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        sx={{ mt: 2, alignSelf: 'flex-start', backgroundColor: '#075f6b' }}
                                        component={Link}
                                        to={`/event/${event.id}`}
                                    >
                                        Learn More
                                    </Button>
                                </Box>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>


        </Box>
    );
}

export default Events;
