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
    const [eventName, setEventName] = useState('');
    const [noParticipants, setNoParticipants] = useState('');
    const [tempEventID, setTempEventID] = useState('');
    const [tempUserID, setTempUserID] = useState('');


    useEffect(() => {
        retrieveEventParticipants();
        if (selectedEvent) {
            handleViewParticipants();
        }
    }, [selectedEvent]);



    const retrieveEventParticipants = () => {
        http.get('/events')
            .then(res => {
                setEventsOptions(res.data);
                const filteredEvents = res.data.filter(event => event.id === selectedEvent);
                setEventName(filteredEvents[0].title);
            })
            .catch(error => {
                console.error('Error fetching events:', error);
            });
    };
    // Trigger fetching participants when selectedEvent changes

    const handleChangeEvent = (event) => {
        const selectedValue = event.target.value;
        setSelectedEvent(selectedValue);  // Update the selected event
    };
    const handleViewParticipants = () => {
        if (!selectedEvent) return;  // Only fetch participants if an event is selected

        http.get(`/events/${selectedEvent}/participants`)
            .then((participantsRes) => {
                const participants = participantsRes.data;

                // Fetch feedback after participants are fetched
                return http.get('/EventFeedback').then(feedbackRes => {
                    const feedback = feedbackRes.data;

                    const combinedData = participants.map(participant => {
                        const matchingFeedback = feedback.find(fb => fb.eventId === participant.eventId && fb.userId === participant.id);
                        console.log("matching: ", matchingFeedback)
                        return {
                            ...participant,
                            feedback2: matchingFeedback || null,
                        };
                    });
                    console.log('Combined data:', combinedData);

                    setParticipants(combinedData);
                });
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    };

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
            date: yup.date().required('Date is required'),
            category: yup.string().trim().max(500).required('Category is required'),
            recipient: yup.string().trim().lowercase().email().max(50, 'Max 50 characters only').required('Recipient is required')
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
                    console.log(`This is message data title: ${messageData.title}`);
                    console.log(`This is message data content: ${messageData.content}`);
                    console.log(`This is message data date: ${messageData.date}`);
                    console.log(`This is message data recipient: ${messageData.recipient}`);
                    console.log(`This is message data category: ${messageData.category}`);
                    console.log(`This is message data userId: ${messageData.userId}`);

                    console.error('Error sending message:', error.message);
                    toast.error('Error sending message.');
                });
        }
    });


    const handleOpenDeleteDialog = (id, eventid, userid) => {
        setFeedbackID(id);
        setTempEventID(eventid);
        setTempUserID(userid);
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
                    setParticipants(prevParticipants => prevParticipants.filter(participant => participant.id !== tempUserID));
                    handleCloseDeleteDialog();
                    toast.success('Feedback deleted successfully!');
                }).catch(error => {
                    console.error('Error deleting feedback:', error);
                    toast.error('Failed to delete feedback.');
                });

            http.put(`/events/update-feedback-status/${tempEventID}`, {
                userId: tempUserID,
                FeedbackStatus: false
            })
                .then(() => {
                    console.log('Feedback status updated successfully');
                })
                .catch((error) => {
                    console.error('Error updating feedback status:', error);
                });
        }
    };

    return (
        <Box sx={{ display: 'flex', height: '100vh' }}>
            <AdminSidebar />
            <Box sx={{ flexGrow: 1, p: 3 }}>
                <Typography variant="h3" className="events-participant-text" sx={{ mb: 2 }}>
                    Event Feedback
                </Typography>

                <FormControl fullWidth sx={{ mb: 3, minWidth: 200 }}>
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

                {selectedEvent ? (
                    <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 2 }}>
                        Showing results for <span style={{ textDecoration: 'underline' }}>{eventName}</span>
                    </Typography>
                ) : (
                    <Typography variant="h5" sx={{ fontStyle: 'italic', mt: 2 }}>
                        No event selected
                    </Typography>
                )}

                <Box sx={{ flexGrow: 1, p: 3, m: 3, bgcolor: '#9FCCC9' }} style={{ borderRadius: '16px' }}>
                    <Grid container spacing={2} sx={{ mb: 4 }}>
                        <Grid item xs={4}>
                            <Box sx={{ p: 2, bgcolor: '#3f51b5', borderRadius: '8px', textAlign: 'center', color: 'white' }}>
                                <Typography variant="h6">Total Particpants</Typography>
                                <Typography variant="h4">{participants.length}</Typography>
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
                    <TableContainer component={Paper} sx={{ bgcolor: '', maxHeight: 180, overflowY: 'auto' }} className='Table'>
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
                                        {feedback?.feedback === 1 ? (
                                            <>
                                                <TableCell align="center"><Link to={`/admin/FeedbackAdmin/${feedback.feedback2  ?.id}`}>Feedback</Link></TableCell>
                                                <TableCell align="center">
                                                    <IconButton onClick={() => handleOpenMessageDialog(feedback.email)}>
                                                        <ReplyIcon />
                                                    </IconButton>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <IconButton onClick={() => handleOpenDeleteDialog(feedback.feedback2?.id, feedback.eventId, feedback.userId)}>
                                                        <DeleteOutlineIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </>
                                        ) : (
                                            <>
                                                <TableCell align="center" color='red'>UNAVAILABLE</TableCell>
                                                <TableCell align="center" color='red'>UNAVAILABLE</TableCell>
                                                <TableCell align="center" color='red'>UNAVAILABLE</TableCell>
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

