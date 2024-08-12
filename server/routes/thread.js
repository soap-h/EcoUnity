const express = require('express');
const router = express.Router();
const { User, Thread, Comment } = require('../models');
const yup = require('yup');
const { validateToken } = require('../middlewares/auth');
const { Op, literal } = require('sequelize');

// GET ALL Public Thread + Search API
router.get("/", async (req, res) => {
    let condition = { isPrivate: 0 };  // Add condition to only include public threads
    let search = req.query.search;
    if (search) {
        condition[Op.or] = [
            { title: { [Op.like]: `%${search}%` } },
            { description: { [Op.like]: `%${search}%` } }
        ];
    }

    try {
        let list = await Thread.findAll({
            where: condition,
            order: [['createdAt', 'DESC']],
            attributes: {
                include: [
                    // Adding a count of associated comments
                    [literal('(SELECT COUNT(*) FROM comments WHERE comments.threadId = Thread.id)'), 'commentCount']
                ]
            },
            include: {
                model: User,
                as: 'user',
                attributes: ['firstName', 'imageFile']
            }
        });
        res.json(list);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching threads' });
    }
});

// Retrieve Public Threads with Common Category
router.get("/:category", async (req, res) => {
    let category = req.params.category;
    let condition = {
        category: category,
        isPrivate: 0  // Add condition to only include public threads
    };

    try {
        let threadList = await Thread.findAll({
            where: condition,
            order: [['createdAt', 'DESC']],  // Optional: if you want to order threads
            attributes: {
                include: [
                    // Adding a count of associated comments
                    [literal('(SELECT COUNT(*) FROM comments WHERE comments.threadId = Thread.id)'), 'commentCount']
                ]
            },
            include: {
                model: User,
                as: 'user',
                attributes: ['firstName', 'imageFile']
            }
        });
        res.status(200).json(threadList);
    } catch (error) {
        res.status(500).json({
            error: "An error occurred while fetching threads."
        });
    }
});


// Creating a Thread + Validation API, pass must include the profanity API
router.post("/", validateToken, async (req, res) => {
    let data = req.body;

    // Add the user ID from the token
    data.userId = req.user.id;

    // ValidationSchema
    let validationSchema = yup.object({
        title: yup.string().trim().min(3).max(500).required(),
        category: yup.string().trim().min(3).max(35).required(),
        description: yup.string().trim().min(3).max(2000).required()
    });

    try {
        data = await validationSchema.validate(data, { abortEarly: false });
        // If the data is valid, create the Thread
        let result = await Thread.create(data);
        res.json(result);
    } catch (err) {
        res.status(400).json({
            errors: err.errors
        });
    }
});

// Retrieve Single Thread by ID
router.get("/id/:id", async (req, res) => {
    let id = req.params.id;
    try {
        // Fetch the thread including user information and count of associated comments
        let thread = await Thread.findByPk(id, {
            attributes: {
                include: [
                    // Adding a count of associated comments
                    [literal('(SELECT COUNT(*) FROM comments WHERE comments.threadId = Thread.id)'), 'commentCount']
                ]
            },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['firstName', 'imageFile'] // Include user information
                }
            ]
        });

        if (!thread) {
            return res.status(404).json({
                error: "Thread not found"
            });
        }

        res.json(thread);
    } catch (err) {
        if (err instanceof yup.ValidationError) {
            return res.status(400).json({ error: err.errors });
        }
        res.status(500).json({ error: err.message });
    }
});

// Retrieve Thread with Vote Counts
// router.get("/id/:id", async (req, res) => {
//     const id = req.params.id;

//     try {
//         // Fetch the thread along with associated user information
//         const thread = await Thread.findByPk(id, {
//             include: [
//                 { model: User, as: 'user', attributes: ['firstName'] }
//             ]
//         });

//         if (!thread) {
//             return res.status(404).json({ error: "Thread not found" });
//         }

//         // Fetch the upvote and downvote counts from the UserVote model
//         const [upvoteCount, downvoteCount] = await Promise.all([
//             UserVote.count({ where: { threadId: id, voteType: 'upvote' } }),
//             UserVote.count({ where: { threadId: id, voteType: 'downvote' } })
//         ]);

//         // Prepare response data
//         const threadData = thread.toJSON();

//         // Add vote counts to the thread data
//         threadData.upvoteCount = upvoteCount;
//         threadData.downvoteCount = downvoteCount;

//         // Respond with thread data and vote counts
//         res.json(threadData);

//     } catch (err){
//         if (err instanceof yup.ValidationError) {
//             return res.status(400).json({ error: err.errors });
//         }
//         res.status(500).json({ error: err.message });
//     }
// });


// Update Thread with Parameter ID + Code to Handle Not Found Error + Code to Validate Input using Yup
router.put("/update/:id", validateToken, async (req, res) => {
    let id = req.params.id;
    let thread = await Thread.findByPk(id);

    if (!thread) {
        res.sendStatus(404);
        return;
    }

    // Check if the user is the owner of the thread
    if (thread.userId !== req.user.id) {
        res.sendStatus(403); // Forbidden
        return;
    }

    let data = req.body;

    let validationSchema = yup.object({
        title: yup.string().trim().min(3).max(500).required(),
        category: yup.string().trim().min(3).max(35).required(),
        description: yup.string().trim().min(3).max(2000).required()
    });

    try {
        data = await validationSchema.validate(data, { abortEarly: false });
        let num = await Thread.update(data, {
            where: { id: id }
        });
        if (num[0] === 1) {
            res.json({
                message: 'Thread was edited successfully'
            });
        } else {
            res.status(400).json({
                message: `Cannot edit thread with thread ID: ${id}`
            });
        }
    } catch (err) {
        if (err instanceof yup.ValidationError) {
            return res.status(400).json({ error: err.errors });
        }
        res.status(500).json({ error: err.message });
    }
});

