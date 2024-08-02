import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid, List, ListItem, ListItemText, ListItemAvatar, Avatar, IconButton } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ReviewPage() {
    const [reviews, setReviews] = useState([]);
    
    const formik = useFormik({

        initialValues: {
            rating: "",
            comment: "",
        },

        validationSchema: yup.object({
            rating: yup.number()
                .min(1, 'Rating must be a minimum of 1')
                .max(5, 'Rating must be a maximum of 5')
                .required('Rating is required'),
            comment: yup.string().trim()
                .min(3, 'Comment must be at least 3 characters')
                .max(500, 'Comment must be at most 500 characters')
                .required('Comment is required'),
        }),

        onSubmit: async (data) => {
            const res = await http.post("/reviews", data);
            console.log(res.data);
            toast.success('Review added successfully!');
        }

    });

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const response = await http.get('/reviews');
            setReviews(response.data);
        } catch (error) {
            console.error('Failed to fetch reviews:', error);
        }
    };



    return (
        <>

        


            <Box sx={{mt: 5, mx: 5}}>

            <Box component="form" onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6} lg={8}>
                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            label="Rating"
                            name="rating"
                            type="number"
                            value={formik.values.rating}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.rating && Boolean(formik.errors.rating)}
                            helperText={formik.touched.rating && formik.errors.rating}
                        />
                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            multiline minRows={2}
                            label="Comment"
                            name="comment"
                            value={formik.values.comment}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.comment && Boolean(formik.errors.comment)}
                            helperText={formik.touched.comment && formik.errors.comment}
                        />
                    </Grid>
                </Grid>
                <Box sx={{ mt: 2 }}>
                    <Button variant="contained" type="submit">
                        Add
                    </Button>
                </Box>
            </Box>
                <Typography variant="h5" sx={{ my: 4 }}>
                    Reviews
                </Typography>
                <List sx={{ mt: 4 }}>
                    {reviews.map((review, index) => (
                        <ListItem key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                            <ListItemText
                                primary={review.rating}
                                secondary={
                                <>
                                    <Typography component="span" variant="body2" color="textPrimary">
                                        {review.comment}
                                    </Typography>
                                </>
                                }
                                sx={{ ml: 2 }}
                            />
                            {/* <IconButton onClick={() => navigate("/reviews")}>
                                <StarIcon/>
                            </IconButton>
                            <IconButton onClick={() => handleEdit(product)}>
                                <EditIcon />
                            </IconButton>
                            <IconButton onClick={() => handleDelete(product.id)}>
                                <DeleteIcon />
                            </IconButton> */}
                        </ListItem>
                    ))}
                </List>
            </Box>
        </>
    );
}

export default ReviewPage;