// /src/services/chatService.js
const ChatMessage = require('../models/ChatMessage');

const saveMessage = async (messageData) => {
    const message = new ChatMessage(messageData);
    return await message.save();
};

const getMessageWithPopulation = async (messageId) => {
    return await ChatMessage.findById(messageId)
        .populate('user', 'fullName')
        .populate('replyTo', 'message');
};

const deleteMessage = async (messageId) => {
    return await ChatMessage.findByIdAndDelete(messageId);
};

const editMessage = async (messageId, newMessage) => {
    return await ChatMessage.findByIdAndUpdate(messageId, { message: newMessage, isEdited: true }, { new: true });
};

const getAllMessages = async () => {
    return await ChatMessage.find()
        .populate('user', 'fullName')
        .populate('replyTo', 'message');
};

module.exports = {
    saveMessage,
    getMessageWithPopulation,
    deleteMessage,
    editMessage,
    getAllMessages,
};
