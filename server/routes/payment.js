// payment.js

const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { sendReceiptEmail } = require('./emailservice');
const { Event } = require('../models'); // Assuming you have an Event model

// Create Checkout Session
router.post('/create-checkout-session', async (req, res) => {
    const { eventTitle, amount, currency, email, eventId } = req.body;

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: currency,
                        product_data: {
                            name: eventTitle,
                        },
                        unit_amount: amount * 100, // Amount in cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            customer_email: email, // Email for the receipt
            metadata: { eventId },  // Add eventId to metadata
            success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.origin}/cancel`,
        });
        res.json({ id: session.id });
    } catch (error) {
        console.error('Error creating Checkout session:', error);
        res.status(500).json({ error: error.message });
    }
});


// // Retrieve Checkout Session Details
// router.get('/checkout-session/:sessionId', async (req, res) => {
//     const { sessionId } = req.params;

//     try {
//         const session = await stripe.checkout.sessions.retrieve(sessionId);
//         res.json(session);
//     } catch (error) {
//         console.error('Error retrieving Checkout session:', error);
//         res.status(500).json({ error: error.message });
//     }
// });

// // Send Receipt Email After Successful Payment
// router.post('/send-receipt', async (req, res) => {
//     const { sessionId } = req.body;

//     try {
//         // Retrieve session information from Stripe
//         const session = await stripe.checkout.sessions.retrieve(sessionId);

//         if (session.payment_status === 'paid') {
//             // Check if display_items exist
//             const items = session.display_items || []; // Fallback to an empty array if undefined

//             // If `display_items` is undefined or not an array, handle the case
//             if (!Array.isArray(items)) {
//                 throw new Error('No items found in session to generate receipt.');
//             }

//             // Send receipt email
//             await sendReceiptEmail({
//                 to: session.customer_email,
//                 subject: 'Your Receipt from EcoUnity',
//                 items: items.map(item => ({
//                     name: item.custom.name,
//                     price: item.amount_total / 100,
//                 })),
//                 totalAmount: session.amount_total / 100,
//                 paymentMethod: `${session.payment_method_types[0].toUpperCase()} - ****`,
//                 receiptNumber: session.id,
//                 datePaid: new Date().toLocaleDateString(),
//             });

//             res.json({ message: 'Receipt sent successfully.' });
//         } else {
//             res.status(400).json({ error: 'Payment not completed.' });
//         }
//     } catch (error) {
//         console.error('Error sending receipt email:', error);
//         res.status(500).json({ error: error.message });
//     }
// });

// Retrieve Checkout Session Details
router.get('/checkout-session/:sessionId', async (req, res) => {
    const { sessionId } = req.params;

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        res.json(session);
    } catch (error) {
        console.error('Error retrieving Checkout session:', error);
        res.status(500).json({ error: error.message });
    }
});

// Send Receipt Email After Successful Payment
router.post('/send-receipt', async (req, res) => {
    const { sessionId } = req.body;

    try {
        // Retrieve session information from Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status === 'paid') {
            // Retrieve event information
            const event = await Event.findByPk(session.metadata.eventId);

            // Send receipt email
            await sendReceiptEmail({
                to: session.customer_email,
                subject: `Receipt for your registration to ${event.title}`,
                items: [{ name: event.title, price: session.amount_total / 100 }],
                totalAmount: session.amount_total / 100,
                paymentMethod: session.payment_method_types[0].toUpperCase(),
                receiptNumber: session.id,
                datePaid: new Date().toLocaleDateString(),
            });

            res.json({ message: 'Receipt sent successfully.' });
        } else {
            res.status(400).json({ error: 'Payment not completed.' });
        }
    } catch (error) {
        console.error('Error sending receipt email:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
