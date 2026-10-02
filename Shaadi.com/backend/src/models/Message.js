const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true, trim: true },
  read: { type: Boolean, default: false },
}, { timestamps: true });

// This is the access pattern used when a conversation is opened.
messageSchema.index({ conversationId: 1, createdAt: 1 });
messageSchema.index({ conversationId: 1, senderId: 1, read: 1 });

module.exports = mongoose.model('Message', messageSchema);
