const express = require('express');
const router = express.Router();
const { EventParticipant } = require('../models');
const { Op } = require("sequelize");
const yup = require("yup");


// Without MySQL
// router.post("/", (req, res) => {
//     let data = req.body;
//     EventParticipantList.push(data);
//     res.json(data);
// });

// WITH MySQL
router.post("/", async (req, res) => {
    let data = req.body;
    let validationSchema = yup.object({
        name: yup.string().trim().min(3).max(100).required(),
        emailAddress: yup.string().trim().min(3).max(500).required(),
        response: yup.string().trim().min(3).max(100).required(),
        reply: yup.string().trim().min(3).max(100).required()
    });
    try {
        data = await validationSchema.validate(data,
            { abortEarly: false });
        // Process valid data
        let result = await EventParticipant.create(data);
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
            { name: { [Op.like]: `%${search}%` } },
            { emailAddress: { [Op.like]: `%${search}%` } }
        ];
    }
    let list = await EventParticipant.findAll({
        order: [['createdAt', 'DESC']]
    });
    res.json(list);
});

router.get("/:id", async (req, res) => {
    let id = req.params.id;
    let eventParticipant = await EventParticipant.findByPk(id);
    if (!eventParticipant) {
        res.sendStatus(404);
        return;
    }
    res.json(eventParticipant);
});

router.put("/:id", async (req, res) => {
    let id = req.params.id;
    let data = req.body;
    let validationSchema = yup.object({
        name: yup.string().trim().min(3).max(100).required(),
        emailAddress: yup.string().trim().min(3).max(500).required(),
        response: yup.string().trim().min(3).max(100).required(),
        reply: yup.string().trim().min(3).max(100).required()
    });

    try {
        data = await validationSchema.validate(data,
            { abortEarly: false });
        let num = await EventParticipant.update(data, {
            where: { id: id }
        });
        if (num == 1) {
            res.json({
                message: "participant was updated successfully."
            });
        }
        else {
            res.status(400).json({
                message: `Cannot update tutorial with id ${id}.`
            });
        }
    }
    catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

router.delete("/:id", async (req, res) => {
    let id = req.params.id;
    let num = await EventParticipant.destroy({
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