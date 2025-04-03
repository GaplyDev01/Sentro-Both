const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Import database connection
const { testConnection } = require('./config/db.config');

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const newsRoutes = require('./routes/news.routes');
const predictionRoutes = require('./routes/prediction.routes');

// Import middlewares
const errorHandler = require('./middlewares/error.middleware');
const { authenticateJwt } = require('./middlewares/auth.middleware');

// Initialize express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
}));

// Only use morgan in development
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Base API route
app.use('/api', (req, res, next) => {
  console.log(`API Request: ${req.method} ${req.originalUrl}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authenticateJwt, userRoutes);
app.use('/api/news', authenticateJwt, newsRoutes);
app.use('/api/predictions', authenticateJwt, predictionRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  const staticPath = path.join(__dirname, '../../frontend/src/frontend/build');
  app.use(express.static(staticPath));
  
  // Any routes not matched by API will be redirected to index.html
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.resolve(staticPath, 'index.html'));
    }
  });
} else {
  // Default route for development
  app.get('/', (req, res) => {
    res.json({
      message: 'Welcome to the News Impact Platform API',
    });
  });
}

// Error handling middleware
app.use(errorHandler);

// Start server with database connection test
const startServer = async () => {
  try {
    // Test connection to Supabase
    const connected = await testConnection();
    
    if (!connected) {
      console.error('Failed to connect to Supabase. Check your credentials.');
      process.exit(1);
    }
    
    // Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API URL: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Server startup error:', error.message);
    process.exit(1);
  }
};

// Only start the server if not in a serverless environment
// Vercel will import the app but not call listen()
if (process.env.NODE_ENV !== 'production') {
  startServer();
} else {
  // Test connection to Supabase when module is loaded in production
  testConnection().catch(err => {
    console.error('Failed to connect to Supabase:', err);
  });
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // Don't exit in production, as it will take down the serverless function
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1);
  }
});

// Export app for testing and serverless use
module.exports = app; 