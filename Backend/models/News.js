// models/News.js
const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: String,
  status: String,
  category: [String],
  coverImage: String,
  additionalImage1: String,
  additionalImage2: String,
}, {
  collection: 'editor_articles',
  timestamps: true  // adds createdAt and updatedAt automatically
});


module.exports = mongoose.model('News', NewsSchema);