import React, { useEffect, useState, useContext } from 'react';
import { Box, Typography, Grid, Button, Paper, Card, CardContent, Chip, CardActions, Tooltip, IconButton } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import ForumNavigation from '../../components/Forum/ForumNavigation';
import ForumBigPicture from '../../components/Forum/ForumBigPicture';
import http from '../../http';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ThreadCard from '../../components/Forum/ThreadCard';
import UserContext from '../../contexts/UserContext';
import ForumHeader from '../../components/Forum/ForumHeader';
import ForumSearchBar from '../../components/Forum/ForumSearchBar';

function ForumByCategory() {
    const { category } = useParams();
    const [categoryThreadList, setCategoryThreadList] = useState([]);
    const [bookmarkedThreads, setBookmarkedThreads] = useState([]);
    const [showComments, setShowComments] = useState({});
    const [newComment, setNewComment] = useState({});
    const [comments, setComments] = useState({});
    const [userVotes, setUserVotes] = useState({});
    const [showFullContent, setShowFullContent] = useState(false);
    const { user } = useContext(UserContext);


    useEffect(() => {
        http.get(`/thread/${category}`).then((res) => {
            console.log(res.data);
            setCategoryThreadList(res.data);
        });
    }, [category]);



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
            setCategoryThreadList(prevThreads =>
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


            setCategoryThreadList(prevThreads =>
                prevThreads.map(thread =>
                    thread.id === threadId
                        ? { ...thread, commentCount: updatedThread.commentCount }
                        : thread
                )
            );

            // Notify the recipient
            const thread = categoryThreadList.find(t => t.id === threadId);
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


    const handleDeleteClick = (id) => {
        setSelectedThreadId(id);
        setOpen(true);
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
    };


    const handleSearchResults = (results) => {
        setCategoryThreadList(results);
    }


    return (
        <Box sx={{ p: 4 }}>
            <ForumHeader />
            <Grid container spacing={2} sx={{ my: 2 }}>
                <ForumNavigation />
                <Grid item xs={8.86}>
                    <ForumSearchBar onSearchResults={handleSearchResults} sx={{ pb: 2 }} />
                    {categoryThreadList.length === 0 ? (
                        <Grid>
                            <Typography variant="h6" sx={{ mt: 2 }}>
                                There are no threads under this category so far, create one now!
                            </Typography>
                        </Grid>
                    ) : (
                        categoryThreadList.map((thread) => (
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
                                handleLikeToggle={handleLikeToggle}
                                handleVote={handleVote}
                                showFullContent={showFullContent}
                                handleToggleContent={handleToggleContent}
                                user={user}
                            />
                        ))
                    )}

                </Grid>
            </Grid>
        </Box>
    );
}

export default ForumByCategory;
