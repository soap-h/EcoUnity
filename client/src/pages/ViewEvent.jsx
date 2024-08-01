import React from 'react';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

const ViewEvent = ({ event, onClose }) => (
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
            <Button onClick={onClose} color="primary">
                Close
            </Button>
        </DialogActions>
    </Dialog>
);

export default ViewEvent;
