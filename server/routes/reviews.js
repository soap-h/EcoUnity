const express = require('express');
const router = express.Router();
const { Review, User, Product } = require('../models');
const { Op } = require("sequelize");
const { sign } = require('jsonwebtoken');
const { validateToken } = require('../middlewares/auth');
const yup = require("yup");

const updateProductRating = async (productId) => {
    const reviews = await Review.findAll({
        where: { productId: productId },
        attributes: ['rating'],
    });

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(2) : 0;

    await Product.update(
        { prod_rating: averageRating },
        { where: { id: productId } }
    );
};

// Create a new review
router.post('/', validateToken, async (req, res) => {
    const userId = req.user.id; // Assuming user is authenticated and userId is available
    const { productId, rating, comment } = req.body;

    // Validation schema
    const schema = yup.object({
        userId: yup.number().required(),
        productId: yup.number().required(),
        rating: yup.number().min(1).max(5).required(),
        comment: yup.string().trim().max(500),
    });

    try {
        // Validate the incoming request
        await schema.validate({ userId, productId, rating, comment }, { abortEarly: false });

        const existingReview = await Review.findOne({
            where: {
                userId: userId,
                productId: productId,
            },
        });

        if (existingReview) {
            return res.status(400).json({ message: 'You have already submitted a review for this product.' });
        }

        // Create the new review
        const newReview = await Review.create({ userId, productId, rating, comment });

        // Update the product's average rating
        await updateProductRating(productId);

        // Respond with the created review
        res.json(newReview);
    } catch (err) {
        console.error('Error creating review:', err);
        res.status(400).json({ errors: err.errors });
    }
});


// Get all reviews
router.get("/:productId", async (req, res) => {
    const { productId } = req.params;
    try {
        let reviews = await Review.findAll({
            where: { productId: productId }, // Filter by productId
            attributes: ['id', 'userId', 'productId', 'rating', 'comment', 'createdAt'],
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ['firstName', 'lastName', 'imageFile']
                }
            ]
        });
        res.json(reviews);
    } catch (err) {
        console.error("Error fetching reviews:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Check if user has already made a review
router.get("/:productId/check", async (req, res) => {
    const { userId } = req.query;
    const { productId } = req.params; // Correctly access productId from route parameters
    try {
        let reviews = await Review.findOne({where: { productId, userId } });
        if (reviews) {
            let reviewId = reviews.id;
            return res.json({ reviewed: true, reviewId });
        } else {
            return res.json({ reviewed: false });
        }
    } catch (err) {
        console.error("Error checking review submission:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Update a review by ID
router.put("/:id", validateToken, async (req, res) => {
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
router.delete('/:reviewId', validateToken, async (req, res) => {
    const reviewId = req.params.reviewId;

    try {
        // Find the review to get the productId before deletion
        const review = await Review.findByPk(reviewId);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        const productId = review.productId;

        // Delete the review
        await Review.destroy({ where: { id: reviewId } });

        // Update the product's average rating
        await updateProductRating(productId);

        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = router;