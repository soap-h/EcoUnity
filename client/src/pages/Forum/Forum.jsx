import React, { useEffect, useState, useContext } from 'react';
import { Box, Grid, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import http from '../../http';
import {
    Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon, Comment as CommentIcon, BookmarkBorder as BookmarkBorderIcon,
    Bookmark as BookmarkIcon, ExpandMore as ExpandMoreIcon, Mood as MoodIcon, MoodBad as MoodBadIcon
} from '@mui/icons-material';
import UserContext from '../../contexts/UserContext';
import ForumNavigation from '../../components/Forum/ForumNavigation';
import ForumBigPicture from '../../components/Forum/ForumBigPicture';
import ThreadCard from '../../components/Forum/ThreadCard';
import { Link } from 'react-router-dom';

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
                http.get('/bookmarks'),
                // user ? http.get(`/userVotes/${user.id}`) : Promise.resolve({ data: [] })
            ]);
            setThreadList(threadsRes.data);
            setBookmarkedThreads(bookmarksRes.data.map(b => b.threadId));
            // setUserVotes(votesRes.data.reduce((acc, vote) => {
            //     acc[vote.threadId] = vote.voteType;
            //     return acc;
            // }, {}));
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

    // biodiversity, energy, conservation, agriculture, recycling, climate change
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
            const thread = threadList.find(t => t.id === threadId);
            const recipientEmail = await getUserEmailById(thread.userId);

            const message = {
                'title': `${user.firstName} ${user.lastName} Commented on your post`,
                'content': `${user.firstName} ${user.lastName} Commented ${newComment[threadId]?.text}`,
                'recipient': `${recipientEmail}`,
                'date': `${new Date()}`,
                'category': "forum",
            }
            http.post("/inbox", message)
                .catch((error) => {
                    toast.error('error');
                    console.log(error);
                });

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



    return (
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
        </Box>
    );
}

export default Forum;
