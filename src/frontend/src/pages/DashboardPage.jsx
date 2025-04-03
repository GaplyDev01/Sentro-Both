import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Grid, 
  Paper, 
  Tabs,
  Tab,
  ButtonGroup,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { getDashboardData } from '../services/newsService';
import { useQuery } from 'react-query';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function DashboardPage() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [timeFrame, setTimeFrame] = useState('week');
  const [category, setCategory] = useState('all');
  
  const { data, isLoading, isError, refetch } = useQuery(
    ['dashboardData', timeFrame, category, activeTab],
    () => getDashboardData({ timeFrame, category }),
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false
    }
  );
  
  useEffect(() => {
    refetch();
  }, [timeFrame, category, refetch]);
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };
  
  const getScoreColor = (score) => {
    if (score >= 80) return '#f44336'; // red
    if (score >= 60) return '#ff9800'; // orange
    if (score >= 40) return '#2196f3'; // blue
    return '#4caf50'; // green
  };
  
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (isError) {
    return (
      <Box sx={{ mt: 3 }}>
        <Alert severity="error">
          Failed to load dashboard data. Please try again later.
        </Alert>
      </Box>
    );
  }
  
  const impactColor = data ? getScoreColor(data.impactScore) : '#4caf50';
  
  // Configure chart options and data
  const trendChartData = {
    labels: data?.impactTrend?.labels || [],
    datasets: [
      {
        label: 'Impact Score',
        data: data?.impactTrend?.data || [],
        fill: false,
        backgroundColor: '#2196f3',
        borderColor: '#2196f3',
        tension: 0.4
      }
    ]
  };
  
  const trendChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: false
      }
    },
    scales: {
      y: {
        min: 0,
        max: 100
      }
    }
  };
  
  const pieChartData = {
    labels: data?.impactDistribution?.labels || [],
    datasets: [
      {
        label: 'News Count',
        data: data?.impactDistribution?.data || [],
        backgroundColor: [
          '#f44336',
          '#ff9800',
          '#4caf50'
        ],
        borderColor: [
          '#f44336',
          '#ff9800',
          '#4caf50'
        ],
        borderWidth: 1,
      },
    ],
  };
  
  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };
  
  const barChartData = {
    labels: data?.newsVolumeByCategory?.labels || [],
    datasets: [
      {
        label: 'News Count',
        data: data?.newsVolumeByCategory?.data || [],
        backgroundColor: [
          '#f44336',
          '#ff9800',
          '#2196f3',
          '#4caf50',
          '#9c27b0',
          '#795548'
        ]
      },
    ],
  };
  
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };
  
  const industryChartData = {
    labels: data?.industryImpactData?.labels || [],
    datasets: [
      {
        label: 'Impact Score',
        data: data?.industryImpactData?.data || [],
        backgroundColor: [
          '#f44336',
          '#ff9800',
          '#4caf50',
          '#9c27b0'
        ]
      },
    ],
  };
  
  const marketTrendsChartData = {
    labels: data?.marketTrendsData?.labels || [],
    datasets: data?.marketTrendsData?.datasets?.map((dataset, index) => ({
      label: dataset.label,
      data: dataset.data,
      fill: false,
      backgroundColor: index === 0 ? '#2196f3' : '#f44336',
      borderColor: index === 0 ? '#2196f3' : '#f44336',
      tension: 0.4
    })) || [],
  };
  
  const predictionsChartData = {
    labels: data?.futurePredictions?.labels || [],
    datasets: [
      {
        label: 'Predicted Impact',
        data: data?.futurePredictions?.data || [],
        backgroundColor: '#9c27b0',
        borderColor: '#9c27b0',
        borderWidth: 1,
      },
    ],
  };
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Business Impact Dashboard
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        Track how news and events impact {currentUser?.business?.name || 'your business'}
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="dashboard tabs">
          <Tab label="Overview" />
          <Tab label="Industry Impact" />
          <Tab label="Market Trends" />
          <Tab label="Predictions" />
        </Tabs>
      </Box>
      
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <ButtonGroup variant="outlined" aria-label="time frame selection">
          <Button 
            onClick={() => setTimeFrame('day')} 
            variant={timeFrame === 'day' ? 'contained' : 'outlined'}
          >
            Day
          </Button>
          <Button 
            onClick={() => setTimeFrame('week')} 
            variant={timeFrame === 'week' ? 'contained' : 'outlined'}
          >
            Week
          </Button>
          <Button 
            onClick={() => setTimeFrame('month')} 
            variant={timeFrame === 'month' ? 'contained' : 'outlined'}
          >
            Month
          </Button>
          <Button 
            onClick={() => setTimeFrame('quarter')} 
            variant={timeFrame === 'quarter' ? 'contained' : 'outlined'}
          >
            Quarter
          </Button>
        </ButtonGroup>
        
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="category-select-label">Category</InputLabel>
          <Select
            labelId="category-select-label"
            id="category-select"
            value={category}
            label="Category"
            onChange={handleCategoryChange}
            size="small"
          >
            <MenuItem value="all">All Categories</MenuItem>
            <MenuItem value="financial">Financial</MenuItem>
            <MenuItem value="technology">Technology</MenuItem>
            <MenuItem value="market">Market</MenuItem>
            <MenuItem value="regulatory">Regulatory</MenuItem>
            <MenuItem value="supply-chain">Supply Chain</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      {activeTab === 0 && (
        <Grid container spacing={3}>
          {/* Top row - Summary cards */}
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>Overall Impact Score</Typography>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                height: 150,
                position: 'relative'
              }}>
                <Box sx={{ 
                  width: 120, 
                  height: 120, 
                  borderRadius: '50%', 
                  bgcolor: impactColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0px 0px 15px rgba(0,0,0,0.2)'
                }}>
                  <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold' }}>
                    {data?.impactScore || 0}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                Based on {data?.newsCount || 0} news articles affecting your business in the selected time period
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Impact Trend ({timeFrame === 'day' ? 'Hourly' : 
                  timeFrame === 'week' ? 'Daily' : 
                  timeFrame === 'month' ? 'Weekly' : 'Monthly'})
              </Typography>
              <Box sx={{ height: 220 }}>
                <Line 
                  data={trendChartData} 
                  options={trendChartOptions}
                />
              </Box>
            </Paper>
          </Grid>
          
          {/* Second row */}
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Top Impact Categories</Typography>
              <Box sx={{ mt: 2 }}>
                {data?.topImpactedCategories?.map((item, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2">{item.category}</Typography>
                      <Typography variant="body2" fontWeight="bold">{item.score}</Typography>
                    </Box>
                    <Box sx={{ width: '100%', height: 8, bgcolor: '#e0e0e0', borderRadius: 4 }}>
                      <Box 
                        sx={{ 
                          width: `${item.score}%`, 
                          height: '100%', 
                          bgcolor: getScoreColor(item.score),
                          borderRadius: 4
                        }} 
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Impact Distribution</Typography>
              <Box sx={{ height: 240 }}>
                <Doughnut 
                  data={pieChartData} 
                  options={pieChartOptions}
                />
              </Box>
            </Paper>
          </Grid>
          
          {/* Third row */}
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>News Volume by Category</Typography>
              <Box sx={{ height: 300 }}>
                <Bar 
                  data={barChartData} 
                  options={barChartOptions}
                />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}
      
      {activeTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Industry Impact Analysis</Typography>
              <Typography variant="body1" paragraph>
                A more detailed analysis of how news and events are impacting your specific industry 
                ({currentUser?.business?.industry || 'your industry'}).
              </Typography>
              <Box sx={{ height: 400 }}>
                <Bar 
                  data={industryChartData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 100
                      }
                    }
                  }}
                />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}
      
      {activeTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Market Trends</Typography>
              <Typography variant="body1" paragraph>
                Analysis of market trends relevant to your business sector.
              </Typography>
              <Box sx={{ height: 400 }}>
                <Line 
                  data={marketTrendsChartData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top'
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true
                      }
                    }
                  }}
                />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}
      
      {activeTab === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Future Impact Predictions</Typography>
              <Typography variant="body1" paragraph>
                Predictive analysis of how upcoming news and events may impact your business operations.
              </Typography>
              <Box sx={{ height: 400 }}>
                <Bar 
                  data={predictionsChartData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 100
                      }
                    }
                  }}
                />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
} 