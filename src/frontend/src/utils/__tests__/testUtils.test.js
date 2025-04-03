import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders, createMockAuthContext, mockNewsService } from '../testUtils';
import { AuthProvider } from '../../context/AuthContext';

// Mock dependencies
jest.mock('../../context/AuthContext', () => ({
  AuthProvider: ({ children }) => <div data-testid="auth-provider">{children}</div>
}));

jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }) => <div data-testid="browser-router">{children}</div>
}));

jest.mock('@mui/material/styles', () => ({
  ThemeProvider: ({ children }) => <div data-testid="theme-provider">{children}</div>,
  createTheme: jest.fn().mockReturnValue({ mockTheme: true })
}));

describe('testUtils', () => {
  describe('renderWithProviders', () => {
    it('renders component with all providers', () => {
      const TestComponent = () => <div data-testid="test-component">Test Content</div>;
      
      renderWithProviders(<TestComponent />);
      
      // Check that the component renders
      expect(screen.getByTestId('test-component')).toBeInTheDocument();
      expect(screen.getByTestId('test-component')).toHaveTextContent('Test Content');
      
      // Check that all providers are used
      expect(screen.getByTestId('theme-provider')).toBeInTheDocument();
      expect(screen.getByTestId('browser-router')).toBeInTheDocument();
      expect(screen.getByTestId('auth-provider')).toBeInTheDocument();
    });
    
    it('sets custom route when provided', () => {
      const originalPushState = window.history.pushState;
      window.history.pushState = jest.fn();
      
      const TestComponent = () => <div>Test</div>;
      renderWithProviders(<TestComponent />, { route: '/test-route' });
      
      expect(window.history.pushState).toHaveBeenCalledWith(
        {}, 
        'Test page', 
        '/test-route'
      );
      
      // Restore original
      window.history.pushState = originalPushState;
    });
    
    it('uses default route when not provided', () => {
      const originalPushState = window.history.pushState;
      window.history.pushState = jest.fn();
      
      const TestComponent = () => <div>Test</div>;
      renderWithProviders(<TestComponent />);
      
      expect(window.history.pushState).toHaveBeenCalledWith(
        {}, 
        'Test page', 
        '/'
      );
      
      // Restore original
      window.history.pushState = originalPushState;
    });
    
    it('passes additional render options to RTL render', () => {
      const TestComponent = () => <div>Test</div>;
      const container = document.createElement('div');
      
      renderWithProviders(<TestComponent />, { container });
      
      // If the container was used, the component should be rendered inside it
      expect(container.textContent).toBe('Test');
    });
  });
  
  describe('createMockAuthContext', () => {
    it('returns default mock auth context', () => {
      const authContext = createMockAuthContext();
      
      // Check default user values
      expect(authContext.currentUser).toBeDefined();
      expect(authContext.currentUser.id).toBe('test-user-id');
      expect(authContext.currentUser.email).toBe('test@example.com');
      expect(authContext.currentUser.displayName).toBe('Test User');
      expect(authContext.currentUser.businessName).toBe('Test Business');
      expect(authContext.currentUser.setupCompleted).toBe(true);
      expect(authContext.currentUser.businessDetails.industry).toBe('Technology');
      
      // Check default state
      expect(authContext.loading).toBe(false);
      expect(authContext.error).toBeNull();
      
      // Check that mock functions are provided
      expect(typeof authContext.login).toBe('function');
      expect(typeof authContext.register).toBe('function');
      expect(typeof authContext.logout).toBe('function');
      expect(typeof authContext.resetPassword).toBe('function');
      expect(typeof authContext.updateProfile).toBe('function');
      expect(typeof authContext.updateBusinessDetails).toBe('function');
      expect(typeof authContext.isAdmin).toBe('function');
      
      // Verify isAdmin default behavior
      expect(authContext.isAdmin()).toBe(false);
    });
    
    it('overrides default values with provided values', () => {
      const customValues = {
        currentUser: {
          id: 'custom-id',
          email: 'custom@example.com',
          role: 'admin'
        },
        loading: true,
        error: 'Custom error',
        isAdmin: jest.fn().mockReturnValue(true)
      };
      
      const authContext = createMockAuthContext(customValues);
      
      // Check that values are overridden
      expect(authContext.currentUser.id).toBe('custom-id');
      expect(authContext.currentUser.email).toBe('custom@example.com');
      expect(authContext.currentUser.role).toBe('admin');
      
      // Default values not explicitly overridden should still exist
      expect(authContext.currentUser.businessDetails).toBeDefined();
      
      // Check state overrides
      expect(authContext.loading).toBe(true);
      expect(authContext.error).toBe('Custom error');
      
      // Check function override
      expect(authContext.isAdmin()).toBe(true);
    });
  });
  
  describe('mockNewsService', () => {
    it('mocks getNewsFeed with expected data', async () => {
      const result = await mockNewsService.getNewsFeed();
      
      expect(result.articles).toHaveLength(2);
      expect(result.articles[0].id).toBe(1);
      expect(result.articles[0].title).toBe('Test Article 1');
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.hasMore).toBe(false);
    });
    
    it('mocks getNewsById with dynamic id', async () => {
      const result = await mockNewsService.getNewsById(123);
      
      expect(result.id).toBe(123);
      expect(result.title).toBe('Test Article 123');
      expect(result.summary).toBe('This is a test article');
      expect(result.content).toBe('Detailed content goes here');
    });
    
    it('mocks getPrediction with expected data', async () => {
      const result = await mockNewsService.getPrediction();
      
      expect(result.id).toBe('pred-1');
      expect(result.overallImpact).toBe(75);
      expect(result.confidenceLevel).toBe(80);
      expect(result.impactAreas).toHaveLength(2);
      expect(result.recommendations).toHaveLength(1);
    });
    
    it('mocks getPredictionHistory with expected data', async () => {
      const result = await mockNewsService.getPredictionHistory();
      
      expect(result.predictions).toHaveLength(2);
      expect(result.predictions[0].id).toBe('pred-1');
      expect(result.predictions[1].id).toBe('pred-2');
      expect(result.total).toBe(2);
    });
  });
}); 