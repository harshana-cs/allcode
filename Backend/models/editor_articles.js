const mongoose = require('mongoose');

const ApprovedArticleSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: String,
  status: { type: String, default: 'approved' },
  category: [String],
  coverImage: String,
  additionalImage1: String,
  additionalImage2: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Editor_articles', ApprovedArticleSchema);
