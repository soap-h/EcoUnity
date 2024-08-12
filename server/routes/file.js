const express = require('express');
const router = express.Router();
// const { validateToken } = require('../middlewares/auth');
const { upload, threadUpload, slidesUpload, productUpload } = require('../middlewares/upload');
const { User } = require('../models');


router.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.status(400).json(err);
        }
        else if (req.file == undefined) {d
            res.status(400).json({ message: "No file uploaded" });
        }
        else {
            res.json({ filename: req.file.filename });
        }
    })
});

router.post('/upload/profile-pic', (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        } else if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        } else {
            try {
                const user = await User.findByPk(req.user.id); 
                if (!user) {
                    return res.status(404).json({ message: "User not found" });
                }

                user.imageFile = req.file.filename;
                await user.save();

                res.json({ imageFile: user.imageFile });
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
        }
    });
});

router.post('/upload/threadPictures', (req, res) => {
    threadUpload(req, res, (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
        }
        else if (req.file == undefined) {
            res.status(400).json({ message: "No file uploaded "});
        }
        else {
            res.json({
                filename: req.file.filename
            });
        }
    })
});

router.post('/upload/productPictures', productUpload, (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    res.status(200).json({ filename: req.file.filename });
});

module.exports = router;


