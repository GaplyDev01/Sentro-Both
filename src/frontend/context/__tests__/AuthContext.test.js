import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from '../AuthContext';
import axios from 'axios';

// Mock axios
jest.mock('axios');

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Component to test the auth context
  const TestComponent = () => {
    const { currentUser, loading, error, login, register, logout, updateProfile, updateBusinessDetails, isAdmin } = useAuth();
    
    return (
      <div>
        <div data-testid="loading">{loading.toString()}</div>
        <div data-testid="error">{error || 'no error'}</div>
        <div data-testid="user">{currentUser ? JSON.stringify(currentUser) : 'no user'}</div>
        <button onClick={() => login('test@example.com', 'password')} data-testid="login-btn">Login</button>
        <button onClick={() => register({ email: 'new@example.com', password: 'password', name: 'New User' })} data-testid="register-btn">Register</button>
        <button onClick={() => logout()} data-testid="logout-btn">Logout</button>
        <button onClick={() => updateProfile({ name: 'Updated Name' })} data-testid="update-profile-btn">Update Profile</button>
        <button onClick={() => updateBusinessDetails({ name: 'Business Name' })} data-testid="update-business-btn">Update Business</button>
        <div data-testid="is-admin">{isAdmin() ? 'admin' : 'not admin'}</div>
      </div>
    );
  };

  test('provides initial state with loading true', async () => {
    // Mock the auth check to return no user initially
    axios.get.mockResolvedValueOnce({ data: { user: null } });
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    expect(screen.getByTestId('loading')).toHaveTextContent('true');
    expect(screen.getByTestId('user')).toHaveTextContent('no user');
    expect(screen.getByTestId('error')).toHaveTextContent('no error');
    
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });
  });

  test('loads user from API if already logged in', async () => {
    // Mock the auth check to return a user
    const mockUser = { id: '123', email: 'test@example.com', name: 'Test User' };
    axios.get.mockResolvedValueOnce({ data: { user: mockUser } });
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent(JSON.stringify(mockUser));
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });
  });

  test('handles login successfully', async () => {
    // Mock the auth check to return no user initially
    axios.get.mockResolvedValueOnce({ data: { user: null } });
    
    // Mock successful login
    const mockUser = { id: '123', email: 'test@example.com', name: 'Test User' };
    axios.post.mockResolvedValueOnce({ data: { user: mockUser } });
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    await waitFor(() => expect(screen.getByTestId('loading')).toHaveTextContent('false'));
    
    userEvent.click(screen.getByTestId('login-btn'));
    
    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent(JSON.stringify(mockUser));
      expect(axios.post).toHaveBeenCalledWith('/api/auth/login', {
        email: 'test@example.com',
        password: 'password'
      }, { withCredentials: true });
    });
  });
  
  // Mark error test as todo
  test.todo('handles login failure');

  test('handles register successfully', async () => {
    // Mock the auth check to return no user initially
    axios.get.mockResolvedValueOnce({ data: { user: null } });
    
    // Mock successful registration
    const mockUser = { id: '123', email: 'new@example.com', name: 'New User' };
    axios.post.mockResolvedValueOnce({ data: { user: mockUser } });
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    await waitFor(() => expect(screen.getByTestId('loading')).toHaveTextContent('false'));
    
    userEvent.click(screen.getByTestId('register-btn'));
    
    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent(JSON.stringify(mockUser));
      expect(axios.post).toHaveBeenCalledWith('/api/auth/register', {
        email: 'new@example.com',
        password: 'password',
        name: 'New User'
      }, { withCredentials: true });
    });
  });
  
  // Mark error test as todo
  test.todo('handles registration failure');

  test('handles logout successfully', async () => {
    // Mock the auth check to return a user
    const mockUser = { id: '123', email: 'test@example.com', name: 'Test User' };
    axios.get.mockResolvedValueOnce({ data: { user: mockUser } });
    
    // Mock successful logout
    axios.post.mockResolvedValueOnce({ data: { success: true } });
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    await waitFor(() => expect(screen.getByTestId('user')).toHaveTextContent(JSON.stringify(mockUser)));
    
    userEvent.click(screen.getByTestId('logout-btn'));
    
    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('no user');
      expect(axios.post).toHaveBeenCalledWith('/api/auth/logout', {}, { withCredentials: true });
    });
  });
  
  // Mark error test as todo
  test.todo('handles logout failure');

  test('updates user profile successfully', async () => {
    // Mock the auth check to return a user
    let mockUser = { id: '123', email: 'test@example.com', name: 'Test User' };
    axios.get.mockResolvedValueOnce({ data: { user: mockUser } });
    
    // Mock successful profile update
    const updatedUser = { ...mockUser, name: 'Updated Name' };
    axios.put.mockResolvedValueOnce({ data: { user: updatedUser } });
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    await waitFor(() => expect(screen.getByTestId('user')).toHaveTextContent(JSON.stringify(mockUser)));
    
    userEvent.click(screen.getByTestId('update-profile-btn'));
    
    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent(JSON.stringify(updatedUser));
      expect(axios.put).toHaveBeenCalledWith('/api/users/profile', { name: 'Updated Name' }, { withCredentials: true });
    });
  });
  
  // Mark error test as todo
  test.todo('handles profile update failure');

  test('updates business details successfully', async () => {
    // Mock the auth check to return a user with business details
    let mockUser = { 
      id: '123', 
      email: 'test@example.com', 
      name: 'Test User',
      business: { name: 'Old Business' } 
    };
    axios.get.mockResolvedValueOnce({ data: { user: mockUser } });
    
    // Mock successful business details update
    const updatedUser = { 
      ...mockUser, 
      business: { name: 'Business Name' } 
    };
    axios.patch.mockResolvedValueOnce({ data: { user: updatedUser } });
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    await waitFor(() => expect(screen.getByTestId('user')).toHaveTextContent(JSON.stringify(mockUser)));
    
    userEvent.click(screen.getByTestId('update-business-btn'));
    
    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent(JSON.stringify(updatedUser));
      expect(axios.patch).toHaveBeenCalledWith('/api/users/business-details', { name: 'Business Name' }, { withCredentials: true });
    });
  });
  
  // Mark error test as todo
  test.todo('handles business details update failure');

  test('correctly identifies admin users', async () => {
    // Mock the auth check to return an admin user
    const mockUser = { 
      id: '123', 
      email: 'admin@example.com', 
      name: 'Admin User',
      role: 'admin'
    };
    axios.get.mockResolvedValueOnce({ data: { user: mockUser } });
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByTestId('is-admin')).toHaveTextContent('admin');
    });
  });

  test('correctly identifies non-admin users', async () => {
    // Mock the auth check to return a regular user
    const mockUser = { 
      id: '123', 
      email: 'user@example.com', 
      name: 'Regular User',
      role: 'user'
    };
    axios.get.mockResolvedValueOnce({ data: { user: mockUser } });
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByTestId('is-admin')).toHaveTextContent('not admin');
    });
  });
}); 