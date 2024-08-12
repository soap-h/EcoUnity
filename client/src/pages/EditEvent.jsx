import React, { useState } from 'react';
import { Box, TextField, Button, FormControl, InputLabel, Select, MenuItem, List, ListItem } from '@mui/material';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import dayjs from 'dayjs';
import http from '../http';

const EditEvent = ({ event, onClose }) => {
    const [title, setTitle] = useState(event.title);
    const [details, setDetails] = useState(event.details);
    const [date, setDate] = useState(dayjs(event.date));
    const [timeStart, setTimeStart] = useState(dayjs(event.timeStart, 'HH:mm:ss'));
    const [timeEnd, setTimeEnd] = useState(dayjs(event.timeEnd, 'HH:mm:ss'));
    const [venue, setVenue] = useState(event.venue);  // Venue state
    const [price, setPrice] = useState(event.price);
    const [participants, setParticipants] = useState(event.participants);
    const [category, setCategory] = useState(event.category);
    const [type, setType] = useState(event.type);
    const [registerEndDate, setRegisterEndDate] = useState(dayjs(event.registerEndDate));
    const [imageFile, setImageFile] = useState(null);
    const [existingImage, setExistingImage] = useState(event.imageFile);
    const [location, setLocation] = useState({ lat: event.latitude, lng: event.longitude }); // Use event's location

    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete({
        requestOptions: {
            location: { lat: () => 1.3521, lng: () => 103.8198 },
            radius: 200 * 1000,
        },
        defaultValue: venue,
    });

    const handleSelect = async (address) => {
        setValue(address, false);
        clearSuggestions();

        try {
            const results = await getGeocode({ address });
            const { lat, lng } = await getLatLng(results[0]);
            setVenue(address);  // Set the venue state
            setLocation({ lat, lng });
        } catch (error) {
            console.error('Error: ', error);
        }
    };

    const handleSubmit = async () => {
        // Ensure venue is a string and has a valid value
        let venueText = venue || '';
    
        if (typeof venueText !== 'string' || venueText.trim().length < 3) {
            // Fetch address from latitude and longitude if venue is not properly set
            const geocoder = new google.maps.Geocoder();
            const latLng = new google.maps.LatLng(location.lat, location.lng);
            const response = await new Promise((resolve, reject) => {
                geocoder.geocode({ location: latLng }, (results, status) => {
                    if (status === "OK" && results[0]) {
                        resolve(results[0].formatted_address);
                    } else {
                        reject('Failed to fetch address');
                    }
                });
            });
            venueText = response;
        }
    
        const formData = new FormData();
        formData.append('title', title);
        formData.append('details', details);
        formData.append('date', date ? date.format('YYYY-MM-DD') : null);
        formData.append('timeStart', timeStart ? timeStart.format('HH:mm:ss') : null);
        formData.append('timeEnd', timeEnd ? timeEnd.format('HH:mm:ss') : null);
        formData.append('venue', venueText);  // Use the processed venue text
        formData.append('latitude', location.lat);
        formData.append('longitude', location.lng);
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
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        fullWidth
                        margin="normal"
                        placeholder="Enter the venue"
                    />
                    {status === 'OK' && (
                        <List sx={{ maxHeight: 200, overflow: 'auto', marginTop: '10px' }}>
                            {data.map(({ place_id, description }) => (
                                <ListItem key={place_id} button onClick={() => handleSelect(description)}>
                                    {description}
                                </ListItem>
                            ))}
                        </List>
                    )}
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
                    <Button onClick={handleSubmit} color="primary" variant="contained">
                        Save Changes
                    </Button>
                </Box>
            </Box>
        </LocalizationProvider>
    );
};

export default EditEvent;
