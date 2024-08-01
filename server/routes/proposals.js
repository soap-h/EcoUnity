// server/routes/proposals.js
const express = require('express');
const router = express.Router();
const { Proposal, User } = require('../models');
const { upload } = require('../middleware/upload');
const { validateToken } = require('../middlewares/auth');

router.post('/', validateToken, upload, async (req, res) => {
    try {
        const { file } = req;
        const proposal = await Proposal.create({
            date: new Date(),
            name: file.originalname,
            document: file.filename,
            userId: req.user.id,
            status: 'Pending'
        });
        res.status(201).json(proposal);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const proposals = await Proposal.findAll();
        res.json(proposals);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id/approve', async (req, res) => {
    try {
        await Proposal.update({ status: 'Approved' }, { where: { id: req.params.id } });
        res.json({ message: 'Proposal approved' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id/reject', async (req, res) => {
    try {
        await Proposal.update({ status: 'Rejected' }, { where: { id: req.params.id } });
        res.json({ message: 'Proposal rejected' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
