import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Divider, ListItemAvatar, Avatar } from '@mui/material';
import { ArrowForwardIos, Description } from '@mui/icons-material';
import http from '../http';

function Learning() {
    const [lessons, setLessons] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLessons = async () => {
            try {
                const response = await http.get('/lesson');  // Adjust the endpoint to your API
                setLessons(response.data);
            } catch (error) {
                console.error('Failed to fetch lessons:', error);
            }
        };

        fetchLessons();
    }, []);

    const handleLessonClick = (lessonId) => {
        navigate(`/lesson/${lessonId}`);
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                Lessons
            </Typography>
            <List>
                {lessons.map((lesson) => (
                    <React.Fragment key={lesson.id}>
                        <ListItem 
                            button 
                            onClick={() => handleLessonClick(lesson.id)}
                            sx={{
                                borderRadius: 2,
                                marginBottom: 1,
                                boxShadow: 1,
                                '&:hover': {
                                    backgroundColor: 'primary.light',
                                },
                            }}
                        >
                            <ListItemAvatar>
                                <Avatar sx={{ bgcolor: 'primary.main' }}>
                                    <Description />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={lesson.title}
                                secondary={lesson.description}
                            />
                            <ListItemSecondaryAction>
                                <IconButton edge="end" onClick={() => handleLessonClick(lesson.id)}>
                                    <ArrowForwardIos />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                        <Divider variant="inset" component="li" />
                    </React.Fragment>
                ))}
            </List>
        </Box>
    );
}

export default Learning;
