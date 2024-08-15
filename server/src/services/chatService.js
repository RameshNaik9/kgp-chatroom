// /src/services/chatService.js
const ChatMessage = require('../models/ChatMessage');

const saveMessage = async (messageData) => {
    const message = new ChatMessage(messageData);
    await message.save();
    return message;
};

const getAllMessages = async () => {
    return await ChatMessage.find({ isDeleted: false }).populate('user', 'fullName').exec();
};

module.exports = {
    saveMessage,
    getAllMessages,
};
