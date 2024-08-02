import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Avatar, Container, Paper } from '@mui/material';
import { useParams } from 'react-router-dom';
import http from '../http';

function GuestProfile() {
    const { id } = useParams(); // Get user ID from URL
    const [user, setUser] = useState(null);
    const [trackerList, setTrackerList] = useState([]);

    const getUser = () => {
        http.get(`/user/${id}`).then((res) => {
            console.log(res.data)
            setUser(res.data);
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

    useEffect(() => {
        getUser();
        getTrackers();
    }, [id]);

    if (!user) {
        return <Typography>Loading...</Typography>;
    }

    const userTrackers = trackerList.filter(tracker => tracker.userId === user.id);
    const totalPoints = userTrackers.reduce((total, tracker) => total + tracker.points, 0);

    return (
        <Box sx={{ bgcolor: '#F0F5F8', minHeight: '100vh', width: '100%' }}>
            <Container maxWidth="lg">
                <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <Box sx={{ position: 'relative', display: 'inline-block' }}>
                                <Avatar
                                    alt={`${user.firstName} ${user.lastName}`}
                                    src={`${import.meta.env.VITE_FILE_PROFILE_URL}${user.imageFile}`}
                                    sx={{ width: 150, height: 150, marginLeft: 12 }}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Typography variant="h4">{user.firstName} {user.lastName}</Typography>
                            <Typography variant="body1" color="textSecondary">{user.email}</Typography>
                            <Typography variant="body1" color="textSecondary">{user.description}</Typography>
                        </Grid>
                    </Grid>

                    <Grid container spacing={4} sx={{ marginTop: 4 }}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" gutterBottom>Stats</Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Paper elevation={2} sx={{ padding: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 100 }}>
                                        <Typography variant="h5" component="div">112</Typography>
                                        <Typography variant="body2">Recycling Points</Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={6}>
                                    <Paper elevation={2} sx={{ padding: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 100 }}>
                                        <Typography variant="h5" component="div">2</Typography>
                                        <Typography variant="body2">Events Participated</Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={6}>
                                    <Paper elevation={2} sx={{ padding: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 100 }}>
                                        <Typography variant="h5" component="div">3</Typography>
                                        <Typography variant="body2">Quizzes Taken</Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={6}>
                                    <Paper elevation={2} sx={{ padding: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 100 }}>
                                        <Typography variant="h5" component="div">{totalPoints}</Typography>
                                        <Typography variant="body2">CO2 Saved</Typography>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" gutterBottom>Activities</Typography>
                            <Paper elevation={2} sx={{ padding: 2 }}>
                                <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ marginBottom: 1 }}>
                                    <Typography variant="body1">31/4/2024</Typography>
                                    <Typography variant="body1">Plant-a-tree</Typography>
                                </Box>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Typography variant="body1">29/2/2024</Typography>
                                    <Typography variant="body1">ZeroWaste Upcycling Workshop</Typography>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </Box >
    );
}

export default GuestProfile;
