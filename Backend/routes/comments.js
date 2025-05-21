
  
const express = require('express');
const Comment = require('./models/Comment'); // Comment model
const User = require('./models/User');       // User model

// Add a new comment
app.post('/comments', async (req, res) => {
  const { postId, userId, comment } = req.body;

  // Validate inputs
  if (!postId || !userId || !comment) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // Fetch the user's name using the userId
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Create the comment with the user's name
    const newComment = new Comment({
      postId,
      name: user.name,   // Automatically set from database
      comment
    });

    // Save and respond
    const savedComment = await newComment.save();
    res.status(201).json(savedComment);
  } catch (error) {
    console.error('Error saving comment:', error);
    res.status(500).json({ message: 'Failed to save comment' });
  }
});


