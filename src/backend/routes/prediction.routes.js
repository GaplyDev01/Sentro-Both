const express = require('express');
const router = express.Router();
const { getPrediction, getPredictionHistory } = require('../controllers/prediction.controller');
const { checkSetupComplete } = require('../middlewares/auth.middleware');

// Get user's prediction history
router.get('/history', checkSetupComplete, getPredictionHistory);

// Get prediction for a news article
router.get('/:newsId', checkSetupComplete, getPrediction);

module.exports = router; 