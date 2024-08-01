import React, { useState} from 'react';
import {useNavigate} from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import PageBanner from '../assets/FeedbackBanner.jpg';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';




function AddIncidentReport() {
    const navigate = useNavigate();
    const [imageFile, setImageFile] = useState(null);
    const [submissionStatus, setSubmissionStatus] = useState('');




    const formik = useFormik({
        initialValues: {
            ReportType: "",
            ReportDetails: "",
            Location: "",
        },
        validationSchema: yup.object({
            ReportType: yup.string().trim()
                .min(3, 'Report Type must be at least 3 characters').required('Report Type is required'),
            ReportDetails: yup.string().trim()
                .max(50, 'Report Details must be at most 50 characters').required('Report Details is required'),
            Location: yup.string().trim()
                .min(3, 'Location must be at least 3 characters')
                .max(100, 'Location must be at most 100 characters')
                .required('Location is required'),
        }),
        onSubmit: (data) => {
     

            if (imageFile) {
                data.imageFile = imageFile;
            }
            data.ReportType = data.ReportType.trim();
            data.ReportDetails = data.ReportDetails.trim();
            data.Location = data.Location.trim();
            http.post("/IncidentReporting", data)
                .then((res) => {
                    setSubmissionStatus('success');
                    toast.success('yes');
                    formik.resetForm();
                    setImageFile(null);
                })
                .catch((error) => {
                    setSubmissionStatus('error');
                    toast.error('errorr');
                    console.log(error);
                });
        }
    });


    const onFileChange = (e) => {
        let file = e.target.files[0];
        if (file) {
            if (file.size > 1024 * 1024) {
                toast.error('Maximum file size is 1MB');
                return;
            }

            let formData = new FormData();
            formData.append('file', file);
            http.post('/file/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then((res) => {
                    setImageFile(res.data.filename);
                })
                .catch(function (error) {
                    console.log(error.response);
                });
        }
    };

    return (

        <Box sx={{ bgcolor: '#075F6B', minHeight: '100vh', padding: 3 }}>
            <Grid container justifyContent='center'>
                <img
                    src={PageBanner}
                    alt="PageBanner"
                    style={{ width: 'auto', height: '500px', marginBottom: '0px' }}
                />
            </Grid>

            <Grid container>
                <Grid item xs={12} sx={{ bgcolor: '#9FCCC9', color: 'white', textAlign: 'center', py: 2 }}>
                    hello
                </Grid>
            </Grid>

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: 'calc(100vh - 100px)', // Adjust based on other content height
                    py: 3, // Optional padding
                }}
            >
                <Box
                    component="form"
                    onSubmit={formik.handleSubmit}
                    width={800}
                    sx={{
                        bgcolor: 'white',
                        p: 3,
                        borderRadius: 2,
                    }}
                >
                    <TextField
                        fullWidth
                        margin="dense"
                        autoComplete="off"
                        label="Report Type"
                        name="ReportType"
                        value={formik.values.ReportType}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.ReportType && Boolean(formik.errors.ReportType)}
                        helperText={formik.touched.ReportType && formik.errors.ReportType}
                        style={{ marginBottom: '10px' }}
                    />
                    <TextField
                        fullWidth
                        margin="dense"
                        autoComplete="off"
                        multiline
                        minRows={2}
                        label="Report Details"
                        name="ReportDetails"
                        value={formik.values.ReportDetails}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.ReportDetails && Boolean(formik.errors.ReportDetails)}
                        helperText={formik.touched.ReportDetails && formik.errors.ReportDetails}
                        style={{ marginBottom: '10px' }}
                    />
                    <TextField
                        fullWidth
                        margin="dense"
                        autoComplete="off"
                        multiline
                        minRows={2}
                        label="Location"
                        name="Location"
                        value={formik.values.Location}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.Location && Boolean(formik.errors.Location)}
                        helperText={formik.touched.Location && formik.errors.Location}
                        style={{ marginBottom: '10px' }}
                    />
                    <Box sx={{ textAlign: 'center', mt: 2 }} >
                        <Button variant="contained" component="label">
                            Upload Image
                            <input hidden accept="image/*" multiple type="file" onChange={onFileChange} />
                        </Button>
                    </Box>
                    {
                        imageFile && (
                            <Box className="aspect-ratio-container" sx={{ mt: 2 }}>
                                <img alt="some picture" 
                                    src={`${import.meta.env.VITE_FILE_BASE_URL}${imageFile}`}>
                                </img>
                            </Box>
                        )
                    }

                    <Box sx={{ mt: 2 }}>
                        <Button variant="contained" type="submit" sx={{ bgcolor: '#9FCCC9' }}>
                            Submit
                        </Button>
                    </Box>
                </Box>
            </Box>

            <ToastContainer />
        </Box>
    );
}

export default AddIncidentReport;

