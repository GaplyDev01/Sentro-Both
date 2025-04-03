import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BusinessSetupPrompt from '../BusinessSetupPrompt';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Mock the react-router-dom and auth context
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('../../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

describe('BusinessSetupPrompt', () => {
  const mockNavigate = jest.fn();
  
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
  });
  
  it('renders the business setup prompt when user has no business data', () => {
    // Mock that the user is logged in but has no business data
    useAuth.mockReturnValue({
      currentUser: {
        id: '123',
        firstName: 'John',
        lastName: 'Doe'
      }
    });
    
    render(<BusinessSetupPrompt />);
    
    // Check that the prompt is displayed
    expect(screen.getByText('Complete Your Business Setup')).toBeInTheDocument();
    expect(screen.getByText('Action Required')).toBeInTheDocument();
    expect(screen.getByText('Personalized Impact Scores')).toBeInTheDocument();
    expect(screen.getByText('Industry-Specific News')).toBeInTheDocument();
    expect(screen.getByText('Tailored Alerts')).toBeInTheDocument();
    expect(screen.getByText('John, Just 3 Simple Steps')).toBeInTheDocument();
  });
  
  it('renders the business setup prompt when business data is incomplete', () => {
    // Mock a user with incomplete business data (missing industry and size)
    useAuth.mockReturnValue({
      currentUser: {
        id: '123',
        firstName: 'Jane',
        lastName: 'Smith',
        business: {
          name: 'Test Business',
          location: 'New York'
          // Missing industry and size fields
        }
      }
    });
    
    render(<BusinessSetupPrompt />);
    
    // Check that the prompt is displayed
    expect(screen.getByText('Complete Your Business Setup')).toBeInTheDocument();
  });
  
  it('does not render when business setup is complete', () => {
    // Mock a user with complete business data
    useAuth.mockReturnValue({
      currentUser: {
        id: '123',
        firstName: 'Jane',
        lastName: 'Smith',
        business: {
          name: 'Test Business',
          industry: 'Technology',
          location: 'New York',
          size: 'Small'
        }
      }
    });
    
    const { container } = render(<BusinessSetupPrompt />);
    
    // Component should return null, so container should be empty
    expect(container.firstChild).toBeNull();
  });
  
  it('navigates to business setup page when the button is clicked', () => {
    useAuth.mockReturnValue({
      currentUser: {
        id: '123',
        firstName: 'John'
      }
    });
    
    render(<BusinessSetupPrompt />);
    
    // Click the setup button
    fireEvent.click(screen.getByText('Complete Setup'));
    
    // Check that it navigates to the business setup page
    expect(mockNavigate).toHaveBeenCalledWith('/business-setup');
  });
  
  it('renders without firstname when user data is minimal', () => {
    // Mock minimal user data without firstName
    useAuth.mockReturnValue({
      currentUser: {
        id: '123'
        // No firstName provided
      }
    });
    
    render(<BusinessSetupPrompt />);
    
    // Should render "Just 3 Simple Steps" without the name
    expect(screen.getByText('Just 3 Simple Steps')).toBeInTheDocument();
    // Should not contain "undefined, Just 3 Simple Steps"
    expect(screen.queryByText('undefined, Just 3 Simple Steps')).not.toBeInTheDocument();
  });
  
  it('correctly identifies incomplete business data when some fields are present', () => {
    // Test various incomplete combinations
    const testCases = [
      {
        business: { name: 'Test' },
        expected: true // incomplete
      },
      {
        business: { name: 'Test', industry: 'Tech' },
        expected: true // incomplete
      },
      {
        business: { name: 'Test', industry: 'Tech', location: 'NY' },
        expected: true // incomplete
      },
      {
        business: { industry: 'Tech', location: 'NY', size: 'Small' },
        expected: true // incomplete (missing name)
      }
    ];
    
    testCases.forEach((testCase, index) => {
      useAuth.mockReturnValue({
        currentUser: {
          id: '123',
          business: testCase.business
        }
      });
      
      const { unmount } = render(<BusinessSetupPrompt />);
      
      // Should render the prompt since all test cases are incomplete
      expect(screen.getByText('Complete Your Business Setup')).toBeInTheDocument();
      
      unmount();
    });
  });
  
  it('renders default component for null or undefined currentUser', () => {
    // Mock auth context with no user
    useAuth.mockReturnValue({
      currentUser: null
    });
    
    render(<BusinessSetupPrompt />);
    
    // Even with null user, the component appears to render a default state
    // This means we should check that the component renders
    expect(screen.getByText('Complete Your Business Setup')).toBeInTheDocument();
  });
  
  it('handles undefined business property', () => {
    // Mock user with no business property at all
    useAuth.mockReturnValue({
      currentUser: {
        id: '123',
        firstName: 'John',
        // No business property
      }
    });
    
    render(<BusinessSetupPrompt />);
    
    // Should show the prompt
    expect(screen.getByText('Complete Your Business Setup')).toBeInTheDocument();
  });
}); 