const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));



// Enable CORS
app.use(cors({
    origin: process.env.CLIENT_URL
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Simple Route
app.get("/", (req, res) => {
    res.send("Welcome to Eco Unity");
});

// STRIPE Payments
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const sendEmail = require('../client/src/contexts/sendEmail.cjs');

const calculateOrderAmount = (items) => {
    return items.reduce((total, item) => {
        return total + item.price * item.quantity;
    }, 0);
};

app.post('/create-payment-intent', async (req, res) => {
    const { items, email } = req.body;
    const amount = calculateOrderAmount(items);

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'sgd', // or your preferred currency
        });

        // Send the response immediately
        res.send({
            clientSecret: paymentIntent.client_secret,
        });

        // Handle email sending separately
        (async () => {
            try {
                await sendEmail({
                    orderNumber: paymentIntent.id,
                    items: items
                }, email);
                console.log('Email sent successfully');
            } catch (err) {
                console.error('Error sending email:', err.message);
            }
        })();

    } catch (err) {
        res.status(500).send({
            error: err.message,
        });
    }
});

// Routes
const productRoute = require('./routes/products');
app.use("/products", productRoute);
const userRoute = require('./routes/user');
app.use("/user", userRoute);
const fileRoute = require('./routes/file');
app.use("/file", fileRoute);
const eventsRoute = require('./routes/events');
app.use("/events", eventsRoute);
const paymentRoute = require('./routes/payment');
app.use('/payment', paymentRoute);
const proposalsRoute = require('./routes/proposals'); 
app.use("/proposals", proposalsRoute); 
const adminRoute = require('./routes/admin')
app.use('/admin', adminRoute);
const trackerRoute = require('./routes/tracker');
app.use("/tracker", trackerRoute)
const activityRoute = require('./routes/activity');
app.use("/activities", activityRoute)
const inboxRoute = require('./routes/inbox');
app.use("/inbox", inboxRoute)
const EventFeedbackRoute = require('./routes/EventFeedback');
app.use("/EventFeedback", EventFeedbackRoute);
const EventParticipantRoute = require('./routes/EventParticipants');
app.use("/EventParticipants", EventParticipantRoute);
const IncidentReportingRoute = require('./routes/IncidentReporting');
app.use("/IncidentReporting", IncidentReportingRoute);

// Forum Routes
// Route for Threads
const threadRoute = require('./routes/thread');
app.use("/thread", threadRoute);
const commentRoute =  require('./routes/comment');
app.use("/comment", commentRoute);
const bookmarkRoute = require('./routes/bookmark');
app.use("/bookmarks", bookmarkRoute);
const reportthreadRoute = require('./routes/reportthread');
app.use("/reportthread", reportthreadRoute);



const db = require('./models');
db.sequelize.sync({ alter: true })
    .then(() => {
        let port = process.env.APP_PORT;
        app.listen(port, () => {
            console.log(`⚡ Server running on http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });
