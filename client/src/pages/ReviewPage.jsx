import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid, List, ListItem, ListItemText, IconButton, Rating, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import UserContext from '../contexts/UserContext';

function ReviewPage() {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([]);
    const [open, setOpen] = useState(false);
    const [editingReviewId, setEditingReviewId] = useState(null);
    const [hasPurchased, setHasPurchased] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const { user } = useContext(UserContext);

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

        onSubmit: async (data, { resetForm }) => {
            try {
                if (editingReviewId) {
                    // Update existing review
                    const res = await http.put(`/reviews/${editingReviewId}`, data);
                    toast.success('Review updated successfully!');
                    handleClose();
                } else {
                        // Create new review
                        console.log(productId)
                        const res = await http.post(`/reviews`, { ...data, productId });
                        toast.success('Review added successfully!');
                        console.log(res.data.id)
                        setEditingReviewId(res.data.id);
                        setHasSubmitted(true);
                        handleClose();
                }
                fetchReviews(); // Refresh reviews after adding/updating
                resetForm(); // Clear form after submission
                handleClose();
            } catch (error) {
                console.error('Failed to submit review:', error);
                toast.error('Failed to submit review');
                handleClose();
            }
        }
    });

    useEffect(() => {
        fetchReviews();
        const checkPurchase = async () => {
            try {
                const response = await http.get('/purchase/check', {
                    params: {
                        userId: user.id,
                        productId: productId,
                    },
                });
                console.log(response.data);
                setHasPurchased(response.data.purchased);   
            } catch (error) {
                console.error('Error checking purchase:', error);
            }
        };

        const checkReviews = async () => {
            try {
                const response = await http.get(`/reviews/${productId}/check`, {
                    params: {
                        userId: user.id,  
                    },
                });
                console.log(response.data);
                setHasSubmitted(response.data.reviewed);
                setEditingReviewId(response.data.reviewId);
            } catch (error) {
                console.error('Error checking reviews: ', error);
            }
        }

        checkPurchase();
        checkReviews();

    }, [productId, user.id]);

    const fetchReviews = async () => {
        try {
            const response = await http.get(`/reviews/${productId}`);
            setReviews(response.data);
        } catch (error) {
            console.error('Failed to fetch reviews:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await http.delete(`/reviews/${id}`);
            toast.success('Review deleted successfully!');
            fetchReviews(); // Refresh reviews after deletion
    
            // Reset the form state after deletion
            setHasSubmitted(false);
            setEditingReviewId(null);
        } catch (error) {
            console.error('Failed to delete review:', error);
            toast.error('Failed to delete review');
        }
    };
    

    const handleEdit = (review) => {
        if (review) {
            // Populate form with review data for editing
            setOpen(true);
            formik.setValues({
                rating: review.rating,
                comment: review.comment
            });
            setEditingReviewId(review.id); // Set the review id that is being edited
        } else {
            console.error("Review not found");
        }
    };

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-GB', options); // 'en-GB' formats it as dd/MM/yyyy
    };

    const handleClickOpen = () => {
        setOpen(true);
    };
    
    const handleClose = () => {
        setOpen(false);
        formik.resetForm(); // Reset form to initial values
    };
    
    return (
        <>
            <Box sx={{ mt: 5, mx: 5 }}>
                {/* Button to open the modal */}
                {hasPurchased ? (
                    hasSubmitted ? (
                        <>
                            <Button variant="contained" onClick={() => {
                                const review = reviews.find((r) => r.id === editingReviewId);
                                if (review) {
                                    handleEdit(review);
                                } else {
                                    console.error("Review not found for editing");
                                }
                            }}>
                                Edit Review
                            </Button>
                            <IconButton onClick={() => handleDelete(editingReviewId)}>
                                <DeleteIcon />
                            </IconButton>
                        </>
                    ) : (
                        <Button variant="contained" onClick={handleClickOpen}>
                            Add Review
                        </Button>
                    )
                ) : (
                    <Typography>You must purchase this product before submitting a review.</Typography>
                )}

                {/* Dialog for the form */}
                <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                    <DialogTitle>{editingReviewId ? 'Update Review' : 'Add Review'}</DialogTitle>
                    <DialogContent>
                        <Box component="form" onSubmit={formik.handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Rating
                                        name="rating"
                                        value={Number(formik.values.rating)}
                                        onChange={(event, value) => {
                                            formik.setFieldValue('rating', value);
                                        }}
                                        onBlur={formik.handleBlur}
                                        precision={1}
                                        error={formik.touched.rating && Boolean(formik.errors.rating)}
                                    />
                                    {formik.touched.rating && formik.errors.rating && (
                                        <Typography variant="body2" color="error">
                                            {formik.errors.rating}
                                        </Typography>
                                    )}
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
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button variant="contained" type="submit" onClick={formik.handleSubmit}>
                            {editingReviewId ? 'Update Review' : 'Add Review'}
                        </Button>
                    </DialogActions>
                </Dialog>
    
                <Typography variant="h5" sx={{ my: 4 }}>
                    Reviews
                </Typography>
                <List sx={{ mt: 4 }}>
                    {reviews.map((review, index) => (
                        <ListItem key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box component="img"
                                src={`${import.meta.env.VITE_FILE_PROFILE_URL}/${review.user.imageFile}`} 
                                sx={{ width: 100, height: 100, mr: 2 }} // Adjust size as needed
                            />
                    
                            <ListItemText
                                primary={ <Rating value={review.rating} readOnly precision={0.5} /> }
                                secondary={
                                    <>
                                        <Typography component="span" variant="body2" color="textPrimary">
                                            {review.user.firstName} {review.user.lastName} on {formatDate(review.createdAt)} says {review.comment}
                                        </Typography>
                                    </>
                                }
                                sx={{ ml: 2 }}
                            />
                            {/* Uncomment if you want to add edit/delete functionality */}
                            {/* <IconButton onClick={() => handleEdit(review)}>
                                <EditIcon />
                            </IconButton> */}
                        </ListItem>
                    ))}
                </List>
            </Box>
        </>
    );
}

export default ReviewPage;
