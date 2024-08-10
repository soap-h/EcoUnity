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

// Routes
const productRoute = require('./routes/products');
app.use("/products", productRoute);
const userRoute = require('./routes/user');
app.use("/user", userRoute);
const fileRoute = require('./routes/file');
app.use("/file", fileRoute);
const eventsRoute = require('./routes/events');
app.use("/events", eventsRoute);
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