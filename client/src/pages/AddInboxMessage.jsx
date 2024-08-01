import React from 'react';
import { Box, Typography, TextField, Button, Paper, Container } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import http from '../http';
import { useContext } from 'react';
import UserContext from '../contexts/UserContext';

function AddInboxMessage() {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            title: '',
            content: '',
            date: new Date(),
            category: 'events',
            recipient: ''
        },
        validationSchema: yup.object({
            title: yup.string().required('Title is required').min(3, 'Title must be at least 3 characters long').max(100, 'Title can be at most 100 characters long'),
            content: yup.string().required('Content is required').min(3, 'Content must be at least 3 characters long').max(500, 'Content can be at most 500 characters long'),
            date: yup.date().required('Date is required'),
            recipient: yup.string().required('Recipient is required').email('Recipient must be a valid email').max(50, 'Recipient can be at most 50 characters long')
        }),
        onSubmit: values => {
            const messageData = {
                ...values,
                userId: user.id
            };
            http.post('/inbox', messageData)
                .then(response => {
                    navigate('/inbox');
                })
                .catch(error => {
                    console.error('Error posting message:', error);
                });
        }
    });

    return (
        <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
            <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
                <Typography component="h1" variant="h6" color="text.primary">
                    Compose Message
                </Typography>
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
                        id="recipient"
                        label="To"
                        name="recipient"
                        value={formik.values.recipient}
                        onChange={formik.handleChange}
                        error={formik.touched.recipient && Boolean(formik.errors.recipient)}
                        helperText={formik.touched.recipient && formik.errors.recipient}
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
            </Paper>
        </Container>
    );
}

export default AddInboxMessage;
