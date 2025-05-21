// models/ad.js
const mongoose = require('mongoose');

// Define Schema for Ads
const adSchema = new mongoose.Schema({
  title: String,
  websiteLink: String,
  position: String,
  duration: Number,
  imageUrl: String,
  createdAt: Date,
  updatedAt: Date
});

// Create the Model for Ads
const Ad = mongoose.model('Ad', adSchema);

module.exports = Ad;
