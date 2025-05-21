const express = require("express");
const router = express.Router();
const { submitArticle } = require("../controllers/articleController");
const { Article } = require("../models/article"); // ✅ Fixed import
const articleImageUpload = require("../middleware/imageUpload");

const debug = require("debug")("server:authorRoutes");


// GET: Draft articles by author
router.get("/author_draft", async (req, res) => {
  const { author } = req.query;
  console.log("Fetching drafts for author:", author); // ✅ Debug log

  if (!author) return res.status(400).json({ error: "Author is required in query" });

  try {
    const drafts = await Article.find({ status: "draft", author }).sort({ updatedAt: -1 });
    console.log("Drafts found:", drafts.length); // ✅ Debug log
    res.json(drafts);
  } catch (err) {
    console.error("Error fetching drafts:", err);
    res.status(500).json({ error: "Failed to fetch drafts" });
  }
});

// GET: Review articles by author
router.get("/author_review", async (req, res) => {
  const { author } = req.query;

  // ✅ Improved validation and logging
  if (!author) {
    console.error("❌ Missing author in query");
    return res.status(400).json({ error: "Author is required in query" });
  }

  try {
    const reviews = await Article.find({ status: "review", author }).sort({ updatedAt: -1 });
    console.log(`✅ Found ${reviews.length} review articles for ${author}`);
    res.json(reviews);
  } catch (err) {
    console.error("❌ Error fetching review articles:", err);
    res.status(500).json({ error: "Failed to fetch review articles" });
  }
});

// POST: Create new draft article
router.post("/author_draft", articleImageUpload, submitArticle);

// PUT: Update article by ID
router.put("/:id", articleImageUpload, async (req, res) => {
  try {
    const articleId = req.params.id;
    const baseUrl = `${req.protocol}://${req.get("host")}/`;

    if (!req.body.author) {
      return res.status(400).json({ error: "Author is required" });
    }

    const updates = {
      title: req.body.title,
      content: req.body.content,
      category: req.body.category,
      status: req.body.status,
      author: req.body.author,
    };

    if (req.files["coverImage"]) {
      updates.coverImage = baseUrl + req.files["coverImage"][0].path.replace(/\\/g, "/");
    }
    if (req.files["additionalImage1"]) {
      updates.additionalImage1 = baseUrl + req.files["additionalImage1"][0].path.replace(/\\/g, "/");
    }
    if (req.files["additionalImage2"]) {
      updates.additionalImage2 = baseUrl + req.files["additionalImage2"][0].path.replace(/\\/g, "/");
    }

    const updatedArticle = await Article.findByIdAndUpdate(articleId, updates, { new: true });
    if (!updatedArticle) return res.status(404).json({ error: "Article not found" });

    res.json({ message: "✅ Article updated successfully", article: updatedArticle });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET: Single article by ID
router.get("/:id", async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ error: "Article not found" });
    res.json(article);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;