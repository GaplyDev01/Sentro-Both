import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext';
import theme from './styles/theme';

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