const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const User = require ('./models/Users');
// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());  // To parse JSON bodies
app.use(cors());  // Enable cross-origin requests (optional)

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch((err) => console.log(err));

// Basic route to check if server is working
app.get('/', (req, res) => {
  res.send('NepNews Backend Server is Running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
// Signup route
app.post('/api/signup', async (req, res) => {
    const { fullName, phone, email, password } = req.body;
  
    // Validate the input (check if any field is missing)
    if (!fullName || !phone || !email || !password) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }
  
    try {
      // Check if the email already exists in the database
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: 'Email already in use' });
      }
  
      // Create a new user
      const user = new User({ fullName, phone, email, password });
      await user.save();  // Save the user to MongoDB
  
      // Send a response confirming the user was created
      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error creating user', error });
    }
  });


  // Login route
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
  
    // Validate input (make sure both email and password are provided)
    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter both email and password' });
    }
  
    try {
      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Check if the entered password matches the stored hashed password
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Send a response if login is successful
      res.status(200).json({ message: 'Login successful', userId: user._id });
    } catch (error) {
      res.status(500).json({ message: 'Error logging in', error });
    }
  });
  
