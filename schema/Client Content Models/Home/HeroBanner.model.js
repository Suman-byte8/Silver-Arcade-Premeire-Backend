const mongoose = require('mongoose');

const heroBannerSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subtitle: { type: String },
    description: { type: String, required: true },
    image:{ type: String, required: true},
    url: { type: String, required: true },
    page: { type: String, default: 'home' },
    section: { type: String, default: 'hero' },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('HeroBanner', heroBannerSchema);