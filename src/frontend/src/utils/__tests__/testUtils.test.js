import React from 'react';
import { screen, render } from '@testing-library/react';
import { renderWithProviders, createMockAuthContext, mockNewsService } from '../testUtils';

// We'll just test the createMockAuthContext and mockNewsService functions directly
// since they're easier to test without complicated mocking
describe('testUtils', () => {
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
      expect(authContext.currentUser.businessDetails).toBeDefined();
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
          role: 'admin',
          businessDetails: { industry: 'Healthcare' }
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
      expect(authContext.currentUser.businessDetails.industry).toBe('Healthcare');
      
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
  
  // Simple test for renderWithProviders
  describe('renderWithProviders', () => {
    it('renders the provided component', () => {
      const TestComponent = () => <div data-testid="test-component">Test Content</div>;
      
      renderWithProviders(<TestComponent />);
      
      // Check that the component renders
      expect(screen.getByTestId('test-component')).toBeInTheDocument();
      expect(screen.getByTestId('test-component')).toHaveTextContent('Test Content');
    });
  });
}); 