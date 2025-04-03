const Prediction = require('../models/prediction.model');
const NewsArticle = require('../models/newsArticle.model');

/**
 * Service for generating and managing predictions
 */
class PredictionService {
  constructor() {
    // Simple in-memory cache for predictions
    this.cache = new Map();
    
    // Cache expiration time (30 minutes)
    this.cacheExpiry = 30 * 60 * 1000;
  }
  
  /**
   * Generate a prediction for a news article
   * @param {String} articleId - ID of the news article
   * @param {Object} user - User requesting the prediction
   * @returns {Promise<Object>} - Generated prediction
   */
  async generatePrediction(articleId, user) {
    try {
      if (!articleId) {
        throw new Error('Article ID is required');
      }
      
      if (!user || !user.id) {
        throw new Error('Valid user is required');
      }

      // Create a unique cache key
      const cacheKey = `prediction-${articleId}-${user.id}`;
      
      // Check cache first
      const cachedPrediction = this.cache.get(cacheKey);
      if (cachedPrediction && (Date.now() - cachedPrediction.timestamp) < this.cacheExpiry) {
        console.log('Returning cached prediction');
        return cachedPrediction.data;
      }
      
      // Find the news article
      const newsArticle = await NewsArticle.findById(articleId);
      if (!newsArticle) {
        throw new Error('News article not found');
      }

      // Check if a prediction already exists for this article and user
      const existingPrediction = await Prediction.findOne({
        articleId: articleId,
        userId: user.id,
      });

      if (existingPrediction) {
        // Cache the prediction
        this.cache.set(cacheKey, {
          data: existingPrediction,
          timestamp: Date.now()
        });
        
        return existingPrediction;
      }

      // Validate business details
      if (!user.businessDetails || !user.businessDetails.industry || !user.businessDetails.location) {
        throw new Error('Business details incomplete. Industry and location are required.');
      }
      
      // Get business details from the user
      const { industry, location } = user.businessDetails;

      // Generate prediction based on the news article and business details
      const prediction = this.analyzePrediction(newsArticle, industry, location);

      // Create and save the prediction
      const newPrediction = await Prediction.create({
        newsArticle: articleId,
        user: user.id,
        industry,
        location,
        ...prediction,
      });
      
      // Cache the prediction
      this.cache.set(cacheKey, {
        data: newPrediction,
        timestamp: Date.now()
      });

      return newPrediction;
    } catch (error) {
      console.error('Error generating prediction:', error.message);
      throw new Error(`Failed to generate prediction: ${error.message}`);
    }
  }

  /**
   * Analyze and generate prediction data for a news article
   * @param {Object} newsArticle - News article data
   * @param {String} industry - User's industry
   * @param {String} location - User's location
   * @returns {Object} - Prediction data
   */
  analyzePrediction(newsArticle, industry, location) {
    // Use the impact score from the news article as a base
    const baseImpact = newsArticle.impactScore;
    
    // Generate different impact areas based on the industry
    const impactAreas = this.generateImpactAreas(newsArticle, industry);
    
    // Generate timeframes for the impact
    const timeframes = this.generateTimeframes(baseImpact);
    
    // Generate recommendations based on the impact
    const recommendations = this.generateRecommendations(baseImpact, industry);
    
    // Calculate confidence level based on relevance and data quality
    const confidenceLevel = this.calculateConfidenceLevel(newsArticle, industry, location);
    
    return {
      overallImpact: baseImpact,
      impactAreas,
      timeframes,
      recommendations,
      confidenceLevel,
    };
  }

