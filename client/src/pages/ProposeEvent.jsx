import React, { useState, useContext } from 'react';
import { Box, Button, Typography, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import Dropzone from 'react-dropzone';
import bannerImage from '../assets/images/events-banner.png';
import http from '../http';
import UserContext from '../contexts/UserContext';  

const ProposeEvent = () => {
    const [file, setFile] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const handleFileUpload = (acceptedFiles) => {
        setFile(acceptedFiles[0]);
    };

    const handleSubmit = async () => {
        if (!user) {
            // If the user is not logged in, show the login prompt dialog
            setIsDialogOpen(true);
            return;
        }

        if (file) {
            const formData = new FormData();
            formData.append('file', file); // Ensure the field name matches the middleware

            try {
                const response = await http.post('/proposals', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                console.log('File uploaded successfully:', response.data);
                setFile(null); // Clear the file after upload
                setIsConfirmationOpen(true); // Open confirmation dialog
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        }
    };

    return (
        <Box>
            <Box
                sx={{
                    backgroundImage: `url(${bannerImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    padding: '50px 0',
                    textAlign: 'center',
                    color: '#fff',
                }}
            >
                <Typography variant="h2">Event Proposal</Typography>
            </Box>
            <Box sx={{ textAlign: 'center', padding: '20px' }}>
                <Typography variant="h5">Let’s bring sustainability into the community, together.</Typography>
                <Box
                    sx={{
                        margin: '20px 0',
                        padding: '10px',
                        backgroundColor: '#f5f5f5',
                        borderRadius: '8px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Typography variant="body1" sx={{ marginRight: '10px' }}>
                        Download and fill in this template document for submission.
                    </Typography>
                    <Button variant="contained" color="primary" href="/proposal_template.docx" download>
                        <Typography variant="body1">proposal_template.docx</Typography>
                    </Button>
                </Box>
            </Box>
            <Box sx={{ textAlign: 'center', padding: '20px' }}>
                <Typography variant="h6">Upload</Typography>
                <Dropzone onDrop={handleFileUpload} accept={{ 'application/pdf': ['.pdf'], 'application/msword': ['.doc', '.docx'] }}>
                    {({ getRootProps, getInputProps }) => (
                        <Box
                            {...getRootProps()}
                            sx={{
                                border: '2px dashed #3f51b5',
                                borderRadius: '8px',
                                padding: '20px',
                                cursor: 'pointer',
                                textAlign: 'center',
                                marginBottom: '20px',
                            }}
                        >
                            <input {...getInputProps()} />
                            <CloudUploadIcon sx={{ fontSize: '50px', color: '#3f51b5' }} />
                            <Typography variant="body1">
                                Drag & drop files or <Link component="span">Browse</Link>
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                                Supported formats: PDF, DOC, DOCX
                            </Typography>
                        </Box>
                    )}
                </Dropzone>
                {file && (
                    <Box sx={{ textAlign: 'center', marginBottom: '20px' }}>
                        <Typography variant="body1">Selected file: {file.name}</Typography>
                    </Box>
                )}
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                    SUBMIT FILE
                </Button>
            </Box>
            
             {/* Dialog for login prompt */}
            <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
                <DialogTitle>Login Required</DialogTitle>
                <DialogContent>
                    <Typography>You need to be logged in to submit a file. Please log in to continue.</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsDialogOpen(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            setIsDialogOpen(false);
                            navigate('/login');
                        }}
                        color="primary"
                    >
                        Login
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Confirmation Dialog for successful submission */}
            <Dialog open={isConfirmationOpen} onClose={() => setIsConfirmationOpen(false)}>
                <DialogTitle>Submission Successful</DialogTitle>
                <DialogContent>
                    <Typography>Your event proposal has been submitted successfully!</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsConfirmationOpen(false)} color="primary">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ProposeEvent;
