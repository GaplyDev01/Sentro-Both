import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import App from '../App';
import { renderWithProviders } from '../utils/testUtils';
import { useAuth } from '../context/AuthContext';

// Mock the auth context hook
jest.mock('../context/AuthContext', () => ({
  AuthProvider: ({ children }) => children,
  useAuth: jest.fn(),
}));

// Mock the route components
jest.mock('../pages/HomePage', () => () => <div data-testid="home-page">Home Page</div>);
jest.mock('../pages/LoginPage', () => () => <div data-testid="login-page">Login Page</div>);
jest.mock('../pages/RegisterPage', () => () => <div data-testid="register-page">Register Page</div>);

describe('App', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
  });

  test('renders login page for unauthenticated users', async () => {
    // Set up auth context to return no current user
    useAuth.mockReturnValue({
      currentUser: null,
      loading: false,
    });
    
    // Navigate to the home route which should redirect to login
    renderWithProviders(<App />, { route: '/' });
    
    // Wait for route to redirect
    await waitFor(() => {
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
    });
  });
  
  test('renders home page for authenticated users', async () => {
    // Set up auth context to return a current user
    useAuth.mockReturnValue({
      currentUser: { id: 'test-user-id' },
      loading: false,
      isAdmin: () => false,
    });
    
    // Navigate to the home route
    renderWithProviders(<App />, { route: '/' });
    
    // Wait for route to render
    await waitFor(() => {
      expect(screen.getByTestId('home-page')).toBeInTheDocument();
    });
  });
  
  test('shows loading state when auth is loading', async () => {
    // Set up auth context to return loading state
    useAuth.mockReturnValue({
      currentUser: null,
      loading: true,
    });
    
    // Navigate to the home route
    const { container } = renderWithProviders(<App />, { route: '/' });
    
    // Should not show login or home page yet
    expect(screen.queryByTestId('login-page')).not.toBeInTheDocument();
    expect(screen.queryByTestId('home-page')).not.toBeInTheDocument();
    
    // Update auth to finish loading (unauthenticated)
    useAuth.mockReturnValue({
      currentUser: null,
      loading: false,
    });
    
    // Wait for login page to render after loading
    await waitFor(() => {
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
    });
  });
  
  test('allows access to register page for unauthenticated users', async () => {
    // Set up auth context to return no current user
    useAuth.mockReturnValue({
      currentUser: null,
      loading: false,
    });
    
    // Navigate to the register route
    renderWithProviders(<App />, { route: '/register' });
    
    // Register page should be accessible
    await waitFor(() => {
      expect(screen.getByTestId('register-page')).toBeInTheDocument();
    });
  });
}); 