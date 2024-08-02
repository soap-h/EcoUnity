import React, { useState, useEffect } from 'react'
import { InputLabel, FormControl, Box, Typography, Select, MenuItem, IconButton, Button } from '@mui/material';
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
import global from '../global';
import UserContext from '../contexts/UserContext';
import AdminSidebar from '../components/AdminSidebar';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useParams, useNavigate } from 'react-router-dom';



function FeedbackAdmin() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [FeedbackList, setFeedback] = useState([]);
    const [FeedbackCount, setFeedbackCount] = useState(0);

    useEffect(() => {
        http.get('/EventFeedback').then((res) => {
            console.log(res.data);
            setFeedback(res.data);

        }).catch(error => {
            console.error('Error fetching data:', error);
        });
    }, []);

    const deleteFeedback = () => {

        http.delete(`/EventFeedback/${id}`)
            .then((res) => {
                console.log(res.data);
                navigate("/admin/FeedbackAdmin");
            });
    };

    const itemCount = FeedbackList.length;
    
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };



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
                                    <TableCell align="center"> Send Reply </TableCell>
                                    <TableCell align="center"> </TableCell>

                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {FeedbackList.map((Feedback, i) => (
                                    <TableRow
                                        key={Feedback.id} // Assuming each row has a unique 'id'
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {dayjs(Feedback.createdAt).format('YYYY-MM-DD')} {/* Format date as needed */}
                                        </TableCell>
                                        <TableCell align="center">{Feedback.user?.firstName}</TableCell>
                                        <TableCell align="center">{Feedback.user?.email}</TableCell>
                                        <TableCell align="center"><a href={`/admin/FeedbackAdmin/${Feedback.id}`}>Feedback</a></TableCell>
                                        <TableCell align="center"><Link to={`/addinbox`}><ReplyIcon /></Link></TableCell>
                                        <TableCell align="center"  ><IconButton onClick={handleOpen} ><DeleteOutlineIcon /></IconButton></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
                <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    Delete Feedback
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this Feedback?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="inherit"
                        onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="error"
                        onClick={deleteFeedback}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            <ToastContainer />
            </Box>

        </Box>
    );
}

export default FeedbackAdmin