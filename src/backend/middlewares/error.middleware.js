/**
 * Global error handling middleware
 * @param {object} err - Error object
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @param {function} next - Next middleware function
 * @returns {object} Error response
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  
  // Log error
  console.error(`Error: ${err.message}`);
  
  // Send standardized error response
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Server error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = errorHandler; 