import React from 'react';
import {
    Card, CardContent, CardHeader, Avatar, Typography, IconButton, Chip, Button, Collapse, TextField, Divider, Box
} from '@mui/material';
import {
    Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon, Comment as CommentIcon, BookmarkBorder as BookmarkBorderIcon,
    Bookmark as BookmarkIcon, ExpandMore as ExpandMoreIcon, Mood as MoodIcon, MoodBad as MoodBadIcon
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import global from '../../global';

const ThreadCard = ({
    thread, onDeleteClick, onBookmarkToggle, onCommentClick, onCommentChange, onCommentSubmit, newComment, bookmarkedThreads, onViewCommentsToggle, truncateContent, getCategoryChipColor,
    showComments, comments, userVotes, handleVote, showFullContent, handleToggleContent, user
}) => {
    return (
        <Card key={thread.id} sx={{ margin: 'auto', marginTop: 2, maxWidth: '100%', width: '100%' }}>
            <CardHeader
                avatar={
                    <Link to={`/guestprofile/${thread.userId}`}>
                        <Avatar alt={thread.user?.firstName} src={thread.user?.imageFile ? `${import.meta.env.VITE_FILE_PROFILE_URL}${thread.user?.imageFile}` : undefined} />
                    </Link>
                }
                title={
                    <Link to={`/guestprofile/${thread.userId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        {thread.user?.firstName}
                    </Link>
                }
                subheader={dayjs(thread.createdAt).format(global.datetimeFormat)}
            />
            <CardContent>
                <Typography variant="h6" component="div">
                    {thread.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                    {truncateContent(thread.description, 200)}
                    {thread.description.length > 200 && (
                        <Button onClick={handleToggleContent} sx={{ mt: 1, color: 'primary.main' }}>
                            {showFullContent ? 'View Less' : 'View More'}
                        </Button>
                    )}
                </Typography>
                {thread.imageFile && (
                    <Box className="aspect-ratio-container">
                        <img alt="thread" src={`${import.meta.env.VITE_FILE_THREAD_URL}${thread.imageFile}`} />
                    </Box>
                )}
                {thread.category && (
                    <Chip
                        label={thread.category}
                        color={getCategoryChipColor(thread.category)}
                        sx={{ mt: 1 }}
                    />
                )}
                <CardContent sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <IconButton
                        aria-label="like"
                        onClick={() => handleVote(thread.id, 'upvote')}
                        disabled={userVotes[thread.id] === 'upvote'}
                    >
                        <MoodIcon />
                        {thread.upvote}
                    </IconButton>
                    <IconButton
                        aria-label="dislike"
                        onClick={() => handleVote(thread.id, 'downvote')}
                        disabled={userVotes[thread.id] === 'downvote'}
                    >
                        <MoodBadIcon />
                        {thread.downvote}
                    </IconButton>
                    <IconButton
                        aria-label="comment"
                        onClick={() => onCommentClick(thread.id)}
                    >
                        <CommentIcon />
                        {thread.comments?.length || 0}
                    </IconButton>
                    <IconButton
                        color={bookmarkedThreads.includes(thread.id) ? 'primary' : 'default'}
                        aria-label="bookmark"
                        onClick={() => onBookmarkToggle(thread.id)}
                    >
                        {bookmarkedThreads.includes(thread.id) ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                    </IconButton>
                    {user && user.id === thread.userId && (
                        <>
                            <IconButton aria-label="delete" onClick={() => onDeleteClick(thread.id)}>
                                <DeleteIcon />
                            </IconButton>
                            <Link to={`/editthread/${thread.id}`}>
                                <IconButton aria-label="edit">
                                    <EditIcon />
                                </IconButton>
                            </Link>
                        </>
                    )}
                </CardContent>
                <Collapse in={newComment[thread.id]?.expanded || false} sx={{ mt: 2 }}>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        value={newComment[thread.id]?.text || ''}
                        onChange={(e) => onCommentChange(e, thread.id)}
                        placeholder="Add a comment..."
                        sx={{ mb: 1 }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => onCommentSubmit(thread.id)}
                    >
                        Post
                    </Button>
                </Collapse>
            </CardContent>
            <Divider />
            <CardContent>
                <Button
                    variant="outlined"
                    endIcon={<ExpandMoreIcon />}
                    onClick={() => onViewCommentsToggle(thread.id)}
                    sx={{ mb: 2 }}
                >
                    {showComments[thread.id] ? 'Hide Comments' : 'View Comments'}
                </Button>
                {showComments[thread.id] && (
                    <Box sx={{ mt: 2 }}>
                        {comments[thread.id]?.map((comment, index) => (
                            <Box key={index} sx={{ mb: 1, borderRadius: 1, p: 1 }}>
                                <Typography variant="subtitle2" fontWeight="bold">
                                    {comment.user?.firstName}
                                </Typography>
                                <Typography variant="body2">{comment.description}</Typography>
                            </Box>
                        ))}
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default ThreadCard;
