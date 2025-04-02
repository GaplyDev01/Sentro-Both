const { supabase } = require('../config/db.config');

/**
 * Prediction model for Supabase
 */
class Prediction {
  /**
   * Get a prediction by ID
   * @param {string} id - Prediction ID
   * @returns {Promise<Object>} Prediction object
   */
  static async findById(id) {
    const { data, error } = await supabase
      .from('predictions')
      .select('*, news_articles(*)')
      .eq('id', id)
      .single();

    if (error) throw error;
    return this.formatPrediction(data);
  }

  /**
   * Find a prediction by news article ID and user ID
   * @param {string} articleId - News article ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Prediction object
   */
  static async findOne({ articleId, userId }) {
    const { data, error } = await supabase
      .from('predictions')
      .select('*, news_articles(*)')
      .eq('news_article_id', articleId)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data ? this.formatPrediction(data) : null;
  }

  /**
   * Get predictions for a user
   * @param {string} userId - User ID
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of predictions
   */
  static async findByUser(userId, options = {}) {
    let query = supabase
      .from('predictions')
      .select('*, news_articles(*)')
      .eq('user_id', userId);

    // Pagination
    if (options.limit) {
      query = query.limit(options.limit);
    }

    if (options.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 20) - 1);
    }

    // Order by created date, newest first
    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) throw error;
    return data.map(prediction => this.formatPrediction(prediction));
  }

  /**
   * Create a new prediction
   * @param {Object} predictionData - Prediction data
   * @returns {Promise<Object>} Created prediction
   */
  static async create(predictionData) {
    const now = new Date();
    
    // Format the impact areas, timeframes, and recommendations as JSON
    const dbPrediction = {
      news_article_id: predictionData.newsArticle,
      user_id: predictionData.user,
      industry: predictionData.industry,
      location: predictionData.location,
      overall_impact: predictionData.overallImpact,
      impact_areas: predictionData.impactAreas,
      timeframes: predictionData.timeframes,
      confidence_level: predictionData.confidenceLevel,
      recommendations: predictionData.recommendations,
      created_at: now,
      updated_at: now,
    };

    const { data, error } = await supabase
      .from('predictions')
      .insert(dbPrediction)
      .select('*, news_articles(*)')
      .single();

    if (error) throw error;
    return this.formatPrediction(data);
  }

  /**
   * Format a prediction from database format to API format
   * @param {Object} dbPrediction - Database prediction object
   * @returns {Object} Formatted prediction
   */
  static formatPrediction(dbPrediction) {
    if (!dbPrediction) return null;

    // Format the prediction
    return {
      id: dbPrediction.id,
      newsArticle: dbPrediction.news_articles ? {
        id: dbPrediction.news_articles.id,
        title: dbPrediction.news_articles.title,
        // Include other relevant news article fields
      } : dbPrediction.news_article_id,
      user: dbPrediction.user_id,
      industry: dbPrediction.industry,
      location: dbPrediction.location,
      overallImpact: dbPrediction.overall_impact,
      impactAreas: dbPrediction.impact_areas,
      timeframes: dbPrediction.timeframes,
      confidenceLevel: dbPrediction.confidence_level,
      recommendations: dbPrediction.recommendations,
      createdAt: dbPrediction.created_at,
      updatedAt: dbPrediction.updated_at,
    };
  }
}

module.exports = Prediction; 