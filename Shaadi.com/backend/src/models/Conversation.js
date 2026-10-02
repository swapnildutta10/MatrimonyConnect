const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
  lastMessage: { type: String, default: '' },
  lastMessageTime: { type: Date },
  lastMessageSender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

conversationSchema.index({ participants: 1, lastMessageTime: -1 });

module.exports = mongoose.model('Conversation', conversationSchema);
