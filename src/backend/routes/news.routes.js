const express = require('express');
const router = express.Router();
const { getNews, getNewsById } = require('../controllers/news.controller');
const { checkSetupComplete } = require('../middlewares/auth.middleware');

// Get curated news for a user
router.get('/', checkSetupComplete, getNews);

// Get specific news article by ID
router.get('/:id', getNewsById);

module.exports = router; 