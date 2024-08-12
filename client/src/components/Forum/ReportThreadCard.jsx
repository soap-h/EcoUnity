import React from 'react';
import { Card, CardContent, CardHeader, Avatar, Typography, IconButton, Divider, Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import dayjs from 'dayjs';
import './ReportThreadCard.css'; // Import the external CSS

const ReportThreadCard = ({ thread, onClose }) => {
    if (!thread) {
        return null;
    }

    return (
        <Card className="card-container">
            <CardHeader
                avatar={
                    <Avatar 
                        alt={thread.user?.firstName} 
                        src={thread.user?.imageFile ? `${import.meta.env.VITE_FILE_PROFILE_URL}${thread.user.imageFile}` : ''} 
                    />
                }
                title={<Typography className="card-title">{thread.title}</Typography>}
                subheader={<Typography className="card-subheader">{dayjs(thread.createdAt).fromNow()}</Typography>}
                className="card-header"
            />
            <Divider />
            <CardContent className="card-content">
                <Typography variant="h6" component="h2" className="card-details" gutterBottom>
                    Details
                </Typography>
                <Typography variant="body1" paragraph>
                    <span className="card-detail-label">Category:</span> {thread.category}
                </Typography>
                <Typography variant="body1" paragraph>
                    <span className="card-detail-label">Description:</span> {thread.description}
                </Typography>
                {thread.imageFile && (
                    <Box mt={2}>
                        <img
                            src={`${import.meta.env.VITE_FILE_THREAD_URL}${thread.imageFile}`}
                            alt="Thread"
                            className="card-image"
                        />
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default ReportThreadCard;
