import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import http from '../http';
import { Box, Typography, TextField, Button } from '@mui/material';
import {
    Dialog, DialogTitle, DialogContent, DialogContentText,
    DialogActions
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function EditActivity() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [activity, setActivity] = useState({
        title: "",
        points: 0
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        http.get(`/activities/${id}`).then((res) => {
            setActivity(res.data);
            setLoading(false);
        });
    }, []);

    const formik = useFormik({
        initialValues: activity || { title: "", points: 0 },
        enableReinitialize: true,
        validationSchema: yup.object({
            title: yup.string().trim()
                .min(3, 'Title must be at least 3 characters')
                .max(100, 'Title must be at most 100 characters')
                .required('Title is required'),
            points: yup.number()
                .integer('Points must be a number')
                .required('Points are required')
        }),
        onSubmit: (data) => {
            data.title = data.title.trim();
            data.points = data.points;
            http.put(`/activities/${id}`, data)
                .then((res) => {
                    console.log(res.data);
                    navigate("/activities");
                })
                .catch(function (err) {
                    toast.error(`${err.response.data.message}`);
                });
        }
    });
    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const deleteActivity = () => {
        http.delete(`/activities/${id}`)
            .then((res) => {
                console.log(res.data);
                navigate("/activities");
            });
    }
    return (
        <Box sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: '80vh'
        }}>
            <Typography variant="h5" sx={{ my: 2 }}>
                Edit Activity
            </Typography>
            {
                !loading && (
                    <Box component="form" onSubmit={formik.handleSubmit}>
                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            label="Title"
                            name="title"
                            value={formik.values.title}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.title && Boolean(formik.errors.title)}
                            helperText={formik.touched.title && formik.errors.title}
                        />
                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            multiline minRows={2}
                            label="Points"
                            name="points"
                            value={formik.values.points}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.points && Boolean(formik.errors.points)}
                            helperText={formik.touched.points && formik.errors.points}
                        />
                        <Box sx={{ mt: 2 }}>
                            <Button variant="contained" type="submit">
                                Update
                            </Button>
                            <Button variant="contained" sx={{ ml: 2 }} color="error"
                                onClick={handleOpen}>
                                Delete
                            </Button>
                        </Box>
                    </Box>
                )
            }
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    Delete Activity
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this activity?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="inherit"
                        onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="error"
                        onClick={deleteActivity}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            <ToastContainer />
        </Box>
    );
}

export default EditActivity