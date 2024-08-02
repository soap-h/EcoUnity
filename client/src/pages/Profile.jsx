import React, { useContext, useState, useEffect } from 'react';
import { Box, Typography, Grid, Avatar, Container, Paper, IconButton, Button, TextField } from '@mui/material';
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
    const navigate = useNavigate(); // For redirecting after deletion

    const getTrackers = () => {
        http.get("/tracker").then((res) => {
            setTrackerList(res.data);
        });
    };

    useEffect(() => {
        getTrackers();
        setDescription(user?.description || '');
    }, [user]);

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
        setDescription(user.description); // Reset the description to the last saved state
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
        // Confirm dialog to ensure the user wants to delete their account
        if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            http.delete(`/user/${user.id}`)
                .then(() => {
                    toast.success('User deleted successfully');
                    // Redirect to the login page or home page after deletion
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
        <Box sx={{ bgcolor: '#F0F5F8', minHeight: '100vh', width: '100%' }}>
            <Container maxWidth="lg">
                <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <Box sx={{ position: 'relative', display: 'inline-block' }}>
                                <Avatar
                                    alt={`${user.firstName} ${user.lastName}`}
                                    src={`${import.meta.env.VITE_FILE_PROFILE_URL}${user?.imageFile}`} 
                                    sx={{ width: 150, height: 150, marginLeft: 12 }}
                                />
                               
                                <IconButton
                                    component="label"
                                    sx={{
                                        position: 'absolute',
                                        bottom: 0,
                                        right: 0,
                                        backgroundColor: '#EEEEEE',
                                        '&:hover': { backgroundColor: '#DDDDDD' },
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
                                />
                            ) : (
                                <Typography variant="body1" color="textSecondary">{description}</Typography>
                            )}
                            {isEditing ? (
                                <>
                                    <Button variant="contained" color="primary" onClick={saveDescription} sx={{ mt: 2, mr: 2 }}>
                                        Save
                                    </Button>
                                    <Button variant="outlined" onClick={cancelButtonHandler} sx={{ mt: 2 }}>
                                        Cancel
                                    </Button>
                                </>
                            ) : (
                                <Button variant="contained" onClick={editButtonHandler} sx={{ mt: 2 }}>
                                    Edit Description
                                </Button>
                            )}
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
                    <Button variant="contained" color="primary" onClick={deleteUser} sx={{ mt: 2 }}>
                                Delete Account
                            </Button>
                </Paper>

                <ToastContainer />
            </Container>
        </Box >
    );
}

export default Profile;
