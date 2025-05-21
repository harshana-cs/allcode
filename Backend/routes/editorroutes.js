const express = require('express');
const router = express.Router();
const EditorArticle = require('../models/editor_articles');

// ✅ POST: Create new editor article
router.post('/', async (req, res) => {
  try {
    const newArticle = new EditorArticle({
      title: req.body.title,
      content: req.body.content,
      author: req.body.author,
      status: req.body.status || 'pending',
      category: Array.isArray(req.body.category) ? req.body.category : [req.body.category], // Ensure array
      coverImage: req.body.coverImage || '',
      additionalImage1: req.body.additionalImage1 || '',
      additionalImage2: req.body.additionalImage2 || ''
    });

    await newArticle.save();
    res.status(201).json({ message: 'Editor article saved successfully', newArticle });
  } catch (err) {
    console.error('Error saving editor article:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH: Approve an article
router.patch('/:id/approve', async (req, res) => {
  try {
    // Find and update the article status in EditorArticle collection
    const updatedArticle = await EditorArticle.findByIdAndUpdate(
      req.params.id,
      { status: 'approved', updatedAt: new Date() },
      { new: true }
    );

    if (!updatedArticle) {
      return res.status(404).json({ message: 'Article not found' });
    }

    // Create a new document in ApprovedArticle collection with the approved article's data
    const approvedCopy = new ApprovedArticle({
      title: updatedArticle.title,
      content: updatedArticle.content,
      author: updatedArticle.author,
      status: 'approved',
      category: updatedArticle.category,
      coverImage: updatedArticle.coverImage,
      additionalImage1: updatedArticle.additionalImage1,
      additionalImage2: updatedArticle.additionalImage2,
      createdAt: updatedArticle.createdAt,
      updatedAt: updatedArticle.updatedAt
    });

    await approvedCopy.save();

    res.json({ message: 'Article approved and copied successfully', updatedArticle, approvedCopy });
  } catch (err) {
    console.error('Error approving article:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
// ✅ PATCH: Reject an article
router.patch('/:id/reject', async (req, res) => {
  try {
    const updatedArticle = await EditorArticle.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected', updatedAt: new Date() },
      { new: true }
    );

    if (!updatedArticle) {
      return res.status(404).json({ message: 'Article not found' });
    }

    res.json({ message: 'Article rejected successfully', updatedArticle });
  } catch (err) {
    console.error('Error rejecting article:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ GET: Fetch all articles
router.get('/', async (req, res) => {
  try {
    const articles = await EditorArticle.find().sort({ createdAt: -1 });
    res.json(articles);
  } catch (err) {
    console.error('Error fetching articles:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ GET: Fetch article by ID
router.get('/:id', async (req, res) => {
  try {
    const article = await EditorArticle.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    res.json(article);
  } catch (err) {
    console.error('Error fetching article by ID:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