  /**
   * Generate impact areas for the prediction
   * @param {Object} newsArticle - News article data
   * @param {String} industry - User's industry
   * @returns {Array} - Impact areas
   */
  generateImpactAreas(newsArticle, industry) {
    // This would typically use a more sophisticated algorithm or AI model
    // For now, we'll generate some sample impact areas based on the industry
    
    const baseImpact = newsArticle.impactScore;
    const areas = [];
    
    // Add financial impact
    areas.push({
      name: 'Financial',
      score: this.adjustImpactScore(baseImpact, -10, 10),
      description: this.getFinancialImpactDescription(baseImpact, industry),
    });
    
    // Add operational impact
    areas.push({
      name: 'Operational',
      score: this.adjustImpactScore(baseImpact, -15, 15),
      description: this.getOperationalImpactDescription(baseImpact, industry),
    });
    
    // Add market impact
    areas.push({
      name: 'Market',
      score: this.adjustImpactScore(baseImpact, -5, 20),
      description: this.getMarketImpactDescription(baseImpact, industry),
    });
    
    // Add reputation impact
    areas.push({
      name: 'Reputation',
      score: this.adjustImpactScore(baseImpact, -20, 5),
      description: this.getReputationImpactDescription(baseImpact, industry),
    });
    
    return areas;
  }

  /**
   * Generate timeframes for the impact
   * @param {Number} baseImpact - Base impact score
   * @returns {Array} - Timeframes
   */
  generateTimeframes(baseImpact) {
    return [
      {
        period: 'short-term',
        impact: this.adjustImpactScore(baseImpact, 0, 10), // Higher immediate impact
        description: this.getTimeframeDescription('short-term', baseImpact),
      },
      {
        period: 'medium-term',
        impact: this.adjustImpactScore(baseImpact, -10, 0), // Slightly lower medium-term impact
        description: this.getTimeframeDescription('medium-term', baseImpact),
      },
      {
        period: 'long-term',
        impact: this.adjustImpactScore(baseImpact, -20, -5), // Diminishing long-term impact
        description: this.getTimeframeDescription('long-term', baseImpact),
      },
    ];
  }

  /**
   * Generate recommendations based on the impact
   * @param {Number} baseImpact - Base impact score
   * @param {String} industry - User's industry
   * @returns {Array} - Recommendations
   */
  generateRecommendations(baseImpact, industry) {
    const recommendations = [];
    
    // Generate different recommendations based on the impact direction
    if (baseImpact > 50) {
      // Strong positive impact
      recommendations.push({
        title: 'Capitalize on positive trend',
        description: 'Consider increasing investment in related areas to maximize benefits from this positive development.',
        priority: 'high',
      });
    } else if (baseImpact > 20) {
      // Moderate positive impact
      recommendations.push({
        title: 'Monitor positive development',
        description: 'Keep track of this positive trend and prepare to adjust strategies if it continues.',
        priority: 'medium',
      });
    } else if (baseImpact < -50) {
      // Strong negative impact
      recommendations.push({
        title: 'Mitigate potential risks',
        description: 'Develop a risk mitigation strategy to address the potential negative impacts of this development.',
        priority: 'high',
      });
    } else if (baseImpact < -20) {
      // Moderate negative impact
      recommendations.push({
        title: 'Prepare contingency plans',
        description: 'Consider developing contingency plans to address possible negative outcomes.',
        priority: 'medium',
      });
    } else {
      // Neutral or mild impact
      recommendations.push({
        title: 'Monitor developments',
        description: 'Keep an eye on related developments to determine if any action is needed in the future.',
        priority: 'low',
      });
    }
    
    // Add industry-specific recommendation
    recommendations.push({
      title: `Industry-specific strategy for ${industry}`,
      description: this.getIndustrySpecificRecommendation(baseImpact, industry),
      priority: Math.abs(baseImpact) > 40 ? 'high' : Math.abs(baseImpact) > 20 ? 'medium' : 'low',
    });
    
    return recommendations;
  }

