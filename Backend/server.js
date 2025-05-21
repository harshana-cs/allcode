// // Load environment variables
// require('dotenv').config();
// console.log("DEBUG - MONGO_URI:", process.env.MONGO_URI);

// // Dependencies
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const path = require('path');

// // Initialize app
// const app = express();
// const PORT = process.env.PORT || 5000;

// // Models
// const Comment = require('./models/Comment');
// const User = require('./models/User');

// // Route Files
// const authRoutes = require('./routes/auth');
// const userRoutes = require('./routes/userRoutes');
// const articleRoutes = require('./routes/articleroutes');
// const adRoutes = require('./routes/adsroutes');
// const newsRoutes = require('./routes/news');
// const mainLoginRoutes = require('./routes/mainloginroutes');
// const authorRoutes = require('./routes/authoroutes');
// const editorRoutes = require('./routes/editorroutes');
// const errorHandler = require('./middleware/errorHandler');


// // Middleware
// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ extended: true, limit: "10mb" }));
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// const corsOptions = {
//   origin: [
//     "http://localhost:3000",
//     "http://127.0.0.1:5500",
//     "http://localhost:5000",
//     "http://127.0.0.1:5000"
//   ],
//   methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
//   credentials: true,
// };
// app.use(cors(corsOptions));

// // Connect to MongoDB
// const mongoURI = process.env.MONGO_URI;
// if (!mongoURI) {
//   console.error("❌ MONGO_URI not found in .env");
//   process.exit(1);
// }

// mongoose.connect(mongoURI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then(() => console.log("✅ MongoDB connected successfully"))
// .catch(err => {
//   console.error("❌ MongoDB connection error:", err);
//   process.exit(1);
// });

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/user', userRoutes);
// app.use('/api/articles', articleRoutes);
// app.use('/api/ads', adRoutes);
// app.use('/api/news', newsRoutes);
// app.use('/api/login', mainLoginRoutes);
// app.use('/api/author', authorRoutes);
// app.use('/api/editor_articles', editorRoutes);

// // Comments Routes
// app.post('/comments', async (req, res) => {
//   const { postId, userId, email, comment } = req.body;

//   try {
//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ message: 'User not found' });

//     const newComment = new Comment({
//       postId,
//       email,
//       comment
//     });

//     const savedComment = await newComment.save();
//     res.status(201).json(savedComment);
//   } catch (error) {
//     console.error('Error saving comment:', error);
//     res.status(500).json({ message: 'Failed to save comment' });
//   }
// });

// app.get('/comments/:postId', async (req, res) => {
//   const { postId } = req.params;

//   try {
//     const comments = await Comment.find({ postId });
//     res.status(200).json(comments);
//   } catch (error) {
//     console.error('Error fetching comments:', error);
//     res.status(500).json({ message: 'Failed to fetch comments' });
//   }
// });

// // Root Route
// app.get('/', (req, res) => {
//   res.send('🚀 Unified NepNews Server is running!');
// });

// // Error Handler
// app.use(errorHandler);

// // Start Server
// app.listen(PORT, () => {
//   console.log(`✅ Server is running at http://localhost:${PORT}`);
// });


// Load environment variables
// require('dotenv').config();
// console.log("DEBUG - MONGO_URI:", process.env.MONGO_URI);

// // Dependencies
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const path = require('path');

// // Initialize app
// const app = express();
// const PORT = process.env.PORT || 5000;

// // Models
// const Comment = require('./models/Comment');
// const User = require('./models/User');

// // Route Files
// const authRoutes = require('./routes/auth');
// const userRoutes = require('./routes/userRoutes');
// const articleRoutes = require('./routes/articleroutes');
// const adRoutes = require('./routes/adsroutes');
// const newsRoutes = require('./routes/news');
// const mainLoginRoutes = require('./routes/mainloginroutes');
// const authorRoutes = require('./routes/authoroutes');
// const editorRoutes = require('./routes/editorroutes');
// const errorHandler = require('./middleware/errorHandler');
// // const authRoutes = require('./routes/auth'); 
// // const userRoutes = require('./routes/userRoutes'); // Importing user routes
// // const Comment = require('./models/Comment'); 
// const router = express.Router();
// // const newsRoutes = require('./routes/news');
// // const User = require('./models/User');
// const adsRoutes = require('./routes/ads');


