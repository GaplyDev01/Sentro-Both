import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layout
import MainLayout from './components/layout/MainLayout';

// Pages (to be implemented)
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BusinessSetupPage from './pages/BusinessSetupPage';
import NewsFeedPage from './pages/NewsFeedPage';
import NewsDetailPage from './pages/NewsDetailPage';
import DashboardPage from './pages/DashboardPage';
import UserProfilePage from './pages/UserProfilePage';
import SettingsPage from './pages/SettingsPage';
import BookmarksPage from './pages/BookmarksPage';
import NotFoundPage from './pages/NotFoundPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  // Show loading state if authentication is being checked
  if (loading) {
    return null; // Or a loading spinner
  }
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Admin route wrapper 
const AdminRoute = ({ children }) => {
  const { currentUser, loading, isAdmin } = useAuth();
  
  // Show loading state if authentication is being checked
  if (loading) {
    return null; // Or a loading spinner
  }
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isAdmin()) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Theme configuration
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    error: {
      main: '#f44336',
    },
    warning: {
      main: '#ff9800',
    },
    info: {
      main: '#2196f3',
    },
    success: {
      main: '#4caf50',
    },
    background: {
      default: '#fafafa',
      paper: '#fff',
    },
    text: {
      primary: '#212121',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: {
      fontSize: '2.5rem',
    },
    h2: {
      fontSize: '2rem',
    },
    h3: {
      fontSize: '1.75rem',
    },
    h4: {
      fontSize: '1.5rem',
    },
    h5: {
      fontSize: '1.25rem',
    },
    h6: {
      fontSize: '1rem',
    },
    body1: {
      fontSize: '1rem',
    },
    body2: {
      fontSize: '0.875rem',
    },
    caption: {
      fontSize: '0.75rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<HomePage />} />
            <Route path="business-setup" element={<BusinessSetupPage />} />
            <Route path="news" element={<NewsFeedPage />} />
            <Route path="news/:id" element={<NewsDetailPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="profile" element={<UserProfilePage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="bookmarks" element={<BookmarksPage />} />
            
            {/* Admin routes */}
            <Route path="admin" element={
              <AdminRoute>
                <AdminDashboardPage />
              </AdminRoute>
            } />
          </Route>

          {/* 404 route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 