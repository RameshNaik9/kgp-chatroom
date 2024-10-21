// /src/routes/index.js
const express = require('express');
const authRoutes = require('./authRoutes');
const chatController = require('../controllers/chatController');
const notificationRoutes = require('./notificationRoutes');
const assistantRoutes = require('./assistantRoutes');
const profileRoutes = require('./profileRoutes');  // Add profile routes

const router = express.Router();

// Authentication routes
router.use('/auth', authRoutes);

// Chat message routes
router.get('/messages', chatController.getMessages);

// Push notification subscription routes
router.use('/subscribe', notificationRoutes);

// Assistant chat routes
router.use('/assistant', assistantRoutes);

// User profile routes
router.use('/profile', profileRoutes);

module.exports = router;
