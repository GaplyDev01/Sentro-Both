const Joi = require('joi');

/**
 * Validate request body against schema
 * @param {object} schema - Joi validation schema
 * @returns {function} Express middleware function
 */
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    
    next();
  };
};

/**
 * Validation schemas
 */
const schemas = {
  // User registration schema
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
  }),
  
  // User login schema
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
  
  // Update profile schema
  updateProfile: Joi.object({
    firstName: Joi.string(),
    lastName: Joi.string(),
    password: Joi.string().min(6),
  }).min(1),
  
  // Update business details schema
  updateBusinessDetails: Joi.object({
    industry: Joi.string().required(),
    location: Joi.string().required(),
  }),
};

module.exports = {
  validateRequest,
  schemas,
}; 