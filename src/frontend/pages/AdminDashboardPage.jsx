import React from 'react';
import { 
  Typography, 
  Box, 
  Paper, 
  Tabs, 
  Tab, 
  Button, 
  Grid,
  Alert
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = React.useState(0);
  const { currentUser, isAdmin } = useAuth();
  
  // Redirect non-admin users
  if (!isAdmin()) {
    return <Navigate to="/" replace />;
  }
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Manage users, content, and system settings
        </Typography>
      </Box>
      
      <Alert severity="info" sx={{ mb: 4 }}>
        This admin dashboard is currently under development. Full functionality will be available in a future update.
      </Alert>
      
      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Users" />
          <Tab label="Content" />
          <Tab label="Settings" />
          <Tab label="Analytics" />
        </Tabs>
      </Paper>
      
      {activeTab === 0 && (
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h6">User Management</Typography>
            <Button variant="contained" color="primary">
              Add New User
            </Button>
          </Box>
          
          <Typography variant="body1" color="textSecondary">
            User management functionality will be implemented in a future update.
          </Typography>
          
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} md={4}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Total Users
                </Typography>
                <Typography variant="h4">124</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Active Users
                </Typography>
                <Typography variant="h4">98</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Admin Users
                </Typography>
                <Typography variant="h4">3</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      )}
      
      {activeTab === 1 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Content Management
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Content management functionality will be implemented in a future update.
          </Typography>
        </Paper>
      )}
      
      {activeTab === 2 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            System Settings
          </Typography>
          <Typography variant="body1" color="textSecondary">
            System settings functionality will be implemented in a future update.
          </Typography>
        </Paper>
      )}
      
      {activeTab === 3 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Analytics Dashboard
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Analytics functionality will be implemented in a future update.
          </Typography>
        </Paper>
      )}
    </Box>
  );
} 