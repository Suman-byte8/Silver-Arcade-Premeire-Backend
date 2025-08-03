const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin, getAdminProfile, populateUserActivity, addRooms, updateRoomDetails } = require('../controllers/admin.controller');
const { check } = require('express-validator');
const { protect, authorize } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');


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

// Register Admin
router.post('/register', validateAdminRegistration, registerAdmin);
// Login Admin
router.post('/login', validateAdminLogin, loginAdmin);
// Get Admin Profile
router.get('/profile/:adminId', protect, authorize('admin'), getAdminProfile);
// Populate User Activity
router.get('/user-activity', protect, authorize('admin'), populateUserActivity);
// add rooms
router.post('/add-rooms', protect, authorize('admin'), upload.single('roomImage'), addRooms);
// Update Room Details
router.put('/update-room-details/:roomId', protect, authorize('admin'), upload.single('roomImage'), updateRoomDetails);

module.exports = router;