import React, { useState } from 'react';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import http from '../http';

const ViewEvent = ({ event, onClose }) => {
    const [participants, setParticipants] = useState([]);
    const [openParticipantsDialog, setOpenParticipantsDialog] = useState(false);

    const handleViewParticipants = async () => {
        try {
            const res = await http.get(`/events/${event.id}/participants`);
            setParticipants(res.data);
            setOpenParticipantsDialog(true);
        } catch (error) {
            console.error('Failed to fetch participants:', error);
        }
    };

    const handleCloseParticipantsDialog = () => {
        setOpenParticipantsDialog(false);
    };

    return (
        <>
            <Dialog open onClose={onClose}>
                <DialogTitle>Event Details</DialogTitle>
                <DialogContent>
                    <Typography variant="h6">{event.title}</Typography>
                    <Typography>Date: {new Date(event.date).toLocaleDateString()}</Typography>
                    <Typography>Start Time: {event.timeStart}</Typography>
                    <Typography>End Time: {event.timeEnd}</Typography>
                    <Typography>Venue: {event.venue}</Typography>
                    <Typography>Price: {event.price}</Typography>
                    <Typography>Max Participants: {event.participants}</Typography>
                    <Typography>Registered Participants: {event.registered}</Typography>
                    <Typography>Category: {event.category}</Typography>
                    <Typography>Type: {event.type}</Typography>
                    <Typography>Register End Date: {new Date(event.registerEndDate).toLocaleDateString()}</Typography>
                    <Typography>Details: {event.details}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleViewParticipants} color="primary">
                        View Participants
                    </Button>
                    <Button onClick={onClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openParticipantsDialog} onClose={handleCloseParticipantsDialog}>
                <DialogTitle>Registered Participants</DialogTitle>
                <DialogContent>
                    {participants.length > 0 ? (
                        <TableContainer component={Paper}>
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
                        </TableContainer>
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
        </>
    );
};

export default ViewEvent;