  /**
   * Calculate confidence level for the prediction
   * @param {Object} newsArticle - News article data
   * @param {String} industry - User's industry
   * @param {String} location - User's location
   * @returns {Number} - Confidence level (0-100)
   */
  calculateConfidenceLevel(newsArticle, industry, location) {
    // Base confidence level
    let confidence = 60;
    
    // Adjust based on relevance to industry
    if (newsArticle.relevanceCategories.includes(industry)) {
      confidence += 15;
    }
    
    // Adjust based on source reliability (simplified)
    if (['Reuters', 'Bloomberg', 'AP', 'BBC'].includes(newsArticle.source.name)) {
      confidence += 10;
    }
    
    // Adjust based on content completeness
    if (newsArticle.content && newsArticle.content.length > 500) {
      confidence += 5;
    }
    
    // Ensure confidence is within range
    return Math.min(Math.max(confidence, 30), 90);
  }

  /**
   * Helper to adjust impact score with variations
   * @param {Number} baseScore - Base impact score
   * @param {Number} minAdjust - Minimum adjustment
   * @param {Number} maxAdjust - Maximum adjustment
   * @returns {Number} - Adjusted impact score
   */
  adjustImpactScore(baseScore, minAdjust, maxAdjust) {
    const adjust = minAdjust + Math.random() * (maxAdjust - minAdjust);
    return Math.min(Math.max(baseScore + adjust, -100), 100);
  }

  /**
   * Get financial impact description
   * @param {Number} impactScore - Impact score
   * @param {String} industry - User's industry
   * @returns {String} - Description
   */
  getFinancialImpactDescription(impactScore, industry) {
    if (impactScore > 50) {
      return `This news could have a significant positive financial impact on ${industry} businesses, potentially increasing revenue streams and investment opportunities.`;
    } else if (impactScore > 20) {
      return `This development may lead to moderate financial benefits for ${industry} businesses, including possible increased customer spending.`;
    } else if (impactScore < -50) {
      return `This news may significantly affect ${industry} financials negatively, potentially reducing revenue and increasing costs.`;
    } else if (impactScore < -20) {
      return `There could be some financial challenges for ${industry} businesses, requiring careful budget management.`;
    } else {
      return `Minimal financial impact expected for ${industry} businesses based on this news.`;
    }
  }

  /**
   * Get operational impact description
   * @param {Number} impactScore - Impact score
   * @param {String} industry - User's industry
   * @returns {String} - Description
   */
  getOperationalImpactDescription(impactScore, industry) {
    if (impactScore > 50) {
      return `This news could significantly improve operational efficiency in the ${industry} sector, enabling better processes and resource allocation.`;
    } else if (impactScore > 20) {
      return `Some positive operational changes may be possible for ${industry} businesses as a result of this development.`;
    } else if (impactScore < -50) {
      return `Significant operational disruptions may affect ${industry} businesses, requiring major adjustments to processes.`;
    } else if (impactScore < -20) {
      return `Some operational challenges could arise for ${industry} businesses, potentially requiring workflow adjustments.`;
    } else {
      return `Minimal operational impact expected for ${industry} businesses based on this news.`;
    }
  }

  /**
   * Get market impact description
   * @param {Number} impactScore - Impact score
   * @param {String} industry - User's industry
   * @returns {String} - Description
   */
  getMarketImpactDescription(impactScore, industry) {
    if (impactScore > 50) {
      return `This development could significantly expand market opportunities for ${industry} businesses, potentially opening new customer segments.`;
    } else if (impactScore > 20) {
      return `Moderate market improvements may be expected for ${industry} businesses, with possible increased customer interest.`;
    } else if (impactScore < -50) {
      return `Significant market challenges may arise for ${industry} businesses, potentially reducing market share or customer interest.`;
    } else if (impactScore < -20) {
      return `Some market pressure may affect ${industry} businesses, requiring attention to customer retention strategies.`;
    } else {
      return `Minimal market impact expected for ${industry} businesses based on this news.`;
    }
  }

