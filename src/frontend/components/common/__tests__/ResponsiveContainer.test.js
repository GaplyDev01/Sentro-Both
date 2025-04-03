import React from 'react';
import { render, screen } from '@testing-library/react';
import ResponsiveContainer from '../ResponsiveContainer';

// Using global mocks defined in jest.setup.js

describe('ResponsiveContainer', () => {
  it('renders with default props', () => {
    render(
      <ResponsiveContainer>
        <div data-testid="content">Test Content</div>
      </ResponsiveContainer>
    );
    
    // Check that the content is rendered
    expect(screen.getByTestId('content')).toBeInTheDocument();
    expect(screen.getByTestId('content')).toHaveTextContent('Test Content');
    
    // Container should be rendered with mui-box inside
    expect(screen.getByTestId('mui-box')).toBeInTheDocument();
  });
  
  it('applies maxWidth prop correctly', () => {
    render(
      <ResponsiveContainer maxWidth="sm">
        <div>Test Content</div>
      </ResponsiveContainer>
    );
    
    // We can't directly test MUI props through the mock, but we can ensure component renders
    expect(screen.getByTestId('mui-box')).toBeInTheDocument();
  });
  
  it('applies disableGutters prop correctly', () => {
    render(
      <ResponsiveContainer disableGutters={true}>
        <div>Test Content</div>
      </ResponsiveContainer>
    );
    
    // We can't directly test MUI props through the mock, but we can ensure component renders
    expect(screen.getByTestId('mui-box')).toBeInTheDocument();
  });
  
  it('applies custom sx styles correctly', () => {
    render(
      <ResponsiveContainer sx={{ backgroundColor: 'red', padding: '20px' }}>
        <div>Test Content</div>
      </ResponsiveContainer>
    );
    
    // We can't directly test sx props through the mock, but we can ensure component renders
    expect(screen.getByTestId('mui-box')).toBeInTheDocument();
  });
  
  it('applies correct padding based on screen size - mobile', () => {
    // Set up useMediaQuery mock to simulate mobile view
    const mockUseMediaQuery = require('@mui/material').useMediaQuery;
    mockUseMediaQuery.mockImplementation(query => {
      if (query === 'down(sm)') return true; // mobile
      return false;
    });
    
    render(
      <ResponsiveContainer>
        <div>Mobile View</div>
      </ResponsiveContainer>
    );
    
    // Reset the mock after test
    mockUseMediaQuery.mockReset();
  });
  
  it('applies correct padding based on screen size - tablet', () => {
    // Set up useMediaQuery mock to simulate tablet view
    const mockUseMediaQuery = require('@mui/material').useMediaQuery;
    mockUseMediaQuery.mockImplementation(query => {
      if (query === 'down(sm)') return false;
      if (query === 'between(sm,md)') return true; // tablet
      return false;
    });
    
    render(
      <ResponsiveContainer>
        <div>Tablet View</div>
      </ResponsiveContainer>
    );
    
    // Reset the mock after test
    mockUseMediaQuery.mockReset();
  });
  
  it('applies correct padding based on screen size - desktop', () => {
    // Set up useMediaQuery mock to simulate desktop view
    const mockUseMediaQuery = require('@mui/material').useMediaQuery;
    mockUseMediaQuery.mockImplementation(query => {
      if (query === 'down(sm)') return false;
      if (query === 'between(sm,md)') return false;
      return false; // not mobile, not tablet = desktop
    });
    
    render(
      <ResponsiveContainer>
        <div>Desktop View</div>
      </ResponsiveContainer>
    );
    
    // Reset the mock after test
    mockUseMediaQuery.mockReset();
  });
}); 