// Simple health check endpoint
module.exports = (req, res) => {
  console.log('Health check endpoint called:', req.method, req.url);
  
  res.status(200).json({
    status: 'ok',
    message: 'News Impact Platform API is running',
    env: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
}; 