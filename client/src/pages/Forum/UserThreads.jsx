import React, { useEffect, useState, useContext } from 'react';
import { Box, Typography, Grid, CardContent, CardActions, Tooltip, IconButton, Chip, Button, Paper, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, CircularProgress } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon, Comment as CommentIcon, Bookmark as BookmarkIcon, BookmarkBorder as BookmarkBorderIcon } from '@mui/icons-material';
import http from '../../http';
import { Link, useNavigate } from 'react-router-dom';
import ForumNavigation from '../../components/Forum/ForumNavigation';
import ForumBigPicture from '../../components/Forum/ForumBigPicture';
import UserContext from '../../contexts/UserContext';
import ThreadCard from '../../components/Forum/ThreadCard';


function UserThreads() {
    const [threadList, setThreadList] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedThreadId, setSelectedThreadId] = useState(null);
    const { user } = useContext(UserContext);
    const navigate = useNavigate(); // Initialize the useNavigate hook
    const [bookmarkedThreads, setBookmarkedThreads] = useState([]);
    const [showComments, setShowComments] = useState({});
    const [newComment, setNewComment] = useState({});
    const [comments, setComments] = useState({});
    const [userVotes, setUserVotes] = useState({});
    const [showFullContent, setShowFullContent] = useState(false);

    const [loading, setLoading] = useState(true);







    const handleToggleContent = () => {
        setShowFullContent(!showFullContent);
    };







    const handleBookmarkToggle = async (threadId) => {
        try {
            if (bookmarkedThreads.includes(threadId)) {
                await http.delete(`/bookmarks/${threadId}`);
                setBookmarkedThreads(bookmarkedThreads.filter(id => id !== threadId));
            } else {
                await http.post('/bookmarks', { threadId });
                setBookmarkedThreads([...bookmarkedThreads, threadId]);
            }
        } catch (error) {
            console.error('Error handling bookmark:', error);
        }
    };

    const handleVote = async (threadId, voteType) => {
        try {
            const currentVote = userVotes[threadId];

            if (currentVote === voteType) {
                await http.put(`/thread/id/${threadId}/${voteType}/decrease`);
                setUserVotes(prevState => ({
                    ...prevState,
                    [threadId]: null
                }));
            } else {
                if (currentVote) {
                    await http.put(`/thread/id/${threadId}/${currentVote}/decrease`);
                }
                await http.put(`/thread/id/${threadId}/${voteType}/increase`);
                setUserVotes(prevState => ({
                    ...prevState,
                    [threadId]: voteType
                }));
            }

            const response = await http.get('/thread');
            setThreadList(response.data);
        } catch (error) {
            console.error('Error handling vote:', error);
        }
    };

    const handleCommentClick = (threadId) => {
        setNewComment(prevState => ({
            ...prevState,
            [threadId]: {
                ...prevState[threadId],
                expanded: !(prevState[threadId]?.expanded || false)
            }
        }));
    };

    const handleCommentChange = (event, threadId) => {
        setNewComment(prevState => ({
            ...prevState,
            [threadId]: {
                ...prevState[threadId],
                text: event.target.value
            }
        }));
    };

    const handleCommentSubmit = async (threadId) => {
        try {
            await http.post(`/comment/${threadId}`, { description: newComment[threadId]?.text });
            setComments(prevState => ({
                ...prevState,
                [threadId]: [...(prevState[threadId] || []), newComment[threadId]?.text]
            }));
            setNewComment(prevState => ({
                ...prevState,
                [threadId]: { text: '', expanded: false }
            }));
        } catch (error) {
            console.error('Error posting comment:', error);
        }
    };

    const handleViewCommentsToggle = async (threadId) => {
        if (showComments[threadId]) {
            setShowComments(prevState => ({
                ...prevState,
                [threadId]: !prevState[threadId]
            }));
        } else {
            try {
                const response = await http.get(`/comment/thread/${threadId}`);
                setComments(prevState => ({
                    ...prevState,
                    [threadId]: response.data
                }));
                setShowComments(prevState => ({
                    ...prevState,
                    [threadId]: true
                }));
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        }
    };

    const truncateContent = (content, maxLength) => {
        if (content.length <= maxLength) return content;
        return showFullContent ? content : content.substring(0, maxLength) + '...';
    };

    const getCategoryChipColor = (categoryName) => {
        switch (categoryName.toLowerCase()) {
            case 'biodiversity': return 'error';
            case 'energy': return 'warning';
            case 'conservation': return 'success';
            case 'agriculture': return 'primary';
            case 'recycling': return 'secondary';
            case 'climate change': return 'info';
            default: return 'default';
        }
    };

    useEffect(() => {
        if (!user || !user.id) {
            // Redirect to login if user is not logged in
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            try {
                // Fetch the threads created by the logged-in user
                const threadsRes = await http.get(`/thread/user/${user.id}`);
                setThreadList(threadsRes.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
                // Optionally, handle the error state
            }
        };

        fetchData();
    }, [user, navigate]); // Add navigate to dependencies

    const handleDeleteClick = (id) => {
        setSelectedThreadId(id);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedThreadId(null);
    };

    const handleDeleteConfirm = () => {
        http.delete(`/thread/${selectedThreadId}`).then(() => {
            setThreadList(threadList.filter(thread => thread.id !== selectedThreadId));
            handleClose();
        }).catch((error) => {
            console.error("There was an error deleting the thread!", error);
            // Optionally, handle the error state
        });
    };

    if (!user) {
        return null; // This will redirect to login if user is not logged in
    }

    return (
        <Box sx={{p:4}}>
            {
                loading ? (
                    <CircularProgress />
                ) : (

                    <Box>
                        <ForumBigPicture />
                        <Grid container spacing={2} sx={{ my: 2 }}>
                            <ForumNavigation />

                            <Grid item xs={9}>
                                <Link to="/addthread">
                                    <Button variant='contained' startIcon={<AddIcon />} fullWidth sx={{ mb: 2 }}>
                                        Add a new thread
                                    </Button>
                                </Link>


                                {threadList.length > 0 ? (
                                    threadList.map((thread) => (
                                        <ThreadCard
                                            key={thread.id}
                                            thread={thread}
                                            onDeleteClick={handleDeleteClick}
                                            onBookmarkToggle={handleBookmarkToggle}
                                            onCommentClick={handleCommentClick}
                                            onCommentChange={handleCommentChange}
                                            onCommentSubmit={handleCommentSubmit}
                                            onViewCommentsToggle={handleViewCommentsToggle}
                                            bookmarkedThreads={bookmarkedThreads}
                                            truncateContent={truncateContent}
                                            getCategoryChipColor={getCategoryChipColor}
                                            showComments={showComments}
                                            newComment={newComment}
                                            comments={comments}
                                            userVotes={userVotes}
                                            handleVote={handleVote}
                                            showFullContent={showFullContent}
                                            handleToggleContent={handleToggleContent}
                                            user={user}
                                        />

                                    ))
                                ) : (
                                    <Typography>You have not created any thread. Press the above button to start now!</Typography>
                                )}

                            </Grid>


                        </Grid>

                        <Dialog open={open} onClose={handleClose}>
                            <DialogTitle>Delete Thread</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Are you sure you want to delete this thread? This action cannot be undone.
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleClose} color="primary">
                                    Cancel
                                </Button>
                                <Button onClick={handleDeleteConfirm} color="error" autoFocus>
                                    Delete
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Box>
                )
            }
        </Box>
    );
}

export default UserThreads;
