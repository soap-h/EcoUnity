const express = require('express');
const router = express.Router();
const { User, Event, Registration } = require('../models');
const { Op } = require("sequelize");
const yup = require("yup");
const { validateToken } = require('../middlewares/auth');
const { upload } = require('../middlewares/upload'); // Import the upload middleware

router.post("/", validateToken, upload, async (req, res) => {
    let data = req.body;

    // Check if req.user is correctly attached
    if (!req.user) {
        return res.status(500).json({ error: "User information is not attached to the request." });
    }

    data.userId = req.user.id;
    data.userName = `${req.user.firstName} ${req.user.lastName}`; // Add user name to data

    if (req.file) {
        data.imageFile = req.file.filename; // Save the file name to the imageFile field
    }

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
        attributes: ['id', 'title', 'date', 'participants', 'price', 'category', 'type', 'registerEndDate', 'timeStart', 'timeEnd', 'venue', 'details', 'userId', 'userName', 'imageFile', "registered"]
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

router.put("/:id/register", validateToken, async (req, res) => {
    let eventId = req.params.id;
    let userId = req.user.id;

    try {
        let event = await Event.findByPk(eventId);
        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        if (event.registered >= event.participants) {
            return res.status(400).json({ error: "Event is fully booked" });
        }

        let registration = await Registration.create({ eventId, userId });
        await event.increment('registered', { by: 1 });

        res.json({ message: "Successfully registered for the event" });
    } catch (err) {
        res.status(400).json({ errors: err.message });
    }
});

router.put("/:id", validateToken, upload, async (req, res) => {
    let data = req.body;
    let userId = req.user.id;  // Ensure the user is authenticated
    let eventId = req.params.id;

    let validationSchema = yup.object({
        title: yup.string().trim().min(3).max(100).required(),
        date: yup.date().required(),
        timeStart: yup.string().required(),
        timeEnd: yup.string().required(),
        venue: yup.string().trim().min(3).max(100).required(),
        price: yup.number().required(),
        category: yup.string().trim().min(3).max(100).required(),
        type: yup.string().trim().min(3).max(100).required(),
        details: yup.string().trim().required(),
        registerEndDate: yup.date().required()
    });

    try {
        data = await validationSchema.validate(data, { abortEarly: false });

        let event = await Event.findByPk(eventId);
        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        if (req.file) {
            data.imageFile = req.file.filename; // Update the file name of the uploaded image
        }

        await Event.update(data, { where: { id: eventId, userId } });
        res.json({ message: "Event updated successfully" });
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

router.get('/:id/participants', async (req, res) => {
    try {
        const eventId = req.params.id;
        const registrations = await Registration.findAll({
            where: { eventId },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'firstName', 'lastName'],
                },
            ],
        });
        const participants = registrations.map((registration) => ({
            id: registration.user.id,
            name: `${registration.user.firstName} ${registration.user.lastName}`,
        }));
        res.json(participants);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
