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
    const [proposals, setProposals] = useState([]);
    const [tabValue, setTabValue] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [openAdd, setOpenAdd] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openView, setOpenView] = useState(false);
    const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
    const [participants, setParticipants] = useState([]);
    const [openParticipantsDialog, setOpenParticipantsDialog] = useState(false);

    const handleOpenParticipantsDialog = async (event) => {
        try {
            const res = await http.get(`/events/${event.id}/participants`);
            setParticipants(res.data);
            setSelectedEvent(event);
            setOpenParticipantsDialog(true);
        } catch (error) {
            console.error('Failed to fetch participants:', error);
        }
    };

    const handleCloseParticipantsDialog = () => {
        setOpenParticipantsDialog(false);
        setParticipants([]);
    };

    const fetchEvents = async () => {
        try {
            const res = await http.get('/events');
            setEvents(res.data);
        } catch (error) {
            console.error('Failed to fetch events:', error);
        }
    };

    const fetchProposals = async () => {
        try {
            const res = await http.get('/proposals');
            setProposals(res.data);
        } catch (error) {
            console.error('Failed to fetch proposals:', error);
        }
    };

    useEffect(() => {
        fetchEvents();
        fetchProposals();
    }, []);

    useEffect(() => {
        console.log("Fetched events:", events);
        console.log("Current events:", currentEvents);
        console.log("Past events:", pastEvents);
    }, [events]);

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

    const now = dayjs();

    const currentEvents = events.filter(event => {
        let eventEndTime = dayjs(event.date); // Parse the date

        if (event.timeEnd) {
            // If timeEnd is in the correct format, parse it
            const [hours, minutes, seconds] = event.timeEnd.split(':');
            eventEndTime = eventEndTime.hour(hours).minute(minutes).second(seconds);
        }

        console.log(`Event ${event.id} end time: ${eventEndTime.isValid() ? eventEndTime.format() : 'Invalid Date'}`);
        return now.isBefore(eventEndTime);
    });

    const pastEvents = events.filter(event => {
        let eventEndTime = dayjs(event.date);

        if (event.timeEnd) {
            const [hours, minutes, seconds] = event.timeEnd.split(':');
            eventEndTime = eventEndTime.hour(hours).minute(minutes).second(seconds);
        }

        console.log(`Event ${event.id} end time: ${eventEndTime.isValid() ? eventEndTime.format() : 'Invalid Date'}`);
        return now.isAfter(eventEndTime);
    });

    const renderEventsTable = (eventsToDisplay) => (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Title</TableCell>
                        <TableCell>Participants</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Registration Deadline</TableCell>
                        <TableCell>Created by (user ID)</TableCell>
                        <TableCell align="right">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {eventsToDisplay.length > 0 ? (
                        eventsToDisplay.map((event) => (
                            <TableRow key={event.id}>
                                <TableCell>{event.id}</TableCell>
                                <TableCell>{event.date}</TableCell>
                                <TableCell>{event.title}</TableCell>
                                <TableCell onClick={() => handleOpenParticipantsDialog(event)}>
                                    {event.registered}/{event.participants}
                                </TableCell>
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
                            <TableCell colSpan={10}>No events available</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );

    const renderProposalsTable = () => (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Document</TableCell>
                        <TableCell>User ID</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {proposals.length > 0 ? (
                        proposals.map((proposal) => (
                            <TableRow key={proposal.id} style={{ backgroundColor: proposal.status === 'Approved' ? 'lightgreen' : proposal.status === 'Rejected' ? 'lightcoral' : 'inherit' }}>
                                <TableCell>{proposal.id}</TableCell>
                                <TableCell>{proposal.date}</TableCell>
                                <TableCell>
                                    <a href={`/proposals/download/${proposal.document}`} download>
                                        {proposal.name}
                                    </a>
                                </TableCell>
                                <TableCell>{proposal.userId}</TableCell>
                                <TableCell>
                                    <Button variant="contained" sx={{ backgroundColor: 'green', color: 'white' }} onClick={() => handleApproveProposal(proposal.id)} disabled={proposal.status !== 'Pending'}>
                                        Approve
                                    </Button>
                                    <Button variant="contained" sx={{ backgroundColor: 'red', color: 'white', ml: 2 }} onClick={() => handleRejectProposal(proposal.id)} disabled={proposal.status !== 'Pending'}>
                                        Reject
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5}>No proposals available</TableCell>
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
                    {tabValue === 0 && renderEventsTable(currentEvents)}
                    {tabValue === 1 && renderProposalsTable()}
                    {tabValue === 2 && renderEventsTable(pastEvents)}
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
                <Dialog open={openParticipantsDialog} onClose={handleCloseParticipantsDialog}>
                    <DialogTitle>Registered Participants for {selectedEvent?.title}</DialogTitle>
                    <DialogContent>
                        {participants.length > 0 ? (
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>User ID</TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Email</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {participants.map((participant) => (
                                        <TableRow key={participant.id}>
                                            <TableCell>{participant.id}</TableCell>
                                            <TableCell>{participant.name}</TableCell>
                                            <TableCell>{participant.email}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <Typography>No participants registered yet.</Typography>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseParticipantsDialog} color="primary">
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
