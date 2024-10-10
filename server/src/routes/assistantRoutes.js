const express = require('express');
const { createNewConversation } = require('../controllers/assistantController');
const authMiddleware = require('../middleware/auth');
const { sendMessage } = require('../controllers/assistantController');


const router = express.Router();

// POST route to create a new conversation
router.post('/new-conversation', authMiddleware, createNewConversation);

// POST route to send a message in a conversation
router.post('/:conversation_id', authMiddleware, sendMessage);

module.exports = router;
