const express = require('express');
const authRouter = express.Router();
const authController = require('../../src/backend/controllers/auth.controller');

// Setup auth routes
authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);
authRouter.post('/verify-email', authController.verifyEmail);
authRouter.post('/forgot-password', authController.forgotPassword);
authRouter.post('/reset-password', authController.resetPassword);

// Import the main Express app and middleware
const app = require('../index');

// Create a new router to handle /auth routes
const router = express.Router();
router.use('/auth', authRouter);

// Create a handler that routes based on the request path
const handler = (req, res) => {
  console.log('Auth route handler called:', req.method, req.url);
  
  // For Vercel serverless functions, we need to rewrite the URL
  // The original URL will be like /api/auth/login
  // In this catch-all route file, route will be in req.query
  if (req.query && req.query.route) {
    // Convert the route array to a path string
    const routePath = Array.isArray(req.query.route) 
      ? '/' + req.query.route.join('/') 
      : '/' + req.query.route;
    
    console.log('Rewriting URL from', req.url, 'to', '/auth' + routePath);
    req.url = '/auth' + routePath;
  }
  
  // Route requests through the Express app
  return app(req, res);
};

module.exports = handler; 