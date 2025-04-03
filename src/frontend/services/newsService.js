import axios from 'axios';

const API_URL = '/api';

// Get personalized news feed
export const getNewsFeed = async (params = {}) => {
  try {
    // Only use mock data if USE_MOCK_DATA is explicitly set to 'true'
    if (process.env.REACT_APP_USE_MOCK_DATA === 'true') {
      return getMockNewsFeed(params);
    }
    
    // By default, use the actual API
    const response = await axios.get(`${API_URL}/news`, {
      params,
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching news feed:', error);
    
    // Fallback to mock data if API call fails and in development
    if (process.env.NODE_ENV === 'development') {
      console.warn('Falling back to mock data due to API error');
      return getMockNewsFeed(params);
    }
    
    handleError(error);
    throw error;
  }
};

// Mock function for development
const getMockNewsFeed = (params) => {
  const { page = 1, limit = 10, category, impact, date, source, search } = params;
  
  // Generate 100 mock articles
  const allArticles = Array(100).fill().map((_, index) => {
    const id = index + 1;
    let articleData = { id };
    
    // Rotate between different categories
    const categories = ['Technology', 'Energy', 'Healthcare', 'Finance', 'Logistics', 'Economy'];
    const category = categories[id % categories.length];
    
    // Generate impact score (50-95)
    const impactScore = 50 + Math.floor(Math.random() * 46);
    
    // Generate date within last 30 days
    const date = new Date();
    date.setDate(date.getDate() - (id % 30));
    const formattedDate = date.toISOString().split('T')[0];
    
    // Rotate between sources
    const sources = [
      'Financial Times', 'TechCrunch', 'Wall Street Journal', 
      'Bloomberg', 'Reuters', 'Healthcare Daily'
    ];
    const source = sources[id % sources.length];
    
    // Article details
    switch (category) {
      case 'Technology':
        articleData = {
          ...articleData,
          title: `Tech innovation ${id}: AI applications in business analytics`,
          summary: `New breakthroughs in artificial intelligence are changing how businesses analyze performance data and forecast future trends.`,
          category,
          impactScore,
          date: formattedDate,
          source: 'TechCrunch'
        };
        break;
      case 'Energy':
        articleData = {
          ...articleData,
          title: `Renewable energy milestone: Wind power exceeds ${40 + (id % 30)}% efficiency`,
          summary: `Advancements in wind turbine technology have resulted in significant efficiency improvements, making renewable energy more competitive with fossil fuels.`,
          category,
          impactScore,
          date: formattedDate,
          source: 'Financial Times'
        };
        break;
      case 'Healthcare':
        articleData = {
          ...articleData,
          title: `New treatment for ${id % 2 === 0 ? 'chronic' : 'acute'} conditions shows promising results`,
          summary: `Clinical trials reveal breakthrough in treatment options for patients, potentially reducing hospital stays and improving outcomes.`,
          category,
          impactScore,
          date: formattedDate,
          source: 'Healthcare Daily'
        };
        break;
      case 'Finance':
        articleData = {
          ...articleData,
          title: `Global markets react to ${id % 2 === 0 ? 'interest rate changes' : 'economic indicators'}`,
          summary: `Investors are adjusting portfolios in response to central bank policies and emerging economic data from major economies.`,
          category,
          impactScore,
          date: formattedDate,
          source: 'Wall Street Journal'
        };
        break;
      case 'Logistics':
        articleData = {
          ...articleData,
          title: `Supply chain optimization using ${id % 2 === 0 ? 'blockchain' : 'AI'} shows ${id % 10 + 20}% efficiency gains`,
          summary: `Companies implementing new technologies in their supply chain management are seeing reduced costs and improved delivery times.`,
          category,
          impactScore,
          date: formattedDate,
          source: 'Reuters'
        };
        break;
      default: // Economy
        articleData = {
          ...articleData,
          title: `${id % 2 === 0 ? 'Consumer spending' : 'Manufacturing output'} shows ${id % 2 === 0 ? 'growth' : 'resilience'} in Q${1 + (id % 4)}`,
          summary: `Latest economic indicators suggest continued economic expansion despite global challenges and supply constraints.`,
          category: 'Economy',
          impactScore,
          date: formattedDate,
          source: 'Bloomberg'
        };
    }
    
    return articleData;
  });
  
  // Filter articles based on params
  let filteredArticles = [...allArticles];
  
  if (category && category !== 'all') {
    filteredArticles = filteredArticles.filter(article => article.category === category);
  }
  
  if (impact && impact !== 'all') {
    filteredArticles = filteredArticles.filter(article => {
      if (impact === 'high') return article.impactScore >= 80;
      if (impact === 'medium') return article.impactScore >= 60 && article.impactScore < 80;
      if (impact === 'low') return article.impactScore < 60;
      return true;
    });
  }
  
  if (source && source !== 'all') {
    filteredArticles = filteredArticles.filter(article => article.source === source);
  }
  
  if (date && date !== 'all') {
    const today = new Date();
    const articleDate = new Date(date);
    
    filteredArticles = filteredArticles.filter(article => {
      const articleDate = new Date(article.date);
      
      if (date === 'today') {
        return articleDate.toDateString() === today.toDateString();
      }
      
      if (date === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(today.getDate() - 7);
        return articleDate >= weekAgo;
      }
      
      if (date === 'month') {
        const monthAgo = new Date();
        monthAgo.setMonth(today.getMonth() - 1);
        return articleDate >= monthAgo;
      }
      
      if (date === 'quarter') {
        const quarterAgo = new Date();
        quarterAgo.setMonth(today.getMonth() - 3);
        return articleDate >= quarterAgo;
      }
      
      return true;
    });
  }
  
  if (search) {
    const searchLower = search.toLowerCase();
    filteredArticles = filteredArticles.filter(article => 
      article.title.toLowerCase().includes(searchLower) || 
      article.summary.toLowerCase().includes(searchLower)
    );
  }
  
  // Pagination
  const totalArticles = filteredArticles.length;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedArticles = filteredArticles.slice(startIndex, endIndex);
  
  // Add a short delay to simulate API call
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        articles: paginatedArticles,
        total: totalArticles,
        page: parseInt(page),
        limit: parseInt(limit),
        hasMore: endIndex < totalArticles
      });
    }, 800);
  });
};

