import React, { useContext, useState, useEffect } from 'react';
import { Box, Typography, Grid, Avatar, Container, Paper, IconButton, Button, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { ToastContainer, toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import UserContext from '../contexts/UserContext';
import http from '../http';
import { useNavigate } from 'react-router-dom';

function Profile() {
    const { id } = useParams();
    const { user, setUser } = useContext(UserContext);
    const [trackerList, setTrackerList] = useState([]);
    const [description, setDescription] = useState(user ? user.description : '');
    const [isEditing, setIsEditing] = useState(false);
    const [eventcount, seteventcount] = useState(0);
    const [participatedEvents, setParticipatedEvents] = useState([]); // Store participated events
    const navigate = useNavigate();

    const getTrackers = () => {
        http.get("/tracker").then((res) => {
            setTrackerList(res.data);
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
        if (!user || !user.description) {
            http.get(`/user/${id}`).then((res) => {
                setUser(res.data);
                localStorage.setItem('user', JSON.stringify(res.data));
            }).catch(error => {
                console.error("Error fetching user data: ", error);
            });
        } else {
            setDescription(user?.description || '');
            getTrackers();
            getEvents();
        }
    }, [user, id]);

    const userTrackers = trackerList.filter(tracker => user && user.id === tracker.userId);
    const totalPoints = userTrackers.reduce((total, tracker) => total + tracker.points, 0);

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };

    const saveDescription = () => {
        http.put(`/user/description/${user.id}`, { description })
            .then((res) => {
                toast.success('Description updated successfully');
                setIsEditing(false);
                const updatedUser = { ...user, description };
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
            })
            .catch((error) => {
                console.error("Error updating description: ", error);
                toast.error('Failed to update description');
            });
    };

    const editButtonHandler = () => {
        setIsEditing(true);
    };

    const cancelButtonHandler = () => {
        setIsEditing(false);
        setDescription(user.description);
    };

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
                    const updatedUser = { ...user, imageFile: res.data.imageFile };
                    setUser(updatedUser);
                    localStorage.setItem('user', JSON.stringify(updatedUser));
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

    const deleteUser = () => {
        if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            http.delete(`/user/${user.id}`)
                .then(() => {
                    toast.success('User deleted successfully');
                    logout();
                })
                .catch((error) => {
                    console.error("Delete Error: ", error);
                    toast.error('Failed to delete user');
                });
        }
    };

    const logout = () => {
        localStorage.clear();
        window.location = "/";
    };

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
                                <IconButton
                                    component="label"
                                    sx={{
                                        position: 'absolute',
                                        bottom: 0,
                                        right: 0, 
                                        backgroundColor: 'grey', // Change icon color to grey
                                        color: '#fff',
                                        '&:hover': { backgroundColor: 'darkgrey' },
                                    }}
                                >
                                    <AddPhotoAlternateIcon />
                                    <input hidden accept="image/*" type="file" onChange={onFileChange} />
                                </IconButton>

                            </Box>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'black' }}>
                                {user.firstName} {user.lastName}
                            </Typography>
                            <Typography variant="body1" color="textSecondary" gutterBottom>
                                {user.email}
                            </Typography>
                            {isEditing ? (
                                <TextField
                                    fullWidth
                                    margin="dense"
                                    label="Description"
                                    variant="outlined"
                                    multiline
                                    rows={4}
                                    value={description}
                                    onChange={handleDescriptionChange}
                                    sx={{ marginTop: 2 }}
                                />
                            ) : (
                                <Typography variant="body1" color="textSecondary" sx={{ marginTop: 2 }}>
                                    {description}
                                </Typography>
                            )}
                            {isEditing ? (
                                <Box sx={{ marginTop: 2 }}>
                                    <Button variant="contained" color="primary" onClick={saveDescription} sx={{ marginRight: 2 }}>
                                        Save
                                    </Button>
                                    <Button variant="outlined" onClick={cancelButtonHandler}>
                                        Cancel
                                    </Button>
                                </Box>
                            ) : (
                                <IconButton onClick={editButtonHandler} sx={{ marginTop: 2 }}>
                                    <EditIcon color="primary" />
                                </IconButton>
                            )}
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
                                            112
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
                            <Paper elevation={2} sx={{ padding: 2, maxHeight: 248, overflowY: 'auto' }}> {/* Scrollable container */}
                                {participatedEvents.length > 0 ? (
                                    participatedEvents.map((event, index) => (
                                        <Box key={index} display="flex" justifyContent="space-between" alignItems="center" sx={{ marginBottom: 1 }}>
                                            <Typography variant="body1">{event.eventDetails.date}</Typography>
                                            <Typography variant="body1">{event.eventDetails.title}</Typography>
                                            <Button variant="contained" color="primary" size="small">
                                                Give Feedback
                                            </Button>
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
                    <Button variant="contained" color="error" onClick={deleteUser} sx={{ mt: 4 }}>
                        Delete Account
                    </Button>
                </Paper>

                <ToastContainer />
            </Container>
        </Box>
    );
}

export default Profile;
