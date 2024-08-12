const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User } = require('../models');
const yup = require("yup");
const { sign } = require('jsonwebtoken');
const { validateToken } = require('../middlewares/auth');
const { ppupload } = require('../middlewares/upload');
require('dotenv').config();

router.post("/register", async (req, res) => {
    let data = req.body;
    // Validate request body
    let validationSchema = yup.object({
        firstName: yup.string().trim().min(3).max(50).required()
            .matches(/^[a-zA-Z '-,.]+$/,
                "name only allow letters, spaces and characters: ' - , ."),
        lastName: yup.string().trim().min(3).max(50).required()
            .matches(/^[a-zA-Z '-,.]+$/,
                "name only allow letters, spaces and characters: ' - , ."),
        email: yup.string().trim().lowercase().email().max(50).required(),
        password: yup.string().trim().min(8).max(50).required()
            .matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/,
                "password at least 1 letter and 1 number")
    });
    try {
        data = await validationSchema.validate(data,
            { abortEarly: false });

        // Check email
        let user = await User.findOne({
            where: { email: data.email }
        });
        if (user) {
            res.status(400).json({ message: "Email already exists." });
            return;
        }

        // Hash passowrd
        data.password = await bcrypt.hash(data.password, 10);
        // Create user
        let result = await User.create(data);
        res.json({
            message: `Email ${result.email} was registered successfully.`
        });
    }
    catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

router.post("/login", async (req, res) => {
    let data = req.body;
    // Validate request body
    let validationSchema = yup.object({
        email: yup.string().trim().lowercase().email().max(50).required(),
        password: yup.string().trim().min(8).max(50).required()
    });
    try {
        data = await validationSchema.validate(data,
            { abortEarly: false });

        // Check email and password
        let errorMsg = "Email or password is not correct.";
        let user = await User.findOne({
            where: { email: data.email }
        });
        if (!user) {
            res.status(400).json({ message: errorMsg });
            return;
        }
        let match = await bcrypt.compare(data.password, user.password);
        if (!match) {
            res.status(400).json({ message: errorMsg });
            return;
        }

        // Return user info
        let userInfo = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            description: user.description,
            isAdmin: user.isAdmin,
            imageFile: user.imageFile

        };
        let accessToken = sign(userInfo, process.env.APP_SECRET,
            { expiresIn: process.env.TOKEN_EXPIRES_IN });
        res.json({
            accessToken: accessToken,
            user: userInfo
        });
    }
    catch (err) {
        res.status(400).json({ errors: err.errors });
        return;
    }
});

router.get("/auth", validateToken, async (req, res) => {
    try {
        // Fetch the user from the database using the ID from the token
        let user = await User.findOne({ where: { id: req.user.id } });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Prepare the user info with all necessary fields
        let userInfo = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            description: user.description,
            imageFile: user.imageFile,
            isAdmin: user.isAdmin,
            points: user.points
        };

        res.json({ user: userInfo });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});


router.post('/upload/profile-pic', validateToken, (req, res) => {
    ppupload(req, res, async (err) => {
        if (err) {
            console.error("Upload Error: ", err);
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
                console.error("Database Error: ", error);
                res.status(500).json({ message: error.message });
            }
        }
    });
});

router.put("/description/:id", async (req, res) => {
    let id = req.params.id;
    let user = await User.findByPk(id);
    if (!user) {
        res.sendStatus(404);
        return;
    }

    let data = req.body;
    let validationSchema = yup.object({
        description: yup.string().trim().max(500)
    });
    try {
        data = await validationSchema.validate(data,
            { abortEarly: false }
        );
        let num = await User.update(data, {
            where: { id: id }
        });
        if (num == 1) {
            res.json({
                message: "Description was updated successfully."
            });
        }
        else {
            res.status(400).json({
                message: `Cannot update Description with id ${id}.`
            });
        }
    } catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});


// Get user info for all users
router.get("/userinfo", validateToken, async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'firstName', 'lastName', 'email', 'isAdmin', 'imageFile', 'points']  // Only fetch id and email attributes
        });
        res.json(users);
    } catch (error) {
        console.error("Database Error: ", error);
        res.status(500).json({ message: error.message });
    }
});

router.get("/:id", validateToken, async (req, res) => {
    const userId = req.params.id;  // Get the user ID from the request parameters

    try {
        const user = await User.findOne({
            where: { id: userId },  // Fetch the user with the specified ID
            attributes: ['id', 'firstName', 'lastName', 'email', 'isAdmin', 'imageFile', 'goals', 'description', 'goaltype', 'points']  // Only fetch specified attributes
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error("Database Error: ", error);
        res.status(500).json({ message: error.message });
    }
});

router.put("/admin/:id", validateToken, async (req, res) => {
    const userId = req.params.id;
    const { isAdmin } = req.body;

    // Check if the requesting user is an admin
    const requestingUser = await User.findByPk(req.user.id);
    if (!requestingUser || !requestingUser.isAdmin) {
        return res.status(403).json({ message: "You do not have permission to perform this action." });
    }

    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.isAdmin = isAdmin;
        await user.save();

        res.json({ message: "Admin status updated successfully." });
    } catch (error) {
        console.error("Database Error: ", error);
        res.status(500).json({ message: error.message });
    }
});


router.put("/settracker/:id", validateToken, async (req, res) => {
    let id = req.params.id;
    let user = await User.findByPk(id);
    if (!user) {
        res.sendStatus(404);
        return;
    }

    let data = req.body;
    let validationSchema = yup.object({
        goals: yup.number().min(1).integer().required(),
        goaltype: yup.string().trim().max(500).required()
    });
    try {
        data = await validationSchema.validate(data,
            { abortEarly: false }
        );
        let num = await User.update(data, {
            where: { id: id }
        });
        if (num == 1) {
            res.json({
                message: "Tracker Goal was updated successfully."
            });
        }
        else {
            res.status(400).json({
                message: `Cannot update Goal with id ${id}.`
            });
        }
    } catch (err) {
        res.status(400).json({ errors: err.errors });
    }
})


router.delete("/:id", validateToken, async (req, res) => {
    let id = req.params.id;

    // Find the user to be deleted
    let userToDelete = await User.findByPk(id);
    if (!userToDelete) {
        return res.status(404).json({ message: "User not found" });
    }

    // Check if the requesting user is an admin or if they are deleting their own account
    let requestingUser = await User.findByPk(req.user.id);
    if (!requestingUser) {
        return res.status(404).json({ message: "Requesting user not found" });
    }

    if (requestingUser.id !== userToDelete.id && !requestingUser.isAdmin) {
        return res.status(403).json({ message: "You do not have permission to delete this user" });
    }

    // Delete the user
    try {
        await User.destroy({ where: { id: id } });
        res.json({ message: "User was deleted successfully." });
    } catch (error) {
        console.error("Delete Error: ", error);
        res.status(500).json({ message: "Failed to delete user" });
    }
});

module.exports = router;
