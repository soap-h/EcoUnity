import React, { useEffect, useState, useContext } from 'react';
import UserContext from '../contexts/UserContext';
import { Link } from 'react-router-dom';
import { Box, Typography, IconButton, Button, TextField } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import dayjs from 'dayjs';
import global from '../global';
import http from '../http';
import { useNavigate } from 'react-router-dom';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import bannerImage from '../assets/images/Picture1.png';

ChartJS.register(ArcElement, Tooltip, Legend);

function Trackers() {
    const navigate = useNavigate();
    const [trackerList, setTrackerList] = useState([]);
    const [hoveredId, setHoveredId] = useState(null);
    const [selectedId, setSelectedId] = useState(null);
    const { user } = useContext(UserContext);

    const [goal, setGoal] = useState(1000); // State for goal
    const [openEditDialog, setOpenEditDialog] = useState(false); // State for edit dialog

    const formatDate = (date) => {
        const [year, month, day] = date.split('-');
        return `${day}/${month}/${year}`;
    };

    const getTrackers = () => {
        http.get('/tracker').then((res) => {
            console.log(res.data);
            setTrackerList(res.data);
        });
    };

    useEffect(() => {
        getTrackers();
    }, []);

    // delete activity
    const [open, setOpen] = useState(false);
    const handleOpen = (id) => {
        setSelectedId(id);
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    // edit goal
    const handleOpenEditDialog = () => {
        setOpenEditDialog(true);
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
    };

    const handleGoalChange = () => {
        handleCloseEditDialog();
    };

    const deleteActivity = () => {
        if (selectedId) {
            http.delete(`/tracker/${selectedId}`)
                .then((res) => {
                    console.log(res.data);
                    setTrackerList(trackerList.filter(tracker => tracker.id !== selectedId));
                    handleClose();
                });
        }
    }

    const totalPoints = trackerList.reduce((total, tracker) => total + tracker.points, 0);
    const remainingPoints = Math.max(goal - totalPoints, 0);
    const data = {
        labels: ['Total Points', 'Remaining'],
        
        datasets: [
            {
                data: [Math.min(totalPoints, goal), remainingPoints],
                // limit
                backgroundColor: ['#5A9895', '#f5f5f5'],
                hoverBackgroundColor: ['#4A7B7A', '#e0e0e0'],
            },
        ],
    };

    return (
        <Box sx={{ p: 2 }}>
            <Box
                component="img"
                src={bannerImage}
                alt="Banner"
                sx={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    mb: 2,
                }}
            />
            <Typography variant="h5" sx={{ my: 2 }}>
                Tracker
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <Box sx={{ width: '400px', height: '80vh', maxHeight: '80vh', overflowY: 'auto', border: '1px solid #ccc', borderRadius: '8px', p: 3, ml: 8 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Total Points
                    </Typography>
                    <Typography variant="h4" sx={{ mb: 2, textAlign: 'center', color: '#5A9895' }}>
                        {totalPoints}/{goal}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <Doughnut data={data} />
                    </Box>
                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Button variant="contained" startIcon={<Edit />} onClick={handleOpenEditDialog}>
                            Edit Goal
                        </Button>
                    </Box>
                </Box>

                <Box sx={{ width: '400px', height: '80vh', maxHeight: '80vh', overflowY: 'auto', border: '1px solid #ccc', borderRadius: '8px', p: 3, mr: 8, position: "relative" }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '96%', mb: 2, bgcolor: '#f5f5f5', p: 1, borderRadius: '4px', }}>
                        <Typography variant="body1" sx={{ width: '30%' }}>
                            Date
                        </Typography>
                        <Typography variant="body1" sx={{ width: '50%' }}>
                            Activity
                        </Typography>
                        <Typography variant="body1" sx={{ width: '20%' }}>
                            Points
                        </Typography>
                    </Box>
                    {
                        trackerList.length === 0 ? (
                            <Typography sx={{ textAlign: 'center', color: 'gray', }}>No Recorded activities</Typography>
                        ) : (
                            trackerList.map((tracker) => (
                                <Box key={tracker.id} sx={{ display: 'flex', justifyContent: 'space-between', py: 2, px: 1, bgcolor: '#fff', borderBottom: '1px solid #ddd', '&:hover': { backgroundColor: '#f5f5f5' } }}
                                    onMouseEnter={() => setHoveredId(tracker.id)}
                                    onMouseLeave={() => setHoveredId(null)}>
                                    <Typography variant="body2" sx={{ width: '30%' }}>
                                        {formatDate(tracker.date)}
                                    </Typography>
                                    <Typography variant="body2" sx={{ width: '55%' }}>
                                        {tracker.title}
                                    </Typography>
                                    <Typography variant="body2" sx={{ width: '15%' }}>
                                        {tracker.points}
                                    </Typography>
                                    {hoveredId === tracker.id && (
                                        <IconButton
                                            size="small"
                                            sx={{
                                                position: 'absolute',
                                                right: 25,
                                                color: 'red',
                                            }}
                                            onClick={() => handleOpen(tracker.id)}
                                        >
                                            <Delete />
                                        </IconButton>
                                    )}
                                </Box>
                            ))
                        )
                    }
                    <Dialog open={open} onClose={handleClose}>
                        <DialogTitle>
                            Delete Activity
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Are you sure you want to delete this activity?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button variant="contained" color="inherit" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button variant="contained" color="error" onClick={deleteActivity}>
                                Delete
                            </Button>
                        </DialogActions>
                    </Dialog>
                    {/* Add button */}
                    <Box sx={{ position: 'absolute', bottom: 16, right: 16 }}>
                        <Link to="/addactivity" style={{ textDecoration: 'none' }}>
                            <IconButton color="primary" sx={{
                                padding: '4px', backgroundColor: "#5A9895", '&:hover': { backgroundColor: "#4A7B7A" },
                            }}>
                                <Add />
                            </IconButton>
                        </Link>
                    </Box>
                </Box>
            </Box>

            {/* Edit Goal Dialog */}
            <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
                <DialogTitle>Edit Goal</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter a new value for the goal.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Goal"
                        type="number"
                        fullWidth
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEditDialog} color="inherit">
                        Cancel
                    </Button>
                    <Button onClick={handleGoalChange} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
            
            <ToastContainer />
        </Box>
    )
}

export default Trackers;