  /**
   * Get reputation impact description
   * @param {Number} impactScore - Impact score
   * @param {String} industry - User's industry
   * @returns {String} - Description
   */
  getReputationImpactDescription(impactScore, industry) {
    if (impactScore > 50) {
      return `This news could significantly enhance the reputation of ${industry} businesses, building stronger customer trust and loyalty.`;
    } else if (impactScore > 20) {
      return `Some positive reputation effects may benefit ${industry} businesses, possibly improving public perception.`;
    } else if (impactScore < -50) {
      return `Significant reputation challenges may affect ${industry} businesses, requiring proactive reputation management.`;
    } else if (impactScore < -20) {
      return `Some negative public perception may affect ${industry} businesses, suggesting a need for communication strategies.`;
    } else {
      return `Minimal reputation impact expected for ${industry} businesses based on this news.`;
    }
  }

  /**
   * Get timeframe description
   * @param {String} period - Time period
   * @param {Number} impactScore - Impact score
   * @returns {String} - Description
   */
  getTimeframeDescription(period, impactScore) {
    const impact = impactScore > 0 ? 'positive' : impactScore < 0 ? 'negative' : 'neutral';
    
    if (period === 'short-term') {
      return `In the immediate term (0-3 months), the ${impact} impact of this news will be most pronounced, requiring ${impactScore > 0 ? 'quick action to capitalize on opportunities' : 'prompt attention to mitigate challenges'}.`;
    } else if (period === 'medium-term') {
      return `Over the medium term (3-12 months), the ${impact} effects will likely ${Math.abs(impactScore) > 40 ? 'continue to be significant' : 'begin to stabilize'}, suggesting the need for ${impactScore > 0 ? 'strategic planning to maintain advantages' : 'ongoing adjustment of strategies'}.`;
    } else {
      return `In the long term (1+ years), the ${impact} impact will likely ${Math.abs(impactScore) > 60 ? 'create lasting changes in the industry landscape' : 'diminish as the market adjusts'}, indicating a need for ${impactScore > 0 ? 'sustainable approaches to leverage benefits' : 'resilience building against similar future challenges'}.`;
    }
  }

  /**
   * Get industry-specific recommendation
   * @param {Number} impactScore - Impact score
   * @param {String} industry - User's industry
   * @returns {String} - Recommendation
   */
  getIndustrySpecificRecommendation(impactScore, industry) {
    // Simple industry-specific recommendations
    if (industry.toLowerCase().includes('retail')) {
      return impactScore > 0
        ? 'Consider adjusting inventory and promotions to capitalize on this positive trend in retail consumer sentiment.'
        : 'Review inventory levels and customer engagement strategies to mitigate potential reduced foot traffic or spending.';
    } else if (industry.toLowerCase().includes('technology')) {
      return impactScore > 0
        ? 'Evaluate opportunities to accelerate innovation or product launches to capitalize on favorable tech market conditions.'
        : 'Consider focusing R&D efforts on resilient technologies and services that maintain value during market uncertainties.';
    } else if (industry.toLowerCase().includes('manufacturing')) {
      return impactScore > 0
        ? 'Assess supply chain optimizations and potential capacity increases to meet possible increased demand.'
        : 'Review supply chain redundancies and inventory management to prepare for potential disruptions.';
    } else if (industry.toLowerCase().includes('healthcare')) {
      return impactScore > 0
        ? 'Consider expanding services or facilities to capitalize on favorable healthcare sector developments.'
        : 'Evaluate resource allocation and emergency preparedness to maintain quality care during potential challenges.';
    } else if (industry.toLowerCase().includes('finance')) {
      return impactScore > 0
        ? 'Consider adjusting investment portfolios and customer offerings to capitalize on positive financial market trends.'
        : 'Review risk management strategies and capital reserves to ensure resilience during market fluctuations.';
    } else {
      return impactScore > 0
        ? `Evaluate opportunities to capitalize on this positive development in the ${industry} sector through strategic planning and resource allocation.`
        : `Consider developing contingency plans to navigate potential challenges in the ${industry} sector, focusing on operational resilience.`;
    }
  }
}

module.exports = new PredictionService(); 