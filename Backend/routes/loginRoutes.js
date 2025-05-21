// routes/loginRoutes.js
const express = require("express");
const router = express.Router();
const Editor = require("../models/userModel"); // Adjust path if needed

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const editor = await Editor.findOne({ email });

    if (!editor) {
      return res.status(404).json({ message: "Editor not found" });
    }

    if (editor.password !== password) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    res.status(200).json({ message: "Login successful", editor });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
