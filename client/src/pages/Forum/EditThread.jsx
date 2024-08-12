import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import http from '../../http';
import { Box, Typography, TextField, Button, CircularProgress, Grid } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './EditThread.module.css';

function EditThread() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [thread, setThread] = useState({ title: "", description: "" });
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(true);

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
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            .then((res) => {
                setImageFile(res.data.filename);
            })
            .catch((error) => {
                console.log(error.response);
            });
        }
    };

    useEffect(() => {
        http.get(`/thread/id/${id}`).then((res) => {
            setThread(res.data);
            setImageFile(res.data.imageFile);
            setLoading(false);
        }).catch((err) => {
            console.error("Error fetching thread:", err);
            setLoading(false);
        });
    }, [id]);

    const formik = useFormik({
        initialValues: thread,
        enableReinitialize: true,
        validationSchema: yup.object({
            title: yup.string().trim()
                .min(3, 'Title needs to be at least 3 characters')
                .max(500, 'Title needs to be at most 500 characters')
                .required('Title is required'),
            description: yup.string().trim()
                .min(3, 'Description needs to be at least 3 characters')
                .max(2000, 'Description needs to be at most 2000 characters')
                .required('Description is required')
        }),
        onSubmit: (data) => {
            if (imageFile) {
                data.imageFile = imageFile;
            }
            data.title = data.title.trim();
            data.description = data.description.trim();

            http.put(`/thread/update/${id}`, data).then((res) => {
                navigate('/forum');
            });
        }
    });

    return (
        <Box className={styles.container} sx={{mt:2}}>
            <Typography variant="h5" className={styles.title} >Edit Thread</Typography>

            {loading ? (
                <Box className={styles.spinnerContainer}>
                    <CircularProgress />
                </Box>
            ) : (
                <Box component="form" onSubmit={formik.handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6} lg={8} sx={{mt:1}}>
                            <TextField
                                className={styles.textField}
                                fullWidth
                                margin="dense"
                                autoComplete='off'
                                label='Title'
                                name='title'
                                value={formik.values.title}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.title && Boolean(formik.errors.title)}
                                helperText={formik.touched.title && formik.errors.title}
                            />
                            <TextField
                                className={styles.textField}
                                fullWidth
                                margin="dense"
                                multiline
                                minRows={2}
                                label='Description'
                                name='description'
                                value={formik.values.description}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.description && Boolean(formik.errors.description)}
                                helperText={formik.touched.description && formik.errors.description}
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={4}>
                            <Box sx={{ textAlign: 'center', mt: 2 }}>
                                <Button className={styles.uploadButton} variant="contained" component="label">
                                    Upload Image
                                    <input hidden accept="image/*" multiple type='file' onChange={onFileChange} />
                                </Button>
                                {imageFile && (
                                    <Box className={styles.imagePreview}>
                                        <img alt="thread" src={`${import.meta.env.VITE_FILE_THREAD_URL}${imageFile}`} />
                                    </Box>
                                )}
                            </Box>
                        </Grid>
                    </Grid>
                    <Box sx={{ mt: 2 }}>
                        <Button className={styles.updateButton} variant="contained" type='submit'>Update</Button>
                    </Box>
                </Box>
            )}
            <ToastContainer />
        </Box>
    );
}

export default EditThread;
