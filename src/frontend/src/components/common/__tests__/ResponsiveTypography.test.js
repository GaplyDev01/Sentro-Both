import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ResponsiveTypography from '../ResponsiveTypography';

// Create a test theme
const theme = createTheme({
  typography: {
    h1: {
      fontSize: '2.5rem',
    },
    h2: {
      fontSize: '2rem',
    },
    h3: {
      fontSize: '1.75rem',
    },
    body1: {
      fontSize: '1rem',
    },
    subtitle1: {
      fontSize: '0.875rem',
    },
  }
});

// Wrap component with necessary providers
const renderWithTheme = (ui) => {
  return render(
    <ThemeProvider theme={theme}>
      {ui}
    </ThemeProvider>
  );
};

describe('ResponsiveTypography', () => {
  test('renders children correctly', () => {
    renderWithTheme(
      <ResponsiveTypography>Test Typography</ResponsiveTypography>
    );
    
    expect(screen.getByText('Test Typography')).toBeInTheDocument();
  });
  
  test('applies the correct variant', () => {
    const { container } = renderWithTheme(
      <ResponsiveTypography variant="h1">Heading 1</ResponsiveTypography>
    );
    
    // Find the Typography component
    const typography = container.firstChild;
    
    // Check if it has the correct variant class
    expect(typography).toHaveClass('MuiTypography-h1');
  });
  
  test('uses mobileVariant on small screens when specified', () => {
    // Mock useMediaQuery to simulate mobile screen
    jest.spyOn(require('@mui/material'), 'useMediaQuery').mockImplementation(() => true);
    
    const { container } = renderWithTheme(
      <ResponsiveTypography variant="h1" mobileVariant="h3">
        Responsive Heading
      </ResponsiveTypography>
    );
    
    // Find the Typography component
    const typography = container.firstChild;
    
    // Check if it uses the mobileVariant
    expect(typography).toHaveClass('MuiTypography-h3');
    
    // Reset the mock
    jest.restoreAllMocks();
  });
  
  test('applies custom alignment', () => {
    const { container } = renderWithTheme(
      <ResponsiveTypography align="center">
        Centered Text
      </ResponsiveTypography>
    );
    
    // Find the Typography component
    const typography = container.firstChild;
    
    // Check if it has the correct alignment class
    expect(typography).toHaveClass('MuiTypography-alignCenter');
  });
  
  test('applies custom color', () => {
    const { container } = renderWithTheme(
      <ResponsiveTypography color="primary">
        Colored Text
      </ResponsiveTypography>
    );
    
    // Find the Typography component
    const typography = container.firstChild;
    
    // Check if it has the correct color class
    expect(typography).toHaveClass('MuiTypography-colorPrimary');
  });
  
  test('applies custom styles', () => {
    const customStyles = {
      fontWeight: 'bold',
      letterSpacing: '0.05em',
    };
    
    const { container } = renderWithTheme(
      <ResponsiveTypography sx={customStyles}>
        Styled Text
      </ResponsiveTypography>
    );
    
    // Find the Typography component
    const typography = container.firstChild;
    
    // Check if custom styles are applied
    expect(typography).toHaveStyle('font-weight: bold');
    expect(typography).toHaveStyle('letter-spacing: 0.05em');
  });
}); 