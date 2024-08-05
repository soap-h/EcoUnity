import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Container, InputLabel, MenuItem, FormControl, Select, Grid } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../../http';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AddThread.css'; // Import your updated CSS file

function AddThread() {
    const navigate = useNavigate();

    // For File Upload
    const [imageFile, setImageFile] = useState(null);

    // For the File Upload
    const onFileChange = (e) => {
        let file = e.target.files[0];
        if (file) {
            if (file.size > 1024 * 1024) {
                toast.error('Maximum file size is 1MB');
                return;
            }
            let formData = new FormData();
            formData.append('file', file);
            http.post('/file/upload/threadPictures', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then((res) => {
                setImageFile(res.data.filename);
                console.log(res.data);
            })
            .catch(function (error) {
                console.log(error.response);
            });
        }
    };

    const formik = useFormik({
        initialValues: {
            title: "",
            category: "",
            description: ""
        },

        validationSchema: yup.object({
            title: yup.string().min(3, 'Title must be at least 3 characters.')
                .max(500, 'Title must be at most 500 characters.')
                .required('Title is required.'),
            category: yup.string().required('Category is required.'),
            description: yup.string().min(3, 'Description must be at least 3 characters.')
                .max(2000, 'Description must be at most 2000 characters.')
                .required('Description is required.')
        }),

        onSubmit: (data) => {
            if (imageFile) {
                data.imageFile = imageFile;
            }
            data.title = data.title.trim();
            data.category = data.category.trim();
            data.description = data.description.trim();

            http.post("/thread", data).then((res) => {
                console.log(res.data);
                navigate('/forum');
            });
        }
    });

    return (
        <Container className="container" sx={{mt:4}}>
            <Typography variant="h5" className="header">Add Thread</Typography>

            <Box component="form" onSubmit={formik.handleSubmit} className="form-container">
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6} lg={8}>
                        <TextField fullWidth margin="dense"
                            autoComplete='off'
                            label="Title"
                            name='title'
                            value={formik.values.title}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.title && Boolean(formik.errors.title)}
                            helperText={formik.touched.title && formik.errors.title}
                            className="text-field" />

                        <FormControl className="form-control">
                            <InputLabel id='chooseCategory'>Category</InputLabel>
                            <Select
                                labelId='chooseCategory'
                                id='myCategory'
                                onChange={formik.handleChange}
                                autoWidth
                                name="category"
                                label="Category"
                                value={formik.values.category}
                                onBlur={formik.handleBlur}
                                error={formik.touched.category && Boolean(formik.errors.category)}
                                helperText={formik.touched.category && formik.errors.category}
                                className="category-select">
                                <MenuItem value="">None</MenuItem>
                                <MenuItem value="Biodiversity">Biodiversity</MenuItem>
                                <MenuItem value="Energy">Energy</MenuItem>
                                <MenuItem value="Conservation">Conservation</MenuItem>
                                <MenuItem value="Agriculture">Agriculture</MenuItem>
                                <MenuItem value="Recycling">Recycling</MenuItem>
                                <MenuItem value="Climate Change">Climate Change</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField fullWidth margin="dense"
                            autoComplete='off'
                            label="Description"
                            name="description"
                            multiline minRows={2}
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.description && Boolean(formik.errors.description)}
                            helperText={formik.touched.description && formik.errors.description}
                            className="text-field" />
                    </Grid>

                    <Grid item xs={12} md={6} lg={4}>
                        <Box className="upload-button">
                            <Button variant="contained" component="label">
                                Upload Image
                                <input hidden accept="image/*" multiple type='file' onChange={onFileChange} />
                            </Button>
                        </Box>
                        {
                            imageFile && (
                                <Box className="image-preview">
                                    <img alt="thread" 
                                         src={`${import.meta.env.VITE_FILE_THREAD_URL}${imageFile}`} />
                                </Box>
                            )
                        }
                    </Grid>
                </Grid>

                <Box className="button-container">
                    <Button variant='contained' type='submit'>Create Thread</Button>
                </Box>
            </Box>
            <ToastContainer />
        </Container>
    )
}

export default AddThread;
