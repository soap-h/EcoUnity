const express = require('express');
const router = express.Router();

// Require User, Comment, CommentLike Models
const { User, Comment, CommentLike } = require('../models');

// Validation
const yup = require("yup");

// Import ValidateToken from auth.js
const { validateToken } = require('../middlewares/auth');

// POST /comment/:commentId/like - Like a comment
router.post("/:commentId/like", validateToken, async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user.id;

    try {
        // Check if the user has already liked the comment
        const existingLike = await CommentLike.findOne({
            where: {
                commentId: commentId,
                userId: userId
            }
        });

        if (existingLike) {
            return res.status(400).json({ message: 'Comment already liked' });
        }

        // User has not liked the comment, so add a like
        await CommentLike.create({ userId, commentId });
        await Comment.increment('like', { where: { id: commentId } });
        res.json({ message: 'Comment liked' });
    } catch (err) {
        if (err instanceof yup.ValidationError) {
            return res.status(400).json({ error: err.errors });
        }
        res.status(500).json({ error: err.message });
    }
});

// GET /comment/:commentId/like-status - Check if the user has liked the comment
router.get("/:commentId/like-status", validateToken, async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user.id;

    try {
        const like = await CommentLike.findOne({
            where: {
                commentId: commentId,
                userId: userId
            }
        });

        res.json({ liked: !!like });
    } catch (err) {
        if (err instanceof yup.ValidationError) {
            return res.status(400).json({ error: err.errors });
        }
        res.status(500).json({ error: err.message });
    }
});

// DELETE /comment/:commentId/like - Unlike a comment
router.delete("/:commentId/dislike", validateToken, async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user.id;

    try {
        // Find the existing like
        const existingLike = await CommentLike.findOne({
            where: {
                commentId: commentId,
                userId: userId
            }
        });

        if (!existingLike) {
            return res.status(404).json({ message: 'Like not found' });
        }

        // Remove the like
        await existingLike.destroy();
        await Comment.decrement('like', { where: { id: commentId } });
        res.json({ message: 'Like removed' });
    } catch (err) {
        if (err instanceof yup.ValidationError) {
            return res.status(400).json({ error: err.errors });
        }
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
