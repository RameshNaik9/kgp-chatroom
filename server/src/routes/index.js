// /src/routes/index.js
const express = require('express');
const authRoutes = require('./authRoutes');
const chatController = require('../controllers/chatController');
const notificationRoutes = require('./notificationRoutes');

const router = express.Router();

// Authentication routes
router.use('/auth', authRoutes);

// Chat message routes
router.get('/messages', chatController.getMessages);

// Push notification subscription routes
router.use('/subscribe', notificationRoutes);

module.exports = router;
