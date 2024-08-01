const express = require('express');
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

// Simple Route
app.get("/", (req, res) => {
    res.send("Welcome to Eco Unity");
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

const db = require('./models');
db.sequelize.sync({ alter: true})
    .then(() => {
        let port = process.env.APP_PORT;
        app.listen(port, () => {
            console.log(`⚡ Sever running on http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });