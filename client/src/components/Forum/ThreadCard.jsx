import React, { useState, useEffect, useContext } from 'react';
import {
    Card, CardContent, CardHeader, Avatar, Typography, IconButton, Chip, Button, Collapse, TextField, Divider, Box, Tooltip
} from '@mui/material';
import {
    Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon, Comment as CommentIcon, BookmarkBorder as BookmarkBorderIcon,
    Bookmark as BookmarkIcon, ExpandMore as ExpandMoreIcon, Mood as MoodIcon, MoodBad as MoodBadIcon
} from '@mui/icons-material';
import dayjs from '../../dayjsConfig';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ReplyIcon from '@mui/icons-material/Reply';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import { Link } from 'react-router-dom';
import ReportThreadForm from './ReportThreadForm';
import global from '../../global';
import './ThreadCard.css'; // Import the CSS file
import http from '../../http';
import UserContext from '../../contexts/UserContext';
import CategoryPopup from './CategoryPopup'; // Import the CategoryPopup component
import EnergyPopupPic from '../../assets/nuclear.jpg';
import BiodiversityPopupPic from '../../assets/biodiversityCategoryPic.jpg';
import ConservationPopupPic from '../../assets/zebras.jpg';
import AgriculturePopupPic from '../../assets/farmingLOL.jpg';
import RecyclingPopupPic from '../../assets/recyclingLOL.jpg';
import ClimatePopupPic from '../../assets/meltingIcecaps.jpg';
import lol from '../../assets/discussion.jpg';

const ThreadCard = ({
    thread, onDeleteClick, onBookmarkToggle, onCommentClick, onCommentChange, onCommentSubmit, newComment, bookmarkedThreads, onViewCommentsToggle, truncateContent, getCategoryChipColor,
    showComments, comments, userVotes, handleVote, showFullContent, handleLikeToggle, handleToggleContent, user
}) => {
    const [reportFormOpen, setReportFormOpen] = useState(false);
    const [commentLikes, setCommentLikes] = useState({});
    const [anchorEl, setAnchorEl] = useState(null);
    const [isHovered, setIsHovered] = useState(false); // New state for tracking hover

    const handleReportButtonClick = () => {
        setReportFormOpen(true);
    };

    const handleCloseReportForm = () => {
        setReportFormOpen(false);
    };

    const showThreadUserProfilePic = (picture) => {
        const picUrl = `${import.meta.env.VITE_FILE_PROFILE_URL}${picture}`;
        return picUrl || undefined;
    };

    const User = useContext(UserContext);

    // Fetch comment like statuses
    useEffect(() => {
        const fetchCommentLikes = async () => {
            try {
                const commentsForThread = comments[thread.id] || [];
                const likeStatusPromises = commentsForThread.map(comment =>
                    http.get(`/commentLikes/${comment.id}/like-status`)
                );

                const results = await Promise.all(likeStatusPromises);
                const likesData = {};

                results.forEach((result, index) => {
                    const commentId = commentsForThread[index].id;
                    likesData[commentId] = result.data.liked;
                });

                setCommentLikes(likesData);
            } catch (error) {
                console.error('Error fetching comment like statuses', error);
            }
        };

        fetchCommentLikes();
    }, [comments, thread.id]);

    const handleMouseEnter = (event) => {
        setAnchorEl(event.currentTarget);
        setIsHovered(true); // Set hover state to true
    };

    const handleMouseLeave = () => {
        setIsHovered(false); // Set hover state to false
        setTimeout(() => {
            if (!isHovered) {
                setAnchorEl(null); // Only close if not hovered
            }
        }, 30); // Add a delay to prevent immediate closing
    };

    // Handle popover close on mouse leave
    const handlePopoverClose = (event) => {
        if (anchorEl && !anchorEl.contains(event.relatedTarget)) {
            setAnchorEl(null);
        }
    };

    const categoryDetails = {
        'Energy': {
            description: 'Discussions about renewable energy sources, energy efficiency, and innovations in energy technology.',
            threadCount: Math.floor(Math.random() * 100) + 1,
            picture: EnergyPopupPic
        },
        'Biodiversity': {
            description: 'Topics related to the variety of life on Earth, the importance of biodiversity, and conservation efforts.',
            threadCount: Math.floor(Math.random() * 100) + 1,
            picture: BiodiversityPopupPic
        },
        'Conservation': {
            description: 'Conversations on wildlife conservation, habitat preservation, and sustainable practices to protect nature.',
            threadCount: Math.floor(Math.random() * 100) + 1,
            picture: ConservationPopupPic
        },
        'Agriculture': {
            description: 'Debates on sustainable agriculture practices, organic farming, and the impact of agriculture on the environment.',
            threadCount: Math.floor(Math.random() * 100) + 1,
            picture: AgriculturePopupPic
        },
        'Recycling': {
            description: 'Discussions about recycling practices, waste management, and the benefits of reducing waste.',
            threadCount: Math.floor(Math.random() * 100) + 1,
            picture: RecyclingPopupPic
        },
        'Climate Change': {
            description: 'Topics focusing on climate change causes, effects, and strategies to mitigate its impact on the planet.',
            threadCount: Math.floor(Math.random() * 100) + 1,
            picture: ClimatePopupPic
        },
    };

    const currentCategoryDetails = categoryDetails[thread.category] || {
        description: 'No description available.',
        threadCount: 0,
        picture: lol
    };

    return (
        <>
            <Card key={thread.id} className="thread-card">
                <CardHeader
                    avatar={<Link to={`/guestprofile/${thread.userId}`}>
                        <Avatar alt={thread.user?.firstName} src={showThreadUserProfilePic(thread.user?.imageFile)} />
                    </Link>}
                    title={<Link to={`/guestprofile/${thread.userId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        {thread.user?.firstName}
                    </Link>}
                    subheader={dayjs(thread.createdAt).fromNow()}
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
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
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
                                    sx={{ mt: 2 }}
                                >
                                    <CardHeader
                                        avatar={
                                            <Avatar
                                                alt={comment.user?.firstName}
                                                src={`${import.meta.env.VITE_FILE_PROFILE_URL}${comment.user?.imageFile}`}
                                            />
                                        }
                                        title={comment.user?.firstName}
                                        subheader={dayjs(comment.createdAt).fromNow()}
                                        className="comment-header"
                                    />
                                    <Divider className="comment-divider" />
                                    <Typography
                                        variant="body1"
                                        color="text.primary"
                                        sx={{ mt: 2 }}
                                    >
                                        {comment.description}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                        {user && (
                                            <>
                                                <Tooltip title="Like">
                                                    <IconButton
                                                        className="icon-button"
                                                        onClick={() => handleLikeToggle(thread.id, comment.id)}
                                                    >
                                                        {commentLikes[comment.id] ? (
                                                            <FavoriteIcon color="error" />
                                                        ) : (
                                                            <FavoriteBorderIcon />
                                                        )}
                                                        {comment.like ? comment.like : 0}
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Reply">
                                                    <IconButton className="icon-button">
                                                        <ReplyIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </>
                                        )}
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
                            {thread.commentCount || 0}
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
            <CategoryPopup
                anchorEl={anchorEl}
                handleClose={handleMouseLeave}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handlePopoverClose}
                categoryName={thread.category}
                categoryDescription={currentCategoryDetails.description}
                threadCount={currentCategoryDetails.threadCount}
                picture={currentCategoryDetails.picture}
            />
        </>
    );
};

export default ThreadCard;
