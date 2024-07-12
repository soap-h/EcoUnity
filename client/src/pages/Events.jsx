import React, { useState, useEffect } from 'react';
import { Box, Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import AddEvent from './AddEvent';
import EventsTable from './EventsTable';
import http from '../http';

function Events() {
    return (
        <div>
            <EventsTable />
        </div>
    );
}

export default Events

// const Events = () => {
//     const [events, setEvents] = useState([]);
//     const [open, setOpen] = useState(false);



//     const fetchEvents = async () => {
//         try {
//             const response = await http.get('/events');
//             console.log('Fetched events:', response.data); // Check this in the browser console
//             setEvents(Array.isArray(response.data) ? response.data : []);
//         } catch (error) {
//             console.error('Failed to fetch events:', error);
//         }
//     };

//     useEffect(() => {
//         fetchEvents();
//     }, []);
    
//     const handleDelete = async (id) => {
//         try {
//             await http.delete(`/events/${id}`);
//             fetchEvents();
//         } catch (error) {
//             console.error('Failed to delete event:', error);
//         }
//     };

//     const handleOpen = () => {
//         setOpen(true);
//     };

//     const handleClose = () => {
//         setOpen(false);
//         fetchEvents();
//     };

//     return (
//         <Box sx={{ padding: 4 }}>
//             <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
//                 <Typography variant="h4">Events</Typography>
//                 <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpen}>
//                     Add Event
//                 </Button>
//             </Box>

//             <TableContainer component={Paper}>
//                 <Table>
//                     <TableHead>
//                         <TableRow>
//                             <TableCell>ID</TableCell>
//                             <TableCell>Date</TableCell>
//                             <TableCell>Title</TableCell>
//                             <TableCell>Category</TableCell>
//                             <TableCell>Type</TableCell>
//                             {/* <TableCell>Participants</TableCell> */}
//                             {/* <TableCell>Actions</TableCell> */}
//                         </TableRow>
//                     </TableHead>
//                     <TableBody>
//                         {events.length > 0 ? (
//                             events.map((event) => (
//                                 <TableRow key={event.id}> // Changed from event._id to event.id
//                                     <TableCell>{event.id}</TableCell> // Changed from event._id to event.id
//                                     <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
//                                     <TableCell>{event.title}</TableCell>
//                                     <TableCell>{event.category}</TableCell>
//                                     <TableCell>{event.type}</TableCell>
//                                     {/* <TableCell>{event.participants}</TableCell> */}
//                                     {/* <TableCell>
//                                         <Button variant="contained" color="primary">View</Button>
//                                         <IconButton color="secondary" onClick={() => handleDelete(event.id)}> // Changed from event._id to event.id
//                                             <DeleteIcon />
//                                         </IconButton>
//                                     </TableCell> */}
//                                 </TableRow>
//                             ))
//                         ) : (
//                             <TableRow>
//                                 <TableCell colSpan={7}>No events available</TableCell>
//                             </TableRow>
//                         )}
//                     </TableBody>
//                 </Table>
//             </TableContainer>
//             <Typography variant="body2" color="textSecondary" align="right" mt={2}>
//                 {`Rows per page: ${events.length} 1-${events.length} of ${events.length}`}
//             </Typography>
//             <Dialog open={open} onClose={handleClose}>
//                 <DialogTitle>Add Event</DialogTitle>
//                 <DialogContent>
//                     <AddEvent onClose={handleClose} />
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={handleClose} color="primary">
//                         Close
//                     </Button>
//                 </DialogActions>
//             </Dialog>
//         </Box>
//     );
// };

// export default Events;
