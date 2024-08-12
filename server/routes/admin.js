const express = require('express');
const router = express.Router();
const { validateToken } = require('../middlewares/auth');
// const isAdmin = require('../middlewares/admin');

router.get('/dashboard', validateToken, (req, res) => {
    res.json({ message: "Welcome to the admin dashboard" });
});

module.exports = router;
//