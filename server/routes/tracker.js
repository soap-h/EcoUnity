const express = require("express");
const router = express.Router();
const { User, Tracker } = require("../models");
const { Op } = require("sequelize");
const { validateToken } = require("../middlewares/auth");

router.get("/", async (req, res) => {
  let condition = {};
  let search = req.query.search;
  if (search) {
    condition[Op.or] = [
      { title: { [Op.like]: `%${search}%` } },
      { points: { [Op.like]: `%${search}%` } },
      { date: { [Op.like]: `%${search}%` } },
    ];
  }

  let list = await Tracker.findAll({
    where: condition,
    order: [["createdAt", "DESC"]],
  });
  res.json(list);
});

const yup = require("yup");
router.post("/", validateToken, async (req, res) => {
  let data = req.body;
  data.userId = req.user.id;
  // Validate request body
  let validationSchema = yup.object({
    title: yup.string().trim().min(3).max(100).required(),
    points: yup.number().min(1).integer().required(),
    date: yup.date().required(),
  });
  try {
    data = await validationSchema.validate(data, { abortEarly: false });
    // Process valid data
    let result = await Tracker.create(data);
    res.json(result);
  } catch (err) {
    res.status(400).json({ errors: err.errors });
  }
});

router.get("/:id", async (req, res) => {
  let id = req.params.id;
  let tracker = await Tracker.findByPk(id);
  if (!tracker) {
    res.sendStatus(404);
    return;
  }
  res.json(tracker);
});

router.put("/:id", async (req, res) => {
  let id = req.params.id;
  // Check id not found
  let tracker = await Tracker.findByPk(id);
  if (!tracker) {
    res.sendStatus(404);
    return;
  }

  let data = req.body;
  let validationSchema = yup.object({
    title: yup.string().trim().min(3).max(100),
    points: yup.number().min(1).integer().required(),
    date: yup.date().required(),
  });
  try {
    data = await validationSchema.validate(data, { abortEarly: false });
    let num = await Tracker.update(data, {
      where: { id: id },
    });
    if (num == 1) {
      res.json({
        message: "Tracker was updated successfully.",
      });
    } else {
      res.status(400).json({
        message: `Cannot update tracker with id ${id}.`,
      });
    }
  } catch (err) {
    res.status(400).json({ errors: err.errors });
  }
});

router.delete("/:id", async (req, res) => {
  let id = req.params.id;
  let tracker = await Tracker.findByPk(id);
  if (!tracker) {
    res.sendStatus(404);
    return;
  }
  try {
    let num = await Tracker.destroy({
      where: { id: id },
    });
    if (num == 1) {
      res.json({
        message: "Tracker was deleted successfully.",
      });
    } else {
      res.status(400).json({
        message: `Cannot delete tracker with id ${id}.`,
      });
    }
  } catch (err) {
    res.status(400).json({ errors: err.errors });
  }
});

module.exports = router;
