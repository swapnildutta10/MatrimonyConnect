const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const Profile = require('../models/Profile');
const { authenticate } = require('../middleware/auth');
const { demoMemberships } = require('../data/demoStore');


router.post('/register', authController.register);

router.post('/login', authController.login);


router.get('/me', authenticate, async (req, res) => {
  try {
    if (!req.isMongoConnected) {
      const membership = demoMemberships[req.userId.toString()] || '';
      return res.json({ user: req.user, profile: { membership } });
    }
    const profile = await Profile.findOne({ userId: req.userId });
    res.json({ user: req.user, profile });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});

module.exports = router;
