const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/milan';

// Middleware
app.use(cors());
app.use(express.json());

let isMongoConnected = false;

// MongoDB connection (optional — server runs without it)
mongoose.connect(MONGO_URI)
  .then(() => {
    isMongoConnected = true;
    console.log('✓ Connected to MongoDB');
    console.log('  All features available (auth, profiles, chat)');
  })
  .catch((err) => {
    isMongoConnected = false;
    console.warn('⚠ MongoDB not available — running in demo mode');
    console.warn('  Auth & chat features will use in-memory data');
    console.warn('  To enable full features, install MongoDB or provide MONGO_URI');
  });

// Make DB state available to routes
app.use((req, res, next) => {
  req.isMongoConnected = isMongoConnected;
  next();
});

// API Health
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Backend server is running',
    database: isMongoConnected ? 'connected' : 'disconnected (demo mode)',
  });
});

// API Routes — each handles its own DB dependency
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/profiles', require('./src/routes/profiles'));
app.use('/api/chat', require('./src/routes/chat'));
app.use('/api/content', require('./src/routes/content'));

// Serve static files from the frontend build (production)
const frontendDistPath = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(frontendDistPath));

// For any other route, serve the frontend's index.html (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`\n✓ Milan Backend running on http://localhost:${port}`);
    console.log(`  Serving frontend from: ${frontendDistPath}\n`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`  Port ${port} is in use, trying port ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });
}

startServer(PORT);
