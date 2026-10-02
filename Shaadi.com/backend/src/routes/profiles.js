const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { authenticate } = require('../middleware/auth');
const Profile = require('../models/Profile');
const Wishlist = require('../models/Wishlist');
const { demoMemberships } = require('../data/demoStore');

router.get('/', profileController.getAllProfiles);

router.get('/wishlist', authenticate, async (req, res) => {
  try {
    if (!req.isMongoConnected) {
      return res.status(503).json({ error: 'Wishlist storage is unavailable' });
    }

    const wishlist = await Wishlist.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .populate('profileId');
    res.json({ wishlist });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
});

router.put('/membership', authenticate, async (req, res) => {
  try {
    const membership = typeof req.body.membership === 'string' ? req.body.membership.trim() : '';
    const availablePlans = ['Free', 'Milan Plus', 'Milan Premium'];
    if (!availablePlans.includes(membership)) {
      return res.status(400).json({ error: 'Please select a valid membership plan' });
    }

    if (!req.isMongoConnected) {
      // Demo mode — store membership in memory
      demoMemberships[req.userId.toString()] = membership;
      return res.json({
        message: `Membership changed to ${membership}`,
        profile: { membership },
      });
    }

    const profile = await Profile.findOneAndUpdate(
      { userId: req.userId },
      { membership },
      { new: true }
    );
    if (!profile) {
      return res.status(404).json({ error: 'Create your profile before selecting a membership' });
    }

    res.json({ message: `Membership changed to ${membership}`, profile });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update membership' });
  }
});

router.put('/:id/wishlist', authenticate, async (req, res) => {
  try {
    if (!req.isMongoConnected) {
      return res.status(503).json({ error: 'Wishlist storage is unavailable' });
    }

    const profile = await Profile.findById(req.params.id);
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    if (profile.userId.toString() === req.userId.toString()) {
      return res.status(400).json({ error: 'You cannot save your own profile' });
    }

    const existing = await Wishlist.findOne({ userId: req.userId, profileId: profile._id });
    if (existing) {
      await existing.deleteOne();
      return res.json({ shortlisted: false, message: 'Profile removed from wishlist' });
    }

    await Wishlist.create({ userId: req.userId, profileId: profile._id });
    res.status(201).json({ shortlisted: true, message: 'Profile added to wishlist' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update wishlist' });
  }
});

router.get('/:id', profileController.getProfile);

router.post('/', authenticate, profileController.createOrUpdateProfile);

router.put('/:id/interest', authenticate, async (req, res) => {
  try {
    if (!req.isMongoConnected) {
      return res.status(400).json({ error: 'This feature requires MongoDB connection' });
    }

    const profile = await Profile.findById(req.params.id);
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    profile.interestsReceived += 1;
    await profile.save();
    res.json({ message: 'Interest sent successfully', profile });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send interest' });
  }
});

module.exports = router;
