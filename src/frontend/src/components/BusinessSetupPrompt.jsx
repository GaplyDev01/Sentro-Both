import React from 'react';
import {
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  FilterList as FilterListIcon,
  Notifications as NotificationsIcon,
  ArrowForward as ArrowForwardIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function BusinessSetupPrompt() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // Check if business setup is incomplete
  const isBusinessSetupIncomplete = () => {
    if (!currentUser || !currentUser.business) return true;
    
    // Check if required fields are missing
    const { name, industry, location, size } = currentUser.business || {};
    return !name || !industry || !location || !size;
  };
  
  // If business setup is complete, don't show the prompt
  if (!isBusinessSetupIncomplete()) {
    return null;
  }
  
  const handleSetupClick = () => {
    navigate('/business-setup');
  };
  
  return (
    <Card sx={{ mb: 4, overflow: 'visible', position: 'relative' }}>
      <Box 
        sx={{ 
          position: 'absolute',
          top: -15,
          left: 24,
          backgroundColor: 'primary.main',
          color: 'white',
          py: 0.5,
          px: 2,
          borderRadius: 1,
          fontSize: '0.875rem',
          fontWeight: 'bold'
        }}
      >
        Action Required
      </Box>
      <CardContent sx={{ pt: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Typography variant="h5" gutterBottom>
              Complete Your Business Setup
            </Typography>
            <Typography variant="body1" paragraph color="textSecondary">
              Take a moment to set up your business profile to get the full benefits of the News Impact Platform, 
              including personalized news feed and impact predictions tailored to your industry.
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <TrendingUpIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Personalized Impact Scores" 
                  secondary="Get news impact predictions specific to your business" 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <FilterListIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Industry-Specific News" 
                  secondary="Filter news relevant to your sector and location" 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <NotificationsIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Tailored Alerts" 
                  secondary="Receive notifications about high-impact events in your industry" 
                />
              </ListItem>
            </List>
            
            <Box sx={{ mt: 3 }}>
              <Button 
                variant="contained" 
                color="primary" 
                size="large"
                onClick={handleSetupClick}
                endIcon={<ArrowForwardIcon />}
              >
                Complete Setup
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center', alignItems: 'center' }}>
            <Box 
              sx={{ 
                textAlign: 'center',
                bgcolor: 'background.default',
                py: 4,
                px: 3,
                borderRadius: 2,
                maxWidth: 300
              }}
            >
              <AssignmentIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2, opacity: 0.8 }} />
              <Typography variant="h6" gutterBottom>
                {currentUser?.firstName ? `${currentUser.firstName}, ` : ''}Just 3 Simple Steps
              </Typography>
              <Typography variant="body2" color="textSecondary">
                You're just a few clicks away from unlocking the full potential of our platform with a customized experience.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
} 