const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Endpoint to update user profile
router.put('/profile/:userId', async (req, res) => {
    try {
        const { name, phone, email } = req.body; 
        const userId = req.params.userId; 


        if (!name || !phone || !email) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Update user data in the database
        const updatedUser = await User.findByIdAndUpdate(userId, { name, phone, email }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return updated data
        res.json({
            name: updatedUser.name,
            phone: updatedUser.phone,
            email: updatedUser.email,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
// const express = require('express');
// const router = express.Router();
const mongoose = require('mongoose');

// Mongoose Model
const Employee = mongoose.model('nepnews_employee', new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String
}));


// module.exports = router;

module.exports = router;
