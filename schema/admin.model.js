const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'admin',
        enum: ['admin', 'superadmin']
    },
    permissions: [{
        type: String,
        enum: ['create_user', 'edit_user', 'delete_user', 'view_analytics', 'manage_memberships']
    }],
    phoneNumber: {
        type: String,
        required: true
    },
    lastLogin: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended'],
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt timestamp before saving
adminSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;