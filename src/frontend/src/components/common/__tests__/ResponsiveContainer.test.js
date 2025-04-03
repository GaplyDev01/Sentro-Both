import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ResponsiveContainer from '../../../../../frontend/components/common/ResponsiveContainer';

// Create a test theme
const theme = createTheme();

// Helper function to render with ThemeProvider
const renderWithTheme = (ui) => {
  return render(
    <ThemeProvider theme={theme}>
      {ui}
    </ThemeProvider>
  );
};

describe('ResponsiveContainer', () => {
  it('renders children correctly', () => {
    renderWithTheme(
      <ResponsiveContainer>
        <div data-testid="child">Test content</div>
      </ResponsiveContainer>
    );
    
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('applies maxWidth correctly', () => {
    renderWithTheme(
      <ResponsiveContainer maxWidth="sm">
        <div>Content</div>
      </ResponsiveContainer>
    );
    
    // Check if the MUI Container has the maxWidth prop applied
    const container = document.querySelector('.MuiContainer-maxWidthSm');
    expect(container).toBeInTheDocument();
  });

  it('applies custom styles via sx prop', () => {
    const customBgColor = 'rgb(240, 240, 240)';
    
    renderWithTheme(
      <ResponsiveContainer sx={{ bgcolor: customBgColor }}>
        <div>Content</div>
      </ResponsiveContainer>
    );
    
    const container = document.querySelector('.MuiContainer-root');
    expect(container).toHaveStyle(`background-color: ${customBgColor}`);
  });

  it('renders without gutters when disableGutters is true', () => {
    renderWithTheme(
      <ResponsiveContainer disableGutters={true}>
        <div>Content</div>
      </ResponsiveContainer>
    );
    
    const container = document.querySelector('.MuiContainer-disableGutters');
    expect(container).toBeInTheDocument();
  });
}); 