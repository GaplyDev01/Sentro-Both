const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import database connection
const { testConnection } = require('../src/backend/config/db.config');

// Import routes
const authRoutes = require('../src/backend/routes/auth.routes');
const userRoutes = require('../src/backend/routes/user.routes');
const newsRoutes = require('../src/backend/routes/news.routes');
const predictionRoutes = require('../src/backend/routes/prediction.routes');

// Import middlewares
const errorHandler = require('../src/backend/middlewares/error.middleware');
const { authenticateJwt } = require('../src/backend/middlewares/auth.middleware');

// Initialize express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
}));

// Debug logging for all requests
app.use((req, res, next) => {
  console.log(`[DEBUG] API Request at ${new Date().toISOString()}`);
  console.log(`[DEBUG] Method: ${req.method}, URL: ${req.url}, Path: ${req.path}`);
  console.log(`[DEBUG] Query:`, req.query);
  console.log(`[DEBUG] Body:`, req.body);
  next();
});

// Base API route
app.use('/', (req, res, next) => {
  console.log(`API Request: ${req.method} ${req.originalUrl}`);
  next();
});

// Routes
app.use('/auth', authRoutes);
app.use('/users', authenticateJwt, userRoutes);
app.use('/news', authenticateJwt, newsRoutes);
app.use('/predictions', authenticateJwt, predictionRoutes);

// Default route for health check
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'News Impact Platform API is running',
    env: process.env.NODE_ENV
  });
});

// Error handling middleware
app.use(errorHandler);

// Test database connection on cold start
testConnection().catch(err => {
  console.error('Failed to connect to Supabase:', err);
});

// Export the Express app as a serverless function
module.exports = app; 