const { supabase } = require('../config/db.config');

/**
 * NewsArticle model for Supabase
 */
class NewsArticle {
  /**
   * Get a news article by ID
   * @param {string} id - Article ID
   * @returns {Promise<Object>} News article
   */
  static async findById(id) {
    const { data, error } = await supabase
      .from('news_articles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return this.formatArticle(data);
  }

  /**
   * Get news articles with filters
   * @param {Object} filters - Filter options
   * @returns {Promise<Array>} Array of news articles
   */
  static async findMany(filters = {}) {
    let query = supabase
      .from('news_articles')
      .select('*');

    // Apply filters
    if (filters.relevanceCategories && filters.relevanceCategories.length > 0) {
      // Filter for articles that include any of the relevance categories
      query = query.contains('relevance_categories', filters.relevanceCategories);
    }

    // Sort by date (newest first)
    query = query.order('published_at', { ascending: false });

    // Pagination
    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    if (filters.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 20) - 1);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data.map(article => this.formatArticle(article));
  }

  /**
   * Find or create a news article by URL
   * @param {Object} article - News article data
   * @param {Number} impactScore - Calculated impact score
   * @param {Object} businessDetails - Business details for relevance
   * @returns {Promise<Object>} Saved news article
   */
  static async findOrCreate(article, impactScore, businessDetails) {
    // Check if article exists by URL
    const { data: existingArticle, error: findError } = await supabase
      .from('news_articles')
      .select('*')
      .eq('url', article.url)
      .single();

    if (findError && findError.code !== 'PGRST116') throw findError;

    // Format the article data for Supabase
    const relevanceCategories = [businessDetails.industry];
    
    const articleData = {
      title: article.title,
      description: article.description || '',
      content: article.content || '',
      source_id: article.source.id,
      source_name: article.source.name,
      author: article.author,
      url: article.url,
      url_to_image: article.urlToImage,
      published_at: new Date(article.publishedAt),
      relevance_categories: relevanceCategories,
      impact_score: impactScore,
      updated_at: new Date(),
    };

    // If article exists, update it
    if (existingArticle) {
      const { data: updatedArticle, error: updateError } = await supabase
        .from('news_articles')
        .update(articleData)
        .eq('id', existingArticle.id)
        .select()
        .single();

      if (updateError) throw updateError;
      return this.formatArticle(updatedArticle);
    }

    // If article doesn't exist, create it
    articleData.created_at = new Date();
    
    const { data: newArticle, error: insertError } = await supabase
      .from('news_articles')
      .insert(articleData)
      .select()
      .single();

    if (insertError) throw insertError;
    return this.formatArticle(newArticle);
  }

  /**
   * Format a news article from database format to API format
   * @param {Object} dbArticle - Database article object
   * @returns {Object} Formatted article object
   */
  static formatArticle(dbArticle) {
    if (!dbArticle) return null;

    return {
      id: dbArticle.id,
      title: dbArticle.title,
      description: dbArticle.description,
      content: dbArticle.content,
      source: {
        id: dbArticle.source_id,
        name: dbArticle.source_name,
      },
      author: dbArticle.author,
      url: dbArticle.url,
      urlToImage: dbArticle.url_to_image,
      publishedAt: dbArticle.published_at,
      relevanceCategories: dbArticle.relevance_categories,
      impactScore: dbArticle.impact_score,
      sentimentAnalysis: dbArticle.sentiment_analysis,
      keywords: dbArticle.keywords,
      createdAt: dbArticle.created_at,
      updatedAt: dbArticle.updated_at,
    };
  }
}

module.exports = NewsArticle; 