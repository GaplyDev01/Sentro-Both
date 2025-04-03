import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ResponsiveGrid from '../ResponsiveGrid';

// Create a test theme
const theme = createTheme();

// Wrap component with necessary providers
const renderWithTheme = (ui) => {
  return render(
    <ThemeProvider theme={theme}>
      {ui}
    </ThemeProvider>
  );
};

describe('ResponsiveGrid', () => {
  test('renders children correctly', () => {
    renderWithTheme(
      <ResponsiveGrid>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
        <div data-testid="child-3">Child 3</div>
      </ResponsiveGrid>
    );
    
    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
    expect(screen.getByTestId('child-3')).toBeInTheDocument();
  });
  
  test('creates correct number of grid items', () => {
    const { container } = renderWithTheme(
      <ResponsiveGrid>
        <div>Child 1</div>
        <div>Child 2</div>
        <div>Child 3</div>
      </ResponsiveGrid>
    );
    
    // Find all Grid items (children of the Grid container)
    const gridItems = container.querySelectorAll('.MuiGrid-item');
    
    // Should have 3 grid items
    expect(gridItems.length).toBe(3);
  });
  
  test('applies correct column width classes', () => {
    const { container } = renderWithTheme(
      <ResponsiveGrid xs={12} sm={6} md={4} lg={3}>
        <div>Child 1</div>
      </ResponsiveGrid>
    );
    
    // Find the first Grid item
    const gridItem = container.querySelector('.MuiGrid-item');
    
    // Check if it has the correct grid classes
    expect(gridItem).toHaveClass('MuiGrid-grid-xs-12');
    expect(gridItem).toHaveClass('MuiGrid-grid-sm-6');
    expect(gridItem).toHaveClass('MuiGrid-grid-md-4');
    expect(gridItem).toHaveClass('MuiGrid-grid-lg-3');
  });
  
  test('applies custom spacing', () => {
    const { container } = renderWithTheme(
      <ResponsiveGrid spacing={4}>
        <div>Child 1</div>
        <div>Child 2</div>
      </ResponsiveGrid>
    );
    
    // Find the Grid container
    const gridContainer = container.firstChild;
    
    // Check if it has the correct spacing class
    expect(gridContainer).toHaveClass('MuiGrid-spacing-xs-4');
  });
  
  test('applies custom styles', () => {
    const customBgColor = 'rgb(240, 240, 240)';
    
    const { container } = renderWithTheme(
      <ResponsiveGrid sx={{ bgcolor: customBgColor }}>
        <div>Child 1</div>
      </ResponsiveGrid>
    );
    
    // Find the Grid container
    const gridContainer = container.firstChild;
    
    // Check if custom style is applied
    expect(gridContainer).toHaveStyle(`background-color: ${customBgColor}`);
  });
}); 