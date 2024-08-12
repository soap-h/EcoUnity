import React, { useState, useEffect, useContext } from 'react';
import {
    InputLabel, TextField, Box, Typography, MenuItem, IconButton, Button, Select,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, FormControl
} from '@mui/material';
import { Link, useParams, useNavigate } from 'react-router-dom';
import ReplyIcon from '@mui/icons-material/Reply';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import http from '../http';
import dayjs from 'dayjs';
import { ToastContainer, toast } from 'react-toastify';
import * as yup from 'yup';
import { useFormik } from 'formik';
import UserContext from '../contexts/UserContext';
import AdminSidebar from '../components/AdminSidebar';
import { CircularProgress } from '@mui/material';
import { Grid } from '@mui/material';

function FeedbackAdmin() {
    const { id } = useParams();
    const [FeedbackList, setFeedback] = useState([]);
    const [FeedbackID, setFeedbackID] = useState(null);
    const [FeedbackEmail, setFeedbackEmail] = useState(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [openMessage, setOpenMessage] = useState(false);
    const [eventsOptions, setEventsOptions] = useState([]);
    const { user } = useContext(UserContext);
    const [selectedEvent, setSelectedEvent] = useState('');
    const [participants, setParticipants] = useState([]);
    const [noParticipants, setNoParticipants] = useState('');


    useEffect(() => {
        retrieveEventParticipants();
        http.get('/EventFeedback').then((res) => {
            setFeedback(res.data);
        }).catch(error => {
            console.error('Error fetching feedback:', error);
        });
    }, []);



    const retrieveEventParticipants = () => {
        http.get('/events')
            .then(res => {
                setEventsOptions(res.data);
            })
            .catch(error => {
                console.error('Error fetching events:', error);
            });
    };

    const handleViewParticipants = () => {
        console.log('Selected event: after handleview', selectedEvent);

        http.get(`/events/${selectedEvent}/participants`)
            .then(res => {
                setParticipants(res.data);
                const noParticipants = res.data.length;
                setNoParticipants(noParticipants);
                console.log('Participants:', participants);
            })
            .catch(error => {
                console.error('Failed to fetch participants:', error);
            });
    };

    const handleChangeEvent = (event) => {
        const selectedValue = event.target.value;
        setSelectedEvent(selectedValue);
        console.log('Selected event:', selectedValue);
        console.log('Selected event 1213:', selectedEvent);
        setParticipants([]);

        // Call handleViewParticipants to fetch participants after updating the selected event

        handleViewParticipants();
    }

    const formik = useFormik({
        initialValues: {
            title: '',
            content: '',
            date: new Date(),
            category: 'events',
            recipient: FeedbackEmail
        },
        validationSchema: yup.object({
            title: yup.string().required('Title is required').min(3, 'Title must be at least 3 characters long').max(100, 'Title can be at most 100 characters long'),
            content: yup.string().required('Content is required').min(3, 'Content must be at least 3 characters long').max(500, 'Content can be at most 500 characters long'),
            date: yup.date().required('Date is required')
        }),
        onSubmit: values => {
            const messageData = {
                ...values,
                recipient: FeedbackEmail,
                userId: user.id
            };
        
            http.post('/inbox', messageData)
                .then(() => {
                    setFeedbackEmail(null);
                    handleCloseMessageDialog();
                    toast.success('Message sent successfully!');
                }).catch(error => {
                    console.error('Error sending message:', error);
                    toast.error('Error sending message.');
                });
        }
    });

    const handleOpenDeleteDialog = (id) => {
        setFeedbackID(id);
        setOpenDelete(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDelete(false);
    };

    const handleOpenMessageDialog = (email) => {
        setFeedbackEmail(email);
        setOpenMessage(true);
    };

    const handleCloseMessageDialog = () => {
        setOpenMessage(false);
    };

    const deleteFeedback = () => {
        if (FeedbackID !== null) {
            http.delete(`/EventFeedback/${FeedbackID}`)
                .then(() => {
                    setFeedback(prevFeedback => prevFeedback.filter(feedback => feedback.id !== FeedbackID));
                    handleCloseDeleteDialog();
                    toast.success('Feedback deleted successfully!');
                }).catch(error => {
                    console.error('Error deleting feedback:', error);
                    toast.error('Failed to delete feedback.');
                });
        }
    };

    return (
        <Box sx={{ display: 'flex', height: '100vh' }}>
            <AdminSidebar />
            <Box sx={{ flexGrow: 1, p: 3 }}>
                <Typography variant="h3" className="events-participant-text">Event Feedback {FeedbackList.length}</Typography>
                <FormControl fullWidth sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel>Event</InputLabel>
                    <Select
                        value={selectedEvent}
                        onChange={handleChangeEvent}
                    >
                        {eventsOptions.map((event) => (
                            <MenuItem key={event.id} value={event.id}>
                                {event.title}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Box sx={{ flexGrow: 1, p: 3, m: 3, bgcolor: '#9FCCC9' }} style={{ borderRadius: '16px' }}>
                    <Grid container spacing={2} sx={{ mb: 4 }}>
                        <Grid item xs={4}>
                            <Box sx={{ p: 2, bgcolor: '#3f51b5', borderRadius: '8px', textAlign: 'center', color: 'white' }}>
                                <Typography variant="h6">Total Particpants</Typography>
                                <Typography variant="h4">{noParticipants}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={4}>
                            <Box sx={{ p: 2, bgcolor: '#ff9800', borderRadius: '8px', textAlign: 'center', color: 'white', position: 'relative' }}>
                                <Typography variant="h6">pending Feedback</Typography>
                                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                                    <CircularProgress
                                        variant="determinate"
                                        value={1}
                                        size={60}
                                        thickness={5}
                                        sx={{ color: 'white' }}
                                    />
                                    <Box
                                        sx={{
                                            top: 0,
                                            left: 0,
                                            bottom: 0,
                                            right: 0,
                                            position: 'absolute',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Typography variant="h6" component="div" color="white">
                                            10
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                    <TableContainer component={Paper} sx={{ bgcolor: '#D7CAB7' }} className='Table'>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">Date</TableCell>
                                    <TableCell align="center">Name</TableCell>
                                    <TableCell align="center">Email</TableCell>
                                    <TableCell align="center">Feedback Response</TableCell>
                                    <TableCell align="center">Send Reply</TableCell>
                                    <TableCell align="center"></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {participants.map((feedback) => (
                                    <TableRow key={feedback.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row">
                                            {dayjs(feedback.createdAt).format('YYYY-MM-DD')}
                                        </TableCell>
                                        <TableCell align="center">{feedback.name}</TableCell>
                                        <TableCell align="center">{feedback.email}</TableCell>
                                        {feedback?.FeedbackStatus === 0 ? (
                                            <>
                                                <TableCell align="center"><Link to={`/admin/FeedbackAdmin/${feedback.id}`}>Feedback</Link></TableCell>
                                                <TableCell align="center">
                                                    <IconButton onClick={() => handleOpenMessageDialog(feedback.email)}>
                                                        <ReplyIcon />
                                                    </IconButton>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <IconButton onClick={() => handleOpenDeleteDialog(feedback.id)}>
                                                        <DeleteOutlineIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </>
                                        ) : (
                                            <>
                                                <TableCell align="center">UNAVAILABLE</TableCell>
                                                <TableCell align="center">UNAVAILABLE</TableCell>
                                                <TableCell align="center">UNAVAILABLE</TableCell>
                                            </>
                                        )}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
                <Dialog open={openDelete} onClose={handleCloseDeleteDialog}>
                    <DialogTitle>Delete Feedback</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete this Feedback?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="inherit" onClick={handleCloseDeleteDialog}>Cancel</Button>
                        <Button variant="contained" color="error" onClick={deleteFeedback}>Delete</Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={openMessage} onClose={handleCloseMessageDialog}>
                    <DialogTitle>Sending Message to {FeedbackEmail}</DialogTitle>
                    <DialogContent>
                        <Box component="form" noValidate onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="title"
                                label="Subject"
                                name="title"
                                autoFocus
                                value={formik.values.title}
                                onChange={formik.handleChange}
                                error={formik.touched.title && Boolean(formik.errors.title)}
                                helperText={formik.touched.title && formik.errors.title}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="content"
                                label="Message"
                                type="text"
                                id="content"
                                multiline
                                rows={4}
                                value={formik.values.content}
                                onChange={formik.handleChange}
                                error={formik.touched.content && Boolean(formik.errors.content)}
                                helperText={formik.touched.content && formik.errors.content}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Send
                            </Button>
                        </Box>
                    </DialogContent>
                </Dialog>
                <ToastContainer />
            </Box>
        </Box>
    );
}

export default FeedbackAdmin;
