const Prediction = require('../models/prediction.model');
const NewsArticle = require('../models/newsArticle.model');
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
    
    if (!newsId) {
      return res.status(400).json({
        success: false,
        message: 'News article ID is required',
      });
    }
    
    // Check if user has completed setup
    if (!req.user.setupCompleted) {
      return res.status(400).json({
        success: false,
        message: 'Please complete your business profile setup first',
      });
    }
    
    // Check if news article exists
    try {
      const newsArticle = await NewsArticle.findById(newsId);
      if (!newsArticle) {
        return res.status(404).json({
          success: false,
          message: 'News article not found',
        });
      }
    } catch (articleError) {
      console.error('Error fetching news article:', articleError.message);
      return res.status(404).json({
        success: false,
        message: 'Failed to fetch news article',
        error: articleError.message,
      });
    }
    
    // Check if prediction already exists
    try {
      const existingPrediction = await Prediction.findOne({
        articleId: newsId,
        userId: req.user.id,
      });
      
      if (existingPrediction) {
        return res.status(200).json({
          success: true,
          data: existingPrediction,
          cached: true,
        });
      }
    } catch (findError) {
      // It's ok if findOne fails, we'll generate a new prediction
      console.warn('Error checking for existing prediction:', findError.message);
    }
    
    // Generate prediction
    const prediction = await predictionService.generatePrediction(newsId, req.user);
    
    res.status(200).json({
      success: true,
      data: prediction,
      cached: false,
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
    
    // Validate numeric parameters
    const parsedLimit = parseInt(limit);
    const parsedOffset = parseInt(offset);
    
    if (isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 50) {
      return res.status(400).json({
        success: false,
        message: 'Invalid limit parameter. Must be between 1 and 50',
      });
    }
    
    if (isNaN(parsedOffset) || parsedOffset < 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid offset parameter. Must be a non-negative integer',
      });
    }
    
    const predictions = await Prediction.findByUser(userId, {
      limit: parsedLimit,
      offset: parsedOffset,
    });
    
    res.status(200).json({
      success: true,
      count: predictions.length,
      data: predictions,
      page: Math.floor(parsedOffset / parsedLimit) + 1,
      limit: parsedLimit,
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