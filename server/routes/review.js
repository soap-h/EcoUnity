const express = require('express');
const router = express.Router();
const { Review } = require('../models');
const { Op } = require("sequelize");
const yup = require("yup");

// Create a new review
router.post("/", async (req, res) => {
    let data = req.body;
    console.log("Received POST to /reviews:", req.body);

    // Validate request body
    let validationSchema = yup.object({
        userId: yup.number(),
        productId: yup.number().required(),
        rating: yup.number().min(1).max(5).required(),
        comment: yup.string().trim().max(500)
    });

    try {
        data = await validationSchema.validate(data, { abortEarly: false });

        let result = await Review.create(data);
        res.json(result);
    } catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

// Get all reviews
router.get("/", async (req, res) => {
    try {
        let reviews = await Review.findAll({
            order: [['createdAt', 'DESC']],
            attributes: ['id', 'userId', 'productId', 'rating', 'comment']
        });
        res.json(reviews);
    } catch (err) {
        console.error("Error fetching reviews:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Update a review by ID
router.put("/:id", async (req, res) => {
    let id = req.params.id;

    // Check if the review exists
    let review = await Review.findByPk(id);
    if (!review) {
        res.sendStatus(404);
        return;
    }

    let data = req.body;
    // Validate request body
    let validationSchema = yup.object({
        rating: yup.number().min(1).max(5).required(),
        comment: yup.string().trim().max(500)
    });

    try {
        data = await validationSchema.validate(data, { abortEarly: false });

        let num = await Review.update(data, {
            where: { id: id }
        });
        if (num == 1) {
            res.json({
                message: "Review was updated successfully."
            });
        } else {
            res.status(400).json({
                message: `Cannot update review with id ${id}.`
            });
        }
    } catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

// Delete a review by ID
router.delete("/:id", async (req, res) => {
    let id = req.params.id;

    try {
        // Check if the review exists
        let review = await Review.findByPk(id);
        if (!review) {
            res.sendStatus(404);
            return;
        }

        // Delete the review from the database
        let num = await Review.destroy({
            where: { id: id }
        });

        if (num === 1) {
            res.json({
                message: "Review was deleted successfully."
            });
        } else {
            res.status(400).json({
                message: `Cannot delete review with id ${id}.`
            });
        }
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({
            message: 'An error occurred while deleting the review.'
        });
    }
});

module.exports = router;
