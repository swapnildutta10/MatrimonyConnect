const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');

// GET /api/content/success-stories
router.get('/success-stories', contentController.getSuccessStories);

// GET /api/content/pricing-plans
router.get('/pricing-plans', contentController.getPricingPlans);

// GET /api/content/articles
router.get('/articles', contentController.getArticles);

// GET /api/content/dating-tips
router.get('/dating-tips', contentController.getDatingTips);

module.exports = router;