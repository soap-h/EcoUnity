import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid, List, ListItem, ListItemText, ListItemAvatar, Avatar, IconButton } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ReviewPage() {
    // const [reviews, setReviews] = useState([]);
    
    // const formik = useFormik({
    //     initialValues: {

    //     }
    // })


    // return (
        // <>
        //     <Box>
        //         <Typography variant="h5" sx={{ my: 4 }}>
        //             Product List
        //         </Typography>
        //         <List sx={{ mt: 4 }}>
        //             {reviews.map((review, index) => (
        //                 <ListItem key={index} sx={{ display: 'flex', alignItems: 'center' }}>
        //                     <ListItemAvatar>
        //                         <Avatar
        //                             variant="square"
        //                             src={`${import.meta.env.VITE_FILE_BASE_URL}/${product.prod_img}`}
        //                             alt={product.prod_name}
        //                             sx={{ width: '100px', height: '100px', aspectRatio: '1/1', objectFit: 'cover' }}
        //                         />
        //                     </ListItemAvatar>
        //                     <ListItemText
        //                         primary={product.prod_name}
        //                         secondary={
        //                         <>
        //                             <Typography component="span" variant="body2" color="textPrimary">
        //                                 {product.prod_desc}
        //                             </Typography>
        //                             <br />
        //                             <Typography component="span" variant="body2" color="textPrimary">
        //                                 Price: {product.prod_price} Points
        //                             </Typography>
        //                             <br />
        //                             <Typography component="span" variant="body2" color="textPrimary">
        //                                 Created At: {new Date(product.createdAt).toLocaleDateString()}
        //                             </Typography>
        //                         </>
        //                         }
        //                         sx={{ ml: 2 }}
        //                     />
        //                     <IconButton onClick={() => navigate("/reviews")}>
        //                         <StarIcon/>
        //                     </IconButton>
        //                     <IconButton onClick={() => handleEdit(product)}>
        //                         <EditIcon />
        //                     </IconButton>
        //                     <IconButton onClick={() => handleDelete(product.id)}>
        //                         <DeleteIcon />
        //                     </IconButton>
        //                 </ListItem>
        //             ))}
        //         </List>
        //     </Box>
        // </>
    // );
}

export default ReviewPage;