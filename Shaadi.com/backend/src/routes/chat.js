const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const Profile = require('../models/Profile');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');

// In-memory demo conversations
const demoConversations = [
  {
    _id: 'conv-1',
    participants: ['demo-user-1', 'user-2'],
    lastMessage: 'That sounds wonderful 😊',
    lastMessageTime: new Date(Date.now() - 2 * 60 * 1000),
    lastMessageSender: 'user-2',
  },
  {
    _id: 'conv-2',
    participants: ['demo-user-1', 'user-3'],
    lastMessage: 'I enjoy travelling too.',
    lastMessageTime: new Date(Date.now() - 60 * 60 * 1000),
    lastMessageSender: 'user-3',
  },
  {
    _id: 'conv-3',
    participants: ['demo-user-1', 'user-4'],
    lastMessage: 'Have a great evening!',
    lastMessageTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
    lastMessageSender: 'user-4',
  },
];

const demoMessages = {
  'conv-1': [
    { _id: 'msg-1', conversationId: 'conv-1', senderId: 'user-2', text: 'Hi Arjun! How are you doing?', createdAt: new Date(Date.now() - 10 * 60 * 1000), read: true },
    { _id: 'msg-2', conversationId: 'conv-1', senderId: 'demo-user-1', text: "Hi! I'm doing well. I just finished some work. How about you?", createdAt: new Date(Date.now() - 8 * 60 * 1000), read: true },
    { _id: 'msg-3', conversationId: 'conv-1', senderId: 'user-2', text: "I'm good! I was looking at your profile. You mentioned that you enjoy travelling.", createdAt: new Date(Date.now() - 6 * 60 * 1000), read: true },
    { _id: 'msg-4', conversationId: 'conv-1', senderId: 'demo-user-1', text: 'Yes, especially mountains and quiet places. Sikkim is one of my favourites.', createdAt: new Date(Date.now() - 4 * 60 * 1000), read: true },
    { _id: 'msg-5', conversationId: 'conv-1', senderId: 'user-2', text: 'That sounds wonderful 😊', createdAt: new Date(Date.now() - 2 * 60 * 1000), read: false },
  ],
  'conv-2': [
    { _id: 'msg-6', conversationId: 'conv-2', senderId: 'user-3', text: 'Hey Arjun! I saw your profile.', createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), read: true },
    { _id: 'msg-7', conversationId: 'conv-2', senderId: 'demo-user-1', text: "Hi Ishita! Nice to meet you.", createdAt: new Date(Date.now() - 90 * 60 * 1000), read: true },
    { _id: 'msg-8', conversationId: 'conv-2', senderId: 'user-3', text: 'I enjoy travelling too.', createdAt: new Date(Date.now() - 60 * 60 * 1000), read: false },
  ],
  'conv-3': [
    { _id: 'msg-9', conversationId: 'conv-3', senderId: 'user-4', text: 'It was lovely talking to you!', createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000), read: true },
    { _id: 'msg-10', conversationId: 'conv-3', senderId: 'demo-user-1', text: "Likewise Meera! Let's catch up soon.", createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000), read: true },
    { _id: 'msg-11', conversationId: 'conv-3', senderId: 'user-4', text: 'Have a great evening!', createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), read: false },
  ],
};

