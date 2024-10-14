 // /src/middleware/auth.js

const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // Extract token from either the authorization header or query parameter
    const authHeader = req.headers.authorization;
    const token = authHeader ? authHeader.split(' ')[1] : req.query.token; // Get from header or query

    // Check if the token is present
    if (!token) {
        return handleAuthError(req, res, 'Authorization token is missing');
    }

    // Verify the JWT token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return handleAuthError(req, res, 'Invalid or expired token');
        }

        // Attach user info to request object for use in other middleware/controllers
        req.user = user;
        next();
    });
};

// Handle authorization errors for both SSE and normal requests
const handleAuthError = (req, res, message) => {
    const acceptsSSE = req.headers.accept === 'text/event-stream';

    if (acceptsSSE) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders();

        res.write('event: error\n');
        res.write(`data: ${message}\n\n`);
        res.end();
    } else {
        res.status(401).json({ message });
    }
};

module.exports = authMiddleware;
