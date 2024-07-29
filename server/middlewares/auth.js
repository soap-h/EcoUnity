// const { verify } = require('jsonwebtoken');
// require('dotenv').config();

// const validateToken = (req, res, next) => {
//     try {
//         const accessToken = req.header("Authorization").split(" ")[1];
//         if (!accessToken) {
//             return res.sendStatus(401);
//         }

//         const payload = verify(accessToken, process.env.APP_SECRET);
//         req.user = payload;
//         return next();
//     }
//     catch (err) {
//         return res.sendStatus(401);
//     }
// }

// module.exports = { validateToken };


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
        console.log('Token is valid. User:', req.user);  // Debugging line
        next();
    } catch (err) {
        return res.status(403).json({ error: "Invalid token" });
    }
};

module.exports = { validateToken };
