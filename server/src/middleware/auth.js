// // /src/middleware/auth.js
// const jwt = require('jsonwebtoken');

// const authMiddleware = (req, res, next) => {
//     const authHeader = req.headers.authorization;

//     if (authHeader) {
//         const token = authHeader.split(' ')[1];

//         jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//             if (err) {
//                 return res.status(403).json({ message: 'Forbidden' });
//             }
//             req.user = user;
//             next();
//         });
//     } else {
//         res.status(401).json({ message: 'Unauthorized' });
//     }
// };

// module.exports = authMiddleware;

// /src/middleware/auth.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Check if authorization header is present
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization header is missing or malformed' });
    }

    const token = authHeader.split(' ')[1]; // Extract token

    // Verify the JWT token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }

        // Attach user info to request object for use in other middleware/controllers
        req.user = user;
        next();
    });
};

module.exports = authMiddleware;
