const jwt = require('jsonwebtoken');
const User = require('../schema/user.model');


const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];
            
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("Decoded token:", decoded);

            // Get user based on role
            let user;
            if (decoded.user && decoded.user.role === 'admin') {
                user = await admin.findById(decoded.user.id).select('-password');
                user.role = 'admin'; // Ensure role is set
            } else if (decoded.user) {
                user = await User.findById(decoded.user.id).select('-password');
                user.role = 'user'; // Ensure role is set
            } else {
                // Legacy token format
                if (decoded.role === 'admin') {
                    user = await admin.findById(decoded.id).select('-password');
                    user.role = 'admin';
                } else {
                    user = await User.findById(decoded.id).select('-password');
                    user.role = 'user';
                }
            }

            if (!user) {
                return res.status(401).json({ message: 'User not found' });
            }

            req.user = user;
            next();
        } catch (error) {
            console.error('Token verification error:', error);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        return res.status(401).json({ message: 'Not authorized, no token provided' });
    }
};


// Middleware to authorize based on user or admin model
const authorize = (expectedRole) => {
    return (req, res, next) => {
      if (!req.user || req.user.role !== expectedRole) {
        return res.status(403).json({
          message: `Not authorized to access this route, Expected role: ${expectedRole}`
        });
      }
      next();
    };
  };
  

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Adjust expiration as needed
    });
};

module.exports = { protect, authorize, generateToken };
