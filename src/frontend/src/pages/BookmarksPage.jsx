import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Grid,
  Paper,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  useTheme
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getBookmarks, removeBookmark } from '../services/newsService';

export default function BookmarksPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState([]);
  const [filteredBookmarks, setFilteredBookmarks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Function to get color based on impact score
  const getImpactColor = (score) => {
    if (score >= 80) return theme.palette.error.main; // High impact - red
    if (score >= 60) return theme.palette.warning.main; // Medium impact - orange
    return theme.palette.success.main; // Low impact - green
  };
  
  // Function to get impact label based on score
  const getImpactLabel = (score) => {
    if (score >= 80) return 'High';
    if (score >= 60) return 'Medium';
    return 'Low';
  };
  
  // Load bookmarks
  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // For development/demo - mock data
        if (process.env.NODE_ENV === 'development') {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const mockBookmarks = [
            {
              id: 1,
              newsId: 1,
              article: {
                id: 1,
                title: 'Market shift in renewable energy sector',
                summary: 'New policies are reshaping the renewable energy landscape, creating opportunities for early adopters and challenges for traditional energy companies.',
                source: 'Financial Times',
                category: 'Energy',
                impactScore: 85,
                date: '2023-04-02'
              },
              createdAt: '2023-04-02T12:34:56Z'
            },
            {
              id: 2,
              newsId: 3,
              article: {
                id: 3,
                title: 'Supply chain disruptions expected to continue through Q3',
                summary: 'Ongoing logistics issues and material shortages are predicted to affect manufacturing and retail sectors well into the third quarter of the year.',
                source: 'Wall Street Journal',
                category: 'Logistics',
                impactScore: 64,
                date: '2023-03-31'
              },
              createdAt: '2023-04-01T09:23:45Z'
            },
            {
              id: 3,
              newsId: 5,
              article: {
                id: 5,
                title: 'Consumer spending shows strong recovery signs',
                summary: 'Latest economic indicators point to robust consumer confidence and increased spending across retail and hospitality sectors.',
                source: 'Bloomberg',
                category: 'Economy',
                impactScore: 76,
                date: '2023-03-29'
              },
              createdAt: '2023-03-30T14:56:12Z'
            }
          ];
          
          setBookmarks(mockBookmarks);
          setFilteredBookmarks(mockBookmarks);
        } else {
          // In production, fetch from API
          const data = await getBookmarks();
          setBookmarks(data.bookmarks);
          setFilteredBookmarks(data.bookmarks);
        }
      } catch (err) {
        console.error('Error fetching bookmarks:', err);
        setError('Failed to load bookmarks. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBookmarks();
  }, []);
  
  // Handle search
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredBookmarks(bookmarks);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = bookmarks.filter(bookmark => 
        bookmark.article.title.toLowerCase().includes(query) ||
        bookmark.article.summary.toLowerCase().includes(query) ||
        bookmark.article.category.toLowerCase().includes(query) ||
        bookmark.article.source.toLowerCase().includes(query)
      );
      setFilteredBookmarks(filtered);
    }
  }, [searchQuery, bookmarks]);
  
  // Remove bookmark
  const handleRemoveBookmark = async (bookmarkId) => {
    try {
      // In development, just update state
      if (process.env.NODE_ENV === 'development') {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Update state to remove bookmark
        setBookmarks(prevBookmarks => 
          prevBookmarks.filter(bookmark => bookmark.id !== bookmarkId)
        );
      } else {
        // In production, call API
        await removeBookmark(bookmarkId);
        // Then update state to remove bookmark
        setBookmarks(prevBookmarks => 
          prevBookmarks.filter(bookmark => bookmark.id !== bookmarkId)
        );
      }
    } catch (err) {
      console.error('Error removing bookmark:', err);
      setError('Failed to remove bookmark. Please try again.');
    }
  };
  
  // Navigate to news detail
  const handleReadArticle = (newsId) => {
    navigate(`/news/${newsId}`);
  };
  
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Your Bookmarks
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Articles you've saved for later reading
        </Typography>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* Search */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search your bookmarks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Paper>
      
      {/* Bookmarks list */}
      {filteredBookmarks.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6">No bookmarks found</Typography>
          <Typography color="textSecondary" paragraph>
            {bookmarks.length === 0 
              ? "You haven't bookmarked any articles yet. Browse the news feed and bookmark articles to see them here."
              : "No bookmarks match your search criteria."}
          </Typography>
          {bookmarks.length === 0 && (
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => navigate('/news')}
            >
              Browse News Feed
            </Button>
          )}
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredBookmarks.map((bookmark) => (
            <Grid item xs={12} key={bookmark.id}>
              <Card>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={8}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle2" color="textSecondary" sx={{ mr: 1 }}>
                          {bookmark.article.source}
                        </Typography>
                        <Chip 
                          label={bookmark.article.category} 
                          size="small" 
                          variant="outlined"
                          sx={{ mr: 1 }}
                        />
                        <Typography variant="body2" color="textSecondary">
                          {bookmark.article.date}
                        </Typography>
                      </Box>
                      <Typography 
                        variant="h6" 
                        gutterBottom
                        sx={{ 
                          cursor: 'pointer',
                          '&:hover': { color: theme.palette.primary.main }
                        }}
                        onClick={() => handleReadArticle(bookmark.article.id)}
                      >
                        {bookmark.article.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" paragraph>
                        {bookmark.article.summary}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Bookmarked on: {new Date(bookmark.createdAt).toLocaleDateString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                      <Box 
                        sx={{ 
                          bgcolor: getImpactColor(bookmark.article.impactScore),
                          color: 'white',
                          px: 2,
                          py: 1,
                          borderRadius: 1,
                          mb: 2,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center'
                        }}
                      >
                        <Typography variant="h4">{bookmark.article.impactScore}%</Typography>
                        <Typography variant="caption">{getImpactLabel(bookmark.article.impactScore)} Impact</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    onClick={() => handleReadArticle(bookmark.article.id)}
                  >
                    Read Article
                  </Button>
                  <IconButton
                    onClick={() => handleRemoveBookmark(bookmark.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
} 