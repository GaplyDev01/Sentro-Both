import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

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
        const res = await axios.get('/api/auth/profile', {
          withCredentials: true,
        });
        
        if (res.data && res.data.user) {
          setCurrentUser(res.data.user);
        }
      } catch (err) {
        // User is not logged in, which is fine
        console.log('User not logged in');
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
      
      const res = await axios.post('/api/auth/login', {
        email,
        password,
      }, {
        withCredentials: true,
      });
      
      if (res.data && res.data.user) {
        setCurrentUser(res.data.user);
        return res.data.user;
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
      
      const res = await axios.post('/api/auth/register', userData, {
        withCredentials: true,
      });
      
      if (res.data && res.data.user) {
        setCurrentUser(res.data.user);
        return res.data.user;
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
      
      await axios.post('/api/auth/logout', {}, {
        withCredentials: true,
      });
      
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
      
      const res = await axios.put('/api/users/profile', profileData, {
        withCredentials: true,
      });
      
      if (res.data && res.data.user) {
        setCurrentUser(res.data.user);
        return res.data.user;
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
      
      const res = await axios.patch('/api/users/business-details', businessData, {
        withCredentials: true,
      });
      
      if (res.data && res.data.user) {
        setCurrentUser(res.data.user);
        return res.data.user;
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