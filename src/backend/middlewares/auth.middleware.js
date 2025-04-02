const { verifyToken } = require('../config/jwt.config');
const User = require('../models/user.model');

/**
 * Middleware to authenticate JWT token
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @param {function} next - Next middleware function
 * @returns {void}
 */
const authenticateJwt = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication failed: No token provided',
      });
    }
    
    // Verify token
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    
    // Find user by id
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication failed: User not found',
      });
    }
    
    // Set user in request
    req.user = user;
    
    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Authentication failed: Invalid token',
    });
  }
};

/**
 * Middleware to check if user has completed setup
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @param {function} next - Next middleware function
 * @returns {void}
 */
const checkSetupComplete = (req, res, next) => {
  // Check if user has completed setup
  if (!req.user.setupCompleted) {
    return res.status(403).json({
      success: false,
      message: 'Please complete your business profile setup first',
    });
  }
  
  next();
};

module.exports = {
  authenticateJwt,
  checkSetupComplete,
}; 