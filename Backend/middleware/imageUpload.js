const multer = require("multer");
const path = require("path");

// Storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // uploads folder
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Upload middleware for multiple images
const articleImageUpload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max size per file
}).fields([
  { name: "coverImage", maxCount: 1 },
  { name: "additionalImage1", maxCount: 1 },
  { name: "additionalImage2", maxCount: 1 }
]);

module.exports = articleImageUpload;

