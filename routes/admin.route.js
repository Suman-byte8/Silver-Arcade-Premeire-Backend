const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin, getAdminProfile,populateUserActivity } = require('../controllers/admin.controller');
const { check } = require('express-validator');
const { protect, authorize } = require('../middlewares/authMiddleware');


// Admin Validation middleware
const validateAdminRegistration = [
    check('firstName', 'First name is required').not().isEmpty(),
    check('lastName', 'Last name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    check('role').equals('admin')
];

// validate login credentials
const validateAdminLogin = [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').not().isEmpty()
];



// Admin routes
router.post('/register', validateAdminRegistration, registerAdmin);
router.post('/login', validateAdminLogin, loginAdmin);
router.get('/profile/:adminId', protect, authorize('admin'), getAdminProfile);
router.get('/user-activity', protect, authorize('admin'), populateUserActivity);

module.exports = router;