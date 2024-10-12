const Conversation = require('../models/conversation');
const Message = require('../models/message');
const axios = require('axios'); // For sending requests to FastAPI

// Create a new conversation in the database
const createConversationInDB = async (userId, chatProfile) => {
  try {
    // Create the new conversation object without tags
    const newConversation = new Conversation({
      user: userId,
      chat_profile: chatProfile,
      chat_title: 'New Chat'  // Default title
    });

    // Save the conversation to the database
    const savedConversation = await newConversation.save();

    // Return the saved conversation's _id as conversation_id
    return savedConversation._id;

  } catch (error) {
    console.error('Error saving conversation to the database:', error);
    throw new Error('Database operation failed');
  }
};

// Save user's message and prepare for assistant response
const saveUserMessageService = async (conversationId, userId, userMessageContent) => {
  try {
    // Create a new message document for the user's message
    const newMessage = new Message({
      conversation_id: conversationId,
      user: userId,
      user_message: {
        content: userMessageContent,
        timestamp: new Date(),
      },
      message_type: 'text',
      metadata: {
        is_read: false,
        is_deleted: false
      }
    });

    // Save the user message to the database
    const savedMessage = await newMessage.save();

    // Update conversation's last message timestamp and total messages count
    await Conversation.updateOne(
      { _id: conversationId },
      { $set: { last_message_at: new Date() }, $inc: { total_messages: 1 } }
    );

    return savedMessage;
  } catch (error) {
    console.error('Error saving user message:', error);
    throw new Error('Database operation failed');
  }
};

// Get the assistant's response and update the same message document
const getAssistantResponseService = async (conversationId, messageId, userMessage) => {
  try {
    // Send request to FastAPI microservice
    const response = await axios.post('http://localhost:8000/api/assistant-response', {
      conversation_id: conversationId,
      user_message: userMessage,
    });

    const { assistant_message, response_time } = response.data;

    // Update the existing message document with the assistant's response
    const updatedMessage = await Message.findOneAndUpdate(
      { _id: messageId },  // Find the message by its _id
      {
        $set: {
          assistant_message: {
            content: assistant_message,
            timestamp: new Date(),
          },
          response_time: response_time
        }
      },
      { new: true }  // Return the updated document
    );

    return updatedMessage;
  } catch (error) {
    console.error('Error getting assistant response:', error);
    throw new Error('Failed to get assistant response');
  }
};



module.exports = { createConversationInDB, saveUserMessageService, getAssistantResponseService };