// Get a specific news article by ID
export const getNewsById = async (newsId) => {
  try {
    const response = await axios.get(`${API_URL}/news/${newsId}`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Get prediction for a news article
export const getPrediction = async (newsId) => {
  try {
    // For development/demo purposes with mock data
    if (process.env.REACT_APP_USE_MOCK_DATA === 'true') {
      return getMockPrediction(newsId);
    }
    
    // In production, use actual API
    const response = await axios.get(`${API_URL}/predictions/${newsId}`, {
      withCredentials: true
    });
    
    // Handle response including cached flag if present
    const prediction = response.data;
    
    // Add isCached flag if it comes from the API
    if (prediction.cached !== undefined) {
      prediction.data.isCached = prediction.cached;
    }
    
    return prediction.data;
  } catch (error) {
    console.error('Error fetching prediction:', error);
    
    // Fallback to mock data if API call fails and in development
    if (process.env.NODE_ENV === 'development') {
      console.warn('Falling back to mock prediction due to API error');
      return getMockPrediction(newsId);
    }
    
    handleError(error);
    throw error;
  }
};

// Get user's prediction history
export const getPredictionHistory = async (params = {}) => {
  try {
    // For development/demo purposes with mock data
    if (process.env.REACT_APP_USE_MOCK_DATA === 'true') {
      return getMockPredictionHistory(params);
    }
    
    // In production, use actual API
    const response = await axios.get(`${API_URL}/predictions/history`, {
      params,
      withCredentials: true
    });
    
    return {
      predictions: response.data.data,
      total: response.data.count,
      page: response.data.page || 1,
      limit: response.data.limit || params.limit || 10
    };
  } catch (error) {
    console.error('Error fetching prediction history:', error);
    
    // Fallback to mock data if API call fails and in development
    if (process.env.NODE_ENV === 'development') {
      console.warn('Falling back to mock prediction history due to API error');
      return getMockPredictionHistory(params);
    }
    
    handleError(error);
    throw error;
  }
};

// Bookmark a news article
export const bookmarkNews = async (newsId) => {
  try {
    const response = await axios.post(`${API_URL}/bookmarks`, {
      newsId
    }, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Remove a bookmark
export const removeBookmark = async (bookmarkId) => {
  try {
    const response = await axios.delete(`${API_URL}/bookmarks/${bookmarkId}`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Get all bookmarked news
export const getBookmarks = async () => {
  try {
    const response = await axios.get(`${API_URL}/bookmarks`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Get dashboard data for the user
export const getDashboardData = async (params = {}) => {
  try {
    // For development/demo purposes, return mock data
    if (process.env.NODE_ENV === 'development') {
      return getMockDashboardData(params);
    }
    
    // In production, use actual API
    const response = await axios.get(`${API_URL}/dashboard`, {
      params,
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Mock function for dashboard data
const getMockDashboardData = (params) => {
  const { timeFrame = 'week', category = 'all' } = params;
  
  // Overall impact score
  const impactScore = 70 + Math.floor(Math.random() * 15);
  
  // News count based on time frame
  let newsCount;
  switch (timeFrame) {
    case 'day':
      newsCount = 10 + Math.floor(Math.random() * 15);
      break;
    case 'week':
      newsCount = 50 + Math.floor(Math.random() * 50);
      break;
    case 'month':
      newsCount = 200 + Math.floor(Math.random() * 100);
      break;
    case 'quarter':
      newsCount = 500 + Math.floor(Math.random() * 300);
      break;
    default:
      newsCount = 100;
  }
  
  // Impact trend data
  let trendLabels = [];
  let trendDataPoints = [];
  
  switch (timeFrame) {
    case 'day':
      // Hourly data for a day
      trendLabels = Array(24).fill().map((_, i) => `${i}:00`);
      trendDataPoints = Array(24).fill().map(() => 40 + Math.floor(Math.random() * 55));
      break;
    case 'week':
      // Daily data for a week
      trendLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      trendDataPoints = Array(7).fill().map(() => 40 + Math.floor(Math.random() * 55));
      break;
    case 'month':
      // Weekly data for a month
      trendLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      trendDataPoints = Array(4).fill().map(() => 40 + Math.floor(Math.random() * 55));
      break;
    case 'quarter':
      // Monthly data for a quarter
      trendLabels = ['Month 1', 'Month 2', 'Month 3'];
      trendDataPoints = Array(3).fill().map(() => 40 + Math.floor(Math.random() * 55));
      break;
    default:
      trendLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      trendDataPoints = Array(4).fill().map(() => 40 + Math.floor(Math.random() * 55));
  }
  
  // Top impacted categories
  const topImpactedCategories = [
    { category: 'Financial Regulations', score: 75 + Math.floor(Math.random() * 20) },
    { category: 'Market Trends', score: 65 + Math.floor(Math.random() * 20) },
    { category: 'Technology', score: 55 + Math.floor(Math.random() * 20) },
    { category: 'Supply Chain', score: 45 + Math.floor(Math.random() * 20) }
  ];
  
  // Impact distribution
  const impactDistribution = {
    labels: ['High Impact', 'Medium Impact', 'Low Impact'],
    data: [
      Math.floor(newsCount * 0.3), // High impact (30%)
      Math.floor(newsCount * 0.5), // Medium impact (50%)
      Math.floor(newsCount * 0.2)  // Low impact (20%)
    ]
  };
  
  // News volume by category
  const newsVolumeByCategory = {
    labels: ['Financial', 'Technology', 'Healthcare', 'Energy', 'Logistics', 'Economy'],
    data: [
      Math.floor(newsCount * 0.25), // Financial (25%)
      Math.floor(newsCount * 0.20), // Technology (20%)
      Math.floor(newsCount * 0.15), // Healthcare (15%)
      Math.floor(newsCount * 0.15), // Energy (15%)
      Math.floor(newsCount * 0.10), // Logistics (10%)
      Math.floor(newsCount * 0.15)  // Economy (15%)
    ]
  };
  
  // Industry impact data
  const industryImpactData = {
    labels: ['Your Company', 'Industry Average', 'Top Performer', 'Bottom Performer'],
    data: [impactScore, impactScore - 5, impactScore + 10, impactScore - 20]
  };
  
  // Market trends data
  const marketTrendsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Your Industry',
        data: Array(6).fill().map(() => 50 + Math.floor(Math.random() * 30))
      },
      {
        label: 'Overall Market',
        data: Array(6).fill().map(() => 40 + Math.floor(Math.random() * 40))
      }
    ]
  };
  
  // Future predictions
  const futurePredictions = {
    labels: ['Next Week', 'Next Month', 'Next Quarter'],
    data: [
      impactScore + Math.floor(Math.random() * 10 - 5),
      impactScore + Math.floor(Math.random() * 15 - 5),
      impactScore + Math.floor(Math.random() * 20 - 10)
    ]
  };
  
  // Add a short delay to simulate API call
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        impactScore,
        newsCount,
        impactTrend: {
          labels: trendLabels,
          data: trendDataPoints
        },
        topImpactedCategories,
        impactDistribution,
        newsVolumeByCategory,
        industryImpactData,
        marketTrendsData,
        futurePredictions
      });
    }, 800);
  });
};

// Mock function for predictions
const getMockPrediction = (newsId) => {
  // Parse the ID as a number to ensure consistent mock data
  const id = parseInt(newsId) || 1;
  
  // Generate a prediction with some variability based on ID
  const overallImpact = 20 + (id % 5) * 15; // Range: 20 to 80
  
  // Use the ID to determine if it's positive or negative
  const isPositive = id % 2 === 0;
  const finalImpact = isPositive ? overallImpact : -overallImpact;
  
  // Generate impact areas
  const impactAreas = [
    {
      name: 'Financial',
      score: finalImpact + (id % 10) - 5,
      description: isPositive 
        ? 'Likely to see positive financial outcomes due to market trends associated with this news.' 
        : 'May face financial challenges as a result of the market shift described in this article.'
    },
    {
      name: 'Operational',
      score: finalImpact + (id % 6) - 3,
      description: isPositive 
        ? 'Operations could benefit from the described changes in industry standards.' 
        : 'Operational adjustments may be needed to mitigate potential disruptions.'
    },
    {
      name: 'Market',
      score: finalImpact + (id % 15) - 7,
      description: isPositive 
        ? 'Market position could strengthen as competitors may be slower to adapt.' 
        : 'Market share might be challenged by faster-moving competitors in this space.'
    },
    {
      name: 'Reputation',
      score: finalImpact + (id % 8) - 4,
      description: isPositive 
        ? 'Public perception likely to improve with proper communication of your response.' 
        : 'Public relations strategy should be developed to address potential concerns.'
    }
  ];
  
  // Generate timeframes
  const timeframes = [
    {
      period: 'short-term',
      impact: finalImpact + 10,
      description: `Immediate effects expected within the next ${1 + (id % 3)} months.`
    },
    {
      period: 'medium-term',
      impact: finalImpact,
      description: `Effects will continue through the next ${4 + (id % 5)} months.`
    },
    {
      period: 'long-term',
      impact: finalImpact - 15,
      description: `Long-term impact will diminish over the next ${12 + (id % 12)} months.`
    }
  ];
  
  // Generate recommendations
  const recommendations = [
    {
      title: isPositive ? 'Capitalize on opportunity' : 'Mitigate potential risks',
      description: isPositive
        ? 'Develop strategies to leverage this trend for maximum benefit to your business.'
        : 'Create contingency plans to address the potential negative impacts highlighted.',
      priority: Math.abs(finalImpact) > 60 ? 'high' : Math.abs(finalImpact) > 30 ? 'medium' : 'low'
    },
    {
      title: 'Monitor developments',
      description: 'Set up regular monitoring to track how this situation evolves over time.',
      priority: 'medium'
    },
    {
      title: isPositive ? 'Align communication strategy' : 'Prepare stakeholder communications',
      description: isPositive
        ? 'Ensure your marketing and PR teams are aligned to communicate the benefits of your approach.'
        : 'Develop clear messaging for stakeholders about how you\'re addressing these challenges.',
      priority: 'high'
    }
  ];
  
  // Add a short delay to simulate API call
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        id: `pred-${newsId}`,
        newsArticle: {
          id: newsId,
          title: `News Article ${newsId}`
        },
        overallImpact: finalImpact,
        impactAreas,
        timeframes,
        recommendations,
        confidenceLevel: 60 + (id % 25), // Range: 60-84
        createdAt: new Date().toISOString(),
        isCached: false
      });
    }, 800);
  });
};

// Mock function for prediction history
const getMockPredictionHistory = (params = {}) => {
  const { page = 1, limit = 10 } = params;
  
  // Generate 20 mock prediction history items
  const allPredictions = Array(20).fill().map((_, index) => {
    const id = index + 1;
    const isPositive = id % 2 === 0;
    const impactScore = isPositive ? 20 + (id % 60) : -(20 + (id % 60));
    
    // Generate date within last 30 days
    const date = new Date();
    date.setDate(date.getDate() - (id % 30));
    
    return {
      id: `pred-${id}`,
      newsArticle: {
        id: id,
        title: `News Article ${id}: ${isPositive ? 'Positive' : 'Negative'} Impact on Industry`,
      },
      overallImpact: impactScore,
      confidenceLevel: 60 + (id % 25),
      createdAt: date.toISOString(),
    };
  });
  
  // Apply pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedPredictions = allPredictions.slice(startIndex, endIndex);
  
  // Add a short delay to simulate API call
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        predictions: paginatedPredictions,
        total: allPredictions.length,
        page: parseInt(page),
        limit: parseInt(limit)
      });
    }, 600);
  });
};

// Helper function to handle errors
const handleError = (error) => {
  if (error.response) {
    console.error('API Error Response:', error.response.data);
    
    // Handle specific errors
    if (error.response.status === 401) {
      // Unauthorized - possibly session expired
      // You might want to redirect to login or refresh token
      console.error('Authentication error - session may have expired');
    }
  } else if (error.request) {
    // Request was made but no response received
    console.error('No response received:', error.request);
  } else {
    // Something else caused the error
    console.error('Error setting up request:', error.message);
  }
}; 