const userProfiles = {
  'user-2': { name: 'Ananya Sharma', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80' },
  'user-3': { name: 'Ishita Sen', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
  'user-4': { name: 'Meera Kapoor', image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=300&q=80' },
};

// GET /api/chat/conversations - Get user's conversations
router.get('/conversations', authenticate, async (req, res) => {
  try {
    if (!req.isMongoConnected) {
      const userId = req.userId;
      const conversations = demoConversations
        .filter(c => c.participants.includes(userId))
        .map(c => {
          const otherUserId = c.participants.find(p => p !== userId);
          const otherUser = userProfiles[otherUserId] || { name: 'Unknown', image: '' };
          const msgs = demoMessages[c._id] || [];
          const unreadCount = msgs.filter(m => m.senderId !== userId && !m.read).length;
          return {
            _id: c._id,
            lastMessage: c.lastMessage,
            lastMessageTime: c.lastMessageTime,
            lastMessageSender: c.lastMessageSender,
            otherUser: { _id: otherUserId, name: otherUser.name, email: '', image: otherUser.image },
            unreadCount,
          };
        })
        .sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));

      return res.json({ conversations });
    }

    const conversations = await Conversation.find({ participants: req.userId })
      .populate('participants', 'name email')
      .sort({ lastMessageTime: -1, updatedAt: -1 });

    const enrichedConversations = await Promise.all(conversations.map(async (conv) => {
      const otherParticipant = conv.participants.find(p => p._id.toString() !== req.userId.toString());
      let profileImage = '';
      if (otherParticipant) {
        const profile = await Profile.findOne({ userId: otherParticipant._id });
        profileImage = profile ? profile.image : '';
      }
      const unreadCount = await Message.countDocuments({
        conversationId: conv._id,
        senderId: { $ne: req.userId },
        read: false,
      });
      return {
        _id: conv._id,
        participants: conv.participants,
        lastMessage: conv.lastMessage,
        lastMessageTime: conv.lastMessageTime,
        lastMessageSender: conv.lastMessageSender,
        otherUser: otherParticipant ? { ...otherParticipant.toObject(), image: profileImage } : null,
        unreadCount,
      };
    }));

    res.json({ conversations: enrichedConversations });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

// GET /api/chat/conversations/:id/messages - Get messages for a conversation
router.get('/conversations/:id/messages', authenticate, async (req, res) => {
  try {
    if (!req.isMongoConnected) {
      const messages = demoMessages[req.params.id] || [];
      // Mark messages as read
      messages.forEach(m => {
        if (m.senderId !== req.userId) m.read = true;
      });
      return res.json({ messages });
    }

    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    if (!conversation.participants.some(p => p.toString() === req.userId.toString())) {
      return res.status(403).json({ error: 'Not a participant of this conversation' });
    }

    const messages = await Message.find({ conversationId: req.params.id })
      .sort({ createdAt: 1 })
      .populate('senderId', 'name email');

    await Message.updateMany(
      { conversationId: req.params.id, senderId: { $ne: req.userId }, read: false },
      { read: true }
    );

    res.json({ messages });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// POST /api/chat/send - Send a message
router.post('/send', authenticate, async (req, res) => {
  try {
    const receiverId = typeof req.body.receiverId === 'string' ? req.body.receiverId.trim() : '';
    const text = typeof req.body.text === 'string' ? req.body.text.trim() : '';

    if (!receiverId || !text) {
      return res.status(400).json({ error: 'Receiver ID and message text are required' });
    }

    if (text.length > 2000) {
      return res.status(400).json({ error: 'Message text must be 2000 characters or fewer' });
    }

    if (receiverId === req.userId.toString()) {
      return res.status(400).json({ error: 'You cannot send a message to yourself' });
    }

    // Chat messages must be persisted. Never fall back to the in-memory demo
    // store because those messages are lost as soon as the server restarts.
    if (!req.isMongoConnected) {
      return res.status(503).json({ error: 'Chat storage is unavailable. Connect MongoDB and try again.' });
    }

    if (!mongoose.isValidObjectId(receiverId)) {
      return res.status(400).json({ error: 'Receiver ID is invalid' });
    }

    const receiver = await User.exists({ _id: receiverId });
    if (!receiver) {
      return res.status(404).json({ error: 'Receiver not found' });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [req.userId, receiverId], $size: 2 },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.userId, receiverId],
      });
    }

    const message = await Message.create({
      conversationId: conversation._id,
      senderId: req.userId,
      text,
    });

    conversation.lastMessage = text;
    conversation.lastMessageTime = new Date();
    conversation.lastMessageSender = req.userId;
    await conversation.save();

    const populatedMessage = await Message.findById(message._id).populate('senderId', 'name email');
    res.status(201).json({ message: populatedMessage, conversationId: conversation._id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// GET /api/chat/unread-count - Get unread message count
router.get('/unread-count', authenticate, async (req, res) => {
  try {
    if (!req.isMongoConnected) {
      let count = 0;
      const userConversations = demoConversations.filter(c => c.participants.includes(req.userId));
      userConversations.forEach(c => {
        const messages = demoMessages[c._id] || [];
        count += messages.filter(m => m.senderId !== req.userId && !m.read).length;
      });
      return res.json({ unreadCount: count });
    }

    const conversations = await Conversation.find({ participants: req.userId });
    const conversationIds = conversations.map(c => c._id);

    const unreadCount = await Message.countDocuments({
      conversationId: { $in: conversationIds },
      senderId: { $ne: req.userId },
      read: false,
    });

    res.json({ unreadCount });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch unread count' });
  }
});

// GET /api/chat/history - Get chat history with search + pagination
router.get('/history', authenticate, async (req, res) => {
  try {
    const { search, page = 1, limit = 50 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    let allMessages = [];

    // Try to get real data from MongoDB
    let mongoConversations = [];
    if (req.isMongoConnected) {
      mongoConversations = await Conversation.find({ participants: req.userId });
    }
    
    if (mongoConversations.length > 0) {
      // Use MongoDB data
      const conversationIds = mongoConversations.map(c => c._id);
      const filter = { conversationId: { $in: conversationIds } };
      if (search) filter.text = { $regex: search, $options: 'i' };

      const messages = await Message.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('senderId', 'name email');

      for (const msg of messages) {
        const conv = mongoConversations.find(c => c._id.toString() === msg.conversationId.toString());
        const otherUserId = conv ? conv.participants.find(p => p.toString() !== req.userId.toString()) : null;
        let otherUser = null;
        if (otherUserId) {
          const profile = await Profile.findOne({ userId: otherUserId });
          otherUser = { 
            _id: otherUserId, 
            name: msg.senderId._id.toString() === req.userId.toString() ? 'You' : (profile?.name || 'Unknown'),
            image: profile?.image || '',
          };
        }
        allMessages.push({
          _id: msg._id,
          conversationId: msg.conversationId,
          text: msg.text,
          createdAt: msg.createdAt,
          read: msg.read,
          sender: msg.senderId,
          otherUserName: otherUser?.name || 'Unknown',
          otherUserImage: otherUser?.image || '',
        });
      }
    } else {
      // Fallback to demo conversations for any logged-in user
      const userId = 'demo-user-1';
      const userConvs = demoConversations.filter(c => c.participants.includes(userId));
      
      userConvs.forEach(c => {
        const otherUserId = c.participants.find(p => p !== userId);
        const otherUser = userProfiles[otherUserId] || { name: 'Unknown', image: '' };
        const msgs = demoMessages[c._id] || [];
        msgs.forEach(m => {
          const isSentByMe = m.senderId === userId;
          allMessages.push({
            _id: m._id,
            conversationId: c._id,
            text: m.text,
            createdAt: m.createdAt,
            read: m.read,
            sender: isSentByMe 
              ? { name: 'You', _id: userId }
              : { name: otherUser.name, _id: otherUserId, image: otherUser.image },
            otherUserName: otherUser.name,
            otherUserImage: otherUser.image,
          });
        });
      });
    }

    // Text search filter
    if (search) {
      const s = search.toLowerCase();
      allMessages = allMessages.filter(m => 
        m.text.toLowerCase().includes(s) || 
        m.otherUserName.toLowerCase().includes(s)
      );
    }

    // Sort by date descending
    allMessages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const total = allMessages.length;
    const paginatedMessages = allMessages.slice(skip, skip + parseInt(limit));

    // Group by date
    const grouped = {};
    paginatedMessages.forEach(msg => {
      const date = new Date(msg.createdAt).toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      });
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(msg);
    });

    res.json({ history: grouped, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (err) {
    console.error('Chat history error:', err);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
});

// DELETE /api/chat/conversations/:id - Delete a conversation
router.delete('/conversations/:id', authenticate, async (req, res) => {
  try {
    if (!req.isMongoConnected) {
      const idx = demoConversations.findIndex(c => c._id === req.params.id);
      if (idx === -1) return res.status(404).json({ error: 'Conversation not found' });
      demoConversations.splice(idx, 1);
      delete demoMessages[req.params.id];
      return res.json({ message: 'Conversation deleted' });
    }

    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) return res.status(404).json({ error: 'Conversation not found' });
    if (!conversation.participants.some(p => p.toString() === req.userId.toString())) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    await Message.deleteMany({ conversationId: req.params.id });
    await Conversation.findByIdAndDelete(req.params.id);
    res.json({ message: 'Conversation deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete conversation' });
  }
});

module.exports = router;
