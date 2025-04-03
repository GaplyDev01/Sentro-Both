import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Grid, 
  Paper,
  Card,
  CardContent,
  Divider,
  Chip,
  Button,
  IconButton,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  Tooltip,
  Avatar
} from '@mui/material';
import { 
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Share as ShareIcon,
  TrendingUp as TrendingUpIcon,
  Business as BusinessIcon,
  Language as LanguageIcon,
  Timeline as TimelineIcon,
  Public as PublicIcon,
  ArrowBack as ArrowBackIcon,
  TrendingDown as TrendingDownIcon,
  Equalizer as EqualizerIcon,
  AccessTime as AccessTimeIcon,
  BarChart as BarChartIcon,
  Star as StarIcon,
  PersonOutline as PersonOutlineIcon,
  PieChart as PieChartIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { getNewsById, getPrediction, bookmarkNews } from '../services/newsService';
import { useAuth } from '../context/AuthContext';
import { Bar, Radar, Doughnut } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip as ChartTooltip, 
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  ArcElement
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  RadialLinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title, 
  ChartTooltip, 
  Legend
);

export default function NewsDetailPage() {
  const theme = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [activeChart, setActiveChart] = useState('bar');
  
  // Fetch news article
  const { 
    data: article, 
    isLoading: articleLoading, 
    isError: articleError,
    error: articleErrorData
  } = useQuery(
    ['article', id], 
    () => getNewsById(id),
    {
      refetchOnWindowFocus: false,
    }
  );
  
  // Fetch impact prediction
  const { 
    data: prediction, 
    isLoading: predictionLoading, 
    isError: predictionError
  } = useQuery(
    ['prediction', id], 
    () => getPrediction(id),
    {
      refetchOnWindowFocus: false,
    }
  );
  
  // Toggle bookmark
  const handleBookmark = async () => {
    try {
      await bookmarkNews(id);
      setIsBookmarked(!isBookmarked);
    } catch (err) {
      console.error('Error bookmarking article:', err);
    }
  };
  
  // Share article
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article?.title,
        text: article?.summary,
        url: window.location.href,
      })
      .catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Link copied to clipboard'))
        .catch((err) => console.error('Could not copy text: ', err));
    }
  };
  
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
  
  // Placeholder data for development
  const articleData = article || {
    id: 1,
    title: 'Market shift in renewable energy sector',
    content: `
      <p>New policies are reshaping the renewable energy landscape, creating opportunities for early adopters and challenges for traditional energy companies.</p>
      
      <p>The renewable energy sector is undergoing a significant transformation, driven by policy changes that favor sustainable energy solutions. Companies that have already invested in green technologies are poised to benefit from these shifts, while traditional energy providers face increasing pressure to adapt.</p>
      
      <p>Recent policy changes include tax incentives for renewable energy investments, stricter emissions regulations, and government-backed research initiatives. These measures aim to accelerate the transition to cleaner energy sources and reduce carbon emissions across industries.</p>
      
      <p>Market analysts predict that companies in the solar, wind, and energy storage sectors will see substantial growth over the next five years. Meanwhile, fossil fuel-focused companies will need to diversify their portfolios to remain competitive in the changing energy landscape.</p>
      
      <p>For businesses outside the energy sector, these changes may result in both challenges and opportunities. Rising energy costs could impact operational expenses, but investments in energy efficiency and on-site renewable generation could provide long-term savings and sustainability benefits.</p>
    `,
    source: 'Financial Times',
    author: 'Jane Smith',
    category: 'Energy',
    tags: ['renewable energy', 'policy', 'market trends', 'sustainability'],
    impactScore: 85,
    publishedDate: '2023-04-02',
    readTime: '4 min read',
    credibilityScore: 92
  };
  
  const predictionData = prediction || {
    overallImpact: 85,
    factors: [
      { name: 'Industry Relevance', score: 95 },
      { name: 'Market Volatility', score: 80 },
      { name: 'Regulatory Changes', score: 90 },
      { name: 'Supply Chain', score: 75 },
      { name: 'Consumer Behavior', score: 65 }
    ],
    summary: 'This news is highly relevant to your business in the energy sector. The regulatory changes mentioned could directly impact your operations, while market shifts may present new opportunities for growth in renewable technologies.',
    recommendations: [
      'Consider reviewing your sustainability strategy',
      'Explore tax incentive programs for renewable energy investments',
      'Monitor developments in energy storage technology',
      'Analyze competitors\' responses to these policy changes'
    ],
    relatedArticles: [
      { id: 2, title: 'Tech industry facing new regulatory challenges', source: 'TechCrunch' },
      { id: 4, title: 'Healthcare startups attract record investment in Q1', source: 'Healthcare Daily' },
      { id: 5, title: 'Consumer spending shows strong recovery signs', source: 'Bloomberg' }
    ]
  };
  
  // Toggle chart type
  const handleChartChange = (chartType) => {
    setActiveChart(chartType);
  };
  
  // Enhanced chart data
  const barChartData = {
    labels: predictionData.factors.map(f => f.name),
    datasets: [
      {
        label: 'Impact Score',
        data: predictionData.factors.map(f => f.score),
        backgroundColor: predictionData.factors.map(f => getImpactColor(f.score) + '80'), // Add transparency
        borderColor: predictionData.factors.map(f => getImpactColor(f.score)),
        borderWidth: 1,
      },
    ],
  };
  
  const radarChartData = {
    labels: predictionData.factors.map(f => f.name),
    datasets: [
      {
        label: 'Impact Profile',
        data: predictionData.factors.map(f => f.score),
        backgroundColor: theme.palette.primary.main + '30',
        borderColor: theme.palette.primary.main,
        borderWidth: 2,
        pointBackgroundColor: predictionData.factors.map(f => getImpactColor(f.score)),
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: theme.palette.primary.main
      },
    ],
  };
  
  const doughnutChartData = {
    labels: ['High Impact', 'Medium Impact', 'Low Impact'],
    datasets: [
      {
        data: [
          predictionData.factors.filter(f => f.score >= 80).length,
          predictionData.factors.filter(f => f.score >= 60 && f.score < 80).length,
          predictionData.factors.filter(f => f.score < 60).length
        ],
        backgroundColor: [
          theme.palette.error.main,
          theme.palette.warning.main,
          theme.palette.success.main
        ],
        borderColor: [
          theme.palette.error.main,
          theme.palette.warning.main,
          theme.palette.success.main
        ],
        borderWidth: 1,
      },
    ],
  };
  
  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Impact Factors',
        font: {
          size: 16,
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value) {
            return value + '%';
          },
        }
      }
    }
  };
  
  const radarChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Impact Profile',
        font: {
          size: 16,
        }
      },
    },
    scales: {
      r: {
        angleLines: {
          color: theme.palette.divider,
        },
        grid: {
          color: theme.palette.divider,
        },
        suggestedMin: 0,
        suggestedMax: 100,
        ticks: {
          backdropColor: 'transparent',
          stepSize: 20
        }
      }
    }
  };
  
  const doughnutChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Impact Distribution',
        font: {
          size: 16,
        }
      },
    },
    cutout: '70%',
  };
  
  // Loading and error states
  if (articleLoading || predictionLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (articleError) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center', maxWidth: 600, mx: 'auto', mt: 4 }}>
        <Typography variant="h6" color="error" gutterBottom>
          Error loading article
        </Typography>
        <Typography color="textSecondary" paragraph>
          {articleErrorData?.message || 'An unknown error occurred'}
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => navigate('/news')}
          startIcon={<ArrowBackIcon />}
        >
          Back to News Feed
        </Button>
      </Paper>
    );
  }
  
  return (
    <Box>
      {/* Back button */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/news')}
        sx={{ mb: 2 }}
      >
        Back to News Feed
      </Button>
      
      <Grid container spacing={3}>
        {/* Main article */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            {/* Article header */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="textSecondary" gutterBottom>
                {articleData.source} • {articleData.publishedDate} • {articleData.readTime}
              </Typography>
              <Typography variant="h4" gutterBottom>
                {articleData.title}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ width: 24, height: 24, mr: 1, bgcolor: theme.palette.primary.main }}>
                    <PersonOutlineIcon fontSize="small" />
                  </Avatar>
                  <Typography variant="body2">{articleData.author}</Typography>
                </Box>
                <Chip 
                  size="small" 
                  label={articleData.category} 
                  sx={{ ml: 2 }} 
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 2 }}>
                <Tooltip title="Credibility Score">
                  <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
                    <StarIcon fontSize="small" sx={{ color: theme.palette.warning.main, mr: 0.5 }} />
                    <Typography variant="body2">{articleData.credibilityScore}% credibility</Typography>
                  </Box>
                </Tooltip>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    bgcolor: getImpactColor(articleData.impactScore) + '20',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                  }}
                >
                  <EqualizerIcon fontSize="small" sx={{ mr: 0.5, color: getImpactColor(articleData.impactScore) }} />
                  <Typography 
                    variant="body2" 
                    sx={{ fontWeight: 'medium', color: getImpactColor(articleData.impactScore) }}
                  >
                    {articleData.impactScore}% {getImpactLabel(articleData.impactScore)} Impact
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${theme.palette.divider}`, pt: 1 }}>
                <Box>
                  {articleData.tags.map((tag, index) => (
                    <Chip 
                      key={index}
                      label={tag} 
                      size="small" 
                      variant="outlined"
                      sx={{ mr: 0.5, mb: 0.5 }}
                    />
                  ))}
                </Box>
                <Box>
                  <Tooltip title="Bookmark">
                    <IconButton 
                      onClick={handleBookmark} 
                      color={isBookmarked ? "primary" : "default"} 
                      size="small"
                    >
                      {isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Share">
                    <IconButton onClick={handleShare} size="small">
                      <ShareIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </Box>
            
            <Divider sx={{ mb: 3 }} />
            
            {/* Article content */}
            <Box 
              sx={{ mb: 3 }}
              dangerouslySetInnerHTML={{ __html: articleData.content }}
            />
          </Paper>
        </Grid>
        
        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Impact prediction */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Impact Analysis
            </Typography>
            
            <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 3 }}>
              <Box sx={{ 
                position: 'relative',
                width: 150, 
                height: 150, 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                borderRadius: '50%',
                background: `conic-gradient(${getImpactColor(predictionData.overallImpact)} ${predictionData.overallImpact}%, #f0f0f0 0)`,
                "&::before": {
                  content: '""',
                  position: 'absolute',
                  borderRadius: '50%',
                  inset: '10px',
                  background: theme.palette.background.paper,
                }
              }}>
                <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                  <Typography variant="h3" color={getImpactColor(predictionData.overallImpact)} sx={{ fontWeight: 'bold' }}>
                    {predictionData.overallImpact}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Overall Impact
                  </Typography>
                </Box>
              </Box>
            </Box>
            
            <Typography variant="body2" sx={{ mb: 3 }} paragraph>
              {predictionData.summary}
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Box sx={{ 
                display: 'flex',
                justifyContent: 'center', 
                mb: 2,
                "& button": {
                  mx: 0.5
                }
              }}>
                <Tooltip title="Bar Chart">
                  <Button 
                    size="small" 
                    variant={activeChart === 'bar' ? 'contained' : 'outlined'}
                    onClick={() => handleChartChange('bar')}
                    startIcon={<BarChartIcon />}
                  >
                    Bar
                  </Button>
                </Tooltip>
                <Tooltip title="Radar Chart">
                  <Button 
                    size="small" 
                    variant={activeChart === 'radar' ? 'contained' : 'outlined'}
                    onClick={() => handleChartChange('radar')}
                    startIcon={<TimelineIcon />}
                  >
                    Radar
                  </Button>
                </Tooltip>
                <Tooltip title="Doughnut Chart">
                  <Button 
                    size="small" 
                    variant={activeChart === 'doughnut' ? 'contained' : 'outlined'}
                    onClick={() => handleChartChange('doughnut')}
                    startIcon={<PieChartIcon />}
                  >
                    Doughnut
                  </Button>
                </Tooltip>
              </Box>
              
              <Box sx={{ height: 300 }}>
                {activeChart === 'bar' && (
                  <Bar data={barChartData} options={barChartOptions} />
                )}
                {activeChart === 'radar' && (
                  <Radar data={radarChartData} options={radarChartOptions} />
                )}
                {activeChart === 'doughnut' && (
                  <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
                )}
              </Box>
            </Box>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="subtitle1" gutterBottom>
              Recommendations
            </Typography>
            <List dense>
              {predictionData.recommendations.map((rec, index) => (
                <ListItem key={index}>
                  <ListItemIcon sx={{ minWidth: '30px' }}>
                    <TrendingUpIcon color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={rec} />
                </ListItem>
              ))}
            </List>
          </Paper>
          
          {/* Related articles */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Related Articles
            </Typography>
            <List dense>
              {predictionData.relatedArticles.map((article) => (
                <ListItem 
                  key={article.id} 
                  button
                  onClick={() => navigate(`/news/${article.id}`)}
                  sx={{
                    borderRadius: 1,
                    '&:hover': {
                      bgcolor: theme.palette.action.hover
                    }
                  }}
                >
                  <ListItemText 
                    primary={article.title} 
                    secondary={article.source}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
} 