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
import './ThreadCard.css'; // Import the CSS file

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
            <Card key={thread.id} className="thread-card">
                <CardHeader
                    avatar={<Link to={`/guestprofile/${thread.userId}`}>
                        <Avatar alt={thread.user?.firstName} src={thread.user?.imageFile ? `${import.meta.env.VITE_FILE_PROFILE_URL}${thread.user?.imageFile}` : undefined} />
                    </Link>}
                    title={<Link to={`/guestprofile/${thread.userId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        {thread.user?.firstName}
                    </Link>}
                    subheader={dayjs(thread.createdAt).format(global.datetimeFormat)}
                    className="card-header"
                />
                <CardContent className="card-content">
                    <Typography variant="h6" component="div">
                        {thread.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                        {truncateContent(thread.description, 200)}
                        {thread.description.length > 200 && (
                            <Button onClick={handleToggleContent} className="button">
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
                            className="chip"
                        />
                    )}
                    <Collapse in={newComment[thread.id]?.expanded || false} className="comment-section">
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
                        className="button"
                    >
                        {showComments[thread.id] ? 'Hide Comments' : 'View Comments'}
                    </Button>
                    {showComments[thread.id] && (
                        <Box className="comments-container">
                            {comments[thread.id]?.map((comment, index) => (
                                <Box
                                    key={index}
                                    className="comment"
                                    sx={{mt:2}}
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
                                        className="comment-header"
                                    />
                                    <Divider className="comment-divider" />
                                    <Typography
                                        variant="body1"
                                        color="text.primary"
                                        sx={{mt:2}}
                                    >
                                        {comment.description}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                        <Tooltip title="Like">
                                            <IconButton className="icon-button">
                                                <FavoriteBorderIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Reply">
                                            <IconButton className="icon-button">
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
                            className="icon-button"
                        >
                            <MoodIcon />
                            {thread.upvote}
                        </IconButton>
                        <IconButton
                            aria-label="dislike"
                            onClick={() => handleVote(thread.id, 'downvote')}
                            disabled={userVotes[thread.id] === 'downvote'}
                            className="icon-button"
                        >
                            <MoodBadIcon />
                            {thread.downvote}
                        </IconButton>
                        <IconButton
                            aria-label="comment"
                            onClick={() => onCommentClick(thread.id)}
                            className="icon-button"
                        >
                            <CommentIcon />
                            {thread.comments?.length || 0}
                        </IconButton>
                        <IconButton
                            color={bookmarkedThreads.includes(thread.id) ? 'primary' : 'default'}
                            aria-label="bookmark"
                            onClick={() => onBookmarkToggle(thread.id)}
                            className="icon-button"
                        >
                            {bookmarkedThreads.includes(thread.id) ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                        </IconButton>
                        <IconButton
                            onClick={handleReportButtonClick}
                            className="icon-button"
                        >
                            <ReportGmailerrorredIcon />
                        </IconButton>
                    </Box>
                    {user && user.id === thread.userId && (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton aria-label="delete" onClick={() => onDeleteClick(thread.id)} className="icon-button">
                                <DeleteIcon />
                            </IconButton>
                            <Link to={`/editthread/${thread.id}`}>
                                <IconButton aria-label="edit" className="icon-button">
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
