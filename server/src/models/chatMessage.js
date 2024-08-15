// /src/models/ChatMessage.js
const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
    isEdited: { type: Boolean, default: false },
    replyTo: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatMessage' },
    status: { type: String, default: 'delivered' }, 
}, { timestamps: true });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
