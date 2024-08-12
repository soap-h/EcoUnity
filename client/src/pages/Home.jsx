import React, { useState, useEffect } from 'react';
import { Typography, Box, Button, Paper, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import http from "../http";
import { keyframes } from '@mui/system';
import { Link } from 'react-router-dom';


const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideIn = keyframes`
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

function Home() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = () => {
            http.get("/events").then((res) => {
                setEvents(res.data);
            }).catch(err => console.error("Failed to fetch user info:", err));
        };
        fetchEvents();
    }, []);

    return (
        <Box>
            <Box
                component="div"
                sx={{
                    height: 'calc(100vh - 128px)',
                    backgroundImage: 'url(/src/assets/home-background.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    textAlign: 'center',
                    p: 2,
                    animation: `${fadeIn} 2s ease-out`,
                }}
            >
                <Typography variant="h3" gutterBottom sx={{ animation: `${fadeIn} 2s ease-out` }}>
                    FIND EVERYTHING YOU NEED
                </Typography>
                <Typography variant="h4" gutterBottom sx={{ animation: `${fadeIn} 2s ease-out 0.5s` }}>
                    IN ONE PLACE
                </Typography>
                <Box sx={{ mt: 2 }}>
                    <Button
                        variant="contained"
                        sx={{
                            mr: 2,
                            backgroundColor: '#00796b',
                            animation: `${fadeIn} 2s ease-out 1s`,
                            '&:hover': { transform: 'scale(1.05)' }
                        }}
                    >
                        EXPLORE
                    </Button>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: '#212121',
                            animation: `${fadeIn} 2s ease-out 1.5s`,
                            '&:hover': { transform: 'scale(1.05)' }
                        }}
                    >
                        LEARN MORE
                    </Button>
                </Box>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, p: 2, backgroundColor: "#D7CAB7" }}>

                <Paper sx={{ width: '20%', p: 2, animation: `${slideIn} 1s ease-out` }}>
                    <Typography variant="h6" gutterBottom>
                        I'M LOOKING FOR
                    </Typography>
                    <Box>
                        <Link to="/community-centre" style={{ textDecoration: 'none' }}>
                            <Button fullWidth sx={{ mb: 1 }}>A Community Centre (CC)</Button>
                        </Link>
                        <Link to="/events" style={{ textDecoration: 'none' }}>
                            <Button fullWidth sx={{ mb: 1 }}>Events</Button>
                        </Link>
                        <Link to="/forum" style={{ textDecoration: 'none' }}>
                            <Button fullWidth sx={{ mb: 1 }}>Forum</Button>
                        </Link>
                        <Link to="/incident-reporting" style={{ textDecoration: 'none' }}>
                            <Button fullWidth sx={{ mb: 1 }}>Incident Reporting</Button>
                        </Link>
                        <Link to="/learning" style={{ textDecoration: 'none' }}>
                            <Button fullWidth sx={{ mb: 1 }}>Learning</Button>
                        </Link>
                        <Link to="/merchandise" style={{ textDecoration: 'none' }}>
                            <Button fullWidth sx={{ mb: 1 }}>Merchandise</Button>
                        </Link>
                        <Link to="/eco-tracker" style={{ textDecoration: 'none' }}>
                            <Button fullWidth sx={{ mb: 1 }}>Personal Eco-Tracker</Button>
                        </Link>
                    </Box>
                </Paper>


                <Box sx={{ width: '55%', p: 2, animation: `${slideIn} 1.5s ease-out` }}>
                    <Link to="/your-target-route" style={{ textDecoration: 'none', display: 'block' }}>
                        <Box
                            sx={{
                                backgroundImage: 'url(/src/assets/ccimages/ecounitybanner.png)',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                height: '400px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#ffffff',
                                textAlign: 'center',
                                animation: `${fadeIn} 2s ease-out`,
                            }}
                        >
                        </Box>
                    </Link>
                </Box>

                <Paper sx={{ width: '20%', p: 2, animation: `${slideIn} 2s ease-out` }}>
                    <Typography variant="h6" gutterBottom>
                        Upcoming Events
                    </Typography>
                    {events.length === 0 ? (
                        <Typography variant="body1">No upcoming events</Typography>
                    ) : (
                        events.slice(0, 2).map((event) => (
                            <Box key={event.id} sx={{ mb: 2, animation: `${fadeIn} 2s ease-out` }}>
                                <Typography variant="body1">{event.title}</Typography>
                                <Typography variant="body2">{new Date(event.date).toLocaleDateString()}</Typography>
                                <Button variant="contained" color="primary" size="small">Book session</Button>
                            </Box>
                        ))
                    )}
                </Paper>
            </Box>

            <Box sx={{ mt: 4, p: 2 }}>
                <Typography variant="h4" gutterBottom sx={{ animation: `${fadeIn} 2s ease-out` }}>
                    Our CCs
                </Typography>
                <Grid container spacing={2}>
                    {['cc1.png', 'cc2.png', 'cc3.png', 'cc4.png', 'cc5.png', 'cc6.png'].map((ccImage, index) => (
                        <Grid item xs={6} sm={4} key={index} sx={{ animation: `${slideIn} 2s ease-out` }}>
                            <Link to="/locations" style={{ textDecoration: 'none' }}>
                                <Paper>
                                    <img src={`/src/assets/ccimages/${ccImage}`} alt={`Community Centre ${index + 1}`} style={{ width: '100%' }} />
                                </Paper>
                            </Link>
                        </Grid>
                    ))}
                </Grid>
            </Box>

        </Box>
    );
}

export default Home;
