const express = require('express');
const router = express.Router();
const { Activity } = require('../models')
const { Op } = require("sequelize");
const { validateToken } = require('../middlewares/auth');


router.get("/", async (req, res) => {
    let condition = {};
    let search = req.query.search;
    if (search) {
        condition[Op.or] = [
            { title: { [Op.like]: `%${search}%` } },
            { points: { [Op.like]: `%${search}%` } }
        ];
    }
    // You can add condition for other columns here
    // e.g. condition.columnName = value;
    let list = await Activity.findAll({
        where: condition,
        order: [['createdAt', 'DESC']]
    });
    res.json(list);
});

const yup = require("yup");
router.post("/", async (req, res) => {
    let data = req.body;
    // Validate request body
    let validationSchema = yup.object({
        title: yup.string().trim().min(3).max(100).required(),
        points: yup.number().min(1).integer().required()
    });
    try {
        data = await validationSchema.validate(data,
            { abortEarly: false });
        let activity = await Activity.findOne({
            where: { title: data.title }    
        });
        if (activity) {
            res.status(400).json({message: "Activity already exists. "});
            return;
        }
        // Process valid data
        let result = await Activity.create(data);
        res.json({message: `Activity ${result.title} was created successfully.`});
    }
    catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

router.get("/:id", async (req, res) => {
    let id = req.params.id;
    let activity = await Activity.findByPk(id);
    if (!activity) {
        res.sendStatus(404);
        return;
    }
    res.json(activity);
});

router.put("/:id", async (req, res) => {
    let id = req.params.id;
    // Check id not found
    let activity = await Activity.findByPk(id);
    if (!activity) {
        res.sendStatus(404);
        return;
    }

    let data = req.body;
    let validationSchema = yup.object({
        title: yup.string().trim().min(3).max(100),
        points: yup.number().min(1).integer().required()
    });
    try {
        data = await validationSchema.validate(data,
            { abortEarly: false });
        let activity = await Activity.findOne({
            where: { title: data.title, id: {[Op.ne]: id} }
        });
        if (activity) {
            res.status(400).json({message: "Activity already exists. "});
            return;
        }
        let num = await Activity.update(data, {
            where: { id: id }
        });
        if (num == 1) {
            res.json({
                message: "Activity was updated successfully."
            });
        }
        else {
            res.status(400).json({
                message: `Cannot update Activity with id ${id}.`
            });
        }
    }
    catch (err) {
        res.status(400).json({ errors: err.errors });
    }

});

router.delete("/:id", async (req, res) => {
    let id = req.params.id;
    let activity = await Activity.findByPk(id);
    if (!activity) {
        res.sendStatus(404);
        return;
    }
    try {
        let num = await Activity.destroy({
            where: { id: id }
        })
        if (num == 1) {
            res.json({
                message: "Activity was deleted successfully."
            });
        }
        else {
            res.status(400).json({
                message: `Cannot delete Activity with id ${id}.`
            });
        }
    }
    catch (err) {
        res.status(400).json({ errors: err.errors });
    }

});
module.exports = router;