import React from 'react';
import { 
  Typography, 
  Grid, 
  Paper, 
  Box, 
  Button,
  Card,
  CardContent,
  CardActions
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BusinessSetupPrompt from '../components/BusinessSetupPrompt';

export default function HomePage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // Placeholder data for demo purposes
  const recentNews = [
    {
      id: 1,
      title: 'Market shift in renewable energy sector',
      source: 'Financial Times',
      impactScore: 85,
      date: '2023-04-02'
    },
    {
      id: 2,
      title: 'New regulations affecting tech industry',
      source: 'TechCrunch',
      impactScore: 72,
      date: '2023-04-01'
    },
    {
      id: 3,
      title: 'Supply chain disruptions expected to continue',
      source: 'Wall Street Journal',
      impactScore: 64,
      date: '2023-03-31'
    }
  ];
  
  // Function to get color based on impact score
  const getImpactColor = (score) => {
    if (score >= 80) return '#f44336'; // High impact - red
    if (score >= 60) return '#ff9800'; // Medium impact - orange
    return '#4caf50'; // Low impact - green
  };
  
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome back, {currentUser?.firstName || 'User'}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Here's your news impact summary for {currentUser?.business?.name || 'your business'}
        </Typography>
      </Box>
      
      {/* Business Setup Prompt */}
      <BusinessSetupPrompt />
      
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 3, 
              height: '100%',
              bgcolor: '#f5f5f5',
              borderTop: '4px solid #1976d2'
            }}
          >
            <Typography variant="h6" gutterBottom>High Impact News</Typography>
            <Typography variant="h3" gutterBottom>3</Typography>
            <Typography variant="body2">
              News that may significantly affect your business operations
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Button 
                variant="outlined" 
                color="primary"
                onClick={() => navigate('/news', { state: { filter: 'high' } })}
              >
                View Details
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 3, 
              height: '100%',
              bgcolor: '#f5f5f5',
              borderTop: '4px solid #dc004e'
            }}
          >
            <Typography variant="h6" gutterBottom>Industry Trends</Typography>
            <Typography variant="h3" gutterBottom>7</Typography>
            <Typography variant="body2">
              Trending topics in {currentUser?.business?.industry || 'your industry'}
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Button 
                variant="outlined" 
                color="secondary"
                onClick={() => navigate('/dashboard')}
              >
                View Trends
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 3, 
              height: '100%',
              bgcolor: '#f5f5f5',
              borderTop: '4px solid #4caf50'
            }}
          >
            <Typography variant="h6" gutterBottom>Saved Articles</Typography>
            <Typography variant="h3" gutterBottom>12</Typography>
            <Typography variant="body2">
              Articles you've bookmarked for later reference
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Button 
                variant="outlined" 
                color="success"
                onClick={() => navigate('/bookmarks')}
              >
                View Bookmarks
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        {/* Recent News */}
        <Grid item xs={12}>
          <Typography variant="h5" sx={{ mt: 3, mb: 2 }}>
            Recent High-Impact News
          </Typography>
          
          <Grid container spacing={2}>
            {recentNews.map((news) => (
              <Grid item xs={12} md={4} key={news.id}>
                <Card elevation={2}>
                  <CardContent>
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 1
                      }}
                    >
                      <Typography variant="caption" color="textSecondary">
                        {news.source}
                      </Typography>
                      <Box 
                        sx={{ 
                          bgcolor: getImpactColor(news.impactScore),
                          color: 'white',
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          fontSize: '0.75rem',
                          fontWeight: 'bold'
                        }}
                      >
                        {news.impactScore}% Impact
                      </Box>
                    </Box>
                    <Typography variant="h6" gutterBottom>
                      {news.title}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {news.date}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button 
                      size="small" 
                      onClick={() => navigate(`/news/${news.id}`)}
                    >
                      Read More
                    </Button>
                    <Button size="small">Save</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
} 