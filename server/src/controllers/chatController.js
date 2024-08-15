// /src/controllers/chatController.js
const chatService = require('../services/chatService');

const handleNewMessage = (socket, io) => {
    socket.on('sendMessage', async (messageData, callback) => {
        try {
            const savedMessage = await chatService.saveMessage(messageData);
            const populatedMessage = await savedMessage.populate('user', 'fullName');
            
            // Emit the new message to all connected clients
            io.emit('newMessage', populatedMessage);

            // Respond to the sender with a success status
            if (callback) {
                callback({ status: 'ok' });
            }
        } catch (error) {
            console.error('Error handling new message:', error);
            if (callback) {
                callback({ status: 'error', message: error.message });
            }
        }
    });
};

const getMessages = async (req, res) => {
    try {
        const messages = await chatService.getAllMessages();
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    handleNewMessage,
    getMessages,
};

