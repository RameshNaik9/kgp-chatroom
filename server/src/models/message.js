const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserMessageSchema = new Schema({
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
}, { _id: false });

const AssistantMessageSchema = new Schema({
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
}, { _id: false });

const MetadataSchema = new Schema({
  is_read: { type: Boolean, default: false },
  is_deleted: { type: Boolean, default: false }
}, { _id: false });

const FeedbackSchema = new Schema({
  rating: { type: Number, min: 1, max: 5 },
  comment: { type: String }
}, { _id: false });

const MessageSchema = new Schema({
  message_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
    default: () => new mongoose.Types.ObjectId()
  },
  conversation_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation', 
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  
    required: function() { return !this.assistant_response; }  // Only required if it's a user message
  },
  user_message: UserMessageSchema, 
  assistant_response: AssistantMessageSchema,  
  response_time: { type: String },  
  message_type: {
    type: String,
    enum: ['text', 'image', 'video'],
    default: 'text'
  },
  metadata: MetadataSchema, 
  feedback: FeedbackSchema  
}, { timestamps: true });

module.exports = mongoose.model('Message', MessageSchema);
