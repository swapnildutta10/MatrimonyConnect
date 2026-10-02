const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { generateToken, JWT_SECRET } = require('../middleware/auth');

const JWT_EXPIRY = '7d';
const demoUsers = [];

// Register a new user
exports.register = async (req, res) => {
  try {
    const { name, email, password, mobile, profileCreatedFor } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    if (!req.isMongoConnected) {
      // Demo mode — use in-memory
      const existing = demoUsers.find(u => u.email === email.toLowerCase());
      if (existing) {
        return res.status(409).json({ error: 'An account with this email already exists' });
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = {
        _id: new Date().getTime().toString(),
        name,
        email: email.toLowerCase(),
        mobile: mobile || '',
        profileCreatedFor: profileCreatedFor || 'Myself',
        role: 'user',
      };
      demoUsers.push({ ...user, password: hashedPassword });
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
      return res.status(201).json({ token, user });
    }

    // MongoDB mode
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const user = await User.create({ name, email, password, mobile, profileCreatedFor });
    const token = generateToken(user._id);

    res.status(201).json({ token, user });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (!req.isMongoConnected) {
      // Demo mode
      const userRecord = demoUsers.find(u => u.email === email.toLowerCase());
      if (!userRecord) {
        // Fallback: allow demo login with hardcoded credentials
        if (email.toLowerCase() === 'arjun@milan.com' && password === 'password123') {
          const demoUser = {
            _id: 'demo-user-1',
            name: 'Arjun Mehta',
            email: 'arjun@milan.com',
            mobile: '+91 98765 43210',
            role: 'user',
          };
          const token = jwt.sign({ userId: demoUser._id }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
          return res.json({ token, user: demoUser });
        }
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      const isMatch = await bcrypt.compare(password, userRecord.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      const { password: _, ...user } = userRecord;
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
      return res.json({ token, user });
    }

    // MongoDB mode
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user._id);
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
};
