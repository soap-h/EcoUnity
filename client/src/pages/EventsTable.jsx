import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AddEvent from './AddEvent';
import http from '../http';

function EventsTable() {
    const [events, setEvents] = useState([]);
    const [open, setOpen] = useState(false);

    const fetchEvents = async () => {
        try {
            const res = await http.get('/events');
            console.log('Fetched events: ', res.data);
            setEvents(Array.isArray(res.data) ? res.data : [res.data]);
            console.log(res.data.id, res.data.date)
        } catch (error) {
            console.error(`Error :`, error)
        }
        
    };


    useEffect(() => {
        fetchEvents();
    }, []);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        fetchEvents();
    };

    return (
        <Box sx={{ padding: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h4">Events</Typography>
                <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpen}>
                    Add Event
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Time Start</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {events.length > 0 ? (
                            events.map((event) => (
                                <TableRow key={event.id}>
                                    <TableCell>{event.id}</TableCell>
                                    <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                                    <TableCell>{event.title}</TableCell>
                                    <TableCell>{event.category}</TableCell>
                                    <TableCell>{event.type}</TableCell>
                                    <TableCell>{event.timeStart}</TableCell>
                                    
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5}>No events available</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <Typography variant="body2" color="textSecondary" align="right" mt={2}>
                {`Rows per page: ${events.length} 1-${events.length} of ${events.length}`}
            </Typography>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add Event</DialogTitle>
                <DialogContent>
                    <AddEvent onClose={handleClose} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default EventsTable;