// // Middleware
// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ extended: true, limit: "10mb" }));
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// // Middleware
// app.use(cors({ origin: '*' }));

// app.use(express.json());
// app.use('/uploads', express.static('uploads'));

// const corsOptions = {
//   origin: [
//     "http://localhost:3000",
//     "http://127.0.0.1:5500",
//     "http://localhost:5000",
//     "http://127.0.0.1:5000"
//   ],
//   methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
//   credentials: true,
// };
// app.use(cors(corsOptions));

// // Connect to MongoDB
// const mongoURI = process.env.MONGO_URI;
// if (!mongoURI) {
//   console.error("❌ MONGO_URI not found in .env");
//   process.exit(1);
// }

// mongoose.connect(mongoURI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then(() => console.log("✅ MongoDB connected successfully"))
// .catch(err => {
//   console.error("❌ MongoDB connection error:", err);
//   process.exit(1);
// });

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/user', userRoutes);
// app.use('/api/articles', articleRoutes);
// app.use('/api/ads', adRoutes);
// app.use('/api/news', newsRoutes);
// app.use('/api/login', mainLoginRoutes);
// app.use('/api/author', authorRoutes);
// app.use('/api/editor_articles', editorRoutes);
// // app.use('/api/auth', authRoutes);
// //  app.use('/api/user', userRoutes);
//  app.use('/news', newsRoutes);
//  app.use('/api/ads', adsRoutes);


// // Comments Routes
// app.post('/comments', async (req, res) => {
//   const { postId, userId, email, comment } = req.body;

//   try {
//     // Check if user exists
//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ message: 'User not found' });

  
//     const newComment = new Comment({
//       postId,
//       email, 
//       comment
//     });

//     const savedComment = await newComment.save();
//     res.status(201).json(savedComment);
//   } catch (error) {
//     console.error('Error saving comment:', error);
//     res.status(500).json({ message: 'Failed to save comment' });
//   }
// });

// // Backend GET route (to fetch comments for a post)
// app.get('/comments/:postId', async (req, res) => {
//   const { postId } = req.params;
  
//   try {
//     const comments = await Comment.find({ postId });
//     res.status(200).json(comments);
//   } catch (error) {
//     console.error('Error fetching comments:', error);
//     res.status(500).json({ message: 'Failed to fetch comments' });
//   }
// });

// // Root Route
// app.get('/', (req, res) => {
//   res.send('🚀 Unified NepNews Server is running!');
// });

// // Error Handler
// app.use(errorHandler);

// // Start Server
// app.listen(PORT, () => {
//   console.log(`✅ Server is running at http://localhost:${PORT}`);
// });
// Load environment variables
require('dotenv').config();
console.log("DEBUG - MONGO_URI:", process.env.MONGO_URI);

// Dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Models
const Comment = require('./models/Comment');
const User = require('./models/User');

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/userRoutes');
const articleRoutes = require('./routes/articleroutes');
 const adRoutes = require('./routes/adsroutes');
// const altAdRoutes = require('./routes/ads'); // Ensure this isn't a duplicate route
const newsRoutes = require('./routes/news');
const mainLoginRoutes = require('./routes/mainloginroutes');
const authorRoutes = require('./routes/authoroutes');
const editorRoutes = require('./routes/editorroutes');
const errorHandler = require('./middleware/errorHandler');

// Initialize app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://127.0.0.1:5500",
    "http://localhost:5000",
    "http://127.0.0.1:5000"
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  console.error("❌ MONGO_URI not found in .env");
  process.exit(1);
}

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Route registration
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/ads', adRoutes); // Main ads route
// app.use('/api/ads-alt', altAdRoutes); // Alternate ads route, avoid conflict if same
app.use('/api/news', newsRoutes);
app.use('/api/login', mainLoginRoutes);
app.use('/api/author', authorRoutes);
app.use('/api/editor_articles', editorRoutes);
app.use('/news', newsRoutes); // Alias, optional

// Comments Routes
app.post('/comments', async (req, res) => {
  const { postId, userId, email, comment } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const newComment = new Comment({ postId, email, comment });
    const savedComment = await newComment.save();
    res.status(201).json(savedComment);
  } catch (error) {
    console.error('Error saving comment:', error);
    res.status(500).json({ message: 'Failed to save comment' });
  }
});

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

// Root route
app.get('/', (req, res) => {
  res.send('🚀 Unified NepNews Server is running!');
});

// Error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
