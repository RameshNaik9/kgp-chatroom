const express = require('express');
const { createNewConversation, sendMessage, getConversation, getAllConversationsForUser } = require('../controllers/assistantController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// POST route to create a new conversation
router.post('/new-conversation', authMiddleware, createNewConversation);

// POST route to send a message in a conversation
router.post('/:conversation_id', authMiddleware, sendMessage);

// New route to get a conversation by conversation_id
router.get('/conversation/:conversation_id', authMiddleware, getConversation);

// GET route to fetch all conversations for a specific user
router.get('/conversations', authMiddleware, getAllConversationsForUser);

module.exports = router;
