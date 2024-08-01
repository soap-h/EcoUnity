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

router.put('/:id/status', validateToken, async (req, res) => {
    const id = req.params.id;

    // Find the incident by primary key
    let incidentReporting = await IncidentReporting.findByPk(id);
    if (!incidentReporting) {
        return res.sendStatus(404); // Not found
    }

    // Check if the requesting user is authorized to update this incident
    const userId = req.user.id;
    if (incidentReporting.userId !== userId) {
        return res.sendStatus(403); // Forbidden
    }
    // Define validation schema for action status
    const validationSchema = yup.object({
        status: yup.string().trim().oneOf(['Pending', 'Approved', 'Rejected']).required(), // Adjust options as needed
    });

    try {
        // Validate the incoming data
        const { status } = await validationSchema.validate(req.body, { abortEarly: false });

        // Update the incident's action status
        const [updated] = await IncidentReporting.update({ ActionStatus: status }, {
            where: { id: id }
        });

        if (updated) {
            return res.json({ message: 'Status updated successfully.' });
        } else {
            return res.status(400).json({ message: `Cannot update status for incident with id ${id}.` });
        }
    } catch (err) {
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