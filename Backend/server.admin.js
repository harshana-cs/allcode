require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const crypto = require("crypto");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5500", "http://127.0.0.1:5500", "http://localhost:5000", "http://127.0.0.1:5000"],
  methods: ["GET", "POST", "DELETE"],
  credentials: true
}));


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String
});

const User = mongoose.model("nepnews_employee", userSchema);

/// Add new user with password from request body
app.post("/api/addUser", async (req, res) => {
  try {
    console.log("Received request:", req.body); // Debugging

    const { name, email, password, role } = req.body;  // Include password here

    if (!name || !email || !password || !role) {   // Validate password presence too
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newUser = new User({ name, email, password, role }); // Save password as plain text
    await newUser.save();

    res.json({ message: "User added successfully", user: newUser });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
});


// Fetch users by role
app.get("/api/users/:role", async (req, res) => {
  try {
    const role = req.params.role;
    const users = await User.find({ role });
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
});

// Remove user
app.delete("/api/removeUser/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.json({ message: "User removed successfully" });
  } catch (error) {
    console.error("Error removing user:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
});


const ArticleSchema = new mongoose.Schema({
    newsTitle: String,
    newsDescription: String,
    coverImage: String,
    additionalImages: [String],
    status: String
});

const Article = mongoose.model("editor_articles", ArticleSchema);

// API to fetch approved articles
app.get("/api/articles", async (req, res) => {
    try {
        const articles = await Article.find({ status: "Approved" });
        res.json(articles);
    } catch (error) {
        console.error("Error fetching articles:", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
});

// API to fetch individual article for preview
app.get("/api/articles/:id", async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        res.json(article);
    } catch (error) {
        console.error("Error fetching article:", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
});

app.delete("/api/articles/:id", async (req, res) => {
    try {
        const articleId = req.params.id;
        await Article.findByIdAndDelete(articleId);
        res.json({ message: "Article removed successfully." });
    } catch (error) {
        console.error("Error removing article:", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
});


// ✅ Ensure `uploads/` directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

app.use("/uploads", express.static("uploads")); // ✅ Serve uploaded images

const AdSchema = new mongoose.Schema({
    title: String,
    websiteLink: String,
    imageUrl: String,
    duration: Number
});

const Ad = mongoose.model("Ad", AdSchema);

// ✅ Upload new ad with an image
app.post("/ads", upload.single("image"), async (req, res) => {
    try {
        const { title, websiteLink, duration } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

        if (!title || !websiteLink || !imageUrl) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const newAd = new Ad({ title, websiteLink, imageUrl, duration });
        await newAd.save();

        res.json({ message: "Ad added successfully", ad: newAd });
    } catch (error) {
        console.error("Error adding ad:", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
});

// ✅ Fetch all ads
app.get("/ads", async (req, res) => {
    try {
        const ads = await Ad.find();
        console.log(ads);
        res.json(ads);
    } catch (error) {
        console.error("Error fetching ads:", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
});

// ✅ Remove an ad
app.delete("/ads/:id", async (req, res) => {
    try {
        const ad = await Ad.findById(req.params.id);
        if (ad.imageUrl) {
            const imagePath = path.join(__dirname, ad.imageUrl);
            if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath); // ✅ Delete image file
        }

        await Ad.findByIdAndDelete(req.params.id);
        res.json({ message: "Ad removed successfully" });
    } catch (error) {
        console.error("Error removing ad:", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
