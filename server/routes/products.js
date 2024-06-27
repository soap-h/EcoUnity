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
        prod_desc: yup.string().trim().min(3).max(500).required(),
        prod_img: yup.string().trim().required(),
        prod_price: yup.number().integer().positive().required(),
        prod_stock: yup.number().integer().positive().required()
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
            attributes: ['id', 'prod_name', 'prod_desc', 'prod_img', 'prod_price', 'prod_stock', 'createdAt', 'prod_rating'] 
        });
        res.json(products);
    } catch (err) {
        console.error("Error fetching products:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.put('/:id', async (req, res) => {
    const productId = req.params.id;
    const { prod_name, prod_desc, prod_price, prod_img, prod_stock } = req.body;

    try {
        // Find the product by ID
        let product = await Product.findByPk(productId);

        if (!product) {
            res.status(404).json({ message: 'Product not found' });
            return;
        }

        // Check if a new image is uploaded
        if (prod_img && prod_img !== product.prod_img) {
            const oldImagePath = path.join(__dirname, '..', 'public', 'uploads', product.prod_img);

            // Update product details
            product.prod_name = prod_name;
            product.prod_desc = prod_desc;
            product.prod_price = prod_price;
            product.prod_img = prod_img;
            product.prod_stock = prod_stock;

            // Save the updated product
            await product.save();

            // Delete the old image file if it exists
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        } else {
            // If no new image is uploaded, only update other details
            product.prod_name = prod_name;
            product.prod_desc = prod_desc;
            product.prod_price = prod_price;
            product.prod_stock = prod_stock;

            // Save the updated product
            await product.save();
        }

        res.json({ message: 'Product updated successfully', product });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Error updating product' });
    }
});



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
// router.get("/", async (req, res) => {
//     let condition = {};
//     let search = req.query.search;
//     if (search) {
//         condition[Op.or] = [
//             { title: { [Op.like]: `%${search}%` } },
//             { description: { [Op.like]: `%${search}%` } }
//         ];
//     }
//     // You can add condition for other columns here
//     // e.g. condition.columnName = value;

//     let list = await Tutorial.findAll({
//         where: condition,
//         order: [['createdAt', 'DESC']],
//         include: { model: User, as: "user", attributes: ['name'] }
//     });
//     res.json(list);
// });


// router.get("/:id", async (req, res) => {
//     try {
//         const product = await Product.findByPk(req.params.id);
//         if (product) {
//             res.json(product);
//         } else {
//             res.status(404).send("Product not found");
//         }
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// router.put("/:id", async (req, res) => {
//     const schema = yup.object().shape({
//         prod_name: yup.string().trim().min(3).max(100),
//         prod_desc: yup.string().trim().min(3),
//         prod_img: yup.string().trim()
//     });

//     try {
//         const validatedData = await schema.validate(req.body, { abortEarly: false });
//         const product = await Product.update(validatedData, {
//             where: { id: req.params.id }
//         });

//         if (product) {
//             res.json({ message: "Product updated successfully" });
//         } else {
//             res.status(404).send("Product not found");
//         }
//     } catch (err) {
//         res.status(400).json({ errors: err.errors });
//     }
// });





// router.delete("/:id", async (req, res) => {
//     try {
//         const result = await Product.destroy({
//             where: { id: req.params.id }
//         });

//         if (result > 0) {
//             res.json({ message: "Product deleted successfully" });
//         } else {
//             res.status(404).send("Product not found");
//         }
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });



// router.get("/", async (req, res) => {
//     let condition = {};
//     let search = req.query.search;
//     if (search) {
//         condition[Op.or] = [
//             { title: { [Op.like]: `%${search}%` } },
//             { description: { [Op.like]: `%${search}%` } }
//         ];
//     }
//     // You can add condition for other columns here
//     // e.g. condition.columnName = value;

//     let list = await Tutorial.findAll({
//         where: condition,
//         order: [['createdAt', 'DESC']],
//         include: { model: User, as: "user", attributes: ['name'] }
//     });
//     res.json(list);
// });

// router.get("/:id", async (req, res) => {
//     let id = req.params.id;
//     let tutorial = await Tutorial.findByPk(id, {
//         include: { model: User, as: "user", attributes: ['name'] }
//     });
//     // Check id not found
//     if (!tutorial) {
//         res.sendStatus(404);
//         return;
//     }
//     res.json(tutorial);
// });

// router.put("/:id", validateToken, async (req, res) => {
//     let id = req.params.id;
//     // Check id not found
//     let tutorial = await Tutorial.findByPk(id);
//     if (!tutorial) {
//         res.sendStatus(404);
//         return;
//     }

//     // Check request user id
//     let userId = req.user.id;
//     if (tutorial.userId != userId) {
//         res.sendStatus(403);
//         return;
//     }

//     let data = req.body;
//     // Validate request body
//     let validationSchema = yup.object({
//         title: yup.string().trim().min(3).max(100),
//         description: yup.string().trim().min(3).max(500)
//     });
//     try {
//         data = await validationSchema.validate(data,
//             { abortEarly: false });

//         let num = await Tutorial.update(data, {
//             where: { id: id }
//         });
//         if (num == 1) {
//             res.json({
//                 message: "Tutorial was updated successfully."
//             });
//         }
//         else {
//             res.status(400).json({
//                 message: `Cannot update tutorial with id ${id}.`
//             });
//         }
//     }
//     catch (err) {
//         res.status(400).json({ errors: err.errors });
//     }
// });

module.exports = router;