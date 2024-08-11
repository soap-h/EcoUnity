const express = require('express');
const router = express.Router();

// Require User, Comment, Thread Models
const  { User, Comment, Thread, CommentLike } = require('../models');

// Validation
const yup = require("yup");

// Get the Operators
const { Op } = require('sequelize');

// Import ValidateToken from auth.js
const { validateToken } = require('../middlewares/auth');


// POST comment to the thread by Thread ID
router.post("/:threadId", validateToken, async (req, res) => {
    const { threadId } = req.params;
    let data = req.body;

    // Convert threadId to integer
    const threadIdInt = parseInt(threadId, 10);

    // Validate if threadId is a valid integer
    if (isNaN(threadIdInt)) {
        return res.status(400).json({
            error: 'Invalid Thread ID'
        });
    }

    // Get the user id from the token
    data.userId = req.user.id;
    data.threadId = threadIdInt;

    // Validate request body
    const validationSchema = yup.object({
        description: yup.string().trim().min(1).max(1000).required(),
        like: yup.number().integer().min(0).default(0),
        dislike: yup.number().integer().min(0).default(0),
        parentId: yup.number().integer().nullable().default(null)
    });

    try {
        // Validate data against the schema
        data = await validationSchema.validate(data, {
            abortEarly: false
        });

        // Check if the thread exists
        const threadExists = await Thread.findByPk(threadIdInt);
        if (!threadExists) {
            return res.status(404).json({
                error: 'Thread not found'
            });
        }

        // If data is valid, create the comment
        const result = await Comment.create(data);

        // Return the created comment along with its ID:
        const createdComment = await Comment.findByPk(result.id);
        res.json(createdComment);
    }
    catch (err) {
        // If invalid data, return validation error
        if (err instanceof yup.ValidationError) {
            return res.status(400).json({
                error: err.errors
            });
        }
        // If any other error, return a generic error
        res.status(500).json({
            error: err.message
        });
    }
});

// POST reply to comment by Parent ID
router.post("/reply/:parentId", validateToken, async (req, res) => {
    const { parentId } = req.params;
    let data = req.body;

    // Convert parentId to integer
    const parentIdInt = parseInt(parentId, 10);

    // Validate if parentId is a valid integer
    if (isNaN(parentIdInt)) {
        return res.status(400).json({
            error: 'Invalid Parent ID'
        });
    }

    try {
        // Retrieve the parent comment to get the associated thread ID
        const parentComment = await Comment.findByPk(parentIdInt);
        if (!parentComment) {
            return res.status(404).json({
                error: 'Parent comment not found'
            });
        }

        // Extract the thread ID from the parent comment
        const threadIdInt = parentComment.threadId;

        // Prepare the data for creating a reply
        const replyData = {
            ...data,
            userId: req.user.id, // From the token
            parentId: parentIdInt, // Reply to this comment
            threadId: threadIdInt // Associated with the same thread as parent comment
        };

        // Validate request body
        const validationSchema = yup.object({
            description: yup.string().trim().min(1).max(1000).required(),
            like: yup.number().integer().min(0).default(0),
            dislike: yup.number().integer().min(0).default(0),
        });

        // Validate and sanitize data
        await validationSchema.validate(replyData, {
            abortEarly: false,
            stripUnknown: true
        });

        // Create the reply
        const result = await Comment.create(replyData);

        // Return the created comment with all relevant fields
        res.json({
            id: result.id,
            description: result.description,
            like: result.like,
            dislike: result.dislike,
            parentId: result.parentId,
            userId: result.userId,
            threadId: result.threadId,
            createdAt: result.createdAt,
            updatedAt: result.updatedAt
        });
    }
    catch (err) {
        if (err instanceof yup.ValidationError) {
            return res.status(400).json({
                error: err.errors
            });
        }
        res.status(500).json({
            error: err.message
        });
    }
});
// GET Comment by Comment ID
router.get("/:commentId", async (req, res) => {
    const { commentId } = req.params;

    // Convert commentId to integer
    const commentIdInt = parseInt(commentId, 10);

    // Validate if commentId is a valid integer
    if (isNaN(commentIdInt)) {
        return res.status(400).json({
            error: 'Invalid Comment ID'
        });
    }

    try {
        // Fetch the comment by its ID
        let comment = await Comment.findByPk(commentIdInt, {
            include: { model: User, as: "user", attributes: ['firstName']}
        });

        // Check if the comment exists
        if (!comment) {
            return res.status(404).json({
                error: 'Comment not found'
            });
        }

        // Return the comment
        // res.json({
        //     id: comment.id,
        //     description: comment.description,
        //     like: comment.like,
        //     dislike: comment.dislike,
        //     parentId: comment.parentId,
        //     userId: comment.userId,
        //     threadId: comment.threadId,
        //     createdAt: comment.createdAt,
        //     updatedAt: comment.updatedAt
        // });
        res.json({comment});
    }
    catch (err) {
        // Handle unexpected errors
        res.status(500).json({
            error: err.message
        });
    }
});



// GET All Comments by Thread ID with Users Who Liked the Comment
router.get("/thread/:threadId", async (req, res) => {
    const { threadId } = req.params;

    // Convert threadId to integer
    const threadIdInt = parseInt(threadId, 10);

    if (isNaN(threadIdInt)) {
        return res.status(400).json({
            error: 'Invalid Thread ID'
        });
    }

    try {
        // Fetch comments with associated users and likes
        const comments = await Comment.findAll({
            where: { threadId: threadIdInt },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['firstName', 'imageFile']
                },
                {
                    model: CommentLike,
                    as: 'likes',
                    attributes: ['userId'] // We only need the userId
                }
            ]
        });

        // Transform comments to include 'likes' as a list of userIds
        const transformedComments = comments.map(comment => {
            return {
                ...comment.toJSON(),
                likes: comment.likes.map(like => like.userId)
            };
        });

        res.json(transformedComments);
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});