// Delete Thread + Code to Handle Not Found Error
router.delete("/:id", validateToken, async (req, res) => {
    let id = req.params.id;

    let thread = await Thread.findByPk(id);
    if (!thread) {
        res.sendStatus(404);
        return;
    }

    // Check if the user is the owner of the thread
    if (thread.userId !== req.user.id) {
        res.sendStatus(403); // Forbidden
        return;
    }

    let num = await Thread.destroy({
        where: { id: id }
    });

    if (num === 1) {
        res.json({
            message: "Thread was deleted successfully."
        });
    } else {
        res.status(400).json({
            message: `Cannot delete thread with thread ID ${id}`
        });
    }
});

// Retrieve Threads by User ID
router.get('/user/:userId', validateToken, async (req, res) => {
    try {
        const { userId } = req.params;

        // Validate if the user is authorized to view these threads (uncomment if needed)
        // if (userId !== req.user.id) {
        //     return res.status(403).json({ error: 'Forbidden' });
        // }

        // Find all threads created by the user
        const threads = await Thread.findAll({
            where: { userId },
            attributes: {
                include: [
                    // Adding a count of associated comments
                    [literal('(SELECT COUNT(*) FROM comments WHERE comments.threadId = Thread.id)'), 'commentCount']
                ]
            },
            include: {
                model: User,
                as: 'user',
                attributes: ['firstName', 'imageFile']
            },
            order: [['createdAt', 'DESC']]
        });

        res.json(threads);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Increase Upvote
router.put('/id/:id/upvote/increase', async (req, res) => {
    const id = req.params.id;
    try {
        const thread = await Thread.findByPk(id);
        if (!thread) {
            return res.status(404).json({ error: 'Thread not found' });
        }

        // Increase the upvote count
        thread.upvote += 1;
        await thread.save();

        res.json({ message: 'Upvote increased', upvoteCount: thread.upvote });
    } catch (error) {
        console.error('Error increasing upvote:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Decrease Upvote
router.put('/id/:id/upvote/decrease', async (req, res) => {
    const id = req.params.id;
    try {
        const thread = await Thread.findByPk(id);
        if (!thread) {
            return res.status(404).json({ error: 'Thread not found' });
        }

        // Decrease the upvote count
        if (thread.upvote > 0) {
            thread.upvote -= 1;
            await thread.save();
        }

        res.json({ message: 'Upvote decreased', upvoteCount: thread.upvote });
    } catch (error) {
        console.error('Error decreasing upvote:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Increase Downvote
router.put('/id/:id/downvote/increase', async (req, res) => {
    const id = req.params.id;
    try {
        const thread = await Thread.findByPk(id);
        if (!thread) {
            return res.status(404).json({ error: 'Thread not found' });
        }

        // Increase the downvote count
        thread.downvote += 1;
        await thread.save();

        res.json({ message: 'Downvote increased', downvoteCount: thread.downvote });
    } catch (error) {
        console.error('Error increasing downvote:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Decrease Downvote
router.put('/id/:id/downvote/decrease', async (req, res) => {
    const id = req.params.id;
    try {
        const thread = await Thread.findByPk(id);
        if (!thread) {
            return res.status(404).json({ error: 'Thread not found' });
        }

        // Decrease the downvote count
        if (thread.downvote > 0) {
            thread.downvote -= 1;
            await thread.save();
        }

        res.json({ message: 'Downvote decreased', downvoteCount: thread.downvote });
    } catch (error) {
        console.error('Error decreasing downvote:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST Route to Create a Private Thread
router.post("/private", validateToken, async (req, res) => {
    let data = req.body;

    // Check if the user is an admin
    if (!req.user.isAdmin) {
        return res.status(403).json({ error: 'Only admins can create private threads' });
    }

    // Add the user ID from the token
    data.userId = req.user.id;
    data.isPrivate = true; // Set isPrivate to true for private threads

    // ValidationSchema
    let validationSchema = yup.object({
        title: yup.string().trim().min(3).max(500).required(),
        category: yup.string().trim().min(3).max(35).required(),
        description: yup.string().trim().min(3).max(2000).required()
    });

    try {
        data = await validationSchema.validate(data, { abortEarly: false });
        // If the data is valid, create the Thread
        let result = await Thread.create(data);
        res.json(result);
    } catch (err) {
        res.status(400).json({
            errors: err.errors
        });
    }
});

// GET ALL Private Threads with Search
router.get("/privatethreads/why", validateToken, async (req, res) => {
    // Check if the user is an admin
    if (!req.user.isAdmin) {
        return res.status(403).json({ error: 'Only admins can access private threads' });
    }

    // Set the base condition for private threads
    let condition = { isPrivate: 1 };

    // Get search query from request
    let search = req.query.search;

    if (search) {
        condition[Op.or] = [
            { title: { [Op.like]: `%${search}%` } },
            { description: { [Op.like]: `%${search}%` } }
        ];
    }

    try {
        // Query to find private threads with optional search functionality
        let privateThreads = await Thread.findAll({
            where: condition,
            order: [['createdAt', 'DESC']],
            attributes: {
                include: [
                    // Adding a count of associated comments
                    [literal('(SELECT COUNT(*) FROM comments WHERE comments.threadId = Thread.id)'), 'commentCount']
                ]
            },
            include: {
                model: User,
                as: 'user',
                attributes: ['firstName', 'imageFile']
            }
        });
        res.json(privateThreads);
    } catch (err) {
        // Handle errors
        res.status(500).json({ error: 'An error occurred while fetching private threads' });
    }
});


module.exports = router;
