const express = require('express');
const router = express.Router();
const { ReportThread, Thread, User } = require('../models');
const yup = require('yup');
const { validateToken } = require('../middlewares/auth');

// POST a reportThread
router.post("/", validateToken, async (req, res) => {
    let data = req.body;

    // Add the user ID from the token
    data.userId = req.user.id;

    // ValidationSchema
    let validationSchema = yup.object({
        threadId: yup.number().integer().required(),
        problem: yup.string().trim().min(3).max(500).required()
    });

    try {
        data = await validationSchema.validate(data, { abortEarly: false });

        // Create the ReportThread
        let result = await ReportThread.create(data);
        res.status(201).json({
            message: "Report created successfully",
            report: result
        });
    } catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

// GET All reportThreads
router.get("/", validateToken, async (req, res) => {
    try {
        let reports = await ReportThread.findAll({
            include: [
                {
                    model: Thread,
                    as: 'thread',
                    attributes: ['id', 'title', 'category'],  // Thread details
                    include: [
                        {
                            model: User,
                            as: 'user',  // Thread owner
                            attributes: ['firstName', 'lastName', 'imageFile']
                        }
                    ]
                },
                {
                    model: User,
                    as: 'reporter',  // Reporter details
                    attributes: ['firstName', 'lastName', 'imageFile']
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(reports);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET ReportThread by ThreadID
router.get("/thread/:threadId", async (req, res) => {
    const threadId = req.params.threadId;
    try {
        const reports = await ReportThread.findAll({
            where: { threadId: threadId },
            include: [
                {
                    model: Thread,
                    as: 'thread', // Alias used in associations
                    attributes: [
                        'id', 'title', 'category', 'description', 'upvote', 'downvote', 'imageFile', 'createdAt', 'updatedAt'
                    ] // Include all attributes
                },
                {
                    model: User,
                    as: 'reporter', // Alias used in associations
                    attributes: ['firstName', 'lastName', 'imageFile'] // Include attributes for the user who reported
                }
            ]
        });

        if (reports.length === 0) {
            return res.status(404).json({ error: "No reports found for this thread" });
        }

        res.json(reports);
    } catch (err) {
        if (err instanceof yup.ValidationError) {
            return res.status(400).json({ error: err.errors });
        }
        res.status(500).json({ error: err.message });
    }
});


// DELETE reportThread by ReportID (mark as done)
router.delete("/:id", validateToken, async (req, res) => {
    let id = req.params.id;

    try {
        let report = await ReportThread.findByPk(id);
        if (!report) {
            return res.status(404).json({ error: "Report not found" });
        }

        // Check if the user is the owner of the report or an admin
        if (report.userId !== req.user.id && !req.user.isAdmin) {
            return res.sendStatus(403); // Forbidden
        }

        // Delete the report
        await ReportThread.destroy({
            where: { id: id }
        });

        res.json({ message: "Report was deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE reported thread by ThreadID (delete the thread itself)
router.delete("/thread/:threadId", validateToken, async (req, res) => {
    const threadId = req.params.threadId;

    try {
        // Find the thread
        const thread = await Thread.findByPk(threadId);
        if (!thread) {
            return res.status(404).json({ error: "Thread not found" });
        }

        // Check if the user is an admin (assuming only admins can delete threads)
        if (!req.user.isAdmin) {
            return res.sendStatus(403); // Forbidden
        }

        // Delete related reports first
        await ReportThread.destroy({
            where: { threadId: threadId }
        });

        // Delete the thread
        await Thread.destroy({
            where: { id: threadId }
        });

        res.json({ message: "Thread and related reports were deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
