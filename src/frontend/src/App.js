import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

// Import pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import NewsDetailPage from './pages/NewsDetailPage';
import NewsFeedPage from './pages/NewsFeedPage';
import BookmarksPage from './pages/BookmarksPage';
import UserProfilePage from './pages/UserProfilePage';
import SettingsPage from './pages/SettingsPage';
import BusinessSetupPage from './pages/BusinessSetupPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import NotFoundPage from './pages/NotFoundPage';

// Import theme
import theme from './styles/theme';

// PrivateRoute component
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <div data-testid="app">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Router>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Protected routes */}
              <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
              <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
              <Route path="/news" element={<PrivateRoute><NewsFeedPage /></PrivateRoute>} />
              <Route path="/news/:id" element={<PrivateRoute><NewsDetailPage /></PrivateRoute>} />
              <Route path="/bookmarks" element={<PrivateRoute><BookmarksPage /></PrivateRoute>} />
              <Route path="/profile" element={<PrivateRoute><UserProfilePage /></PrivateRoute>} />
              <Route path="/settings" element={<PrivateRoute><SettingsPage /></PrivateRoute>} />
              <Route path="/business-setup" element={<PrivateRoute><BusinessSetupPage /></PrivateRoute>} />
              <Route path="/admin" element={<PrivateRoute><AdminDashboardPage /></PrivateRoute>} />
              
              {/* 404 route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </div>
  );
}

export default App; 