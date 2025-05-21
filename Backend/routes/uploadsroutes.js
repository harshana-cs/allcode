const multer = require("multer");
const path = require("path");
const express = require("express");
const router = express.Router();
const Article = require("./models/article"); // Assuming your model

// Configure storage
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Route for image upload
router.post("/upload-image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const imageUrl = `/uploads/${req.file.filename}`;
    const updatedArticle = await Article.findByIdAndUpdate(
      req.body.articleId,
      { image: imageUrl },
      { new: true }
    );

    res.status(200).json({ message: "Image uploaded successfully", updatedArticle });
  } catch (err) {
    res.status(500).json({ error: "Error uploading image" });
  }
});

module.exports = router;