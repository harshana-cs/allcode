const express = require("express");
const multer = require("multer");
const path = require("path");
const Ad = require("../models/ads");

const router = express.Router();

// Configure Multer for storage
const storage = multer.diskStorage({
    destination: "./uploads/",  // Ensure the 'uploads' directory exists
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

// File filter to allow only image files (JPEG, PNG, GIF)
const fileFilter = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only image files (JPEG, PNG, GIF) are allowed!'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Limit file size to 5 MB
});

// Handle Ad Submission WITH Image Upload
router.post("/upload", upload.single("image"), async (req, res) => {
    console.log("Received image file:", req.file);

    try {
        const { title, websiteLink, position, duration } = req.body;

        // Construct full image URL
        const baseUrl = `${req.protocol}://${req.get("host")}`;
        const imageUrl = req.file ? `${baseUrl}/uploads/${req.file.filename}` : null;

        const newAd = new Ad({
            title,
            websiteLink,
            position,
            duration: parseInt(duration),
            imageUrl
        });

        await newAd.save();
        res.status(201).json({ message: "Ad successfully uploaded!", ad: newAd });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error saving ad", details: error.message });
    }
});
// Fetch all ads
router.get("/", async (req, res) => {
    try {
        const ads = await Ad.find().sort({ createdAt: -1 }); // latest first
        res.status(200).json(ads);
    } catch (err) {
        console.error("Error fetching ads:", err);
        res.status(500).json({ error: "Failed to fetch ads" });
    }
});

module.exports = router;
