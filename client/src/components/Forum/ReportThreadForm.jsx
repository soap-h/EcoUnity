import React, { useState, useContext } from 'react';
import { Box, Typography, TextField, Button, Container, RadioGroup, FormControlLabel, Radio, FormControl, FormLabel } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import  UserContext  from '../../contexts/UserContext';


const ReportThreadForm = ({ threadId, onClose }) => {
    const [problemType, setProblemType] = useState('');
    const [customProblem, setCustomProblem] = useState('');

    // Use context to get the current user ID
    const { user } = useContext(UserContext);

    const formik = useFormik({
        initialValues: {
            problem: ''
        },
        validationSchema: yup.object({
            problem: yup.string().trim().min(3).max(500).required('Please select or specify a problem.')
        }),
        onSubmit: (values) => {
            if (!user || !user.id) {
                toast.error('User not logged in.');
                return;
            }

            const data = {
                threadId,
                reporterId: user.id,  // Include user ID
                problem: problemType === 'Other' ? customProblem : problemType
            };

            http.post('/reportthread', data)
                .then((response) => {
                    toast.success('Report submitted successfully!');
                    onClose();  // Close the form on successful submission
                })
                .catch((error) => {
                    toast.error('Failed to submit report.');
                    console.error('Error reporting thread:', error);
                });
        }
    });

    const handleRadioChange = (event) => {
        const { value } = event.target;
        setProblemType(value);
        if (value !== 'Other') {
            formik.setFieldValue('problem', value);
            setCustomProblem('');  // Clear custom problem if predefined option selected
        }
    };

    const handleCustomProblemChange = (event) => {
        setCustomProblem(event.target.value);
        formik.setFieldValue('problem', event.target.value);
    };

    return (
        <Container sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1300
        }}>
            <Box sx={{
                backgroundColor: 'white',
                padding: 3,
                borderRadius: 2,
                boxShadow: 3,
                width: '90%',
                maxWidth: 500
            }}>
                <Typography variant="h6" gutterBottom>
                    Report This Thread
                </Typography>
                <Box component="form" onSubmit={formik.handleSubmit}>
                    <FormControl component="fieldset" sx={{ mb: 2 }}>
                        <FormLabel component="legend">Select Problem</FormLabel>
                        <RadioGroup
                            aria-label="problem"
                            name="problem"
                            value={problemType}
                            onChange={handleRadioChange}
                        >
                            <FormControlLabel value="Vulgarities and Profanities" control={<Radio />} label="Vulgarities and Profanities" />
                            <FormControlLabel value="Spam" control={<Radio />} label="Spam" />
                            <FormControlLabel value="Trolling" control={<Radio />} label="Trolling" />
                            <FormControlLabel value="Harassment and Bullying" control={<Radio />} label="Harassment and Bullying" />
                            <FormControlLabel value="Misinformation" control={<Radio />} label="Misinformation" />
                            <FormControlLabel value="Duplicate Thread" control={<Radio />} label="Duplicate Thread" />
                            <FormControlLabel value="Other" control={<Radio />} label="Other" />
                        </RadioGroup>
                        {problemType === 'Other' && (
                            <TextField
                                fullWidth
                                margin="dense"
                                label="Specify Other Problem"
                                value={customProblem}
                                onChange={handleCustomProblemChange}
                                helperText={formik.errors.problem}
                                error={Boolean(formik.errors.problem)}
                            />
                        )}
                    </FormControl>
                    <Box sx={{ textAlign: 'right' }}>
                        <Button variant="contained" type="submit">Submit</Button>
                        <Button variant="outlined" onClick={onClose} sx={{ ml: 2 }}>Cancel</Button>
                    </Box>
                </Box>
            </Box>
            <ToastContainer />
        </Container>
    );
};

export default ReportThreadForm;
