import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ResponsiveGrid from '../../../../../frontend/components/common/ResponsiveGrid';

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

describe('ResponsiveGrid', () => {
  it('renders children correctly', () => {
    renderWithTheme(
      <ResponsiveGrid>
        <div data-testid="child">Test content</div>
      </ResponsiveGrid>
    );
    
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('renders as a container when container prop is true', () => {
    renderWithTheme(
      <ResponsiveGrid container>
        <div data-testid="child">Test content</div>
      </ResponsiveGrid>
    );
    
    const gridElement = document.querySelector('.MuiGrid-container');
    expect(gridElement).toBeInTheDocument();
  });

  it('applies responsive grid breakpoints correctly', () => {
    renderWithTheme(
      <ResponsiveGrid xs={12} sm={6} md={4} lg={3}>
        <div>Content</div>
      </ResponsiveGrid>
    );
    
    const gridElement = document.querySelector('.MuiGrid-grid-xs-12');
    expect(gridElement).toBeInTheDocument();
    
    const smGridElement = document.querySelector('.MuiGrid-grid-sm-6');
    expect(smGridElement).toBeInTheDocument();
    
    const mdGridElement = document.querySelector('.MuiGrid-grid-md-4');
    expect(mdGridElement).toBeInTheDocument();
    
    const lgGridElement = document.querySelector('.MuiGrid-grid-lg-3');
    expect(lgGridElement).toBeInTheDocument();
  });

  it('applies spacing correctly', () => {
    renderWithTheme(
      <ResponsiveGrid spacing={4}>
        <div>Content</div>
      </ResponsiveGrid>
    );
    
    const gridElement = document.querySelector('.MuiGrid-spacing-xs-4');
    expect(gridElement).toBeInTheDocument();
  });

  it('applies custom styles via sx prop', () => {
    const customBgColor = 'rgb(240, 240, 240)';
    
    renderWithTheme(
      <ResponsiveGrid sx={{ bgcolor: customBgColor }}>
        <div>Content</div>
      </ResponsiveGrid>
    );
    
    const gridElement = document.querySelector('.MuiGrid-root');
    expect(gridElement).toHaveStyle(`background-color: ${customBgColor}`);
  });
}); 