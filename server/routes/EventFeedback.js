const express = require('express');
const router = express.Router();
const { User, EventFeedback, Registration } = require('../models');
const { Op } = require("sequelize");
const yup = require("yup");
const { validateToken } = require('../middlewares/auth');

router.post("/:id", validateToken, async (req, res) => {
    let data = req.body;
    data.userId = req.user.id;
    data.eventId = req.params.id;
    console.log(data.eventId);
    let validationSchema = yup.object({
        EventName: yup.string().trim().min(3).max(100).required(),
        Improvement: yup.string().trim().min(3).max(500).required(),
        Enjoy: yup.string().trim().min(3).max(100).required(),
        rating: yup.number().min(1).max(10).required(),
        eventId: yup.number().required()
    });
    try {
        data = await validationSchema.validate(data, { abortEarly: false });

        // Create EventFeedback record
        let feedback = await EventFeedback.create(data);

        // Update the Registration record to indicate feedback has been given
        await Registration.update(
            { feedback: 1 }, 
            { 
                where: { 
                    id: data.eventId 
                } 
            }
        );

        res.json(feedback);
    } catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});


router.get("/", async (req, res) => {
    let condition = {};
    let search = req.query.search;
    if (search) {
        condition[Op.or] = [
            { EventName: { [Op.like]: `%${search}%` } },
        ];
    }
    let list = await EventFeedback.findAll({
        where: condition,
        order: [['EventName', 'DESC']],
        include: { model: User, as: "user", attributes: ['firstName', 'email'] }
    });
    res.json(list);
});

router.get("/:id", async (req, res) => {
    let id = req.params.id;
    let eventFeedback = await EventFeedback.findByPk(id, {
        include: { model: User, as: "user", attributes: ['firstName', 'email'] }
    });
    if (!eventFeedback) {
        res.sendStatus(404);
        return;
    }
    res.json(eventFeedback);
});

router.put("/:id", validateToken, async (req, res) => {
    let id = req.params.id;
    
    let eventFeedback = await EventFeedback.findByPk(id);
    if (!eventFeedback) {
        res.sendStatus(404);
        return;
    }
    // Check request user id
    let userId = req.user.id;
    if (eventFeedback.userId != userId) {
        res.sendStatus(403);
        return;
    }
    let data = req.body;
    let validationSchema = yup.object({
        EventName: yup.string().trim().min(3).max(100).required(),
        Improvement: yup.string().trim().min(3).max(500).required(),
        Enjoy: yup.string().trim().min(3).max(100).required(),
        rating: yup.number().min(1).max(10).required()
    });

    try {
        data = await validationSchema.validate(data,
            { abortEarly: false });
        let num = await EventFeedback.update(data, {
            where: { id: id }
        });
        if (num == 1) {
            res.json({
                message: "participant was updated successfully."
            });
        }
        else {
            res.status(400).json({
                message: `Cannot update participant with id ${id}.`
            });
        }
    }
    catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

router.delete("/:id", async (req, res) => {
    let id = req.params.id;
    let num = await EventFeedback.destroy({
        where: { id: id }
    })
    if (num == 1) {
        res.json({
            message: "Tutorial was deleted successfully."
        });
    }
    else {
        res.status(400).json({
            message: `Cannot delete tutorial with id ${id}.`
        });
    }
});

module.exports = router;