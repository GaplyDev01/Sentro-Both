const User = require('../models/user.model');
const { generateToken } = require('../config/jwt.config');

/**
 * User registration
 * @route POST /api/auth/register
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @returns {object} User data and token
 */
const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // Create new user
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      setupCompleted: false,
    });

    // Generate token
    const token = generateToken({ id: user.id });

    res.status(201).json({
      success: true,
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message,
    });
  }
};

/**
 * User login
 * @route POST /api/auth/login
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @returns {object} User data and token
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check if password matches
    const isMatch = await User.matchPassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate token
    const token = generateToken({ id: user.id });

    res.status(200).json({
      success: true,
      data: {
        user: User.formatUser(user),
        token,
      },
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message,
    });
  }
};

/**
 * Get user profile
 * @route GET /api/auth/profile
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @returns {object} User data
 */
const getProfile = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    console.error('Profile error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile',
      error: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
}; 