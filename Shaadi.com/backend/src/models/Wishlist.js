const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  profileId: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile', required: true },
}, { timestamps: true });

// A profile can appear only once in a user's wishlist.
wishlistSchema.index({ userId: 1, profileId: 1 }, { unique: true });
wishlistSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Wishlist', wishlistSchema);
