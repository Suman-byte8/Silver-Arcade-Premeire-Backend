const User = require('../schema/user.model');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const { generateToken } = require('../middlewares/authMiddleware');
const userActivity = require('../schema/userActivity');

// Register a new user
async function registerUser(req, res) {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // Destructure the request body
    const { firstName, lastName, username, memberShipType, memberShipStartDate, memberShipEndDate, phoneNumber, whatsAppNumber, email, address, alternateNumber, password } = req.body;

    try {
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        user = new User({
            firstName,
            lastName,
            username,
            memberShipType,
            memberShipStartDate,
            memberShipEndDate,
            phoneNumber,
            whatsAppNumber,
            email,
            address,
            alternateNumber,
            password: hashedPassword
        });

        // Save the user to the database
        await user.save();

        // generate jwt
        const payload = {
            user: {
                id: user._id,
                role: user.role
            }
        };

        generateToken(payload.user.id, payload.user.role).then(token => {
            res.status(201).json({
                message: 'User registered successfully',
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                },
                token: token
            });
        }
        ).catch(err => {
            console.error('Token generation error:', err);
            res.status(500).json({ message: 'Server error during token generation' });
        });

        await userActivity.create({
            userId: newUser._id,
            action: "signup",
            userAgent: req.headers["user-agent"],
            ipAddress: req.ip,
          });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

// login user
// Alternative async/await version
async function loginUser(req, res) {
    const { email, password } = req.body;
    try {
        // Check if user exists
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        
        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        
        // Generate token
        const token = await generateToken(user._id, user.role);
        
        res.status(200).json({
            message: 'User logged in successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
            token: token
        });

        await userActivity.create({
            userId: user._id,
            action: "login",
            userAgent: req.headers["user-agent"],
            ipAddress: req.ip,
          });
          
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

// Get user profile
async function getUserProfile(req, res) {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }   
        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                email: user.email,
                role: user.role,
                memberShipType: user.memberShipType,
                memberShipStartDate: user.memberShipStartDate,
                memberShipEndDate: user.memberShipEndDate,
                phoneNumber: user.phoneNumber,
                whatsAppNumber: user.whatsAppNumber,
                address: user.address,
                alternateNumber: user.alternateNumber
            }
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Server error while fetching user profile' });
    }
};




module.exports = { registerUser, loginUser, getUserProfile };