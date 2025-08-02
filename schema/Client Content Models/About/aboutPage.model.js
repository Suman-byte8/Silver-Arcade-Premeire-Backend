const mongoose = require('mongoose');


const aboutPageSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    heroImage: { type: String, required: true },
    amenities: {
        type: String,
        title: { type: String, required: true },
        icon: true,
        required: true,
        description: { type: String, required: true }
    },
    exceptionalService: {
        type: String,
        title: { type: String, required: true },
        icon: true,
        required: true,
        description: { type: String, required: true }
    },
    images:{
        type: [String],
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('AboutPage', aboutPageSchema);