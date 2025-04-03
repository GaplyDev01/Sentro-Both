// Import the main Express app and middleware
const app = require('../index');

// Create a handler that routes based on the request path
const handler = (req, res) => {
  console.log('News route handler called:', req.method, req.url);
  
  // For Vercel serverless functions, we need to rewrite the URL
  // The original URL will be like /api/news/trending
  // In this catch-all route file, route will be in req.query
  if (req.query && req.query.route) {
    // Convert the route array to a path string
    const routePath = Array.isArray(req.query.route) 
      ? '/' + req.query.route.join('/') 
      : '/' + req.query.route;
    
    console.log('Rewriting URL from', req.url, 'to', '/news' + routePath);
    req.url = '/news' + routePath;
  }
  
  // Route requests through the Express app
  return app(req, res);
};

module.exports = handler; 