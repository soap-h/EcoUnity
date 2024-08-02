const express = require('express');
const router = express.Router();
const { User, Inbox } = require('../models');
const { Op } = require("sequelize");
const yup = require("yup");
const { validateToken } = require('../middlewares/auth');

router.post("/", validateToken, async (req, res) => {
    let data = req.body;
    data.userId = req.user.id;
    let validationSchema = yup.object({
        title: yup.string().trim().min(3).max(100).required(),
        content: yup.string().trim().min(3).max(500).required(),
        date: yup.date().required(),
        category: yup.string().trim().max(500).required(),
        recipient: yup.string().trim().lowercase().email().max(50).required()
    });
    try {
        data = await validationSchema.validate(data, { abortEarly: false });
        let result = await Inbox.create(data);
        res.json(result);
    } catch (err) {
        res.status(400).json({ errors: err.errors })
    }
})

router.get("/", validateToken, async (req, res) => {
    try {
        // Assuming req.user.id contains the ID of the logged-in user
        const messages = await Inbox.findAll({
            where: {
                recipient: req.user.email  // Assuming 'recipientId' is the field that stores the user ID
            },
            order: [["date", "DESC"]],
        });
        res.json(messages);
    } catch (error) {
        console.error("Failed to fetch messages:", error);
        res.status(500).json({ message: error.message });
    }
});


router.delete("/:id", async (req, res) => {
    let id = req.params.id;
    let inbox = await Inbox.findByPk(id);
    if (!inbox) {
        res.sendStatus(404);
        return;
    }
    try {
        let num = await Inbox.destroy({
            where: { id: id }
        });
        if (num == 1) {
            res.json({
                message: "Tracker was deleted successfully.",
            });
        } else {
            res.status(400).json({
                message: `Cannot delete tracker with id ${id}.`
            });
        }
    } catch (err) {
        res.status(400).json({ errors: err.errors })
    };

});

module.exports = router;