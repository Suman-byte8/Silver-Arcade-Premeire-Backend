const mongoose = require('mongoose');
const commonFields = require('../Shared/commonFields');

const footerLinkSchema = new mongoose.Schema({
...commonFields
}, { timestamps: true });

module.exports = mongoose.model('FooterLink', footerLinkSchema);