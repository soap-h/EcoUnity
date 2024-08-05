const express = require('express');
const router = express.Router();
const { User, IncidentReporting  } = require('../models');
const { Op } = require("sequelize");
const yup = require("yup");
const { validateToken } = require('../middlewares/auth');

router.post("/", validateToken, async (req, res) => {
    let data = req.body;
    data.userId = req.user.id;
    let validationSchema = yup.object({
        ReportType: yup.string().trim().min(3).max(100).required(),
        ReportDetails: yup.string().trim().min(3).max(500).required(),
        Location: yup.string().trim().min(3).max(100).required(),
    });
    try {
        data = await validationSchema.validate(data,
            { abortEarly: false });
        // Process valid data
        let result = await IncidentReporting.create(data);
        res.json(result);
    }
    catch (err) {
        if (err instanceof yup.ValidationError) {
            return res.status(400).json({ error: err.errors });
        }
        res.status(500).json({ error: err.message });

        
    }
});


router.get("/", async (req, res) => {
    let condition = {};
    let search = req.query.search;
    if (search) {
        condition[Op.or] = [
            { ReportType: { [Op.like]: `%${search}%` } },
        ];
    }
    let list = await IncidentReporting.findAll({
        where: condition,
        order: [['ReportType', 'DESC']],
        include: { model: User, as: "user", attributes: ['firstName','email'] }
    });
    res.json(list);
});

router.get("/:id", async (req, res) => {
    let id = req.params.id;
    let incidentReporting = await IncidentReporting.findByPk(id, {
        include: { model: User, as: "user", attributes: ['firstName','email']}
    });
    if (!incidentReporting) {
        res.sendStatus(404);
        return;
    }
    res.json(incidentReporting);
});

router.put('/:id', validateToken, async (req, res) => {
    const id = req.params.id;
    const status = req.body.status; // Ensure you are extracting the correct field

    console.log('Updating status for ID:', id);
    console.log('New status:', status);

    let incidentReporting = await IncidentReporting.findByPk(id);
    if (!incidentReporting) {
        res.sendStatus(404);
        return;
    }
    // Check request user id
    let userId = req.user.id;
    if (incidentReporting.userId != userId) {
        res.sendStatus(403);
        return;
    }
    let data = req.body;
    let validationSchema = yup.object({
        ReportType: yup.string().trim().min(3).max(100).required(),
        ReportDetails: yup.string().trim().min(3).max(500).required(),
        Location: yup.string().trim().min(3).max(100).required(),

    });

    try {
        await validationSchema.validate({ status }, { abortEarly: false });

        const [updated] = await IncidentReporting.update({ ActionStatus: status }, {
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
    } catch (err) {
        console.error('Validation or update error:', err);
        return res.status(400).json({ errors: err.errors });
    }
});

router.delete("/:id", async (req, res) => {
    let id = req.params.id;
    let num = await IncidentReporting.destroy({
        where: { id: id }
    })
    if (num == 1) {
        res.json({
            message: "Report deleted successfully."
        });
    }
    else {
        res.status(400).json({
            message: `Cannot delete Report with id ${id}.`
        });
    }
});

module.exports = router;