// GET Comment with Most Likes by Thread ID with No Parent (Top-Level Comment)
router.get("/thread/most-liked/:threadId", async (req, res) => {
    const { threadId } = req.params;

    // Convert threadId to integer
    const threadIdInt = parseInt(threadId, 10);

    // Validate if threadId is a valid integer
    if (isNaN(threadIdInt)) {
        return res.status(400).json({
            error: 'Invalid Thread ID'
        });
    }

    try {
        // Find the top-level comment with the most likes for the given thread ID
        const comment = await Comment.findOne({
            where: {
                threadId: threadIdInt,
                parentId: null // Ensure it's a top-level comment
            },
            order: [['like', 'DESC']],
            include: { model: User, as: 'user', attributes: ['firstName'] }
        });

        // Check if any comment exists
        if (!comment) {
            return res.status(404).json({
                error: 'No top-level comments found for this thread'
            });
        }

        // Return the comment with the most likes
        res.json({
            id: comment.id,
            description: comment.description,
            like: comment.like,
            dislike: comment.dislike,
            parentId: comment.parentId,
            userId: comment.userId,
            threadId: comment.threadId,
            createdAt: comment.createdAt,
            updatedAt: comment.updatedAt,
            user: comment.user // Include the user info if needed
        });
    }
    catch (err) {
        // Handle unexpected errors
        res.status(500).json({
            error: err.message
        });
    }
});

// GET All Comments by Parent ID
router.get("/parent/:parentId", async (req, res) => {
    const { parentId } = req.params;

    // Convert parentId to integer
    const parentIdInt = parseInt(parentId, 10);

    // Validate if parentId is a valid integer
    if (isNaN(parentIdInt)) {
        return res.status(400).json({
            error: 'Invalid Parent ID'
        });
    }

    try {
        // Fetch all comments with the given parentId
        const comments = await Comment.findAll({
            where: { parentId: parentIdInt },
            include: { model: User, as: 'user', attributes: ['firstName'] }
        });

        // Check if any comments exist
        if (comments.length === 0) {
            return res.status(404).json({
                error: 'No comments found for this parent ID'
            });
        }

        // Return the list of comments
        res.json(comments);
    }
    catch (err) {
        // Handle unexpected errors
        res.status(500).json({
            error: err.message
        });
    }
});

// PUT Update Comment by Comment ID (Only Allows the Creator of the Comment to Update)
router.put("/update/:commentId", validateToken, async (req, res) => {
    const { commentId } = req.params;
    let data = req.body;

    // Convert commentId to integer
    const commentIdInt = parseInt(commentId, 10);

    // Validate if commentId is a valid integer
    if (isNaN(commentIdInt)) {
        return res.status(400).json({
            error: 'Invalid Comment ID'
        });
    }

    try {
        // Fetch the comment by its ID
        const comment = await Comment.findByPk(commentIdInt);
        if (!comment) {
            return res.status(404).json({
                error: 'Comment not found'
            });
        }

        // Validate that the current user is the owner of the comment
        if (comment.userId !== req.user.id) {
            return res.status(403).json({
                error: 'You do not have permission to update this comment'
            });
        }

        // Define the validation schema for updating a comment
        const validationSchema = yup.object({
            description: yup.string().trim().min(1).max(1000).nullable(),
            like: yup.number().integer().min(0).nullable(),
            dislike: yup.number().integer().min(0).nullable(),
            parentId: yup.number().integer().nullable()
        });

        // Validate and sanitize the data
        data = await validationSchema.validate(data, {
            abortEarly: false,
            stripUnknown: true
        });

        // Update the comment with the new data
        await comment.update(data);

        // Return the updated comment
        res.json({
            id: comment.id,
            description: comment.description,
            like: comment.like,
            dislike: comment.dislike,
            parentId: comment.parentId,
            userId: comment.userId,
            threadId: comment.threadId,
            createdAt: comment.createdAt,
            updatedAt: comment.updatedAt
        });
    }
    catch (err) {
        // Handle validation errors
        if (err instanceof yup.ValidationError) {
            return res.status(400).json({
                error: err.errors
            });
        }
        // Handle unexpected errors
        res.status(500).json({
            error: err.message
        });
    }
});

// DELETE Comment by Comment ID
router.delete("/delete/:commentId", validateToken, async (req, res) => {
    const { commentId } = req.params;

    // Convert commentId to integer
    const commentIdInt = parseInt(commentId, 10);

    // Validate if commentId is a valid integer
    if (isNaN(commentIdInt)) {
        return res.status(400).json({
            error: 'Invalid Comment ID'
        });
    }

    try {
        // Fetch the comment by its ID
        const comment = await Comment.findByPk(commentIdInt);
        if (!comment) {
            return res.status(404).json({
                error: 'Comment not found'
            });
        }

        // Validate that the current user is the owner of the comment
        if (comment.userId !== req.user.id) {
            return res.status(403).json({
                error: 'You do not have permission to delete this comment'
            });
        }

        // Delete the comment
        await comment.destroy();

        // Return a success message
        res.json({
            message: 'Comment deleted successfully'
        });
    }
    catch (err) {
        // Handle unexpected errors
        res.status(500).json({
            error: err.message
        });
    }
});







module.exports = router;
 
