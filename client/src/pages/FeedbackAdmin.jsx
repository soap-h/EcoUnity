import React, { useState, useEffect, useContext } from 'react';
import { InputLabel, TextField, Box, Typography, Select, MenuItem, IconButton, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import http from '../http';
import dayjs from 'dayjs';
import ReplyIcon from '@mui/icons-material/Reply';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import * as yup from 'yup';
import { useFormik } from 'formik';
import UserContext from '../contexts/UserContext';
import AdminSidebar from '../components/AdminSidebar';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useParams, useNavigate } from 'react-router-dom';

function FeedbackAdmin() {
    const { id } = useParams();
    const [FeedbackList, setFeedback] = useState([]);
    const [FeedbackID, setFeedbackID] = useState(null);
    const [FeedbackEmail, setFeedbackEmail] = useState(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [openMessage, setOpenMessage] = useState(false);
    const { user } = useContext(UserContext);

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
        }),
        onSubmit: values => {
            console.log('Form values:', values); // Log formik values to ensure submission
            const messageData = {
                ...values,
                recipient: FeedbackEmail,
                userId: user.id
            };
            http.post('/inbox', messageData)
                .then((res) => {
                    console.log('Response:', res.data); // Log response
                    setFeedbackEmail(null)
                    handleCloseMessageDialog();
                    toast.success('Message sent successfully!');
                }).catch(error => {
                    console.error('Error sending message:', error); // Log error
                    toast.error('Error sending message.');
                });
        }
    });

    useEffect(() => {
        http.get('/EventFeedback').then((res) => {
            console.log('Feedback data:', res.data); // Log feedback data
            setFeedback(res.data);
        }).catch(error => {
            console.error('Error fetching data:', error); // Log error
        });
    }, []);

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
                .then((res) => {
                    console.log('Delete response:', res.data); // Log response
                    setFeedback(prevFeedback => prevFeedback.filter(feedback => feedback.id !== FeedbackID));
                    handleCloseDeleteDialog();
                    toast.success('Feedback deleted successfully!');
                }).catch(error => {
                    console.error('Error deleting feedback:', error); // Log error
                    toast.error('Failed to delete feedback.');
                });
        }
    };

    const itemCount = FeedbackList.length;

    return (
        <Box sx={{ display: 'flex', height: '100vh' }}>
            <AdminSidebar /> {/* Sidebar Component */}
            <Box sx={{ flexGrow: 1, p: 3 }}>
                <Typography variant="h3" className="events-participant-text">Incident Reporting {itemCount}</Typography>
                <Box sx={{ flexGrow: 1, p: 3, m: 3, bgcolor: '#9FCCC9' }} style={{ borderRadius: '16px' }}>
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
                                {FeedbackList.map((Feedback) => (
                                    <TableRow
                                        key={Feedback.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {dayjs(Feedback.createdAt).format('YYYY-MM-DD')}
                                        </TableCell>
                                        <TableCell align="center">{Feedback.user?.firstName}</TableCell>
                                        <TableCell align="center">{Feedback.user?.email}</TableCell>
                                        <TableCell align="center"><a href={`/admin/FeedbackAdmin/${Feedback.id}`}>Feedback</a></TableCell>
                                        <TableCell align="center"><IconButton onClick={() => handleOpenMessageDialog(Feedback.user?.email)}><ReplyIcon /></IconButton></TableCell>
                                        <TableCell align="center">
                                            <IconButton onClick={() => handleOpenDeleteDialog(Feedback.id)}>
                                                <DeleteOutlineIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
                <Dialog open={openDelete} onClose={handleCloseDeleteDialog}>
                    <DialogTitle>
                        Delete Feedback
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete this Feedback?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="inherit" onClick={handleCloseDeleteDialog}>
                            Cancel
                        </Button>
                        <Button variant="contained" color="error" onClick={deleteFeedback}>
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={openMessage} onClose={handleCloseMessageDialog}>
                    <DialogTitle>
                        Sending Message to {FeedbackEmail}
                    </DialogTitle>
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
