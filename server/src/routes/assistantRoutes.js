const express = require('express');
const { createNewConversation, sendMessage, getConversation } = require('../controllers/assistantController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// POST route to create a new conversation
router.post('/new-conversation', authMiddleware, createNewConversation);

// POST route to send a message in a conversation
router.post('/:conversation_id', authMiddleware, sendMessage);

// New route to get a conversation by conversation_id
router.get('/conversation/:conversation_id', authMiddleware, getConversation);

module.exports = router;
