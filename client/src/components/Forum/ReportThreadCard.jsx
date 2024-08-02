import React from 'react';
import { Box, Typography, Paper, Divider, Grid, IconButton } from '@mui/material';
import dayjs from 'dayjs';
import { useTheme } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ReportThreadCard = ({ thread, onClose }) => {
    const theme = useTheme();

    if (!thread) {
        return null;
    }

    return (
        <Paper sx={{ padding: 3, maxWidth: 800, margin: 'auto' }}>
            <Box display="flex" alignItems="center" mb={2}>
                <IconButton onClick={onClose} sx={{ mr: 2 }}>
                    <ArrowBackIcon/>
                </IconButton>
                <Typography variant="h5" component="h2">
                    {thread.title}
                </Typography>
            </Box>
            <Divider />
            <Box mt={2}>
                <Typography variant="h6" component="h3" gutterBottom>
                    Details
                </Typography>
                <Typography variant="body1" paragraph>
                    <strong>Category:</strong> {thread.category}
                </Typography>
                <Typography variant="body1" paragraph>
                    <strong>Description:</strong> {thread.description}
                </Typography>
                <Typography variant="body1" paragraph>
                    <strong>Upvotes:</strong> {thread.upvote}
                </Typography>
                <Typography variant="body1" paragraph>
                    <strong>Downvotes:</strong> {thread.downvote}
                </Typography>
                <Typography variant="body1" paragraph>
                    <strong>Created At:</strong> {dayjs(thread.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                </Typography>
                <Typography variant="body1" paragraph>
                    <strong>Updated At:</strong> {dayjs(thread.updatedAt).format('YYYY-MM-DD HH:mm:ss')}
                </Typography>
                {thread.imageFile && (
                    <Box mt={2}>
                        <img
                            src={`${import.meta.env.VITE_FILE_THREAD_URL}${thread.imageFile}`}
                            alt="Thread"
                            style={{ width: '100%', maxHeight: 400, objectFit: 'contain' }}
                        />
                    </Box>
                )}
            </Box>
        </Paper>
    );
};

export default ReportThreadCard;
