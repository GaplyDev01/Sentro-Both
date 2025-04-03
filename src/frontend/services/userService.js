import axios from 'axios';

const API_URL = '/api';

// Get current user profile
export const getProfile = async () => {
  try {
    const response = await axios.get(`${API_URL}/users/profile`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Update user profile
export const updateProfile = async (profileData) => {
  try {
    const response = await axios.put(`${API_URL}/users/profile`, profileData, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Update business details
export const updateBusinessDetails = async (businessData) => {
  try {
    const response = await axios.patch(`${API_URL}/users/business-details`, businessData, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Change password
export const changePassword = async (passwordData) => {
  try {
    const response = await axios.post(`${API_URL}/users/change-password`, passwordData, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Get user activity history
export const getActivityHistory = async () => {
  try {
    const response = await axios.get(`${API_URL}/users/activity`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Get user preferences
export const getUserPreferences = async () => {
  try {
    const response = await axios.get(`${API_URL}/users/preferences`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Update user preferences
export const updateUserPreferences = async (preferencesData) => {
  try {
    const response = await axios.put(`${API_URL}/users/preferences`, preferencesData, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// For development/testing: Mock data functions
export const getMockProfile = () => {
  return {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    jobTitle: 'Marketing Director',
    createdAt: '2023-03-15T10:30:00Z',
    lastLogin: '2023-04-02T08:15:00Z',
    business: {
      name: 'Acme Marketing Solutions',
      industry: 'Marketing & Advertising',
      location: 'New York, NY',
      size: '11-50 employees',
      website: 'https://acmemarketing.example.com'
    },
    preferences: {
      emailNotifications: true,
      darkMode: false,
      weeklyNewsletter: true,
      impactAlerts: {
        high: true,
        medium: true,
        low: false
      }
    }
  };
};

// Helper function to handle errors
const handleError = (error) => {
  if (error.response) {
    console.error('API Error Response:', error.response.data);
    
    // Handle specific errors
    if (error.response.status === 401) {
      // Unauthorized - possibly session expired
      console.error('Authentication error - session may have expired');
    }
  } else if (error.request) {
    // Request was made but no response received
    console.error('No response received:', error.request);
  } else {
    // Something else caused the error
    console.error('Error setting up request:', error.message);
  }
}; 