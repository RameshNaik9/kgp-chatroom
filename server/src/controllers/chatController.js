// /src/controllers/chatController.js
const chatService = require('../services/chatService');

const handleNewMessage = (socket, io) => {
    socket.on('sendMessage', async (messageData, callback) => {
        try {
            const savedMessage = await chatService.saveMessage(messageData);

            // Populate fields
            const populatedMessage = await chatService.getMessageWithPopulation(savedMessage._id);

            // Emit the new message to all connected clients
            io.emit('newMessage', populatedMessage);

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

    socket.on('deleteMessage', async ({ messageId }, callback) => {
        try {
            await chatService.deleteMessage(messageId);
            io.emit('deleteMessage', messageId);

            if (callback) {
                callback({ status: 'ok' });
            }
        } catch (error) {
            console.error('Error deleting message:', error);
            if (callback) {
                callback({ status: 'error', message: error.message });
            }
        }
    });

    socket.on('editMessage', async ({ messageId, newMessage }, callback) => {
        try {
            const updatedMessage = await chatService.editMessage(messageId, newMessage);
            io.emit('editMessage', updatedMessage);

            if (callback) {
                callback({ status: 'ok' });
            }
        } catch (error) {
            console.error('Error editing message:', error);
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

