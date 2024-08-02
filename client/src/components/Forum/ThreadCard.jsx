import React, { useState } from 'react';
import {
    Card, CardContent, CardHeader, Avatar, Typography, IconButton, Chip, Button, Collapse, TextField, Divider, Box, Tooltip
} from '@mui/material';
import {
    Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon, Comment as CommentIcon, BookmarkBorder as BookmarkBorderIcon,
    Bookmark as BookmarkIcon, ExpandMore as ExpandMoreIcon, Mood as MoodIcon, MoodBad as MoodBadIcon
} from '@mui/icons-material';
import dayjs from 'dayjs';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ReplyIcon from '@mui/icons-material/Reply';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import { Link } from 'react-router-dom';
import ReportThreadForm from './ReportThreadForm';
import global from '../../global';

const ThreadCard = ({
    thread, onDeleteClick, onBookmarkToggle, onCommentClick, onCommentChange, onCommentSubmit, newComment, bookmarkedThreads, onViewCommentsToggle, truncateContent, getCategoryChipColor,
    showComments, comments, userVotes, handleVote, showFullContent, handleToggleContent, user
}) => {
    const [reportFormOpen, setReportFormOpen] = useState(false);

    const handleReportButtonClick = () => {
        setReportFormOpen(true);
    };

    const handleCloseReportForm = () => {
        setReportFormOpen(false);
    };

    return (
        <>
            <Card key={thread.id} sx={{ margin: 'auto', marginTop: 2, maxWidth: '100%', width: '100%' }}>
                <CardHeader
                    avatar={<Link to={`/guestprofile/${thread.userId}`}>
                        <Avatar alt={thread.user?.firstName} src={thread.user?.imageFile ? `${import.meta.env.VITE_FILE_PROFILE_URL}${thread.user?.imageFile}` : undefined} />
                    </Link>}
                    title={<Link to={`/guestprofile/${thread.userId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        {thread.user?.firstName}
                    </Link>}
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
                                <Box
                                    key={index}
                                    sx={{
                                        mb: 2,
                                        borderRadius: 2,
                                        p: 2,
                                        boxShadow: 1,
                                        bgcolor: 'background.paper',
                                    }}
                                >
                                    <CardHeader
                                        avatar={
                                            <Avatar
                                                alt={comment.user?.firstName}
                                                src={`${import.meta.env.VITE_FILE_PROFILE_URL}${comment.user?.imageFile}`}
                                            />
                                        }
                                        title={comment.user?.firstName}
                                        subheader={dayjs(comment.createdAt).format('MMM D, YYYY h:mm A')}
                                        sx={{ pb: 1 }}
                                    />
                                    <Divider sx={{ mb: 1, py: 1 }} />
                                    <Typography
                                        variant="body1"
                                        color="text.primary"
                                        sx={{ py: 2 }}
                                    >
                                        {comment.description}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                        <Tooltip title="Like">
                                            <IconButton>
                                                <FavoriteBorderIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Reply">
                                            <IconButton>
                                                <ReplyIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    )}
                </CardContent>
                <CardContent
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        position: 'relative',
                        pt: 2,
                    }}
                >
                    <Box sx={{ display: 'flex', gap: 1 }}>
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
                        <IconButton onClick={handleReportButtonClick}>
                            <ReportGmailerrorredIcon />
                        </IconButton>
                    </Box>
                    {user && user.id === thread.userId && (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton aria-label="delete" onClick={() => onDeleteClick(thread.id)}>
                                <DeleteIcon />
                            </IconButton>
                            <Link to={`/editthread/${thread.id}`}>
                                <IconButton aria-label="edit">
                                    <EditIcon />
                                </IconButton>
                            </Link>
                        </Box>
                    )}
                </CardContent>
            </Card>
            {reportFormOpen && (
                <ReportThreadForm threadId={thread.id} onClose={handleCloseReportForm} />
            )}
        </>
    );
};

export default ThreadCard;

