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
        include: [
        { model: User, as: "user", attributes: ['firstName','email']},
        { model: User, as: "EditNoteUser", attributes: ['firstName','email']},
        ]

    });
    if (!incidentReporting) {
        res.sendStatus(404);
        return;
    }
    res.json(incidentReporting);
});

router.put("/updateStatus/:id", validateToken, async (req, res) => {
    const reportID = req.params.id;
    const { ActionTaken } = req.body;
    const { id } = req.user;

    // Check if the requesting user is an admin
    


    try {
        const report = await IncidentReporting.findByPk(reportID);
        if (!report) {
            return res.status(404).json({ message: "User not found" });
        }

        report.ActionTaken = ActionTaken;
        await report.save();

        res.json({ message: " ActionTaken updated successfully." });
    } catch (error) {
        console.error("Database Error: ", error);
        res.status(500).json({ message: error.message });
    }
});





router.put("/UpdateNote/:id", validateToken, async (req, res) => {
    const id = req.params.id;
    let data = req.body;
    data.EditNoteId = req.user.id;
    // Check id not found
    let incidentReporting = await IncidentReporting.findByPk(id, {
        include: [
        { model: User, as: "user", attributes: ['firstName','email']},
        { model: User, as: "EditNoteUser", attributes: ['firstName','email']},
        ]

    });
    if (!incidentReporting) {
        res.sendStatus(404);
        return;
    }

    // Validate request body
    let validationSchema = yup.object({
        Note: yup.string().trim().min(3).max(100),
        
    });
    try {
        data = await validationSchema.validate(data,
            { abortEarly: false });

        let num = await IncidentReporting.update(data, {
            where: { id: id }
        });
        if (num == 1) {
            res.json({
                message: "Note was updated successfully."
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