// /src/routes/index.js
const express = require('express');
const authRoutes = require('./authRoutes');
const chatController = require('../controllers/chatController');

const router = express.Router();

router.use('/auth', authRoutes);
router.get('/messages', chatController.getMessages);

module.exports = router;
