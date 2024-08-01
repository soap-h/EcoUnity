const express = require('express');
const router = express.Router();
const { Bookmark, Thread } = require('../models');
const { validateToken } = require('../middlewares/auth');

// Save a bookmark
router.post('/', validateToken, async (req, res) => {
    try {
        const { threadId } = req.body;
        const userId = req.user.id;

        // Check if the bookmark already exists
        const existingBookmark = await Bookmark.findOne({
            where: { userId, threadId }
        });

        if (existingBookmark) {
            return res.status(400).json({ message: 'Thread already bookmarked' });
        }

        // Create a new bookmark
        const newBookmark = await Bookmark.create({ userId, threadId });
        res.status(201).json(newBookmark);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Retrieve all bookmarks for a user
router.get('/', validateToken, async (req, res) => {
    try {
        const userId = req.user.id;

        // Get all bookmarks for the user
        const bookmarks = await Bookmark.findAll({
            where: { userId },
            include: {
                model: Thread,
                as: 'thread'
            }
        });

        res.json(bookmarks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Remove a bookmark
router.delete('/:threadId', validateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { threadId } = req.params;

        // Find and delete the bookmark
        const numDeleted = await Bookmark.destroy({
            where: { userId, threadId }
        });

        if (numDeleted === 1) {
            res.json({ message: 'Bookmark removed successfully' });
        } else {
            res.status(404).json({ message: 'Bookmark not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
