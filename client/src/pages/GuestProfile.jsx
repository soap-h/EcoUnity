import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Avatar, Container, Paper, Button } from '@mui/material';
import { useParams } from 'react-router-dom';
import http from '../http';

function GuestProfile() {
    const { id } = useParams(); // Get user ID from URL
    const [user, setUser] = useState(null);
    const [trackerList, setTrackerList] = useState([]);
    const [participatedEvents, setParticipatedEvents] = useState([]);
    const [description, setDescription] = useState('');
    const [eventcount, seteventcount] = useState(0);
    const [points, setPoints] = useState(0);

    const getUser = () => {
        http.get(`/user/${id}`).then((res) => {
            setUser(res.data);
            setDescription(res.data.description);
            setPoints(res.data.points);
        }).catch((error) => {
            console.error("Error fetching user: ", error);
        });
    };

    const getTrackers = () => {
        http.get("/tracker").then((res) => {
            setTrackerList(res.data);
        }).catch((error) => {
            console.error("Error fetching trackers: ", error);
        });
    };

    const getEvents = async () => {
        try {
            const [participatedResponse, eventsResponse] = await Promise.all([
                http.get(`events/${id}/participatedevents`),
                http.get('/events/')
            ]);

            const participatedData = participatedResponse.data;
            const eventsData = eventsResponse.data;

            const linkedEvents = participatedData.map(pe => {
                const eventDetails = eventsData.find(event => event.id === pe.eventId);
                return {
                    ...pe,
                    eventDetails,
                };
            });

            const eventCount = linkedEvents.length;
            setParticipatedEvents(linkedEvents);
            seteventcount(eventCount);
        } catch (err) {
            console.error("Failed to get events:", err);
        }
    };

    useEffect(() => {
        getUser();
        getTrackers();
        getEvents();
    }, [id]);

    if (!user) {
        return <Typography>Loading...</Typography>;
    }

    const userTrackers = trackerList.filter(tracker => tracker.userId === user.id);
    const totalPoints = userTrackers.reduce((total, tracker) => total + tracker.points, 0);

    return (
        <Box sx={{ bgcolor: '#F7FAFC', minHeight: '100vh', width: '100%' }}>
            <Container maxWidth="lg">
                <Paper elevation={3} sx={{ padding: 4, marginTop: 4, borderRadius: 2 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <Box sx={{
                                position: 'relative',
                                display: 'inline-block',
                                textAlign: 'center',
                                ml: 2 // Shift the profile image slightly to the right
                            }}>
                                <Avatar
                                    alt={`${user.firstName} ${user.lastName}`}
                                    src={`${import.meta.env.VITE_FILE_PROFILE_URL}${user.imageFile}`}
                                    sx={{ width: 150, height: 150, marginBottom: 2, boxShadow: 2 }}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'black' }}>
                                {user.firstName} {user.lastName}
                            </Typography>
                            <Typography variant="body1" color="textSecondary" gutterBottom>
                                {user.email}
                            </Typography>
                            <Typography variant="body1" color="textSecondary" sx={{ marginTop: 2 }}>
                                {description}
                            </Typography>
                        </Grid>
                    </Grid>

                    <Grid container spacing={4} sx={{ marginTop: 4 }}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'black' }}>
                                Stats
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Paper elevation={2} sx={{ padding: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 100 }}>
                                        <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }}>
                                            {points}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Recycling Points
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={6}>
                                    <Paper elevation={2} sx={{ padding: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 100 }}>
                                        <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }}>
                                            {eventcount}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Events Participated
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={6}>
                                    <Paper elevation={2} sx={{ padding: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 100 }}>
                                        <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }}>
                                            3
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Quizzes Taken
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={6}>
                                    <Paper elevation={2} sx={{ padding: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 100 }}>
                                        <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }}>
                                            {totalPoints}g
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            CO2 Saved
                                        </Typography>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'black' }}>
                                Activities
                            </Typography>
                            <Paper elevation={2} sx={{ padding: 2, maxHeight: 248, overflowY: 'auto' }}>
                                {participatedEvents.length > 0 ? (
                                    participatedEvents.map((event, index) => (
                                        <Box key={index} display="flex" justifyContent="space-between" alignItems="center" sx={{ marginBottom: 1 }}>
                                            <Typography variant="body1">{event.eventDetails.date}</Typography>
                                            <Typography variant="body1">{event.eventDetails.title}</Typography>
                                        </Box>
                                    ))
                                ) : (
                                    <Typography variant="body1" color="textSecondary">
                                        No events found.
                                    </Typography>
                                )}
                            </Paper>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </Box>
    );
}

export default GuestProfile;
