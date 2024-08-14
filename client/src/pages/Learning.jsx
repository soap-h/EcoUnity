import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Divider, ListItemAvatar, Avatar, Grid, Paper, TextField, FormControl, InputLabel, Checkbox, Select, MenuItem, ListItemIcon } from '@mui/material';
import { ArrowForwardIos, Description, Search } from '@mui/icons-material';
import http from '../http';
import UserContext from '../contexts/UserContext';

function Learning() {
    const [lessons, setLessons] = useState([]);
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const { user } = useContext(UserContext);

    const [searchQuery, setSearchQuery] = useState('');
    const [sortOption, setSortOption] = useState('likes');
    const [sortDirection, setSortDirection] = useState('asc');
    const [selectedTags, setSelectedTags] = useState([]);

    const [hiddenLeaderboard, setHiddenLeaderboard] = useState([]);
    const [quizzesTaken, setQuizzesTaken] = useState(0); // Number of quizzes taken by the user
    const [averagePoints, setAveragePoints] = useState(0); // Average points per quiz

    const tags = ['Biodiversity', 'Energy', 'Conservation', 'Agriculture', 'Recycling', 'Climate Change']; 

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await http.get('/user/userinfo');
            const sortedUsers = response.data.sort((a, b) => b.points - a.points); // Sort users by points
            setUsers(sortedUsers.slice(0, 5));
            setHiddenLeaderboard(sortedUsers);

            const userRank = sortedUsers.findIndex(user => user.id === user.id) + 1;
            user.rank = userRank;
            
            // const attemptsResponse = await http.get(`/attempts?userId=${currentUser.id}`);
            // const userAttempts = attemptsResponse.data.length;
            // setQuizzesTaken(userAttempts);

            // Calculate average points per quiz
            // const averagePointsCalc = userAttempts > 0 ? (currentUser.points / userAttempts).toFixed(2) : 0;
            // setAveragePoints(averagePointsCalc);
        };

        const fetchLessons = async () => {
            try {
                const response = await http.get('/lesson');  // Adjust the endpoint to your API
                setLessons(response.data);
            } catch (error) {
                console.error('Failed to fetch lessons:', error);
            }
        };

        fetchUsers();
        fetchLessons();
    }, []);

    const filteredLessons = lessons
        .filter((lesson) =>
            lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lesson.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .filter((lesson) =>
            selectedTags.length === 0 || selectedTags.every(tag => lesson.tags.includes(tag))
        )
        .sort((a, b) => {
            if (sortDirection === 'asc') {
                return a[sortOption] > b[sortOption] ? 1 : -1;
            }
            return a[sortOption] < b[sortOption] ? 1 : -1;
        });

    const handleLessonClick = (lessonId) => {
        navigate(`/learning/${lessonId}`);
    };

    return (
        <Grid container spacing={2} sx={{mt: 5, width: '95%', margin: 'auto'}}>
            {/* Left Sidebar - Leaderboard */}
            <Grid item xs={12} md={2}>
                <Paper sx={{ padding: 2, backgroundColor:'#e3e3e3', boxShadow: '0px 0px 3px 0px' }}>
                    <Typography variant="h6" gutterBottom>
                        Leaderboard
                    </Typography>
                    <List>
                        {users.map((userz, index) => (
                            <ListItem
                                key={userz.id}
                                sx={{
                                    backgroundColor: userz.id === user.id ? 'primary.light' : 'transparent',
                                    borderRadius: 2,
                                    marginBottom: 1,
                                }}
                            >
                                <ListItemText
                                    primary={`${index + 1}. ${userz.firstName + " " + userz.lastName}`}
                                    secondary={`Points: ${userz.points}`}
                                />
                            </ListItem>
                        ))}
                    </List>

                </Paper>
            </Grid>

            {/* Middle Content - Lessons List (Unchanged) */}
            <Grid item xs={12} md={8}>
                <Box sx={{ padding: 3, backgroundColor:'#e3e3e3', boxShadow: '0px 0px 3px 0px'  }}>
                    <Typography variant="h4" gutterBottom>
                        Discover Lessons
                    </Typography>
                    {/* Search Bar */}
                    <TextField
                        variant="outlined"
                        fullWidth
                        placeholder="Search lessons..."
                        InputProps={{
                            startAdornment: <Search sx={{ mr: 1 }} />,
                        }}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        sx={{ marginBottom: 2 }}
                    />

                    {/* Sort Options */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                        <FormControl variant="outlined" sx={{ minWidth: 120 }}>
                            <InputLabel>Sort By</InputLabel>
                            <Select
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                                label="Sort By"
                            >
                                <MenuItem value="likes">Likes</MenuItem>
                                <MenuItem value="averageScore">Average Score</MenuItem>
                                <MenuItem value="totalPoints">Total Points</MenuItem>
                                <MenuItem value="attemptCount">Attempt Count</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl variant="outlined" sx={{ minWidth: 120 }}>
                            <InputLabel>Direction</InputLabel>
                            <Select
                                value={sortDirection}
                                onChange={(e) => setSortDirection(e.target.value)}
                                label="Direction"
                            >
                                <MenuItem value="asc">Ascending</MenuItem>
                                <MenuItem value="desc">Descending</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    {/* Filter by Tags */}
                    <Box sx={{ marginBottom: 2 }}>
                        <Typography variant="subtitle1">Filter by Tags</Typography>
                        <List>
                            {tags.map((tag) => (
                                <ListItem key={tag} dense button onClick={() => {
                                    if (selectedTags.includes(tag)) {
                                        setSelectedTags(selectedTags.filter(t => t !== tag));
                                    } else {
                                        setSelectedTags([...selectedTags, tag]);
                                    }
                                }}>
                                    <ListItemIcon>
                                        <Checkbox
                                            edge="start"
                                            checked={selectedTags.includes(tag)}
                                            tabIndex={-1}
                                            disableRipple
                                        />
                                    </ListItemIcon>
                                    <ListItemText primary={tag} />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                    <Typography variant="h6">Lessons</Typography>
                    {/* Lessons List */}
                    <List>
                        {filteredLessons.map((lesson) => (
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
            </Grid>

            {/* Right Sidebar - User Stats */}
            <Grid item xs={12} md={2}>
                <Paper sx={{ padding: 2, backgroundColor:'#e3e3e3', boxShadow: '0px 0px 3px 0px'  }}>
                    <Typography variant="h6" gutterBottom>
                        Your Stats
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar alt={user.firstName} src={`${import.meta.env.VITE_FILE_PROFILE_URL}/${user.imageFile}`} sx={{ width: 56, height: 56 }} />
                        <Typography variant="h6" sx={{ ml: 2 }}>
                            {user.firstName} {user.lastName}
                        </Typography>
                    </Box>
                    <Typography variant="body1">Points: {user.points}</Typography>
                    
                    {/* <Typography variant="body1">Quizzes Taken: {user.quizzesTaken}</Typography> */}
                    {/* <Typography variant="body1">Avg Points/Quiz: {averagePoints}</Typography> */}
                    <Typography variant="body1">Leaderboard Rank: #{user.rank}</Typography>
                    {/* Add more stats as needed */}
                </Paper>
            </Grid>
        </Grid>
    );
}

export default Learning;
