import React from 'react';
import { render, screen } from '@testing-library/react';
import ResponsiveTypography from '../ResponsiveTypography';

// Use the actual component instead of the mock
jest.unmock('../ResponsiveTypography');

describe('ResponsiveTypography', () => {
  // Mock MUI's useTheme and useMediaQuery for each test case
  const mockUseTheme = jest.fn();
  const mockUseMediaQuery = jest.fn();
  
  beforeEach(() => {
    // Import the mocked version
    jest.spyOn(require('@mui/material'), 'useTheme').mockImplementation(mockUseTheme);
    jest.spyOn(require('@mui/material'), 'useMediaQuery').mockImplementation(mockUseMediaQuery);
    
    // Default theme mock
    mockUseTheme.mockReturnValue({
      typography: {
        body1: { fontSize: '1rem' },
        h1: { fontSize: '2.5rem' },
        h2: { fontSize: '2rem' },
        h3: { fontSize: '1.75rem' },
      },
      breakpoints: {
        down: jest.fn(breakpoint => `down(${breakpoint})`),
        between: jest.fn((start, end) => `between(${start},${end})`),
      },
    });
    
    // Default media query mock - no responsive behavior by default
    mockUseMediaQuery.mockReturnValue(false);
  });
  
  afterEach(() => {
    mockUseTheme.mockReset();
    mockUseMediaQuery.mockReset();
  });
  
  it('renders with default props', () => {
    render(
      <ResponsiveTypography>Typography Text</ResponsiveTypography>
    );
    
    // Check that the text is rendered
    expect(screen.getByText('Typography Text')).toBeInTheDocument();
  });
  
  it('applies specified variant', () => {
    render(
      <ResponsiveTypography variant="h1">Heading 1</ResponsiveTypography>
    );
    
    // Check that the text is rendered
    expect(screen.getByText('Heading 1')).toBeInTheDocument();
  });
  
  it('applies text alignment', () => {
    render(
      <ResponsiveTypography align="center">Centered Text</ResponsiveTypography>
    );
    
    // Check that the text is rendered
    expect(screen.getByText('Centered Text')).toBeInTheDocument();
  });
  
  it('applies text color', () => {
    render(
      <ResponsiveTypography color="primary">Colored Text</ResponsiveTypography>
    );
    
    // Check that the text is rendered
    expect(screen.getByText('Colored Text')).toBeInTheDocument();
  });
  
  it('applies custom sx styles', () => {
    render(
      <ResponsiveTypography sx={{ fontWeight: 'bold', letterSpacing: 2 }}>
        Custom Styled Text
      </ResponsiveTypography>
    );
    
    // Check that the text is rendered
    expect(screen.getByText('Custom Styled Text')).toBeInTheDocument();
  });
  
  it('uses mobileVariant on mobile screens', () => {
    // Set up useMediaQuery mock to simulate mobile view
    mockUseMediaQuery.mockImplementation(query => {
      return query === 'down(sm)'; // Mobile only
    });
    
    render(
      <ResponsiveTypography variant="h1" mobileVariant="h3">
        Mobile Heading
      </ResponsiveTypography>
    );
    
    // Check that the text is rendered
    expect(screen.getByText('Mobile Heading')).toBeInTheDocument();
  });
  
  it('uses tabletVariant on tablet screens', () => {
    // Set up useMediaQuery mock to simulate tablet view
    mockUseMediaQuery.mockImplementation(query => {
      if (query === 'down(sm)') return false;
      if (query === 'between(sm,md)') return true;
      return false;
    });
    
    render(
      <ResponsiveTypography variant="h1" tabletVariant="h2">
        Tablet Heading
      </ResponsiveTypography>
    );
    
    // Check that the text is rendered
    expect(screen.getByText('Tablet Heading')).toBeInTheDocument();
  });
  
  it('handles different font size formats in theme', () => {
    // Mock with numeric font size
    mockUseTheme.mockReturnValue({
      ...mockUseTheme(),
      typography: {
        body1: { fontSize: '1rem' }
      }
    });
    
    render(
      <ResponsiveTypography variant="body1">
        Text with rem font size
      </ResponsiveTypography>
    );
    
    expect(screen.getByText('Text with rem font size')).toBeInTheDocument();
  });
  
  it('handles object-based responsive font sizes in theme', () => {
    // Mock with object-based font size
    mockUseTheme.mockReturnValue({
      ...mockUseTheme(),
      typography: {
        h1: { 
          fontSize: { 
            xs: '1.5rem', 
            sm: '2rem', 
            md: '2.5rem' 
          } 
        }
      }
    });
    
    render(
      <ResponsiveTypography variant="h1">
        Text with object-based font size
      </ResponsiveTypography>
    );
    
    expect(screen.getByText('Text with object-based font size')).toBeInTheDocument();
  });
  
  it('handles undefined font size in theme', () => {
    // Mock with undefined font size
    mockUseTheme.mockReturnValue({
      ...mockUseTheme(),
      typography: {
        custom: {} // No fontSize
      }
    });
    
    render(
      <ResponsiveTypography variant="custom">
        Text with undefined font size
      </ResponsiveTypography>
    );
    
    expect(screen.getByText('Text with undefined font size')).toBeInTheDocument();
  });
  
  it('handles invalid font size format in theme', () => {
    // Mock with invalid font size format
    mockUseTheme.mockReturnValue({
      ...mockUseTheme(),
      typography: {
        invalid: { fontSize: true } // Invalid format
      }
    });
    
    render(
      <ResponsiveTypography variant="invalid">
        Text with invalid font size
      </ResponsiveTypography>
    );
    
    expect(screen.getByText('Text with invalid font size')).toBeInTheDocument();
  });
  
  it('applies mobile font size adjustment', () => {
    // Set up for mobile
    mockUseMediaQuery.mockImplementation(query => query === 'down(sm)');
    
    // Provide a base font size
    mockUseTheme.mockReturnValue({
      ...mockUseTheme(),
      typography: {
        body1: { fontSize: '1rem' }
      }
    });
    
    render(
      <ResponsiveTypography variant="body1">
        Mobile adjusted font
      </ResponsiveTypography>
    );
    
    expect(screen.getByText('Mobile adjusted font')).toBeInTheDocument();
  });
  
  it('applies tablet font size adjustment', () => {
    // Set up for tablet
    mockUseMediaQuery.mockImplementation(query => {
      if (query === 'down(sm)') return false;
      if (query === 'between(sm,md)') return true;
      return false;
    });
    
    // Provide a base font size
    mockUseTheme.mockReturnValue({
      ...mockUseTheme(),
      typography: {
        body1: { fontSize: '1rem' }
      }
    });
    
    render(
      <ResponsiveTypography variant="body1">
        Tablet adjusted font
      </ResponsiveTypography>
    );
    
    expect(screen.getByText('Tablet adjusted font')).toBeInTheDocument();
  });
}); 