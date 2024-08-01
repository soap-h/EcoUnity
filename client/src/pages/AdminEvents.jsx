import React, { useState, useEffect } from 'react';
import { Box, Tab, Tabs, Typography, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Menu, MenuItem, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import http from '../http';
import AdminSidebar from '../components/AdminSidebar';
import UserContext from '../contexts/UserContext';
import AddEvent from '../pages/AddEvent';
import EditEvent from '../pages/EditEvent';
import ViewEvent from '../pages/ViewEvent';
import dayjs from 'dayjs';

const AdminEvents = () => {
    const { user } = React.useContext(UserContext);
    const [events, setEvents] = useState([]);
    const [tabValue, setTabValue] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [openAdd, setOpenAdd] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openView, setOpenView] = useState(false);
    const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

    const fetchEvents = async () => {
        try {
            const res = await http.get('/events');
            setEvents(res.data);
        } catch (error) {
            console.error('Failed to fetch events:', error);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleMenuOpen = (event, eventId) => {
        setSelectedEvent(eventId);
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleOpenAddDialog = () => {
        setOpenAdd(true);
    };

    const handleCloseAddDialog = () => {
        setOpenAdd(false);
        fetchEvents();
    };

    const handleOpenEditDialog = (event) => {
        setSelectedEvent({
            ...event,
            date: dayjs(event.date),
            timeStart: dayjs(event.timeStart, 'HH:mm:ss'),
            timeEnd: dayjs(event.timeEnd, 'HH:mm:ss'),
            registerEndDate: dayjs(event.registerEndDate),
        });
        setOpenEdit(true);
    };

    const handleCloseEditDialog = () => {
        setOpenEdit(false);
        fetchEvents();
    };

    const handleOpenViewDialog = (event) => {
        setSelectedEvent(event);
        setOpenView(true);
    };

    const handleCloseViewDialog = () => {
        setOpenView(false);
    };

    const handleOpenDeleteConfirmDialog = (event) => {
        setSelectedEvent(event);
        setOpenDeleteConfirm(true);
    };

    const handleCloseDeleteConfirmDialog = () => {
        setOpenDeleteConfirm(false);
    };

    const handleDeleteEvent = async () => {
        try {
            await http.delete(`/events/${selectedEvent.id}`);
            handleCloseDeleteConfirmDialog();
            fetchEvents();
        } catch (error) {
            console.error('Failed to delete event:', error);
        }
    };

    const renderEventsTable = () => (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Title</TableCell>
                        <TableCell>Max Participants</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Registration Deadline</TableCell>
                        <TableCell>Created by (user ID)</TableCell>
                        <TableCell align="right">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {events.length > 0 ? (
                        events.map((event) => (
                            <TableRow key={event.id}>
                                <TableCell>{event.id}</TableCell>
                                <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                                <TableCell>{event.title}</TableCell>
                                <TableCell>{event.participants}</TableCell>
                                <TableCell>{event.price}</TableCell>
                                <TableCell>{event.category}</TableCell>
                                <TableCell>{event.type}</TableCell>
                                <TableCell>{event.registerEndDate}</TableCell>
                                <TableCell>{event.userId}</TableCell>
                                <TableCell align="right">
                                    <IconButton onClick={(e) => handleMenuOpen(e, event)}>
                                        <MoreVertIcon />
                                    </IconButton>
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={Boolean(anchorEl) && selectedEvent?.id === event.id}
                                        onClose={handleMenuClose}
                                    >
                                        <MenuItem onClick={() => { handleMenuClose(); handleOpenEditDialog(event); }}>Edit</MenuItem>
                                        <MenuItem onClick={() => { handleMenuClose(); handleOpenViewDialog(event); }}>View More</MenuItem>
                                        <MenuItem onClick={() => { handleMenuClose(); handleOpenDeleteConfirmDialog(event); }}>Delete</MenuItem>
                                    </Menu>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={7}>No events available</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <AdminSidebar username={user?.firstName || 'User'} />
            <Box sx={{ flexGrow: 1, padding: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h4">Events</Typography>
                    <Button variant="contained" color="primary" onClick={handleOpenAddDialog}>
                        Create new event
                    </Button>
                </Box>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="events tabs">
                    <Tab label="Current Events" />
                    <Tab label="Pending Events" />
                    <Tab label="Past Events" />
                </Tabs>
                <Box sx={{ paddingTop: 3 }}>
                    {tabValue === 0 && renderEventsTable()}
                    {tabValue === 1 && <Typography>Pending Events</Typography>}
                    {tabValue === 2 && <Typography>Past Events</Typography>}
                </Box>
                <Dialog open={openAdd} onClose={handleCloseAddDialog}>
                    <DialogTitle>Add Event</DialogTitle>
                    <DialogContent>
                        <AddEvent onClose={handleCloseAddDialog} />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseAddDialog} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
                {selectedEvent && (
                    <Dialog open={openEdit} onClose={handleCloseEditDialog}>
                        <DialogTitle>Edit Event</DialogTitle>
                        <DialogContent>
                            <EditEvent event={selectedEvent} onClose={handleCloseEditDialog} />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseEditDialog} color="primary">
                                Cancel
                            </Button>
                        </DialogActions>
                    </Dialog>
                )}
                {selectedEvent && (
                    <Dialog open={openView} onClose={handleCloseViewDialog}>
                        <DialogTitle>View Event</DialogTitle>
                        <DialogContent>
                            <ViewEvent event={selectedEvent} onClose={handleCloseViewDialog} />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseViewDialog} color="primary">
                                Close
                            </Button>
                        </DialogActions>
                    </Dialog>
                )}
                {selectedEvent && (
                    <Dialog open={openDeleteConfirm} onClose={handleCloseDeleteConfirmDialog}>
                        <DialogTitle>Delete Event</DialogTitle>
                        <DialogContent>
                            <Typography>Are you sure you want to delete this event?</Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDeleteConfirmDialog} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={handleDeleteEvent} color="primary">
                                Delete
                            </Button>
                        </DialogActions>
                    </Dialog>
                )}
            </Box>
        </Box>
    );
};

export default AdminEvents;