import React, { useState } from 'react';
import { Box, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import http from '../http';

const AddEvent = ({ onClose }) => {
    const [title, setTitle] = useState('');
    const [details, setDetails] = useState('');
    const [date, setDate] = useState(null);
    const [timeStart, setTimeStart] = useState(null);
    const [timeEnd, setTimeEnd] = useState(null);
    const [venue, setVenue] = useState('');
    const [price, setPrice] = useState(0);
    const [participants, setParticipants] = useState(1);
    const [category, setCategory] = useState('');
    const [type, setType] = useState('');
    const [registerEndDate, setRegisterEndDate] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('details', details);
        formData.append('date', date ? date.format('YYYY-MM-DD') : null);
        formData.append('timeStart', timeStart ? timeStart.format('HH:mm:ss') : null);
        formData.append('timeEnd', timeEnd ? timeEnd.format('HH:mm:ss') : null);
        formData.append('venue', venue);
        formData.append('price', price);
        formData.append('participants', participants);
        formData.append('category', category);
        formData.append('type', type);
        formData.append('registerEndDate', registerEndDate ? registerEndDate.format('YYYY-MM-DD') : null);
        if (imageFile) {
            formData.append('file', imageFile);
        }

        try {
            const response = await http.post('/events', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Event added:', response.data);
            onClose();
        } catch (error) {
            if (error.response) {
                console.error('Failed to add event:', error.response.data);
            } else {
                console.error('Failed to add event:', error.message);
            }
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ width: 400 }}>
                <Box mb={2}>
                    <TextField
                        label="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Details"
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        fullWidth
                        margin="normal"
                        multiline
                        rows={2}
                    />
                    <DatePicker
                        label="Date"
                        value={date}
                        onChange={(newValue) => setDate(newValue)}
                        renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                    />
                    <TimePicker
                        label="Start Time"
                        value={timeStart}
                        onChange={(newValue) => setTimeStart(newValue)}
                        renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                    />
                    <TimePicker
                        label="End Time"
                        value={timeEnd}
                        onChange={(newValue) => setTimeEnd(newValue)}
                        renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                    />
                    <TextField
                        label="Venue"
                        value={venue}
                        onChange={(e) => setVenue(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Price"
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(Math.max(0, Number(e.target.value)))}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Participants"
                        type="number"
                        value={participants}
                        onChange={(e) => setParticipants(Math.max(1, Number(e.target.value)))}
                        fullWidth
                        margin="normal"
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Category</InputLabel>
                        <Select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <MenuItem value="Education">Education</MenuItem>
                            <MenuItem value="Community">Community</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Type</InputLabel>
                        <Select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                        >
                            <MenuItem value="Workshop">Workshop</MenuItem>
                            <MenuItem value="Film Screening">Film Screening</MenuItem>
                            <MenuItem value="Clean-up">Clean-up</MenuItem>
                            <MenuItem value="Planting">Planting</MenuItem>
                            <MenuItem value="Seminar">Seminar</MenuItem>
                            <MenuItem value="Fair">Fair</MenuItem>
                            <MenuItem value="Repair">Repair</MenuItem>
                            <MenuItem value="Swap meet">Swap meet</MenuItem>
                            <MenuItem value="Others">Others</MenuItem>
                        </Select>
                    </FormControl>
                    <DatePicker
                        label="Register End Date"
                        value={registerEndDate}
                        onChange={(newValue) => setRegisterEndDate(newValue)}
                        renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImageFile(e.target.files[0])}
                        style={{ marginTop: '10px' }}
                    />
                </Box>
                <Box display="flex" justifyContent="flex-end">
                    <Button onClick={onClose} color="primary" variant="outlined" sx={{ mr: 1 }}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary" variant="contained">
                        Add Event
                    </Button>
                </Box>
            </Box>
        </LocalizationProvider>
    );
};

export default AddEvent;
