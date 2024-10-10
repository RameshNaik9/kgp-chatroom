const express = require('express');
const authRoutes = require('./authRoutes');
const chatController = require('../controllers/chatController');
const notificationRoutes = require('./notificationRoutes');
const assistantRoutes = require('./assistantRoutes');  // Import assistantRoutes

const router = express.Router();

// Authentication routes
router.use('/auth', authRoutes);

// Chat message routes
router.get('/messages', chatController.getMessages);

// Push notification subscription routes
router.use('/subscribe', notificationRoutes);

// Assistant chat routes (for new conversation)
router.use('/assistant', assistantRoutes);  // Prefix assistant routes with /assistant

module.exports = router;
