import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Grid,
  Switch,
  FormControlLabel,
  FormGroup,
  Button,
  Divider,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Palette as PaletteIcon,
  Visibility as VisibilityIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { getUserPreferences, updateUserPreferences } from '../services/userService';

export default function SettingsPage() {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    darkMode: false,
    weeklyNewsletter: true,
    impactAlerts: {
      high: true,
      medium: true,
      low: false
    },
    defaultNewsCategory: 'all',
    newsRefreshInterval: 'daily'
  });

  // Load user preferences
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        setIsLoading(true);
        // In development, use mock data
        if (process.env.NODE_ENV === 'development') {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 800));
          
          setPreferences({
            emailNotifications: true,
            darkMode: false,
            weeklyNewsletter: true,
            impactAlerts: {
              high: true,
              medium: true,
              low: false
            },
            defaultNewsCategory: 'all',
            newsRefreshInterval: 'daily'
          });
        } else {
          // In production, fetch from API
          const data = await getUserPreferences();
          setPreferences(data.preferences);
        }
      } catch (error) {
        setErrorMessage('Failed to load preferences');
        console.error('Error loading preferences:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, []);

  // Handle preference changes
  const handleChange = (event) => {
    const { name, checked, value } = event.target;
    
    // Handle nested impact alert settings
    if (name.startsWith('impactAlerts.')) {
      const impactLevel = name.split('.')[1];
      setPreferences(prev => ({
        ...prev,
        impactAlerts: {
          ...prev.impactAlerts,
          [impactLevel]: checked
        }
      }));
    } 
    // Handle select inputs
    else if (event.target.tagName === 'SELECT' || value !== undefined) {
      setPreferences(prev => ({
        ...prev,
        [name]: value
      }));
    }
    // Handle switch inputs
    else {
      setPreferences(prev => ({
        ...prev,
        [name]: checked
      }));
    }
    
    // Clear any messages when user makes changes
    setSuccessMessage('');
    setErrorMessage('');
  };

  // Save preferences
  const handleSave = async () => {
    try {
      setIsSaving(true);
      setSuccessMessage('');
      setErrorMessage('');

      // In development, simulate API call
      if (process.env.NODE_ENV === 'development') {
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        // In production, update via API
        await updateUserPreferences(preferences);
      }

      setSuccessMessage('Preferences saved successfully');
    } catch (error) {
      setErrorMessage('Failed to save preferences');
      console.error('Error saving preferences:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Settings
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Manage your account preferences and notification settings
        </Typography>
      </Box>

      {successMessage && <Alert severity="success" sx={{ mb: 3 }}>{successMessage}</Alert>}
      {errorMessage && <Alert severity="error" sx={{ mb: 3 }}>{errorMessage}</Alert>}

      <Grid container spacing={3}>
        {/* Notification Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <NotificationsIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                <Typography variant="h6">Notification Settings</Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />
              
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.emailNotifications}
                      onChange={handleChange}
                      name="emailNotifications"
                      color="primary"
                    />
                  }
                  label="Email Notifications"
                />
                <Typography variant="body2" color="textSecondary" sx={{ ml: 4, mb: 2 }}>
                  Receive important updates and alerts via email
                </Typography>

                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.weeklyNewsletter}
                      onChange={handleChange}
                      name="weeklyNewsletter"
                      color="primary"
                    />
                  }
                  label="Weekly Newsletter"
                />
                <Typography variant="body2" color="textSecondary" sx={{ ml: 4, mb: 2 }}>
                  Get a summary of top news and insights every week
                </Typography>

                <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                  Impact Alert Levels
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.impactAlerts.high}
                      onChange={handleChange}
                      name="impactAlerts.high"
                      color="error"
                    />
                  }
                  label="High Impact Alerts"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.impactAlerts.medium}
                      onChange={handleChange}
                      name="impactAlerts.medium"
                      color="warning"
                    />
                  }
                  label="Medium Impact Alerts"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.impactAlerts.low}
                      onChange={handleChange}
                      name="impactAlerts.low"
                      color="success"
                    />
                  }
                  label="Low Impact Alerts"
                />
              </FormGroup>
            </CardContent>
          </Card>
        </Grid>

        {/* Display Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PaletteIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                <Typography variant="h6">Display Settings</Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />
              
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.darkMode}
                      onChange={handleChange}
                      name="darkMode"
                      color="primary"
                    />
                  }
                  label="Dark Mode"
                />
                <Typography variant="body2" color="textSecondary" sx={{ ml: 4, mb: 3 }}>
                  Enable dark theme for the application
                </Typography>
              </FormGroup>
            </CardContent>
          </Card>

          {/* News Feed Settings */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <VisibilityIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                <Typography variant="h6">News Feed Settings</Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Default Category</InputLabel>
                    <Select
                      value={preferences.defaultNewsCategory}
                      onChange={handleChange}
                      name="defaultNewsCategory"
                      label="Default Category"
                    >
                      <MenuItem value="all">All Categories</MenuItem>
                      <MenuItem value="Technology">Technology</MenuItem>
                      <MenuItem value="Energy">Energy</MenuItem>
                      <MenuItem value="Healthcare">Healthcare</MenuItem>
                      <MenuItem value="Finance">Finance</MenuItem>
                      <MenuItem value="Logistics">Logistics</MenuItem>
                      <MenuItem value="Economy">Economy</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>News Refresh Interval</InputLabel>
                    <Select
                      value={preferences.newsRefreshInterval}
                      onChange={handleChange}
                      name="newsRefreshInterval"
                      label="News Refresh Interval"
                    >
                      <MenuItem value="realtime">Real-time</MenuItem>
                      <MenuItem value="hourly">Hourly</MenuItem>
                      <MenuItem value="daily">Daily</MenuItem>
                      <MenuItem value="weekly">Weekly</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Settings'}
        </Button>
      </Box>
    </Box>
  );
} 