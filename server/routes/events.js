const express = require('express');
const router = express.Router();
const { User, Event } = require('../models');
const { Op } = require("sequelize");
const yup = require("yup");
const { validateToken } = require('../middlewares/auth');

router.post("/", validateToken, async (req, res) => {
    let data = req.body;

    // Check if req.user is correctly attached
    if (!req.user) {
        return res.status(500).json({ error: "User information is not attached to the request." });
    }
    
    data.userId = req.user.id;
    data.userName = `${req.user.firstName} ${req.user.lastName}`; // Add user name to data

    let validationSchema = yup.object({
        title: yup.string().trim().min(3).max(100).required(),
        date: yup.date().required(),
        timeStart: yup.string().required(),
        timeEnd: yup.string().required(),
        venue: yup.string().trim().min(3).max(100).required(),
        participants: yup.number().required(),
        price: yup.number().required(),
        category: yup.string().trim().min(3).max(100).required(),
        type: yup.string().trim().min(3).max(100).required(),
        details: yup.string().trim().required(),
        registerEndDate: yup.date().required()
    });
    try {
        data = await validationSchema.validate(data, { abortEarly: false });
        let result = await Event.create(data);
        res.json(result);
    }
    catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

router.get("/", async (req, res) => {
    let condition = {};
    let search = req.query.search;
    if (search) {
        condition[Op.or] = [
            { title: { [Op.like]: `%${search}%` } },
            { description: { [Op.like]: `%${search}%` } }
        ];
    }

    let list = await Event.findAll({
        where: condition,
        order: [['createdAt', 'DESC']],
        attributes: ['id', 'title', 'date', 'timeStart', 'userId', 'userName']
        // include: { model: User, as: "user", attributes: ['firstName'] }
    });

    res.json(list);
});

router.get("/:id", async (req, res) => {
    let id = req.params.id;
    let event = await Event.findByPk(id, {
        include: { model: User, as: "user", attributes: ['firstName'] }
    });
    if (!event) {
        res.sendStatus(404);
        return;
    }
    res.json(event);
});

router.put("/:id", async (req, res) => {
    let id = req.params.id;
    let event = await Event.findByPk(id);
    if (!event) {
        res.sendStatus(404);
        return;
    }

    let userId = req.user.id;
    if (event.userId != userId) {
        res.sendStatus(403);
        return;
    }

    let data = req.body;
    let validationSchema = yup.object({
        title: yup.string().trim().min(3).max(100),
        description: yup.string().trim().min(3).max(500)
    });
    try {
        data = await validationSchema.validate(data, { abortEarly: false });

        let num = await Event.update(data, {
            where: { id: id }
        });
        if (num == 1) {
            res.json({
                message: "Event was updated successfully."
            });
        } else {
            res.status(400).json({
                message: `Cannot update event with id ${id}.`
            });
        }
    } catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

router.delete("/:id", validateToken, async (req, res) => {
    let id = req.params.id;
    let event = await Event.findByPk(id);
    if (!event) {
        res.sendStatus(404);
        return;
    }

    let userId = req.user.id;
    if (event.userId != userId) {
        res.sendStatus(403);
        return;
    }

    let num = await Event.destroy({
        where: { id: id }
    });
    if (num == 1) {
        res.json({
            message: "Event was deleted successfully."
        });
    } else {
        res.status(400).json({
            message: `Cannot delete event with id ${id}.`
        });
    }
});

module.exports = router;
