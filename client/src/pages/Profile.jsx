import React, { useContext, useState, useEffect } from 'react';
import { Box, Typography, Button, Grid, Avatar, Container, Paper } from '@mui/material';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';

import UserContext from '../contexts/UserContext';

function Profile() {
    const { user, setUser } = useContext(UserContext);
    console.log(user.imageFile)

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

        <Box>
            <Container maxWidth="sm">
                <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
                    <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
                        <Avatar
                            alt={`${user.firstName} ${user.lastName}`}
                            src={`${import.meta.env.VITE_FILE_BASE_URL}${user.imageFile}`}
                            sx={{ width: 100, height: 100 }}
                        />
                        <Button variant="contained" component="label" sx={{ mt: 2 }}>
                            Upload Profile Picture
                            <input hidden accept="image/*" type="file"
                                onChange={onFileChange} />
                        </Button>
                        <Typography variant="h5" component="h1" gutterBottom>
                            {user.firstName} {user.lastName}
                        </Typography>
                        <Typography variant="body1" color="textSecondary" align="center">
                            Student at Nanyang Polytechnic, pursuing a diploma in Information Technology.
                            Passionate about discovering new topics and meeting and learning from new people.
                            Strives to become a better version of themselves daily and challenges themselves to push their capabilities beyond their limits.
                        </Typography>
                    </Box>
                    <Grid container spacing={2} style={{ marginTop: '20px' }}>
                        <Grid item xs={12} sm={6}>
                            <Box display="flex" alignItems="center">
                                <EmailIcon style={{ marginRight: '8px' }} />
                                <Typography variant="body1">{user.email}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Box display="flex" alignItems="center">
                                <PhoneIcon style={{ marginRight: '8px' }} />
                                <Typography variant="body1">{user.phone || '+65 1234 5678'}</Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
            <ToastContainer />
        </Box>
    );
}

export default Profile;
