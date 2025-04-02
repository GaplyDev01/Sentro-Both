const express = require('express');
const router = express.Router();
const { updateProfile, updateBusinessDetails } = require('../controllers/user.controller');
const { validateRequest, schemas } = require('../middlewares/validation.middleware');

// Update user profile
router.put('/profile', validateRequest(schemas.updateProfile), updateProfile);

// Update business details
router.patch('/business-details', validateRequest(schemas.updateBusinessDetails), updateBusinessDetails);

module.exports = router; 