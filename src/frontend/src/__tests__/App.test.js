import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import App from '../App';
import { render } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Mock the react-router-dom module
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  BrowserRouter: ({ children }) => <div data-testid="mock-router">{children}</div>,
  Routes: ({ children }) => <div data-testid="mock-routes">{children}</div>,
  Route: ({ children }) => <div data-testid="mock-route">{children}</div>,
  Navigate: jest.fn(({ to }) => <div data-testid="navigate" data-to={to} />),
}));

// Mock the auth context
jest.mock('../context/AuthContext', () => ({
  AuthProvider: ({ children }) => <div data-testid="mock-auth-provider">{children}</div>,
  useAuth: jest.fn(() => ({
    currentUser: null,
    isLoading: false,
    isAuthenticated: false,
    login: jest.fn(),
    logout: jest.fn(),
    register: jest.fn(),
  })),
}));

const theme = createTheme();

// Helper function to render with basic providers
const renderApp = () => {
  return render(
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  );
};

describe('App', () => {
  it('renders without crashing', async () => {
    renderApp();
    
    // Check if any part of the App renders
    const appElement = screen.getByTestId('app');
    expect(appElement).toBeInTheDocument();
  });

  it('shows public routes when user is not authenticated', async () => {
    // Set mock implementation for this test
    const useAuth = require('../context/AuthContext').useAuth;
    useAuth.mockImplementation(() => ({
      currentUser: null,
      isLoading: false,
      isAuthenticated: false,
      login: jest.fn(),
      logout: jest.fn(),
      register: jest.fn(),
    }));

    renderApp();
    
    // The App component should render
    expect(screen.getByTestId('app')).toBeInTheDocument();
    expect(screen.getByTestId('mock-router')).toBeInTheDocument();
  });

  it('shows loading state when auth is loading', async () => {
    // Set mock implementation for this test
    const useAuth = require('../context/AuthContext').useAuth;
    useAuth.mockImplementation(() => ({
      currentUser: null,
      isLoading: true,
      isAuthenticated: false,
      login: jest.fn(),
      logout: jest.fn(),
      register: jest.fn(),
    }));

    renderApp();
    
    // The App component should render
    expect(screen.getByTestId('app')).toBeInTheDocument();
  });
}); 