// // Load environment variables at the top
// require('dotenv').config();
// console.log("DEBUG - MONGO_URI:", process.env.MONGO_URI); 

// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const authRoutes = require('./routes/auth'); // Make sure this path is correct

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Check and use MongoDB URI
// const mongoURI = process.env.MONGO_URI;

// if (!mongoURI) {
//   console.error("❌ MONGO_URI not found in .env");
//   process.exit(1); // Stop the server if the URI is missing
// }

// mongoose.connect(mongoURI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then(() => console.log("✅ MongoDB connected successfully"))
// .catch(err => {
//   console.error("❌ MongoDB connection error:", err);
//   process.exit(1); // Exit on connection error
// });

// // Routes
// app.use('/api/auth', authRoutes);

// // Start server
// app.listen(PORT, () => {
//   console.log(`🚀 Server running at http://localhost:${PORT}`);
// });
// app.get('/', (req, res) => {
//   res.send('🚀 Auth API is running!');
// });

// Load environment variables at the top
require('dotenv').config();
console.log("DEBUG - MONGO_URI:", process.env.MONGO_URI); 

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth'); 
const userRoutes = require('./routes/userRoutes'); // Importing user routes
const Comment = require('./models/Comment'); 
const router = express.Router();
const newsRoutes = require('./routes/news');
const User = require('./models/User');
const adsRoutes = require('./routes/ads');
// const News = require('../models/News');


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: '*' }));

app.use(express.json());
app.use('/uploads', express.static('uploads'));


// Check and use MongoDB URI
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  console.error("❌ MONGO_URI not found in .env");
  process.exit(1); // This Stops the server if the URI is missing
}

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected successfully"))
.catch(err => {
  console.error("❌ MongoDB connection error:", err);
  process.exit(1); // Exit on connection error

});
app.post('/comments', async (req, res) => {
  const { postId, userId, email, comment } = req.body;

  try {
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

  
    const newComment = new Comment({
      postId,
      email, 
      comment
    });

    const savedComment = await newComment.save();
    res.status(201).json(savedComment);
  } catch (error) {
    console.error('Error saving comment:', error);
    res.status(500).json({ message: 'Failed to save comment' });
  }
});

// Backend GET route (to fetch comments for a post)
app.get('/comments/:postId', async (req, res) => {
  const { postId } = req.params;
  
  try {
    const comments = await Comment.find({ postId });
    res.status(200).json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Failed to fetch comments' });
  }
});


// Routes
 app.use('/api/auth', authRoutes);
 app.use('/api/user', userRoutes);
 app.use('/news', newsRoutes);
 app.use('/api/ads', adsRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

// Home route for testing
app.get('/', (req, res) => {
  res.send('🚀 Auth API is running!');
});
