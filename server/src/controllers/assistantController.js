const { createConversationInDB } = require('../services/assistantService');
const { saveUserMessageService, getAssistantResponseService } = require('../services/assistantService');
const Conversation = require('../models/conversation');  // Import the Conversation model
const { getConversationMessages } = require('../services/assistantService');
const { getAllConversationsForUserService } = require('../services/assistantService');




// Create a new conversation
const createNewConversation = async (req, res) => {
  try {
    const userId = req.query.userId; // Extract userId from query parameters
    const { chat_profile } = req.body;

    // Input validation
    if (!chat_profile) {
      return res.status(400).json({ message: 'Chat profile is required.' });
    }

    // Validate chat profile
    if (!['Career', 'Academics', 'General'].includes(chat_profile)) {
      return res.status(400).json({ message: 'Invalid chat profile. Use "Career", "Academics", or "General".' });
    }

    // Call the service to create the conversation in the database
    const conversationId = await createConversationInDB(userId, chat_profile);

    // Return the new conversation ID (which is the _id of the document)
    return res.status(201).json({ conversation_id: conversationId });

  } catch (error) {
    console.error('Error creating new conversation:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};


// Send a message in a conversation
// Send a message in a conversation
const sendMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const conversationId = req.params.conversation_id;
    const { user_message } = req.body;

    // Input validation
    if (!user_message || !user_message.content) {
      return res.status(400).json({ message: 'User message content is required.' });
    }

    // Fetch the conversation to get the current chat_title
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Save the user's message in the messages collection
    const savedUserMessage = await saveUserMessageService(conversationId, userId, user_message.content);

    // Send request to the FastAPI microservice to get the assistant's response and potentially the chat_title
    const updatedMessage = await getAssistantResponseService(conversationId, savedUserMessage._id, user_message.content, conversation.chat_profile);

    // Fetch the updated conversation (chat_title will be unchanged if FastAPI returned null)
    const updatedConversation = await Conversation.findById(conversationId);

    // Customize the response to include chat_title and match the expected format
    const response = {
      message_id: updatedMessage._id,
      conversation_id: updatedMessage.conversation_id,
      user: updatedMessage.user,
      chat_title: updatedConversation.chat_title,  // Send the stored chat_title (it won't change if null)
      user_message: {
        content: updatedMessage.user_message.content,
        timestamp: updatedMessage.user_message.timestamp,
        message_type: updatedMessage.message_type
      },
      assistant_response: {
        content: updatedMessage.assistant_response.content,
        timestamp: updatedMessage.assistant_response.timestamp,
        message_type: updatedMessage.message_type
      }
    };

    // Send the formatted response back to the client
    return res.status(201).json(response);

  } catch (error) {
    console.error('Error handling message:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};



const getConversation = async (req, res) => {
    try {
        const { conversation_id } = req.params;

        // Fetch the conversation including the chat_profile and createdAt
        const conversation = await Conversation.findById(conversation_id);
        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        // Fetch all messages for the conversation
        const messages = await getConversationMessages(conversation_id);

        // Format the response to include conversation info and messages
        const formattedMessages = messages.map(message => ({
            message_id: message._id,
            conversation_id: message.conversation_id,
            user: message.user,
            chat_title: conversation.chat_title,
            chat_profile: conversation.chat_profile, // Include chat_profile in the response
            user_message: {
                content: message.user_message.content,
                timestamp: message.user_message.timestamp,
                message_type: message.message_type
            },
            assistant_response: message.assistant_response ? {
                content: message.assistant_response.content,
                timestamp: message.assistant_response.timestamp,
                message_type: message.message_type
            } : null
        }));

        // Include the createdAt field in the response
        return res.status(200).json({
            conversation_id,
            chat_title: conversation.chat_title,
            chat_profile: conversation.chat_profile,
            createdAt: conversation.createdAt, 
            messages: formattedMessages
        });

    } catch (error) {
        console.error('Error fetching conversation messages:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


// Controller to fetch all conversations for a specific user
const getAllConversationsForUser = async (req, res) => {
    try {
        const userId = req.user.id; // Extract userId from the authenticated user (from the token)

        // Call the service to get all conversations
        const conversations = await getAllConversationsForUserService(userId);

        return res.status(200).json(conversations);
    } catch (error) {
        console.error('Error fetching conversations:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

const deleteConversation = async (req, res) => {
    try {
        const { conversation_id } = req.params;

        // Delete the conversation by ID
        const deletedConversation = await Conversation.findByIdAndDelete(conversation_id);

        if (!deletedConversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        return res.status(200).json({ message: 'Conversation deleted successfully' });
    } catch (error) {
        console.error('Error deleting conversation:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { createNewConversation, sendMessage, getConversation,getAllConversationsForUser, deleteConversation };

