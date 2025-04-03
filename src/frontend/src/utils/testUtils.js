import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';

/**
 * Custom render function that includes providers needed for testing
 * @param {React.ReactElement} ui - The component to render
 * @param {Object} options - Options for render
 * @returns {Object} The return value of render
 */
export function renderWithProviders(ui, options = {}) {
  const {
    route = '/',
    theme = createTheme(),
    ...renderOptions
  } = options;

  // Set the initial window location
  window.history.pushState({}, 'Test page', route);

  const Wrapper = ({ children }) => {
    return (
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <AuthProvider>
            {children}
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    );
  };

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

/**
 * Creates a mock of the Auth context with custom values
 * @param {Object} authValues - Custom auth values to override defaults
 * @returns {Object} Auth context object
 */
export function createMockAuthContext(authValues = {}) {
  return {
    currentUser: {
      id: 'test-user-id',
      email: 'test@example.com',
      displayName: 'Test User',
      businessName: 'Test Business',
      setupCompleted: true,
      businessDetails: {
        industry: 'Technology',
        location: 'New York',
        size: 'Medium',
      },
      ...authValues.currentUser,
    },
    loading: false,
    error: null,
    login: jest.fn().mockResolvedValue({}),
    register: jest.fn().mockResolvedValue({}),
    logout: jest.fn().mockResolvedValue({}),
    resetPassword: jest.fn().mockResolvedValue({}),
    updateProfile: jest.fn().mockResolvedValue({}),
    updateBusinessDetails: jest.fn().mockResolvedValue({}),
    isAdmin: jest.fn().mockReturnValue(false),
    ...authValues,
  };
}

/**
 * Creates a mock of the news service with fixed responses
 */
export const mockNewsService = {
  getNewsFeed: jest.fn().mockResolvedValue({
    articles: [
      {
        id: 1,
        title: 'Test Article 1',
        summary: 'This is a test article',
        category: 'Technology',
        impactScore: 75,
        date: '2023-04-01',
        source: 'Test Source',
      },
      {
        id: 2,
        title: 'Test Article 2',
        summary: 'This is another test article',
        category: 'Finance',
        impactScore: 45,
        date: '2023-03-30',
        source: 'Another Source',
      },
    ],
    total: 2,
    page: 1,
    limit: 10,
    hasMore: false,
  }),
  getNewsById: jest.fn().mockImplementation((id) => {
    return Promise.resolve({
      id,
      title: `Test Article ${id}`,
      summary: 'This is a test article',
      content: 'Detailed content goes here',
      category: 'Technology',
      impactScore: 75,
      date: '2023-04-01',
      source: 'Test Source',
    });
  }),
  getPrediction: jest.fn().mockResolvedValue({
    id: 'pred-1',
    overallImpact: 75,
    confidenceLevel: 80,
    impactAreas: [
      { name: 'Financial', score: 70, description: 'Financial impact description' },
      { name: 'Operational', score: 80, description: 'Operational impact description' },
    ],
    recommendations: [
      { title: 'Recommendation 1', description: 'Description 1', priority: 'high' },
    ],
  }),
  getPredictionHistory: jest.fn().mockResolvedValue({
    predictions: [
      { id: 'pred-1', overallImpact: 75, confidenceLevel: 80 },
      { id: 'pred-2', overallImpact: -30, confidenceLevel: 70 },
    ],
    total: 2,
    page: 1,
    limit: 10,
  }),
}; 