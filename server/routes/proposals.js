const express = require('express');
const path = require('path');
const router = express.Router();
const { Proposal } = require('../models');
const { proposalUpload } = require('../middlewares/upload'); // Updated to use proposalUpload
const { validateToken } = require('../middlewares/auth');

router.post('/', validateToken, proposalUpload, async (req, res) => {
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

// Express's built-in res.sendFile method
router.get('/download/:filename', (req, res) => {
    const { filename } = req.params;
    const fileLocation = path.join(__dirname, '..', 'public', 'uploads', 'proposals', filename);

    res.sendFile(fileLocation, (err) => {
        if (err) {
            console.error('File send error:', err);
            res.status(500).json({ error: 'File download failed' });
        }
    });
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
