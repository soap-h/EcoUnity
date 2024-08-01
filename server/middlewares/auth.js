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
        next();
    } catch (err) {
        return res.status(403).json({ error: "Invalid token" });

    }
};

// const checkAdmin = (req, res, next) => {
//     if (req.user.role !== 'admin') {
//         return res.status(403).json({ error: "Access denied" });
//     }
//     next();
// };

module.exports = { validateToken };
