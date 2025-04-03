import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MainLayout from '../MainLayout';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate, Outlet } from 'react-router-dom';
import { useMediaQuery, useTheme } from '@mui/material';

// Mock ResponsiveTypography to avoid theme rendering issues
jest.mock('../../common/ResponsiveTypography', () => {
  return {
    __esModule: true,
    default: ({ children, variant, ...props }) => (
      <div data-testid="mock-responsive-typography" {...props}>
        {children}
      </div>
    ),
  };
});

// Mock dependencies
jest.mock('react-router-dom', () => ({
  Outlet: jest.fn(() => <div data-testid="outlet">Outlet Content</div>),
  useNavigate: jest.fn(),
}));

jest.mock('@mui/material', () => {
  const original = jest.requireActual('@mui/material');
  return {
    ...original,
    useMediaQuery: jest.fn(),
    useTheme: jest.fn().mockReturnValue({
      breakpoints: {
        down: jest.fn().mockImplementation(size => size === 'sm'),
        between: jest.fn().mockImplementation((start, end) => start === 'sm' && end === 'md'),
      },
      zIndex: {
        drawer: 1200,
        appBar: 1100,
        tooltip: 1500,
      },
      palette: {
        primary: { main: '#1976d2' },
        background: { default: '#fff', paper: '#fff' },
      },
      typography: {
        h6: { fontSize: '1.25rem' },
        body1: { fontSize: '1rem' },
        body2: { fontSize: '0.875rem' },
      },
    }),
  };
});

jest.mock('../../../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

describe('MainLayout', () => {
  const mockNavigate = jest.fn();
  const mockLogout = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock navigate function
    useNavigate.mockReturnValue(mockNavigate);
    
    // Mock default auth context values
    useAuth.mockReturnValue({
      currentUser: {
        id: '123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      },
      logout: mockLogout,
      isAdmin: jest.fn().mockReturnValue(false),
    });
  });
  
  it('renders main layout with navigation and content', () => {
    render(<MainLayout />);
    
    // Check that the main navigation elements are rendered
    expect(screen.getAllByText('Home')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Dashboard')[0]).toBeInTheDocument();
    expect(screen.getAllByText('News Feed')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Bookmarks')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Profile')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Settings')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Logout')[0]).toBeInTheDocument();
    
    // Check that the outlet content is rendered
    expect(screen.getByTestId('outlet')).toBeInTheDocument();
  });
  
  it('navigates to different pages when menu items are clicked', () => {
    render(<MainLayout />);
    
    // Click on the Home menu item
    fireEvent.click(screen.getAllByText('Home')[0]);
    expect(mockNavigate).toHaveBeenCalledWith('/');
    
    // Click on the Dashboard menu item
    fireEvent.click(screen.getAllByText('Dashboard')[0]);
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    
    // Click on the News Feed menu item
    fireEvent.click(screen.getAllByText('News Feed')[0]);
    expect(mockNavigate).toHaveBeenCalledWith('/news');
    
    // Click on the Bookmarks menu item
    fireEvent.click(screen.getAllByText('Bookmarks')[0]);
    expect(mockNavigate).toHaveBeenCalledWith('/bookmarks');
    
    // Click on the Profile menu item
    fireEvent.click(screen.getAllByText('Profile')[0]);
    expect(mockNavigate).toHaveBeenCalledWith('/profile');
    
    // Click on the Settings menu item
    fireEvent.click(screen.getAllByText('Settings')[0]);
    expect(mockNavigate).toHaveBeenCalledWith('/settings');
  });
  
  it('logs out user when logout is clicked', async () => {
    render(<MainLayout />);
    
    // Click on the Logout menu item
    fireEvent.click(screen.getAllByText('Logout')[0]);
    
    // Should call logout and navigate to login page
    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });
  
  it('handles logout error', async () => {
    // Mock logout to throw an error
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockLogout.mockRejectedValue(new Error('Logout failed'));
    
    render(<MainLayout />);
    
    // Click on the Logout menu item
    fireEvent.click(screen.getAllByText('Logout')[0]);
    
    // Should log the error
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Logout error:', expect.any(Error));
    });
    
    consoleErrorSpy.mockRestore();
  });
  
  it('shows admin dashboard option for admin users', () => {
    // Mock user as admin
    useAuth.mockReturnValue({
      currentUser: { id: '123', firstName: 'Admin', lastName: 'User' },
      logout: mockLogout,
      isAdmin: jest.fn().mockReturnValue(true),
    });
    
    render(<MainLayout />);
    
    // Check that the Admin Dashboard menu item is displayed
    expect(screen.getAllByText('Admin Dashboard')[0]).toBeInTheDocument();
    
    // Click on the Admin Dashboard menu item
    fireEvent.click(screen.getAllByText('Admin Dashboard')[0]);
    expect(mockNavigate).toHaveBeenCalledWith('/admin');
  });
  
  it('adapts to mobile view', () => {
    // Update useMediaQuery to return true for mobile
    useMediaQuery.mockImplementation(query => {
      if (query === 'down(sm)') return true; // mobile
      return false;
    });
    
    render(<MainLayout />);
    
    // Click menu button to open drawer
    fireEvent.click(screen.getByRole('button', { name: /menu/i }));
    
    // Navigate to a page
    fireEvent.click(screen.getAllByText('Home')[0]);
    
    // Should close drawer after navigation in mobile mode
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
  
  it('toggles drawer when menu button is clicked', () => {
    // Mock mobile view
    useMediaQuery.mockImplementation(query => {
      if (query === 'down(sm)') return true; // mobile
      return false;
    });
    
    render(<MainLayout />);
    
    // Get menu button and click to toggle drawer
    const menuButton = screen.getByRole('button', { name: /menu/i });
    fireEvent.click(menuButton);
    
    // Click again to close drawer
    fireEvent.click(menuButton);
  });
}); 