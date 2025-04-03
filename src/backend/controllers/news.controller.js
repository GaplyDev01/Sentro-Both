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

    // Get query parameters with defaults
    const { 
      limit = 10, 
      offset = 0,
      category,
      impact,
      date,
      source,
      search 
    } = req.query;
    
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
    
    // Get news from service
    const news = await newsService.getNews(req.user.businessDetails);
    
    // Apply server-side filtering if additional filters provided
    let filteredNews = [...news];
    
    if (category && category !== 'all') {
      filteredNews = filteredNews.filter(article => 
        article.relevanceCategories.includes(category)
      );
    }
    
    if (impact && impact !== 'all') {
      filteredNews = filteredNews.filter(article => {
        const score = article.impactScore;
        if (impact === 'high') return score >= 80;
        if (impact === 'medium') return score >= 60 && score < 80;
        if (impact === 'low') return score < 60;
        return true;
      });
    }
    
    if (source && source !== 'all') {
      filteredNews = filteredNews.filter(article => 
        article.source.name === source
      );
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredNews = filteredNews.filter(article => 
        article.title.toLowerCase().includes(searchLower) || 
        article.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply pagination
    const total = filteredNews.length;
    const paginatedNews = filteredNews.slice(parsedOffset, parsedOffset + parsedLimit);

    res.status(200).json({
      success: true,
      total,
      count: paginatedNews.length,
      page: Math.floor(parsedOffset / parsedLimit) + 1,
      limit: parsedLimit,
      hasMore: parsedOffset + parsedLimit < total,
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
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'News article ID is required',
      });
    }
    
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