const mongoose = require('mongoose');

// Define the schema for comments
const commentSchema = new mongoose.Schema({
  postId: { type: String, required: true },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Create and export the Comment model
module.exports = mongoose.model('Comment', commentSchema);
