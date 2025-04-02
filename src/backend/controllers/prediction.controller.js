const Prediction = require('../models/prediction.model');
const predictionService = require('../services/prediction.service');

/**
 * Generate a prediction for a news article
 * @route GET /api/predictions/:newsId
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @returns {object} Prediction data
 */
const getPrediction = async (req, res) => {
  try {
    const { newsId } = req.params;
    
    // Check if user has completed setup
    if (!req.user.setupCompleted) {
      return res.status(400).json({
        success: false,
        message: 'Please complete your business profile setup first',
      });
    }
    
    // Generate prediction
    const prediction = await predictionService.generatePrediction(newsId, req.user);
    
    res.status(200).json({
      success: true,
      data: prediction,
    });
  } catch (error) {
    console.error('Get prediction error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to generate prediction',
      error: error.message,
    });
  }
};

/**
 * Get user's prediction history
 * @route GET /api/predictions/history
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @returns {object} Array of predictions
 */
const getPredictionHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 10, offset = 0 } = req.query;
    
    const predictions = await Prediction.findByUser(userId, {
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
    
    res.status(200).json({
      success: true,
      count: predictions.length,
      data: predictions,
    });
  } catch (error) {
    console.error('Get prediction history error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch prediction history',
      error: error.message,
    });
  }
};

module.exports = {
  getPrediction,
  getPredictionHistory,
}; 