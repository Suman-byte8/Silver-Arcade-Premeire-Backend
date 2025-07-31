const Admin = require('../schema/admin.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userActivity = require("../schema/userActivity");
const { generateToken } = require('../middlewares/authMiddleware');
const Room = require('../schema/rooms.model');



// Register Admin
async function registerAdmin(req, res) {
    try {
        const {
            firstName,
            lastName,
            username,
            email,
            password,
            phoneNumber,
            permissions,
            role
        } = req.body;

        // Check if admin exists
        const adminExists = await Admin.findOne({ email });
        if (adminExists) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create admin
        const admin = await Admin.create({
            firstName,
            lastName,
            username,
            email,
            password: hashedPassword,
            phoneNumber,
            permissions,
            role: role || 'admin',
            status: 'active'
        });

        if (admin) {
            const token = generateToken(admin._id, admin.role);
            res.status(201).json({
                success: true,
                message: 'Admin registered successfully',
                admin: {
                    id: admin._id,
                    username: admin.username,
                    email: admin.email,
                    role: admin.role,
                    permissions: admin.permissions,
                    status: admin.status
                },
                token
            });
        }

    } catch (error) {
        console.error('Admin registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
}

// Login Admin
async function loginAdmin(req, res) {
    try {
        const { email, password } = req.body;

        // Check if admin exists
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check if admin is active
        if (admin.status !== 'active') {
            return res.status(403).json({ message: 'Account is not active' });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Update last login
        admin.lastLogin = Date.now();
        await admin.save();

        // Generate token
        const token = generateToken(admin._id, admin.role);

        res.status(200).json({
            success: true,
            message: 'Admin logged in successfully',
            admin: {
                id: admin._id,
                username: admin.username,
                email: admin.email,
                role: admin.role,
                permissions: admin.permissions,
                status: admin.status
            },
            token
        });

    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
}

// Get Admin Profile
async function getAdminProfile(req, res) {
    try {
        const admin = await Admin.findById(req.user.id).select('-password');

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        res.status(200).json({
            success: true,
            admin: {
                id: admin._id,
                firstName: admin.firstName,
                lastName: admin.lastName,
                username: admin.username,
                email: admin.email,
                role: admin.role,
                permissions: admin.permissions,
                phoneNumber: admin.phoneNumber,
                status: admin.status,
                lastLogin: admin.lastLogin,
                createdAt: admin.createdAt,
                updatedAt: admin.updatedAt
            }
        });

    } catch (error) {
        console.error('Error fetching admin profile:', error);
        res.status(500).json({ message: 'Server error while fetching profile' });
    }
}

// Populate User Activity
async function populateUserActivity(req, res) {
    try {
        const activities = await userActivity.find().populate('userId', 'username email');
        res.status(200).json({
            success: true,
            activities
        });
    } catch (error) {
        console.error('Error fetching user activities:', error);
        res.status(500).json({ message: 'Server error while fetching user activities' });
    }
}

// add rooms
async function addRooms(req, res) {
    try {
        const { roomName, roomType, roomCapacity, roomPrice, roomDescription, roomImage, roomStatus } = req.body;
        const newRoom = new Room({
            roomName,
            roomType,
            roomCapacity,
            roomPrice,
            roomDescription,
            roomImage,
            roomStatus
        });
        await newRoom.save();
        res.status(201).json({
            success: true,
            message: 'Room added successfully',
            room: newRoom
        });
    } catch (error) {
        console.error('Error adding room:', error);
        res.status(500).json({ message: 'Server error while adding room' });
    }
}


module.exports = {
    registerAdmin,
    loginAdmin,
    getAdminProfile,
    populateUserActivity,
    addRooms
};