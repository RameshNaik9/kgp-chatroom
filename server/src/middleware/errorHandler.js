// /src/middleware/errorHandler.js
exports.errorHandler = (err, req, res, next) => {
    console.error(err.message);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ error: err.message });
};
