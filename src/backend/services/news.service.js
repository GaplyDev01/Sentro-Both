const axios = require('axios');
const NewsArticle = require('../models/newsArticle.model');

/**
 * NewsAPI client for fetching news
 */
class NewsService {
  constructor() {
    this.newsApiClient = axios.create({
      baseURL: 'https://newsapi.org/v2',
      headers: {
        'X-Api-Key': process.env.NEWS_API_KEY,
      },
    });
    
    this.repustateClient = axios.create({
      baseURL: 'https://api.repustate.com/v4',
      headers: {
        'X-API-KEY': process.env.REPUSTATE_API_KEY,
      },
    });
  }

  /**
   * Get news based on industry and location
   * @param {Object} businessDetails - User's business details including industry and location
   * @returns {Promise<Array>} - Array of news articles with impact scores
   */
  async getNews(businessDetails) {
    try {
      // Create search query based on business details
      const { industry, location } = businessDetails;
      const query = `${industry} ${location}`;
      
      // Fetch news from NewsAPI
      const response = await this.newsApiClient.get('/everything', {
        params: {
          q: query,
          sortBy: 'publishedAt',
          language: 'en',
          pageSize: 20, // Limit to 20 articles for performance
        },
      });

      // Process and save news articles
      const processedArticles = await Promise.all(
        response.data.articles.map(async (article) => {
          // Calculate impact score for each article
          const impactScore = await this.calculateImpactScore(article, businessDetails);
          
          // Use the Supabase model to find or create the article
          const newsArticle = await NewsArticle.findOrCreate(article, impactScore, businessDetails);
          
          return newsArticle;
        })
      );

      return processedArticles;
    } catch (error) {
      console.error('Error fetching news:', error.message);
      throw new Error('Failed to fetch news articles');
    }
  }

  /**
   * Calculate impact score for a news article based on sentiment analysis
   * @param {Object} article - News article
   * @param {Object} businessDetails - User's business details
   * @returns {Promise<Number>} - Impact score (-100 to +100)
   */
  async calculateImpactScore(article, businessDetails) {
    try {
      // Get sentiment analysis from Repustate API
      const sentimentResponse = await this.repustateClient.post('/sentiment', {
        text: `${article.title} ${article.description} ${article.content || ''}`,
        lang: 'en',
      });

      const sentimentData = sentimentResponse.data;
      
      // Calculate base impact score from sentiment (-1 to +1 scale)
      let baseScore = sentimentData.score * 100;
      
      // Adjust impact based on relevance to business
      const relevanceFactor = this.calculateRelevance(article, businessDetails);
      
      // Calculate final impact score (-100 to +100)
      const impactScore = Math.min(Math.max(baseScore * relevanceFactor, -100), 100);
      
      return Math.round(impactScore);
    } catch (error) {
      console.error('Error calculating impact score:', error.message);
      // Return neutral score if calculation fails
      return 0;
    }
  }

  /**
   * Calculate relevance factor based on business details
   * @param {Object} article - News article
   * @param {Object} businessDetails - User's business details
   * @returns {Number} - Relevance factor (0.1 to 1.5)
   */
  calculateRelevance(article, businessDetails) {
    const { industry, location } = businessDetails;
    let relevanceFactor = 1.0;
    
    // Check if industry is mentioned in article
    if (
      article.title.toLowerCase().includes(industry.toLowerCase()) ||
      article.description?.toLowerCase().includes(industry.toLowerCase())
    ) {
      relevanceFactor += 0.3;
    }
    
    // Check if location is mentioned in article
    if (
      article.title.toLowerCase().includes(location.toLowerCase()) ||
      article.description?.toLowerCase().includes(location.toLowerCase())
    ) {
      relevanceFactor += 0.2;
    }
    
    // Ensure minimum relevance
    return Math.max(relevanceFactor, 0.1);
  }
}

module.exports = new NewsService(); 