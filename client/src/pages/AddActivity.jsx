import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';

import http from '../http';
import { useNavigate } from 'react-router-dom';


function AddActivity() {
    const [activities, setActivities] = useState([]);
    const [selectedActivity, setSelectedActivity] = useState('');
    const [activityPoints, setActivityPoints] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        http.get('/activities').then((res) => {
            setActivities(res.data);
        });
    }, []);
    
    function getMaxDate() {
        return new Date()
    }

    function getMinDate() {
        return new Date(6, 28, 2023)
    }

    const formik = useFormik({
        initialValues: {
            activity: '',
            points: '',
            date: '',
        },
        validationSchema: yup.object({
            activity: yup.string().required('Activity is required'),
            date: yup.date().required('Date is required').max(getMaxDate(), "Date cannot be greater than Today")
            .min(getMinDate(), "Date cannot be greater than a year")
        }),
        onSubmit: (data) => {
            const selected = activities.find(act => act.id === data.activity);
            const trackerData = {
                title: selected.title,
                points: selected.points,
                date: data.date
            };
            http.post("/tracker", trackerData)
                .then((res) => {
                    console.log(res.data);
                    navigate("/tracker");
                });
        }
    });

    const handleActivityChange = (event) => {
        const selected = activities.find(act => act.id === event.target.value);
        setSelectedActivity(event.target.value);
        setActivityPoints(selected.points);
    };

    return (
        <Box sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: '80vh',
        }}>
            <Typography variant="h5" sx={{ my: 2 }}>
                Add Activity to Tracker
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit} sx={{}}>
                <FormControl fullWidth margin="dense">
                    <InputLabel>Activity</InputLabel>
                    <Select
                        label="Activity"
                        name="activity"
                        value={formik.values.activity}
                        onChange={(e) => {
                            formik.handleChange(e);
                            handleActivityChange(e);
                        }}
                        onBlur={formik.handleBlur}
                        error={formik.touched.activity && Boolean(formik.errors.activity)}
                    >
                        {activities.map((activity) => (
                            <MenuItem key={activity.id} value={activity.id}>
                                {activity.title}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    fullWidth margin="dense" autoComplete="off"
                    label="Points"
                    name="points"
                    value={activityPoints}
                    InputProps={{
                        readOnly: true,
                    }}
                />
                <TextField
                    fullWidth margin="dense" autoComplete="off"
                    label="Date"
                    name="date"
                    type="date"
                    value={formik.values.date}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.date && Boolean(formik.errors.date)}
                    helperText={formik.touched.date && formik.errors.date}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <Box sx={{ mt: 2 }}>
                    <Button variant="contained" type="submit">
                        Add to Tracker
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}

export default AddActivity;
