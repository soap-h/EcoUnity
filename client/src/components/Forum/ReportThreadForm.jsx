import React, { useState, useContext } from 'react';
import { Box, Typography, TextField, Button, RadioGroup, FormControlLabel, Radio, FormControl, FormLabel } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserContext from '../../contexts/UserContext';

const ReportThreadForm = ({ threadId, onClose }) => {
    const [problemType, setProblemType] = useState('');
    const [customProblem, setCustomProblem] = useState('');

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
                toast.error('You need to be logged in to report!');
                return;
            }

            const data = {
                threadId,
                reporterId: user.id,
                problem: problemType === 'Other' ? customProblem : problemType
            };

            http.post('/reportthread', data)
                .then(() => {
                    toast.success('Report submitted successfully!');
                    onClose();
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
            setCustomProblem('');
        }
    };

    const handleCustomProblemChange = (event) => {
        setCustomProblem(event.target.value);
        formik.setFieldValue('problem', event.target.value);
    };

    return (
        <Box sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1300,
            overflow: 'hidden'
        }}>
            {/* Blurred Background */}
            <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backdropFilter: 'blur(10px)',
                zIndex: -1
            }} />

            {/* Form Container */}
            <Box sx={{
                backgroundColor: 'white',
                padding: 4,
                borderRadius: 2,
                boxShadow: 5,
                width: '90%',
                maxWidth: 600,
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: 2
            }}>
                <Typography variant="h6" gutterBottom>
                    Report This Thread
                </Typography>
                <Box component="form" onSubmit={formik.handleSubmit} sx={{ width: '100%' }}>
                    <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
                        <FormLabel component="legend" sx={{ mb: 1 }}>Select Problem</FormLabel>
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
                                sx={{ mt: 2 }}
                            />
                        )}
                    </FormControl>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                        <Button variant="contained" type="submit">Submit</Button>
                        <Button variant="outlined" onClick={onClose}>Cancel</Button>
                    </Box>
                </Box>
            </Box>
            <ToastContainer />
        </Box>
    );
};

export default ReportThreadForm;
