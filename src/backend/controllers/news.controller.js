const NewsArticle = require('../models/newsArticle.model');
const newsService = require('../services/news.service');

/**
 * Get curated news for a user
 * @route GET /api/news
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @returns {object} Array of news articles
 */
const getNews = async (req, res) => {
  try {
    // Check if user has completed setup
    if (!req.user.setupCompleted) {
      return res.status(400).json({
        success: false,
        message: 'Please complete your business profile setup first',
      });
    }

    const { limit = 10, offset = 0 } = req.query;
    
    // Get news from service
    const news = await newsService.getNews(req.user.businessDetails);
    
    // Apply pagination
    const paginatedNews = news.slice(offset, offset + limit);

    res.status(200).json({
      success: true,
      count: news.length,
      data: paginatedNews,
    });
  } catch (error) {
    console.error('Get news error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch news',
      error: error.message,
    });
  }
};

/**
 * Get a specific news article
 * @route GET /api/news/:id
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @returns {object} News article
 */
const getNewsById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const newsArticle = await NewsArticle.findById(id);
    
    if (!newsArticle) {
      return res.status(404).json({
        success: false,
        message: 'News article not found',
      });
    }

    res.status(200).json({
      success: true,
      data: newsArticle,
    });
  } catch (error) {
    console.error('Get news by ID error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch news article',
      error: error.message,
    });
  }
};

module.exports = {
  getNews,
  getNewsById,
}; 