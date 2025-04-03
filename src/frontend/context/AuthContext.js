import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        // Check if we have a token in localStorage
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (token && storedUser) {
          // Set the stored user while we verify with the server
          setCurrentUser(JSON.parse(storedUser));
        }
        
        const res = await api.get('/auth/profile');
        
        if (res.data && res.data.user) {
          setCurrentUser(res.data.user);
          // Update stored user data
          localStorage.setItem('user', JSON.stringify(res.data.user));
        }
      } catch (err) {
        // User is not logged in or token is invalid
        console.log('User not logged in or session expired');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      
      const res = await api.post('/auth/login', {
        email,
        password
      });
      
      if (res.data && res.data.data) {
        setCurrentUser(res.data.data.user);
        // Store token in localStorage
        if (res.data.data.token) {
          localStorage.setItem('token', res.data.data.token);
          localStorage.setItem('user', JSON.stringify(res.data.data.user));
        }
        return res.data.data.user;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      
      // Filter out confirmPassword which is not accepted by the backend
      const { confirmPassword, ...filteredUserData } = userData;
      
      const res = await api.post('/auth/register', filteredUserData);
      
      if (res.data && res.data.data) {
        setCurrentUser(res.data.data.user);
        // Store token in localStorage
        if (res.data.data.token) {
          localStorage.setItem('token', res.data.data.token);
          localStorage.setItem('user', JSON.stringify(res.data.data.user));
        }
        return res.data.data.user;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setLoading(true);
      
      await api.post('/auth/logout');
      
      // Remove token from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setCurrentUser(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Logout failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      setError(null);
      setLoading(true);
      
      const res = await api.put('/users/profile', profileData);
      
      if (res.data && res.data.data && res.data.data.user) {
        setCurrentUser(res.data.data.user);
        localStorage.setItem('user', JSON.stringify(res.data.data.user));
        return res.data.data.user;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Profile update failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update business details
  const updateBusinessDetails = async (businessData) => {
    try {
      setError(null);
      setLoading(true);
      
      const res = await api.patch('/users/business-details', businessData);
      
      if (res.data && res.data.data && res.data.data.user) {
        setCurrentUser(res.data.data.user);
        localStorage.setItem('user', JSON.stringify(res.data.data.user));
        return res.data.data.user;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Business details update failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Check if user has admin role
  const isAdmin = () => {
    return currentUser?.role === 'admin';
  };

  // Value object to be provided to consumers
  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    updateBusinessDetails,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 