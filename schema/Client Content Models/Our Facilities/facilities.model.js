const mongoose = require('mongoose');
const commonFields = require('../Shared/commonFields');

const facilitySchema = new mongoose.Schema({
  ...commonFields,
  subtitle: { type: String },
  description: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
});

module.exports = mongoose.model('Facility', facilitySchema);