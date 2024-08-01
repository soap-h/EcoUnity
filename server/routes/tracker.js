const express = require("express");
const router = express.Router();
const { User, Tracker } = require("../models");
const { Op, sequelize, DataTypes } = require("sequelize");
const db = require("../models");  
const { validateToken } = require("../middlewares/auth");


function getStartOfMonth() {
  const date = new Date();
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function getStartOfPreviousMonth() {
  const date = new Date();
  return new Date(date.getFullYear(), date.getMonth() - 1, 1);
}

// Helper function to get the start of the current week (assuming week starts on Sunday)
function getStartOfWeek() {
  const date = new Date();
  const day = date.getDay(); // Get current day number, from 0 (Sunday) to 6 (Saturday)
  const diff = date.getDate() - day; // Adjust to the previous Sunday
  return new Date(date.getFullYear(), date.getMonth(), diff);
}

function getStartOfYear() {
  const date = new Date();
  return new Date(date.getFullYear(), 0, 1);
}

// Route to get aggregated dashboard data
router.get("/dashboard", async (req, res) => {
  try {
    // Total CO2 saved
    const totalCo2Saved = await Tracker.sum('points');

    // Average CO2 saved
    const averageCo2Saved = await Tracker.findAll({
      attributes: [[db.sequelize.fn('AVG', db.sequelize.col('points')), 'averageCo2Saved']]
    });

    // Active users (assuming users with at least one tracker entry are active)
    const activeUsers = await Tracker.count({
      distinct: true,
      col: 'userId'
    });

    // Top activities contributing to CO2 savings
    const topActivities = await Tracker.findAll({
      attributes: ['title', [db.sequelize.fn('SUM', db.sequelize.col('points')), 'totalPoints']],
      group: ['title'],
      order: [[db.sequelize.fn('SUM', db.sequelize.col('points')), 'DESC']],
      limit: 5
    });

    // CO2 saved over time (monthly)
    const co2SavedOverTime = await Tracker.findAll({
      attributes: [
        [db.sequelize.fn('date_format', db.sequelize.col('date'), '%Y-%m'), 'month'],
        [db.sequelize.fn('sum', db.sequelize.col('points')), 'co2Saved']
      ],
      group: [db.sequelize.fn('date_format', db.sequelize.col('date'), '%Y-%m')],
      order: [db.sequelize.fn('date_format', db.sequelize.col('date'), '%Y-%m')]
    });

    res.json({
      totalCo2Saved,
      averageCo2Saved: averageCo2Saved[0].dataValues.averageCo2Saved,
      activeUsers,
      topActivities,
      co2SavedOverTime
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/improvement", validateToken, async (req, res) => {
  const userId = req.user.id;

  const startOfCurrentMonth = getStartOfMonth();
  const startOfPreviousMonth = getStartOfPreviousMonth();

  try {
    const currentMonthSavings = await Tracker.findOne({
      attributes: [[db.sequelize.fn("sum", db.sequelize.col("points")), "totalPoints"]],
      where: {
        userId: userId,
        date: {
          [Op.gte]: startOfCurrentMonth
        }
      }
    });

    const previousMonthSavings = await Tracker.findOne({
      attributes: [[db.sequelize.fn("sum", db.sequelize.col("points")), "totalPoints"]],
      where: {
        userId: userId,
        date: {
          [Op.gte]: startOfPreviousMonth,
          [Op.lt]: startOfCurrentMonth
        }
      }
    });

    const currentMonthPoints = currentMonthSavings.get("totalPoints") || 0;
    const previousMonthPoints = previousMonthSavings.get("totalPoints") || 0;
    const improvement = currentMonthPoints - previousMonthPoints;

    res.json({ improvement });
  } catch (error) {
    console.error("Failed to fetch improvement data:", error);
    res.status(500).json({ error: error.message });
  }
});


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


// Route to get tracker entries from the start of the current month
router.get("/month", async (req, res) => {
  const startOfMonth = getStartOfMonth();
  console.log("Getting data for /month");

  try {
    const trackers = await Tracker.findAll({
      where: {
        createdAt: {
          [Op.gte]: startOfMonth
        }
      },
      order: [["createdAt", "DESC"]],
    });
    res.json(trackers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to get tracker entries from the start of the current week
router.get("/week", async (req, res) => {
  const startOfWeek = getStartOfWeek();
  try {
    const trackers = await Tracker.findAll({
      where: {
        createdAt: {
          [Op.gte]: startOfWeek
        }
      },
      order: [["createdAt", "DESC"]],
    });
    res.json(trackers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/monthly-co2", validateToken, async (req, res) => {
  const userId = req.user.id; 
  try {
    const monthlyCo2 = await db.Tracker.findAll({
      attributes: [
        [db.sequelize.fn('date_format', db.sequelize.col('date'), '%Y-%m'), 'month'],
        [db.sequelize.fn('sum', db.sequelize.col('points')), 'co2Saved']
      ],
      where: {
        userId: userId, // Filtering by user ID
      },  
      group: [db.sequelize.fn('date_format', db.sequelize.col('date'), '%Y-%m')],
      order: [[db.sequelize.fn('date_format', db.sequelize.col('date'), '%Y-%m'), 'ASC']]
    });
    res.json(monthlyCo2);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
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