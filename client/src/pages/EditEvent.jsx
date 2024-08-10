import React, { useState } from 'react';
import { Box, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import http from '../http';

const EditEvent = ({ event, onClose }) => {
    const [title, setTitle] = useState(event.title);
    const [details, setDetails] = useState(event.details);
    const [date, setDate] = useState(dayjs(event.date));
    const [timeStart, setTimeStart] = useState(dayjs(event.timeStart, 'HH:mm:ss'));
    const [timeEnd, setTimeEnd] = useState(dayjs(event.timeEnd, 'HH:mm:ss'));
    const [venue, setVenue] = useState(event.venue);
    const [price, setPrice] = useState(event.price);
    const [participants, setParticipants] = useState(event.participants);
    const [category, setCategory] = useState(event.category);
    const [type, setType] = useState(event.type);
    const [registerEndDate, setRegisterEndDate] = useState(dayjs(event.registerEndDate));
    const [imageFile, setImageFile] = useState(null);
    const [existingImage, setExistingImage] = useState(event.imageFile);

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
            await http.put(`/events/${event.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            onClose();
        } catch (error) {
            console.error('Failed to update event:', error.response ? error.response.data : error.message);
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
                    <Box mt={2}>
                        {existingImage && (
                            <img
                                src={`${import.meta.env.VITE_FILE_BASE_URL}/${event.imageFile}`} 
                                alt={`Event ${event.id}'s current image`}
                                style={{ height: '30%', width: '50%', borderRadius: '8px', marginBottom: '10px' }}
                            />
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImageFile(e.target.files[0])}
                        />
                    </Box>
                </Box>
                <Box display="flex" justifyContent="flex-end">
                    <Button onClick={onClose} color="primary" variant="outlined" sx={{ mr: 1 }}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary" variant="contained">
                        Save Changes
                    </Button>
                </Box>
            </Box>
        </LocalizationProvider>
    );
};

export default EditEvent;
