const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, populateUserActivity } = require('../controllers/user.controller');
const { check } = require('express-validator');
const { protect, authorize } = require('../middlewares/authMiddleware');

// Validation middleware
const validateRegistration = [
    check('firstName', 'First name is required').not().isEmpty(),
    check('lastName', 'Last name is required').not().isEmpty(),
    check('username', 'Username is required').not().isEmpty(),
    check('memberShipType', 'Member ship type is required').not().isEmpty(),
    check('memberShipStartDate', 'Member ship start date is required').not().isEmpty(),
    check('memberShipEndDate', 'Member ship end date is required').not().isEmpty(),
    check('phoneNumber', 'Phone number is required').not().isEmpty(),
    check('whatsAppNumber', 'WhatsApp number is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('address', 'Address is required').not().isEmpty(),
    check('alternateNumber', 'Alternate number is required').not().isEmpty(),
    check('password', 'Password is required').not().isEmpty()
];

// validate login credentials
const validateLogin = [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').not().isEmpty()
];

// Register route
router.post('/register', validateRegistration, registerUser);

// login route
router.post('/login',validateLogin,loginUser)

// Get user profile route
router.get('/profile/:userId', protect, getUserProfile);

module.exports = router;

