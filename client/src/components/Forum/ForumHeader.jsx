import React from 'react';
import { Paper, Typography, Button } from '@mui/material';
import {
    Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon, Comment as CommentIcon, BookmarkBorder as BookmarkBorderIcon,
    Bookmark as BookmarkIcon, ExpandMore as ExpandMoreIcon, Mood as MoodIcon, MoodBad as MoodBadIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

function ForumHeader() {
    return (
        <Paper elevation={3} sx={{ p: 4, mb: 4, backgroundColor: '#ffffff', borderRadius: 2 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#1976d2' }}>
                Welcome to the Forum
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Join the discussion and share your thoughts on various topics. Engage with others, post new threads, and contribute to ongoing conversations. Your opinions matter!
            </Typography>
            <Link to="/addthread">
                <Button variant='contained' startIcon={<AddIcon />} sx={{ bgcolor: '#1976d2', '&:hover': { bgcolor: '#1565c0' } }}>
                    Add a New Thread
                </Button>
            </Link>
        </Paper>
    )
}

export default ForumHeader