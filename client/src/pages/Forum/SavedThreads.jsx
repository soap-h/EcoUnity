import React, { useEffect, useState, useContext } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CardHeader,
    Divider,
    Avatar,
    IconButton,
    Tooltip,
    Button,
    Chip,
    Collapse,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Paper
} from '@mui/material';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    Comment as CommentIcon,
    Bookmark as BookmarkIcon,
    BookmarkBorder as BookmarkBorderIcon,
    ExpandMore as ExpandMoreIcon,
    Mood as MoodIcon,
    MoodBad as MoodBadIcon
} from '@mui/icons-material';
import http from '../../http';
import { Link } from 'react-router-dom';
import ForumNavigation from '../../components/Forum/ForumNavigation';
import ForumBigPicture from '../../components/Forum/ForumBigPicture';
import UserContext from '../../contexts/UserContext';
import dayjs from 'dayjs';
import global from '../../global';
import ThreadCard from '../../components/Forum/ThreadCard';

function SavedThreads() {
    const [threadList, setThreadList] = useState([]);
    const [bookmarkedThreads, setBookmarkedThreads] = useState([]);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openUnsaveDialog, setOpenUnsaveDialog] = useState(false);
    const [selectedThreadId, setSelectedThreadId] = useState(null);
    const [action, setAction] = useState(null); // 'delete' or 'unsave'
    const { user } = useContext(UserContext);
    const [newComment, setNewComment] = useState({});
    const [comments, setComments] = useState({});
    const [showComments, setShowComments] = useState({});
    const [showFullContent, setShowFullContent] = useState(false);
    const [userVotes, setUserVotes] = useState({});


    const handleToggleContent = () => {
        setShowFullContent(!showFullContent);
    };

    const handleBookmarkToggle = async (threadId) => {
        try {
            if (bookmarkedThreads.includes(threadId)) {
                // Open the confirmation dialog instead of directly deleting the bookmark
                setSelectedThreadId(threadId);
                setAction('unsave');
                setOpenUnsaveDialog(true);
            } else {
                await http.post('/bookmarks', { threadId });
                setBookmarkedThreads([...bookmarkedThreads, threadId]);
            }
        } catch (error) {
            console.error('Error handling bookmark:', error);
        }
    };

    useEffect(() => {
        if (!user || !user.id) return; // Ensure user is logged in

        // Fetch bookmarked threads
        const fetchData = async () => {
            try {
                const bookmarksRes = await http.get('/bookmarks');
                const bookmarkedThreadIds = bookmarksRes.data.map(b => b.thread.id);

                // Fetch the threads based on bookmarked IDs
                const threadsRes = await Promise.all(
                    bookmarkedThreadIds.map(threadId => http.get(`/thread/id/${threadId}`))
                );

                setThreadList(threadsRes.map(res => res.data));
                setBookmarkedThreads(bookmarkedThreadIds);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [user]);

    const handleDeleteClick = (id) => {
        setSelectedThreadId(id);
        setAction('delete');
        setOpenDeleteDialog(true);
    };

    const handleClose = () => {
        setOpenDeleteDialog(false);
        setOpenUnsaveDialog(false);
        setSelectedThreadId(null);
        setAction(null);
    };

    const handleConfirm = async () => {
        try {
            if (action === 'delete') {
                await http.delete(`/thread/${selectedThreadId}`);
                setThreadList(threadList.filter(thread => thread.id !== selectedThreadId));
            } else if (action === 'unsave') {
                await http.delete(`/bookmarks/${selectedThreadId}`);
                setBookmarkedThreads(bookmarkedThreads.filter(id => id !== selectedThreadId));
                setThreadList(threadList.filter(thread => thread.id !== selectedThreadId));
            }
        } catch (error) {
            console.error(`There was an error ${action === 'delete' ? 'deleting' : 'unsaving'} the thread!`, error);
        } finally {
            handleClose();
        }
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

    const handleCommentClick = (threadId) => {
        setNewComment(prevState => ({
            ...prevState,
            [threadId]: {
                ...prevState[threadId],
                expanded: !(prevState[threadId]?.expanded || false)
            }
        }));
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

    const truncateContent = (content, maxLength) => {
        if (content.length <= maxLength) return content;
        return showFullContent ? content : content.substring(0, maxLength) + '...';
    };

    return (
        <Box sx={{p:4}}>
            <ForumBigPicture />
            <Grid container spacing={2} sx={{ my: 2 }}>
                <ForumNavigation />

                <Grid item xs={9}>
                    <Link to="/addthread">
                        <Button variant='contained' startIcon={<AddIcon />} fullWidth sx={{ mb: 2 }}>
                            Add a new thread
                        </Button>
                    </Link>

                    {threadList.map((thread) => (
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
                    ))}



                    <Dialog
                        open={openDeleteDialog}
                        onClose={handleClose}
                        aria-labelledby="delete-dialog-title"
                    >
                        <DialogTitle id="delete-dialog-title">Confirm Deletion</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Are you sure you want to delete this thread? This action cannot be undone.
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={handleConfirm} color="secondary">
                                Delete
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <Dialog
                        open={openUnsaveDialog}
                        onClose={handleClose}
                        aria-labelledby="unsave-dialog-title"
                    >
                        <DialogTitle id="unsave-dialog-title">Confirm Unsave</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Are you sure you want to unsave this thread?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={handleConfirm} color="secondary">
                                Unsave
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Grid>
            </Grid>
        </Box>
    );
}

export default SavedThreads;
