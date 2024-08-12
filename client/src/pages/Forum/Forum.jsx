import React, { useEffect, useState, useContext } from 'react';
import { Box, Grid, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import http from '../../http';
import {
    Add as AddIcon, Delete as DeleteIcon, Comment as CommentIcon, BookmarkBorder as BookmarkBorderIcon,
    Bookmark as BookmarkIcon, ExpandMore as ExpandMoreIcon, Mood as MoodIcon, MoodBad as MoodBadIcon
} from '@mui/icons-material';
import UserContext from '../../contexts/UserContext';
import ForumNavigation from '../../components/Forum/ForumNavigation';
import ThreadCard from '../../components/Forum/ThreadCard';
import ForumHeader from '../../components/Forum/ForumHeader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Forum() {
    const [threadList, setThreadList] = useState([]);
    const [bookmarkedThreads, setBookmarkedThreads] = useState([]);
    const [userVotes, setUserVotes] = useState({});
    const [open, setOpen] = useState(false);
    const [selectedThreadId, setSelectedThreadId] = useState(null);
    const [newComment, setNewComment] = useState({});
    const [comments, setComments] = useState({});
    const [showComments, setShowComments] = useState({});
    const { user } = useContext(UserContext);
    const [showFullContent, setShowFullContent] = useState(false);

    const fetchData = async () => {
        try {
            const [threadsRes, bookmarksRes] = await Promise.all([
                http.get('/thread'),
                user ? http.get('/bookmarks') : Promise.resolve({ data: [] })  // Fetch bookmarks only if the user is logged in
            ]);
            setThreadList(threadsRes.data);
            if (user) {
                setBookmarkedThreads(bookmarksRes.data.map(b => b.threadId));
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
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

    useEffect(() => {
        fetchData();
    }, [user]);

    const handleToggleContent = () => {
        setShowFullContent(!showFullContent);
    };

    const truncateContent = (content, maxLength) => {
        if (content.length <= maxLength) return content;
        return showFullContent ? content : content.substring(0, maxLength) + '...';
    };

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
        });
    };

    const handleBookmarkToggle = async (threadId) => {
        if (!user) {
            toast.error('You need to be logged in to bookmark threads.');
            return;
        }

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

    const getCategoryChipColor = (categoryName) => {
        switch (categoryName.toLowerCase()) {
            case 'biodiversity':
                return 'error';
            case 'energy':
                return 'warning';
            case 'conservation':
                return 'success';
            case 'agriculture':
                return 'primary';
            case 'recycling':
                return 'secondary';
            case 'climate change':
                return 'info';
        }
    }

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
                'unread': 1
            };
            await http.post("/inbox", message);

        } catch (error) {
            console.error('Error posting comment:', error.message);
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

    const handleVote = async (threadId, voteType) => {
        if (!user) {
            toast.error('You need to be logged in to vote.');
            return;
        }

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
            <Grid container spacing={2}>
                <ForumNavigation />
                <Grid item xs={9}>
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
                            handleLikeToggle={handleLikeToggle}
                            handleToggleContent={handleToggleContent}
                            user={user}
                        />
                    ))}
                </Grid>
            </Grid>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this thread?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
                </DialogActions>
            </Dialog>
            <ToastContainer />
        </Box>
    );
}

export default Forum;
