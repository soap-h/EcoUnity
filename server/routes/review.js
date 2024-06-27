const express = require('express');
const router = express.Router();
const fs = require('fs');
const { Product } = require('../models');
const path = require('path');
const { Op } = require("sequelize");
const yup = require("yup");
const { upload } = require('../middlewares/upload');


router.post("/", async (req, res) => {
    let data = req.body;
    console.log("Received POST to /products:", req.body);
    // Validate request body
    let validationSchema = yup.object({
        prod_name: yup.string().trim().min(3).max(100).required(),
        prod_desc: yup.string().trim().min(3).max(500).required()
    });

    try {
        data = await validationSchema.validate(data, { abortEarly: false });
        
        let result = await Product.create(data);
        res.json(result);
    } catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});


router.get("/", async (req, res) => {
    try {
        let products = await Product.findAll({ 
            order: [['createdAt', 'DESC']],
            attributes: ['id', 'prod_name', 'prod_desc', 'prod_img'] 
        });
        res.json(products);
    } catch (err) {
        console.error("Error fetching products:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.put("/:id", async (req, res) => {
    let id = req.params.id;
    // Check id not found
    let product = await Product.findByPk(id);
    if (!product) {
        res.sendStatus(404);
        return;
    }

    let data = req.body;
    // Validate request body
    let validationSchema = yup.object({
        prod_name: yup.string().trim().min(3).max(100).required(),
        prod_desc: yup.string().trim().min(3).max(500).required(),
        prod_img: yup.string().trim().required()
    });

    const imageFileName = product.prod_img;
    const imagePath = path.join(__dirname, '..', 'public', 'uploads', imageFileName);
    if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
    }

    try {
        data = await validationSchema.validate(data,
            { abortEarly: false });

        let num = await Products.update(data, {
            where: { id: id }
        });
        if (num == 1) {
            res.json({
                message: "Product was updated successfully."
            });
        }
        else {
            res.status(400).json({
                message: `Cannot update product with id ${id}.`
            });
        }
    }
    catch (err) {
        res.status(400).json({ errors: err.errors });
    }

})



router.delete("/:id", async (req, res) => {
    let id = req.params.id;

    try {
        // Check if the product exists
        let product = await Product.findByPk(id);
        if (!product) {
            res.sendStatus(404);
            return;
        }

        const imageFileName = product.prod_img;
        const imagePath = path.join(__dirname, '..', 'public', 'uploads', imageFileName);

        // Delete the product from the database
        let num = await Product.destroy({
            where: { id: id }
        });

        if (num === 1) {
            // Delete the image file if it exists
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }

            res.json({
                message: "Product was deleted successfully."
            });
        } else {
            res.status(400).json({
                message: `Cannot delete product with id ${id}.`
            });
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({
            message: 'An error occurred while deleting the product.'
        });
    }
});


module.exports = router;