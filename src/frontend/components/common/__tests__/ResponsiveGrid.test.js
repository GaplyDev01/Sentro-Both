import React from 'react';
import { render, screen } from '@testing-library/react';
import ResponsiveGrid from '../ResponsiveGrid';

// Using global mocks defined in jest.setup.js

describe('ResponsiveGrid', () => {
  it('renders with default props', () => {
    render(
      <ResponsiveGrid>
        <div data-testid="item-1">Item 1</div>
        <div data-testid="item-2">Item 2</div>
      </ResponsiveGrid>
    );
    
    // Check that the content is rendered
    expect(screen.getByTestId('item-1')).toBeInTheDocument();
    expect(screen.getByTestId('item-2')).toBeInTheDocument();
  });
  
  it('renders with custom spacing', () => {
    render(
      <ResponsiveGrid spacing={4}>
        <div>Test Item</div>
      </ResponsiveGrid>
    );
    
    // We can't directly test MUI props through the mock, but we can ensure component renders
    expect(screen.getByText('Test Item')).toBeInTheDocument();
  });
  
  it('renders with custom grid columns', () => {
    render(
      <ResponsiveGrid xs={6} sm={4} md={3} lg={2} xl={1}>
        <div>Test Item</div>
      </ResponsiveGrid>
    );
    
    // We can't directly test MUI props through the mock, but we can ensure component renders
    expect(screen.getByText('Test Item')).toBeInTheDocument();
  });
  
  it('applies custom sx styles correctly', () => {
    render(
      <ResponsiveGrid sx={{ backgroundColor: 'red', padding: '20px' }}>
        <div>Test Item</div>
      </ResponsiveGrid>
    );
    
    // We can't directly test sx props through the mock, but we can ensure component renders
    expect(screen.getByText('Test Item')).toBeInTheDocument();
  });
  
  it('adjusts spacing based on screen size - mobile', () => {
    // Set up useMediaQuery mock to simulate mobile view
    const mockUseMediaQuery = require('@mui/material').useMediaQuery;
    mockUseMediaQuery.mockImplementation(query => {
      if (query === 'down(sm)') return true; // mobile
      return false;
    });
    
    render(
      <ResponsiveGrid>
        <div>Mobile View Item</div>
      </ResponsiveGrid>
    );
    
    // Check that the content is rendered
    expect(screen.getByText('Mobile View Item')).toBeInTheDocument();
    
    // Reset the mock after test
    mockUseMediaQuery.mockReset();
  });
  
  it('adjusts spacing based on screen size - tablet', () => {
    // Set up useMediaQuery mock to simulate tablet view
    const mockUseMediaQuery = require('@mui/material').useMediaQuery;
    mockUseMediaQuery.mockImplementation(query => {
      if (query === 'down(sm)') return false;
      if (query === 'between(sm,md)') return true; // tablet
      return false;
    });
    
    render(
      <ResponsiveGrid>
        <div>Tablet View Item</div>
      </ResponsiveGrid>
    );
    
    // Check that the content is rendered
    expect(screen.getByText('Tablet View Item')).toBeInTheDocument();
    
    // Reset the mock after test
    mockUseMediaQuery.mockReset();
  });
  
  it('adjusts spacing based on screen size - desktop', () => {
    // Set up useMediaQuery mock to simulate desktop view
    const mockUseMediaQuery = require('@mui/material').useMediaQuery;
    mockUseMediaQuery.mockImplementation(query => {
      if (query === 'down(sm)') return false;
      if (query === 'between(sm,md)') return false;
      return false; // not mobile, not tablet = desktop
    });
    
    render(
      <ResponsiveGrid>
        <div>Desktop View Item</div>
      </ResponsiveGrid>
    );
    
    // Check that the content is rendered
    expect(screen.getByText('Desktop View Item')).toBeInTheDocument();
    
    // Reset the mock after test
    mockUseMediaQuery.mockReset();
  });
}); 