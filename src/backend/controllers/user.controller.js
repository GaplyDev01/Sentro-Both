const User = require('../models/user.model');

/**
 * Update user profile
 * @route PUT /api/users/profile
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @returns {object} Updated user data
 */
const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, password } = req.body;
    const userId = req.user.id;
    
    // Update user
    const updatedUser = await User.update(userId, {
      firstName,
      lastName,
      password,
    });

    res.status(200).json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.error('Update profile error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message,
    });
  }
};

/**
 * Update business details
 * @route PATCH /api/users/business-details
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @returns {object} Updated user data
 */
const updateBusinessDetails = async (req, res) => {
  try {
    const { industry, location } = req.body;
    const userId = req.user.id;
    
    if (!industry || !location) {
      return res.status(400).json({
        success: false,
        message: 'Industry and location are required',
      });
    }
    
    // Update user
    const updatedUser = await User.update(userId, {
      businessDetails: {
        industry,
        location,
      },
      setupCompleted: true,
    });

    res.status(200).json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.error('Update business details error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update business details',
      error: error.message,
    });
  }
};

module.exports = {
  updateProfile,
  updateBusinessDetails,
}; 