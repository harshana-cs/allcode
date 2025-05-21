const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 
const User = require('../models/User');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const router = express.Router();
router.post('/register', async (req, res) => {
    console.log("Received registration data:", req.body);
    const { name, phone, email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            name,
            phone,
            email,
            password: hashedPassword
        });

        await newUser.save();

        // Add the user profile data (excluding password) in the response
        return res.status(201).json({
            message: 'User registered successfully',
            user: {
                name: newUser.name,
                phone: newUser.phone,
                email: newUser.email,
                _id: newUser._id,
                createdAt: newUser.createdAt,
                updatedAt: newUser.updatedAt
            }
        });

    } catch (err) {
        console.error("Error during registration:", err.message);
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;




// POST /api/auth/login
router.post('/login', async (req, res) => {
    console.log("Login attempt:", req.body);
    const { email, password } = req.body;

    try {
        // Finds user
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        // Compares password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // (Optional) Create token
        // const token = jwt.sign({ id: user._id }, 'yourSecretKey', { expiresIn: '1h' });

        return res.status(200).json({ message: 'Login successful' }); 
    } catch (err) {
        console.error("Error during registration:", err);
        return res.status(500).json({ message: 'Server error', error: err.message }); 
    }

});

module.exports = router;