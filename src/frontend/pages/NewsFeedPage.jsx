import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Grid, 
  Paper,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Button,
  Card,
  CardContent,
  CardActions,
  IconButton,
  CircularProgress,
  Divider,
  useTheme
} from '@mui/material';
import { 
  Search as SearchIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from 'react-query';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getNewsFeed, bookmarkNews } from '../services/newsService';
import { useAuth } from '../context/AuthContext';

export default function NewsFeedPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  
  // Get initial filter from location state if available
  const initialFilter = location.state?.filter || 'all';
  
  // State for filters and search
  const [filters, setFilters] = useState({
    category: initialFilter,
    impact: 'all',
    date: 'all',
    source: 'all'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [bookmarkedArticles, setBookmarkedArticles] = useState([]);
  const [allArticles, setAllArticles] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  
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
  
  // Query news feed
  const { data, isLoading, isError, error, refetch } = useQuery(
    ['newsFeed', filters, searchQuery, page],
    () => getNewsFeed({ 
      page, 
      limit: 10, 
      category: filters.category !== 'all' ? filters.category : undefined,
      impact: filters.impact !== 'all' ? filters.impact : undefined,
      date: filters.date !== 'all' ? filters.date : undefined,
      source: filters.source !== 'all' ? filters.source : undefined,
      search: searchQuery || undefined
    }),
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      onSuccess: (newData) => {
        if (page === 1) {
          // Replace all articles for first page
          setAllArticles(newData.articles || []);
        } else {
          // Append articles for subsequent pages
          setAllArticles(prevArticles => [...prevArticles, ...(newData.articles || [])]);
        }
        setHasMore(newData.hasMore || false);
      }
    }
  );
  
  // Load more news when reaching bottom
  const loadMore = () => {
    if (hasMore && !isLoading) {
      setPage(prev => prev + 1);
    }
  };
  
  // Reset articles when filters or search change
  useEffect(() => {
    setPage(1);
    setAllArticles([]);
  }, [filters, searchQuery]);
  
  // Toggle bookmark
  const handleBookmark = async (articleId) => {
    try {
      await bookmarkNews(articleId);
      setBookmarkedArticles(prev => 
        prev.includes(articleId) 
          ? prev.filter(id => id !== articleId) 
          : [...prev, articleId]
      );
    } catch (err) {
      console.error('Error bookmarking article:', err);
    }
  };
  
  // Apply filters
  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle search
  const handleSearch = (event) => {
    if (event.key === 'Enter') {
      refetch();
    }
  };
  
  // Reset all filters
  const resetFilters = () => {
    setFilters({
      category: 'all',
      impact: 'all',
      date: 'all',
      source: 'all'
    });
    setSearchQuery('');
  };
  
  // Use placeholder data if API integration is not complete
  const displayArticles = allArticles.length > 0 ? allArticles : [
    {
      id: 1,
      title: 'Market shift in renewable energy sector',
      summary: 'New policies are reshaping the renewable energy landscape, creating opportunities for early adopters and challenges for traditional energy companies.',
      source: 'Financial Times',
      category: 'Energy',
      impactScore: 85,
      date: '2023-04-02'
    },
    {
      id: 2,
      title: 'Tech industry facing new regulatory challenges',
      summary: 'Upcoming regulations will require tech companies to implement stronger data protection measures and could impact digital advertising revenue streams.',
      source: 'TechCrunch',
      category: 'Technology',
      impactScore: 72,
      date: '2023-04-01'
    },
    {
      id: 3,
      title: 'Supply chain disruptions expected to continue through Q3',
      summary: 'Ongoing logistics issues and material shortages are predicted to affect manufacturing and retail sectors well into the third quarter of the year.',
      source: 'Wall Street Journal',
      category: 'Logistics',
      impactScore: 64,
      date: '2023-03-31'
    },
    {
      id: 4,
      title: 'Healthcare startups attract record investment in Q1',
      summary: 'Venture capital flowing into healthcare technology reached an all-time high during the first quarter, with telemedicine and AI diagnostics leading the trend.',
      source: 'Healthcare Daily',
      category: 'Healthcare',
      impactScore: 58,
      date: '2023-03-30'
    },
    {
      id: 5,
      title: 'Consumer spending shows strong recovery signs',
      summary: 'Latest economic indicators point to robust consumer confidence and increased spending across retail and hospitality sectors.',
      source: 'Bloomberg',
      category: 'Economy',
      impactScore: 76,
      date: '2023-03-29'
    }
  ];
  
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          News Feed
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Discover news tailored to {currentUser?.businessName || 'your business'}
        </Typography>
      </Box>
      
      {/* Search and Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search news articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={8} md={5}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {filters.category !== 'all' && (
                <Chip 
                  label={`Category: ${filters.category}`} 
                  onDelete={() => handleFilterChange({ target: { name: 'category', value: 'all' } })}
                />
              )}
              {filters.impact !== 'all' && (
                <Chip 
                  label={`Impact: ${filters.impact}`} 
                  onDelete={() => handleFilterChange({ target: { name: 'impact', value: 'all' } })}
                />
              )}
              {filters.date !== 'all' && (
                <Chip 
                  label={`Date: ${filters.date}`} 
                  onDelete={() => handleFilterChange({ target: { name: 'date', value: 'all' } })}
                />
              )}
              {(filters.category !== 'all' || filters.impact !== 'all' || filters.date !== 'all' || filters.source !== 'all') && (
                <Chip label="Reset All" onClick={resetFilters} />
              )}
            </Box>
          </Grid>
          <Grid item xs={4} md={1} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              variant="outlined" 
              color="primary"
              onClick={() => setShowFilters(!showFilters)}
              startIcon={<FilterListIcon />}
            >
              Filters
            </Button>
          </Grid>
        </Grid>
        
        {/* Expandable filters */}
        {showFilters && (
          <Box sx={{ mt: 2 }}>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel id="category-filter-label">Category</InputLabel>
                  <Select
                    labelId="category-filter-label"
                    id="category-filter"
                    name="category"
                    value={filters.category}
                    label="Category"
                    onChange={handleFilterChange}
                  >
                    <MenuItem value="all">All Categories</MenuItem>
                    <MenuItem value="Technology">Technology</MenuItem>
                    <MenuItem value="Finance">Finance</MenuItem>
                    <MenuItem value="Healthcare">Healthcare</MenuItem>
                    <MenuItem value="Energy">Energy</MenuItem>
                    <MenuItem value="Logistics">Logistics</MenuItem>
                    <MenuItem value="Economy">Economy</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel id="impact-filter-label">Impact Level</InputLabel>
                  <Select
                    labelId="impact-filter-label"
                    id="impact-filter"
                    name="impact"
                    value={filters.impact}
                    label="Impact Level"
                    onChange={handleFilterChange}
                  >
                    <MenuItem value="all">All Impacts</MenuItem>
                    <MenuItem value="high">High Impact</MenuItem>
                    <MenuItem value="medium">Medium Impact</MenuItem>
                    <MenuItem value="low">Low Impact</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel id="date-filter-label">Date</InputLabel>
                  <Select
                    labelId="date-filter-label"
                    id="date-filter"
                    name="date"
                    value={filters.date}
                    label="Date"
                    onChange={handleFilterChange}
                  >
                    <MenuItem value="all">All Time</MenuItem>
                    <MenuItem value="today">Today</MenuItem>
                    <MenuItem value="week">This Week</MenuItem>
                    <MenuItem value="month">This Month</MenuItem>
                    <MenuItem value="quarter">This Quarter</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel id="source-filter-label">Source</InputLabel>
                  <Select
                    labelId="source-filter-label"
                    id="source-filter"
                    name="source"
                    value={filters.source}
                    label="Source"
                    onChange={handleFilterChange}
                  >
                    <MenuItem value="all">All Sources</MenuItem>
                    <MenuItem value="Financial Times">Financial Times</MenuItem>
                    <MenuItem value="TechCrunch">TechCrunch</MenuItem>
                    <MenuItem value="Wall Street Journal">Wall Street Journal</MenuItem>
                    <MenuItem value="Bloomberg">Bloomberg</MenuItem>
                    <MenuItem value="Reuters">Reuters</MenuItem>
                    <MenuItem value="Healthcare Daily">Healthcare Daily</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={resetFilters} sx={{ mr: 1 }}>
                Reset Filters
              </Button>
              <Button 
                variant="contained" 
                onClick={() => {
                  refetch();
                  setShowFilters(false);
                }}
              >
                Apply Filters
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
      
      {/* News Feed with Infinite Scroll */}
      {isLoading && page === 1 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : isError ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="error">Error loading news feed. Please try again.</Typography>
          <Button sx={{ mt: 2 }} variant="outlined" onClick={() => refetch()}>
            Retry
          </Button>
        </Paper>
      ) : displayArticles.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6">No news articles found</Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Try changing your filters or search criteria
          </Typography>
        </Paper>
      ) : (
        <InfiniteScroll
          dataLength={displayArticles.length}
          next={loadMore}
          hasMore={hasMore}
          loader={
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
              <CircularProgress size={30} />
            </Box>
          }
          endMessage={
            <Box sx={{ textAlign: 'center', my: 2 }}>
              <Typography variant="body2" color="textSecondary">
                You've seen all the news articles
              </Typography>
            </Box>
          }
        >
          <Grid container spacing={3}>
            {displayArticles.map(article => (
              <Grid item xs={12} key={article.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Typography variant="caption" color="textSecondary">
                            {article.source} • {article.date}
                          </Typography>
                          <Chip 
                            label={article.category} 
                            size="small" 
                            sx={{ ml: 1 }}
                          />
                        </Box>
                        <Typography variant="h6" gutterBottom>
                          {article.title}
                        </Typography>
                        <Typography variant="body2" paragraph>
                          {article.summary}
                        </Typography>
                      </Box>
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          flexDirection: 'column',
                          alignItems: 'center',
                          ml: 2
                        }}
                      >
                        <Box 
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: '50%',
                            bgcolor: getImpactColor(article.impactScore),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 'bold',
                            mb: 0.5
                          }}
                        >
                          {article.impactScore}
                        </Box>
                        <Typography variant="caption">
                          {getImpactLabel(article.impactScore)} Impact
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button 
                      size="small" 
                      onClick={() => navigate(`/news/${article.id}`)}
                    >
                      Read More
                    </Button>
                    <IconButton 
                      aria-label={bookmarkedArticles.includes(article.id) ? "Remove bookmark" : "Bookmark article"}
                      onClick={() => handleBookmark(article.id)}
                      color={bookmarkedArticles.includes(article.id) ? "primary" : "default"}
                    >
                      {bookmarkedArticles.includes(article.id) ? 
                        <BookmarkIcon /> : 
                        <BookmarkBorderIcon />
                      }
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </InfiniteScroll>
      )}
    </Box>
  );
} 