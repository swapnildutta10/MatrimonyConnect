const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  name: { type: String, required: true, trim: true },
  age: { type: Number, required: true, min: 18, max: 100 },
  gender: { type: String, enum: ['Man', 'Woman'], required: true },
  city: { type: String, required: true, trim: true },
  profession: { type: String, required: true, trim: true },
  education: { type: String, required: true, trim: true },
  religion: { type: String, required: true, trim: true },
  maritalStatus: { type: String, default: 'Never Married' },
  about: { type: String, maxlength: 1000 },
  partnerPreference: { type: String, maxlength: 1000 },
  image: { type: String, default: '' },
  isVerified: { type: Boolean, default: false },
  membership: { type: String, enum: ['Free', 'Milan Plus', 'Milan Premium'], default: 'Free' },
  profileViews: { type: Number, default: 0 },
  interestsReceived: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);