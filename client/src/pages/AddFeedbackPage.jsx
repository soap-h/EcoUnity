import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import PageBanner from '../assets/FeedbackBanner.jpg';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserContext from '../contexts/UserContext';

function AddFeedback() {
    const [submissionStatus, setSubmissionStatus] = useState('');
    const { user } = useContext(UserContext);
    const [eventsOptions, setEventsOptions] = useState([]);
    const [participants, setParticipants] = useState([]);
    const [noParticipants, setNoParticipants] = useState(0);
    const [feedback, setFeedback] = useState([]);
    const [selectedEventId, setSelectedEventId] = useState('');

    useEffect(() => {
        // Fetch feedback and events
        http.get('/EventFeedback')
            .then((res) => {
                const feedbackData = res.data;
                setFeedback(feedbackData);
                console.log('Feedback:', feedbackData);

                // Fetch events and filter them based on feedback
                retrieveEventParticipants(feedbackData);
            })
            .catch((error) => {
                console.error('Error fetching feedback data:', error);
            });
    }, [user.id]);

    const retrieveEventParticipants = (feedbackData) => {
        const userId = user.id;

        // Fetch registrations for the current user
        http.get(`/events/${userId}/registrations`)
            .then(res => {
                const registeredEventIds = res.data.map(registration => registration.eventId);

                // Fetch events and filter out those with feedback already provided
                http.get('/events')
                    .then(eventRes => {
                        const feedbackEventIds = feedbackData.map(fb => fb.eventId);
                        const filteredEvents = eventRes.data
                            .filter(event => registeredEventIds.includes(event.id) && !feedbackEventIds.includes(event.id));

                        setEventsOptions(filteredEvents);
                    })
                    .catch(error => {
                        console.error('Error fetching events:', error.response || error.message);
                    });
            })
            .catch(error => {
                console.error('Error fetching registrations:', error.response || error.message);
            });
    };

    const handleViewParticipants = () => {
        console.log('Selected event:', selectedEventId);

        http.get(`/events/${selectedEventId}/participants`)
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

    const handleEventChange = (event) => {
        const selectedId = event.target.value;
        const selectedEvent = eventsOptions.find(e => e.id === selectedId);
        const selectedTitle = selectedEvent ? selectedEvent.title : '';

        // Update Formik's value with the event title
        formik.setFieldValue('EventName', selectedTitle);

        // Update the event ID state
        setSelectedEventId(selectedId);
    };

    const formik = useFormik({
        initialValues: {
            EventName: "",
            Improvement: "",
            Enjoy: "",
            rating: ""
        },
        validationSchema: yup.object({
            EventName: yup.string().trim()
                .min(3, 'Title must be at least 3 characters')
                .max(100, 'Title must be at most 100 characters')
                .required('Title is required'),
            Improvement: yup.string().trim()
                .min(3, 'Description must be at least 3 characters')
                .max(500, 'Description must be at most 500 characters')
                .required('Description is required'),
            Enjoy: yup.string().trim()
                .min(3, 'Description must be at least 3 characters')
                .max(100, 'Description must be at most 100 characters')
                .required('Description is required'),
            rating: yup.number()
                .min(1, 'Rating must be at least 1')
                .max(10, 'Rating must be at most 10')
                .required('Rating is required')
        }),
        onSubmit: (values) => {
            const formData = {
                ...values,
                eventId: selectedEventId, // Include the event ID
            };

            http.post(`/EventFeedback/${selectedEventId}`, formData)
                .then((res) => {
                    setSubmissionStatus('success');
                    toast.success(`Form has been sent successfully!`);

                    // Update the feedback status to true
                    http.put(`/registrations/update-feedback-status`, {
                        feedbackstatus: true
                    })
                        .then(() => {
                            console.log('Feedback status updated successfully');
                        })
                        .catch((error) => {
                            console.error('Error updating feedback status:', error);
                        });

                    formik.resetForm();
                    console.log(res.data);
                })
                .catch((error) => {
                    setSubmissionStatus('error');
                    toast.error(`Error in submitting form`);
                    console.error(error);
                });
        }
    });


    return (
        <Box sx={{ bgcolor: '#075F6B', minHeight: '100vh', padding: 3 }}>
            <Box>
                <Grid container justifyContent='center'>
                    <img
                        src={PageBanner}
                        alt="PageBanner"
                        style={{ width: 'auto', height: '500px', marginBottom: '0px' }}
                    />
                </Grid>
                <Grid container>
                    <Grid item xs={12} sx={{ bgcolor: '#9FCCC9', color: 'white', textAlign: 'center', py: 2 }}>
                        Feedback Form
                    </Grid>
                </Grid>
            </Box>
            <Box component="form" onSubmit={formik.handleSubmit} sx={{ bgcolor: 'white', p: 3, borderRadius: 2 }}>
                <FormControl fullWidth margin="dense">
                    <InputLabel>Event</InputLabel>
                    <Select
                        name="EventName"
                        value={formik.values.EventName}
                        onChange={handleEventChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.EventName && Boolean(formik.errors.EventName)}
                        label="Event"
                    >
                        {eventsOptions.map((event) => (
                            <MenuItem key={event.id} value={event.id}>
                                {event.title}
                            </MenuItem>
                        ))}
                    </Select>
                    {formik.touched.EventName && formik.errors.EventName && (
                        <FormHelperText error>{formik.errors.EventName}</FormHelperText>
                    )}
                </FormControl>
                <TextField
                    fullWidth
                    margin="dense"
                    autoComplete="off"
                    multiline
                    minRows={2}
                    label="What can be improved?"
                    name="Improvement"
                    value={formik.values.Improvement}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.Improvement && Boolean(formik.errors.Improvement)}
                    helperText={formik.touched.Improvement && formik.errors.Improvement}
                />
                <TextField
                    fullWidth
                    margin="dense"
                    autoComplete="off"
                    multiline
                    minRows={2}
                    label="What do you enjoy about the event?"
                    name="Enjoy"
                    value={formik.values.Enjoy}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.Enjoy && Boolean(formik.errors.Enjoy)}
                    helperText={formik.touched.Enjoy && formik.errors.Enjoy}
                />
                <TextField
                    fullWidth
                    margin="dense"
                    autoComplete="off"
                    label="Rating"
                    name="rating"
                    value={formik.values.rating}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.rating && Boolean(formik.errors.rating)}
                    helperText={formik.touched.rating && formik.errors.rating}
                />
                <Box sx={{ mt: 2 }}>
                    <Button variant="contained" type="submit" sx={{ bgcolor: '#9FCCC9' }}>
                        Submit
                    </Button>
                </Box>
            </Box>
            <ToastContainer />
        </Box>
    );
}

export default AddFeedback;
