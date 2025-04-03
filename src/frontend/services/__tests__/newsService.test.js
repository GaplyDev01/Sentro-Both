import axios from 'axios';
import { getNewsFeed, getNewsById, getPrediction, getPredictionHistory } from '../newsService';

// Mock axios
jest.mock('axios');

describe('News Service', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.REACT_APP_USE_MOCK_DATA = 'false';
    process.env.NODE_ENV = 'production';
  });

  describe('getNewsFeed', () => {
    test('should fetch news from API when not using mock data', async () => {
      // Mock API response
      const mockResponse = {
        data: {
          success: true,
          total: 2,
          count: 2,
          data: [
            { id: 1, title: 'Test Article 1' },
            { id: 2, title: 'Test Article 2' },
          ],
        },
      };
      
      // Set up axios mock
      axios.get.mockResolvedValueOnce(mockResponse);
      
      // Call the function
      const result = await getNewsFeed({ limit: 10, offset: 0 });
      
      // Verify axios was called correctly
      expect(axios.get).toHaveBeenCalledWith('/api/news', {
        params: { limit: 10, offset: 0 },
        withCredentials: true,
      });
      
      // Verify result
      expect(result).toEqual(mockResponse.data);
    });
    
    test('should return mock data when REACT_APP_USE_MOCK_DATA is true', async () => {
      // Set environment to use mock data
      process.env.REACT_APP_USE_MOCK_DATA = 'true';
      
      // Call the function
      const result = await getNewsFeed({ limit: 10, offset: 0 });
      
      // Verify axios was not called
      expect(axios.get).not.toHaveBeenCalled();
      
      // Verify result has expected mock data structure
      expect(result).toHaveProperty('articles');
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('page');
      expect(result).toHaveProperty('limit');
      expect(result).toHaveProperty('hasMore');
    });
    
    test('should fallback to mock data in development when API call fails', async () => {
      // Set environment to development
      process.env.NODE_ENV = 'development';
      
      // Make axios throw an error
      axios.get.mockRejectedValueOnce(new Error('Network error'));
      
      // Call the function
      const result = await getNewsFeed({ limit: 10, offset: 0 });
      
      // Verify axios was called
      expect(axios.get).toHaveBeenCalled();
      
      // Verify result has expected mock data structure
      expect(result).toHaveProperty('articles');
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('page');
      expect(result).toHaveProperty('limit');
      expect(result).toHaveProperty('hasMore');
    });
  });
  
  describe('getNewsById', () => {
    test('should fetch news article by ID from API', async () => {
      // Mock API response
      const mockResponse = {
        data: {
          success: true,
          data: { id: 1, title: 'Test Article 1' },
        },
      };
      
      // Set up axios mock
      axios.get.mockResolvedValueOnce(mockResponse);
      
      // Call the function
      const result = await getNewsById(1);
      
      // Verify axios was called correctly
      expect(axios.get).toHaveBeenCalledWith('/api/news/1', {
        withCredentials: true,
      });
      
      // Verify result
      expect(result).toEqual(mockResponse.data);
    });
  });
  
  describe('getPrediction', () => {
    test('should fetch prediction for a news article from API', async () => {
      // Mock API response
      const mockResponse = {
        data: {
          success: true,
          data: { 
            id: 'pred-1', 
            overallImpact: 75,
            impactAreas: []
          },
          cached: false,
        },
      };
      
      // Set up axios mock
      axios.get.mockResolvedValueOnce(mockResponse);
      
      // Call the function
      const result = await getPrediction(1);
      
      // Verify axios was called correctly
      expect(axios.get).toHaveBeenCalledWith('/api/predictions/1', {
        withCredentials: true,
      });
      
      // Verify result
      expect(result).toEqual(mockResponse.data.data);
      expect(result.isCached).toBe(false);
    });
  });
  
  describe('getPredictionHistory', () => {
    test('should fetch prediction history from API', async () => {
      // Mock API response
      const mockResponse = {
        data: {
          success: true,
          data: [
            { id: 'pred-1', overallImpact: 75 },
            { id: 'pred-2', overallImpact: -30 },
          ],
          count: 2,
          page: 1,
          limit: 10,
        },
      };
      
      // Set up axios mock
      axios.get.mockResolvedValueOnce(mockResponse);
      
      // Call the function
      const result = await getPredictionHistory({ limit: 10, offset: 0 });
      
      // Verify axios was called correctly
      expect(axios.get).toHaveBeenCalledWith('/api/predictions/history', {
        params: { limit: 10, offset: 0 },
        withCredentials: true,
      });
      
      // Verify result
      expect(result).toEqual({
        predictions: mockResponse.data.data,
        total: mockResponse.data.count,
        page: mockResponse.data.page,
        limit: mockResponse.data.limit,
      });
    });
  });
}); 