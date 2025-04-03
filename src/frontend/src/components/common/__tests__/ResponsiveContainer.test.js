import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ResponsiveContainer from '../ResponsiveContainer';

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

describe('ResponsiveContainer', () => {
  test('renders children correctly', () => {
    renderWithTheme(
      <ResponsiveContainer>
        <div data-testid="test-child">Test Content</div>
      </ResponsiveContainer>
    );
    
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
  
  test('applies correct max width', () => {
    const { container } = renderWithTheme(
      <ResponsiveContainer maxWidth="sm">
        <div>Test Content</div>
      </ResponsiveContainer>
    );
    
    // Find the Container component
    const containerElement = container.firstChild;
    
    // Check if it has the correct max-width class
    expect(containerElement).toHaveClass('MuiContainer-maxWidthSm');
  });
  
  test('applies custom styles', () => {
    const customBgColor = 'rgb(240, 240, 240)';
    
    const { container } = renderWithTheme(
      <ResponsiveContainer sx={{ bgcolor: customBgColor }}>
        <div>Test Content</div>
      </ResponsiveContainer>
    );
    
    // Find the Container component
    const containerElement = container.firstChild;
    
    // Check if custom style is applied
    expect(containerElement).toHaveStyle(`background-color: ${customBgColor}`);
  });
  
  test('disables gutters when specified', () => {
    const { container } = renderWithTheme(
      <ResponsiveContainer disableGutters={true}>
        <div>Test Content</div>
      </ResponsiveContainer>
    );
    
    // Find the Container component
    const containerElement = container.firstChild;
    
    // Check if it has the disableGutters class
    expect(containerElement).toHaveClass('MuiContainer-disableGutters');
  });
}); 