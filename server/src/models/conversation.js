const mongoose = require('mongoose');
const { Schema } = mongoose;

const FeedbackSchema = new Schema({
  rating: { type: Number, min: 1, max: 5 },
  comments: { type: String }
}, { _id: false });

const ConversationSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  started_at: {
    type: Date,
    default: Date.now
  },
  last_message_at: {
    type: Date,
    default: Date.now
  },
  total_messages: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'closed', 'archived'],
    default: 'active'
  },
  tags: [String],
  chat_profile: {
    type: String,
    enum: ['career', 'academics', 'general'],
    default: 'career'
  },
  chat_title: {
    type: String,
    default: 'New Chat',
    required: false
  },
  feedback: FeedbackSchema
}, { timestamps: true });

module.exports = mongoose.model('Conversation', ConversationSchema);
