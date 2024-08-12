const yup = require('yup');
const { Purchase, Product } = require('../models'); // Assuming Sequelize models are in a models folder
const express = require('express');
const router = express.Router();

router.post("/", async (req, res) => {

    const { userId, items } = req.body;
    
    console.log("Received POST to /purchase:", req.body);

    // Validation schema for each item
    const itemSchema = yup.object().shape({
        productId: yup.number().required(),
        quantity: yup.number().required(),
        totalPrice: yup.number().required(),
    });

    try {
        // Validate each item in the items array
        for (const item of items) {
            await itemSchema.validate(item);
        }

        // Map each item to a purchase record
        const purchaseRecords = items.map(item => ({
            userId,
            productId: item.productId,
            quantity: item.quantity,
            totalprice: item.totalPrice  // Use totalPrice directly from the frontend
        }));

        // Bulk insert into the database
        await Purchase.bulkCreate(purchaseRecords);
        
        for (const item of items) {
            await Product.increment('prod_sold', {
                by: item.quantity,
                where: { id: item.productId }
            });
        }
        res.status(201).json({ message: 'Purchases recorded successfully' });
    } catch (error) {
        console.error('Error recording purchases:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Check purchase
router.get('/check', async (req, res) => {
    const { userId, productId } = req.query;
    console.log(`Checking purchase for userId: ${userId}, productId: ${productId}`); // Log the parameters
    try {
        const purchase = await Purchase.findOne({ where: { userId, productId } });
        if (purchase) {
            console.log('Found');
            return res.json({ purchased: true });
        } else {
            console.log('Cant find!');
            return res.json({ purchased: false });
        }
    } catch (error) {
        console.error('Error checking purchase:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all purchases tied to a userID
router.get('/', async (req, res) => {
    const { userId, productId } = req.query; // Destructure both userId and productId from query params
    console.log(`Checking purchase for userId: ${userId}${productId ? `, productId: ${productId}` : ''}`); // Log the parameters

    try {   
        const whereCondition = { userId };

        // If productId is provided in the query, add it to the filtering condition
        if (productId) {
            whereCondition.productId = productId;
        }

        // Find all purchases based on the condition
        const purchases = await Purchase.findAll({
            where: { userId: userId },
            include: [
                {
                    model: Product,
                    attributes: ['prod_name', 'prod_img', 'createdAt']
                }
            ]
        });
        


        // Return the found purchases as a JSON response
        res.json(purchases);
        
    } catch (error) {
        console.error('Error checking purchase:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;

