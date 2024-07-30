const express = require('express');
const router = express.Router();
const { User, Inbox } = require('../models');
const { Op } = require("sequelize");
const yup = require("yup");
const { validateToken } = require('../middlewares/auth');

router.post("/", validateToken, async (req, res) => {
    let data = req.body;
    let validationSchema = yup.object({
        title: yup.string().trim().min(3).max(100).required(),
        description: yup.string().trim().min(3).max(500).required(),
        date: yup.date().required(),
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

router.get("/", async (req, res) => {
    let condition = {};
    let search = req.query.search;
    if (search) {
        condition[Op.or] = [
            { title: { [Op.like]: `%${search}%` } },
            { description: { [Op.like]: `%${search}%` } },
            { date: { [Op.like]: `%${search}%` } },
            { recipient: { [Op.like]: `%${search}%` } },
        ];
    }

    let list = await Inbox.findAll({
        where: condition,
        order: [["createdAt", "DESC"]]
    });

    res.json(list)
})

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