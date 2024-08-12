import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Select, FormControl, InputLabel, Box } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import http from '../http';
import { useNavigate } from 'react-router-dom';

function AddActivity({ open, handleClose, activities, onActivityAdded }) {
    const [selectedActivity, setSelectedActivity] = useState('');
    const [activityPoints, setActivityPoints] = useState('');
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            activity: '',
            points: '',
            date: '',
        },
        validationSchema: yup.object({
            activity: yup.string().required('Activity is required'),
            date: yup.date().required('Date is required').max(new Date(), "Date cannot be in the future")
        }),
        onSubmit: (values) => {
            const selected = activities.find(act => act.id === values.activity);
            const trackerData = {
                title: selected.title,
                points: selected.points,
                date: values.date
            };
            http.post("/tracker", trackerData)
                .then(() => {
                    toast.success('Activity added successfully');
                    handleClose();
                    onActivityAdded(trackerData);
                    navigate("/tracker");
                }).catch(error => {
                    toast.error('Failed to add activity');
                    console.error('Error adding activity:', error);
                });
        }
    });

    const handleActivityChange = (event) => {
        const selected = activities.find(act => act.id === event.target.value);
        setSelectedActivity(event.target.value);
        setActivityPoints(selected.points);
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Add Activity to Tracker</DialogTitle>
            <DialogContent>
                <Box sx={{ minWidth: 300 }}>
                    <FormControl fullWidth margin="dense">
                        <InputLabel id="activity-label">Activity</InputLabel>
                        <Select
                            labelId="activity-label"
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
                        fullWidth
                        margin="dense"
                        label="Points"
                        name="points"
                        value={activityPoints}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                    <TextField
                        fullWidth
                        margin="dense"
                        label="Date"
                        type="date"
                        name="date"
                        value={formik.values.date}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.date && Boolean(formik.errors.date)}
                        helperText={formik.touched.date && formik.errors.date}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="inherit">Cancel</Button>
                <Button onClick={formik.handleSubmit} color="primary">Add</Button>
            </DialogActions>
        </Dialog>
    );
}

export default AddActivity;
