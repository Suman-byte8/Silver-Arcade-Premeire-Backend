const User = require('../schema/user.model');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const { generateToken } = require('../middlewares/authMiddleware');

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

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

module.exports = { registerUser };