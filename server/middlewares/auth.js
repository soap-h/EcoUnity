const { verify } = require('jsonwebtoken');

const validateToken = (req, res, next) => {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Unauthorized access" });
    }

    try {
        const validToken = verify(token, process.env.APP_SECRET);
        req.user = validToken;
        next();
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

module.exports = { validateToken };
