require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); 

const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI)
  .then(async () => {
    const hashedPassword = await bcrypt.hash("123456", 10);
    const newUser = new User({
      name: "Test User",
      email: "testuser@example.com",
      phone: "1234567890",
      password
    });
    

    await newUser.save();
    console.log("✅ User inserted successfully");
    mongoose.disconnect();
  })
  .catch(err => {
    console.error("❌ MongoDB error:", err);
  });
