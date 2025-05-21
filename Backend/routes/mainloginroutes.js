const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define schema once
const employeeSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String, // hashed or plain text (update accordingly)
  role: String
});

// Use existing model or create new
const Employee = mongoose.models.nepnews_employee || mongoose.model('nepnews_employee', employeeSchema);

// POST /api/login - Login user
router.post('/', async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const user = await Employee.findOne({ email, role });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or role." });
    }

    // For now plain-text comparison; replace with bcrypt.compare() if using hashed passwords
    if (user.password === password) {
      return res.status(200).json({
        message: "Login successful",
        name: user.name,
        email: user.email,
        role: user.role
      });
    } else {
      return res.status(401).json({ message: "Incorrect password." });
    }

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error." });
  }
});

// GET /api/profile/:email - Get user profile by email
router.get('/profile/:email', async (req, res) => {
  const email = req.params.email;

  try {
    const user = await Employee.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error("Error in profile route:", error);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
