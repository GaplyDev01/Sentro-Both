const axios = require('axios');
const NewsArticle = require('../models/newsArticle.model');

/**
 * NewsAPI client for fetching news
 */
class NewsService {
  constructor() {
    // Ensure API keys are available
    if (!process.env.NEWS_API_KEY) {
      console.error('NEWS_API_KEY is not set in environment variables');
    }
    
    if (!process.env.REPUSTATE_API_KEY) {
      console.error('REPUSTATE_API_KEY is not set in environment variables');
    }
    
    this.newsApiClient = axios.create({
      baseURL: 'https://newsapi.org/v2',
      headers: {
        'X-Api-Key': process.env.NEWS_API_KEY,
      },
      timeout: 10000, // 10 second timeout
    });
    
    this.repustateClient = axios.create({
      baseURL: 'https://api.repustate.com/v4',
      headers: {
        'X-API-KEY': process.env.REPUSTATE_API_KEY,
      },
      timeout: 10000, // 10 second timeout
    });
    
    // Simple in-memory cache
    this.cache = {
      news: new Map(),
      sentiment: new Map()
    };
    
    // Cache expiration time (30 minutes)
    this.cacheExpiry = 30 * 60 * 1000;
  }

  /**
   * Get news based on industry and location
   * @param {Object} businessDetails - User's business details including industry and location
   * @returns {Promise<Array>} - Array of news articles with impact scores
   */
  async getNews(businessDetails) {
    try {
      if (!businessDetails || !businessDetails.industry || !businessDetails.location) {
        throw new Error('Business details incomplete. Industry and location are required.');
      }
      
      // Create search query based on business details
      const { industry, location } = businessDetails;
      const query = `${industry} ${location}`;
      
      // Check cache first
      const cacheKey = `${query}`;
      const cachedData = this.cache.news.get(cacheKey);
      
      if (cachedData && (Date.now() - cachedData.timestamp) < this.cacheExpiry) {
        console.log('Returning cached news results');
        return cachedData.data;
      }
      
      // Fetch news from NewsAPI
      console.log(`Fetching news for query: ${query}`);
      const response = await this.newsApiClient.get('/everything', {
        params: {
          q: query,
          sortBy: 'publishedAt',
          language: 'en',
          pageSize: 20, // Limit to 20 articles for performance
        },
      });
      
      if (!response.data || !response.data.articles) {
        throw new Error('Invalid response from NewsAPI');
      }
      
      console.log(`Received ${response.data.articles.length} articles from NewsAPI`);

      // Process and save news articles
      const processedArticles = await Promise.all(
        response.data.articles.map(async (article) => {
          try {
            // Calculate impact score for each article
            const impactScore = await this.calculateImpactScore(article, businessDetails);
            
            // Use the Supabase model to find or create the article
            const newsArticle = await NewsArticle.findOrCreate(article, impactScore, businessDetails);
            
            return newsArticle;
          } catch (error) {
            console.error(`Error processing article ${article.title}:`, error.message);
            return null;
          }
        })
      );
      
      // Filter out any null articles from errors
      const validArticles = processedArticles.filter(article => article !== null);
      
      // Cache the results
      this.cache.news.set(cacheKey, {
        data: validArticles,
        timestamp: Date.now()
      });

      return validArticles;
    } catch (error) {
      console.error('Error fetching news:', error.message);
      if (error.response) {
        console.error('API response error:', error.response.data);
      }
      throw new Error(`Failed to fetch news articles: ${error.message}`);
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
      const textToAnalyze = `${article.title} ${article.description || ''} ${article.content || ''}`.trim();
      
      if (!textToAnalyze) {
        console.warn('No text available for sentiment analysis');
        return 0;
      }
      
      // Check sentiment cache
      const cacheKey = `sentiment-${textToAnalyze.substring(0, 100)}`;
      const cachedSentiment = this.cache.sentiment.get(cacheKey);
      
      if (cachedSentiment && (Date.now() - cachedSentiment.timestamp) < this.cacheExpiry) {
        return cachedSentiment.score;
      }
      
      // Get sentiment analysis from Repustate API
      const sentimentResponse = await this.repustateClient.post('/sentiment', {
        text: textToAnalyze,
        lang: 'en',
      });

      if (!sentimentResponse.data || !sentimentResponse.data.hasOwnProperty('score')) {
        throw new Error('Invalid sentiment analysis response');
      }
      
      const sentimentData = sentimentResponse.data;
      
      // Calculate base impact score from sentiment (-1 to +1 scale)
      let baseScore = sentimentData.score * 100;
      
      // Adjust impact based on relevance to business
      const relevanceFactor = this.calculateRelevance(article, businessDetails);
      
      // Calculate final impact score (-100 to +100)
      const impactScore = Math.min(Math.max(baseScore * relevanceFactor, -100), 100);
      const finalScore = Math.round(impactScore);
      
      // Cache the sentiment score
      this.cache.sentiment.set(cacheKey, {
        score: finalScore,
        timestamp: Date.now()
      });
      
      return finalScore;
    } catch (error) {
      console.error('Error calculating impact score:', error.message);
      if (error.response) {
        console.error('Sentiment API error:', error.response.data);
      }
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