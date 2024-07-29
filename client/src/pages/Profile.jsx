import React, { useContext, useState } from 'react';
import { Box, Typography, Grid, Avatar, Container, Paper, IconButton, Button } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EmailIcon from '@mui/icons-material/Email';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import UserContext from '../contexts/UserContext';
import http from '../http';

function Profile() {
    const { user, setUser } = useContext(UserContext);

    const onFileChange = (e) => {
        let file = e.target.files[0];
        if (file) {
            if (file.size > 1024 * 1024) {
                toast.error('Maximum file size is 1MB');
                return;
            }

            let formData = new FormData();
            formData.append('profilePic', file);
            http.post('/user/upload/profile-pic', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then((res) => {
                    setUser({ ...user, imageFile: res.data.imageFile });
                    toast.success('Profile picture uploaded successfully');
                })
                .catch((err) => {
                    console.error("Upload Error: ", err);
                    if (err.response && err.response.data) {
                        toast.error(err.response.data.message);
                    } else {
                        toast.error('Failed to upload profile picture');
                    }
                });
        }
    };

    return (
        <Container maxWidth="lg">
            <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <Box sx={{ position: 'relative', display: 'inline-block' }}>
                            <Avatar
                                alt={`${user.firstName} ${user.lastName}`}
                                src={`${import.meta.env.VITE_FILE_BASE_URL}${user.imageFile}`}
                                sx={{ width: 150, height: 150, marginLeft:12 }}
                            />
                            <IconButton
                                component="label"
                                sx={{
                                    position: 'absolute',
                                    bottom: 0,
                                    right: 0,
                                    backgroundColor: 'white',
                                    borderRadius: '50%',
                                    padding: '5px',
                                    '&:hover': { backgroundColor: 'lightgrey' },
                                }}
                            >
                                <AddPhotoAlternateIcon />
                                <input hidden accept="image/*" type="file" onChange={onFileChange} />
                            </IconButton>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <Typography variant="h4">{user.firstName} {user.lastName}</Typography>
                        <Typography variant="body1" color="textSecondary">{user.email}</Typography>
                        <Typography variant="body1" color="textSecondary">
                            Just a regular guy who cares a lot about the planet. Trying to help out with stuff like reducing carbon footprints and cleaning up nature spots. I'm all about spreading the word on why we need to take care of our home. Outside of that, you can catch me hiking, watching birds, or lending a hand at local clean-up events. Let's make a change together!
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ marginTop: 2 }}>
                            Posts: 3 | Member since: 11/11/2023
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container spacing={4} sx={{ marginTop: 4 }}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom>Stats</Typography>
                        <Paper elevation={2} sx={{ padding: 2 }}>
                            <Typography variant="body1">Recycling Points: 112</Typography>
                            <Typography variant="body1">Events participated: 2</Typography>
                            <Typography variant="body1">Quizzes taken: 3</Typography>
                            <Typography variant="body1">CO2 saved: 1000g</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom>Activities</Typography>
                        <Paper elevation={2} sx={{ padding: 2 }}>
                            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ marginBottom: 1 }}>
                                <Typography variant="body1">31/4/2024</Typography>
                                <Typography variant="body1">Plant-a-tree</Typography>
                                <Button variant="contained" color="primary">Give Feedback</Button>
                            </Box>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="body1">29/2/2024</Typography>
                                <Typography variant="body1">ZeroWaste Upcycling Workshop</Typography>
                                <Button variant="contained" color="secondary">Give Feedback</Button>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Paper>
            <ToastContainer />
        </Container>
    );
}

export default Profile;
