import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Grid } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import PageBanner from '../assets/FeedbackBanner.jpg';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AddFeedback() {
    const [submissionStatus, setSubmissionStatus] = useState('');


    const formik = useFormik({
        initialValues: {
            EventName: "",
            Improvement: "",
            Enjoy: "",
            rating: ""
        },
        validationSchema: yup.object({
            Name: yup.string().trim()
                .min(3, 'Name must be at least 3 characters'),
            emailAddress: yup.string().trim().lowercase().email()
                .max(50, 'Email must be at most 50 characters'),
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
        onSubmit: (data) => {
            data.EventName = data.EventName.trim();
            data.Improvement = data.Improvement.trim();
            data.Enjoy = data.Enjoy.trim();
            

            http.post("/EventFeedback", data)
                .then((res) => {
                    setSubmissionStatus('success');
                    toast.success(`Form has been sent successfully!`);

                    formik.resetForm();
                    console.log(res.data);
                })
                .catch((error) => {
                    setSubmissionStatus('error');
                    toast.error(`error in submitting form`);
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
                        style={{ width: 'auto', height: '500px', marginBottom: '0px' }} // Set the desired height here
                    />
                </Grid>
                <Grid container>
                    <Grid item xs={12} sx={{ bgcolor: '#9FCCC9', color: 'white', textAlign: 'center', py: 2 }}>
                        hello
                    </Grid>
                </Grid>
            </Box>
            <Box component="form" onSubmit={formik.handleSubmit} sx={{ bgcolor: 'white', p: 3, borderRadius: 2 }}>
                <TextField
                    fullWidth margin="dense" autoComplete="off"
                    label="Event"
                    name="EventName"
                    value={formik.values.EventName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.EventName && Boolean(formik.errors.EventName)}
                    helperText={formik.touched.EventName && formik.errors.EventName}
                />
                <TextField
                    fullWidth margin="dense" autoComplete="off"
                    multiline minRows={2}
                    label="What can be improved?"
                    name="Improvement"
                    value={formik.values.Improvement}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.Improvement && Boolean(formik.errors.Improvement)}
                    helperText={formik.touched.Improvement && formik.errors.Improvement}
                />
                <TextField
                    fullWidth margin="dense" autoComplete="off"
                    multiline minRows={2}
                    label="What do you enjoy about the event?"
                    name="Enjoy"
                    value={formik.values.Enjoy}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.Enjoy && Boolean(formik.errors.Enjoy)}
                    helperText={formik.touched.Enjoy && formik.errors.Enjoy}
                />
                <TextField
                    fullWidth margin="dense" autoComplete="off"
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