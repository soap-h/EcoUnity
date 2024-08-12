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
import { Link, useNavigate } from 'react-router-dom';
import ForumNavigation from '../../components/Forum/ForumNavigation';
import ForumBigPicture from '../../components/Forum/ForumBigPicture';
import UserContext from '../../contexts/UserContext';
import dayjs from 'dayjs';
import global from '../../global';
import ThreadCard from '../../components/Forum/ThreadCard';
import ForumHeader from '../../components/Forum/ForumHeader';
import ForumSearchBar from '../../components/Forum/ForumSearchBar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    const navigate = useNavigate();


    const [sortOption, setSortOption] = useState('most recent'); // Default sort option

    const sortThreads = (threads, option) => {
        switch (option) {
            case 'most recent':
                return threads.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            case 'oldest':
                return threads.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            case 'A to Z':
                return threads.sort((a, b) => a.title.localeCompare(b.title)); // Assuming thread has a title property
            case 'Z to A':
                return threads.sort((a, b) => b.title.localeCompare(a.title)); // Assuming thread has a title property
            default:
                return threads;
        }
    };

    const handleSortChange = (option) => {
        setSortOption(option);
        setThreadList(prevThreads => sortThreads([...prevThreads], option)); // Sort the threads
    };


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
        if (!user || !user.id) {
            // Redirect to login if user is not logged in
            navigate('/login');
            return;
        }

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

    const getUserEmailById = async (userId) => {
        try {
            const response = await http.get(`/user/userinfo`);
            const user = response.data.find(u => u.id === userId);
            return user ? user.email : "Unknown sender";
        } catch (error) {
            console.error('Error fetching user email:', error);
            return null;
        }
    };


    const handleCommentSubmit = async (threadId) => {
        if (!user) {
            toast.error('You need to be logged in to comment.');
            return;
        }

        try {
            // Post the new comment
            const response = await http.post(`/comment/${threadId}`, { description: newComment[threadId]?.text });
            const createdComment = response.data;

            console.log(`this is my new comment ${createdComment.description}`);

            // Optimistically update the UI
            setThreadList(prevThreads =>
                prevThreads.map(thread =>
                    thread.id === threadId
                        ? { ...thread, commentCount: (thread.commentCount || 0) + 1 }
                        : thread
                )
            );

            // Update comments locally
            setComments(prevState => ({
                ...prevState,
                [threadId]: [...(prevState[threadId] || []), {
                    ...createdComment,
                    createdAt: new Date() // Update with the actual creation date if needed
                }]
            }));

            setNewComment(prevState => ({
                ...prevState,
                [threadId]: { text: '', expanded: false }
            }));

            console.log(`This is the thread id: ${threadId}`)

            // Fetch the latest comment data
            const updatedThreadRes = await http.get(`/thread/id/${threadId}`);
            const updatedThread = updatedThreadRes.data;

            console.log(`updated thread.commentCount: ${updatedThread.commentCount}`);


            setThreadList(prevThreads =>
                prevThreads.map(thread =>
                    thread.id === threadId
                        ? { ...thread, commentCount: updatedThread.commentCount }
                        : thread
                )
            );

            // Notify the recipient
            const thread = threadList.find(t => t.id === threadId);
            const recipientEmail = await getUserEmailById(thread.userId);
            const message = {
                'title': `${user.firstName} ${user.lastName} Commented on your post`,
                'content': `${user.firstName} ${user.lastName} Commented: ${newComment[threadId]?.text}`,
                'recipient': `${recipientEmail}`,
                'date': `${new Date()}`,
                'category': "forum",
            };
            await http.post("/inbox", message);

        } catch (error) {
            console.error('Error posting comment:', error.message);
        }
    };

    const handleSearchResults = (results) => {
        setThreadList(results);
    }


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

    // Comment Like
    const handleLikeToggle = async (threadId, commentId) => {
        if (!user) {
            toast.error('You need to be logged in to like comments.');
            return;
        }

        try {
            // Check the current like status  
            const { data } = await http.get(`/commentLikes/${commentId}/like-status`);

            const hasLiked = data.liked;

            if (hasLiked) {
                // Unlike comment
                console.log(hasLiked);
                await http.delete(`/commentLikes/${commentId}/dislike`);
                setComments(prevComments => ({
                    ...prevComments,
                    [threadId]: prevComments[threadId].map(comment =>
                        comment.id === commentId
                            ? { ...comment, like: comment.like - 1, likes: comment.likes.filter(like => like !== user.id) }
                            : comment
                    )
                }));
            } else {
                // Like comment
                console.log(hasLiked, commentId);
                await http.post(`/commentLikes/${commentId}/like`);
                setComments(prevComments => ({
                    ...prevComments,
                    [threadId]: prevComments[threadId].map(comment =>
                        comment.id === commentId
                            ? { ...comment, like: comment.like + 1, likes: [...(comment.likes || []), user.id] }
                            : comment
                    )
                }));
            }
        } catch (error) {
            console.error('Error toggling like status', error);
        }
    };

    return (
        <Box sx={{ p: 4 }}>
            <ForumHeader />
            <Grid container spacing={2} sx={{ my: 2 }}>
                <ForumNavigation handleSortChange={handleSortChange} />

                <Grid item xs={8.86}>
                    <ForumSearchBar onSearchResults={handleSearchResults} sx={{ pb: 2 }} />
                    {threadList.length === 0 ? (
                        <Grid>
                            <Typography variant="h6" sx={{ mt: 2 }}>
                                You did not save any threads, save some on Home now!!
                            </Typography>
                        </Grid>
                    ) : (threadList.map((thread) => (
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
                            handleLikeToggle={handleLikeToggle}
                            showFullContent={showFullContent}
                            handleToggleContent={handleToggleContent}
                            user={user}
                        />
                    )))}

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
            <ToastContainer />
        </Box>
    );
}

export default SavedThreads;
