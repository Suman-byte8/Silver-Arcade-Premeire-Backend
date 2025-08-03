const mongoose = require('mongoose');

const roomsSchema = new mongoose.Schema({
    roomName: {
        type: String,
        required: true
    },
    roomType: {
        type: String,
        required: true
    },
    roomCapacity: {
        type: Number,
        required: true
    },
    roomPrice: {
        type: Number,
        required: true
    },
    roomDescription: {
        type: String,
        required: true
    },
    roomImage: {
        type: String,
        required: true
    },
    roomStatus: {
        type: String,
        enum: ['available', 'booked'],
        default: 'available'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


const Room = mongoose.model('Room', roomsSchema);
module.exports = Room;