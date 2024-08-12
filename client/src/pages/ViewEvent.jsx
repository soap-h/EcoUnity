import React, { useState } from 'react';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import http from '../http';
import * as XLSX from 'xlsx';

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

    const handleDownloadParticipants = () => {
        if (participants.length === 0) return;

        const worksheet = XLSX.utils.json_to_sheet(participants.map(p => ({
            "User ID": p.id,
            "Name": p.name,
            "Email": p.email
        })));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Participants");
        XLSX.writeFile(workbook, `${event.title.replace(/\s+/g, '_')}_Participants.xlsx`);
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
                        <>
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
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleDownloadParticipants}
                                sx={{ marginTop: 2 }}
                            >
                                Download List as Excel
                            </Button>
                        </>
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
