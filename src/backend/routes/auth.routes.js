const express = require('express');
const router = express.Router();
const { register, login, getProfile } = require('../controllers/auth.controller');
const { authenticateJwt } = require('../middlewares/auth.middleware');
const { validateRequest, schemas } = require('../middlewares/validation.middleware');

// Register a new user
router.post('/register', validateRequest(schemas.register), register);

// Login user
router.post('/login', validateRequest(schemas.login), login);

// Get user profile (protected route)
router.get('/profile', authenticateJwt, getProfile);

module.exports = router; 