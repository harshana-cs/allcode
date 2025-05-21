const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const sanitizeHtml = require('sanitize-html');
const { Article } = require('../models/article');  // assuming both models are exported here
const { Types: { ObjectId } } = mongoose;
const EditorArticle = require('../models/editor_articles');

/* ----------------------- ARTICLE ROUTES ----------------------- */

// Get all articles with pagination
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const articles = await Article.find()
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get article by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid article ID format' });

    const article = await Article.findById(id);
    if (!article) return res.status(404).json({ error: 'Article not found' });

    res.json(article);
  } catch (error) {
    console.error('Error fetching article by ID:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new article
router.post('/', async (req, res) => {
  try {
    const { title, content, category, author, coverImage, additionalImage1, additionalImage2, status } = req.body;

    if (!title || !content || !category || !author) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const validStatuses = ['draft', 'pending', 'approved', 'review'];
    if (status && !validStatuses.includes(status.toLowerCase())) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    // Sanitize inputs
    const sanitizedTitle = sanitizeHtml(title, { allowedTags: [] });
    const sanitizedContent = sanitizeHtml(content, { allowedTags: [] });

    const newArticle = new Article({
      title: sanitizedTitle,
      content: sanitizedContent,
      category,
      author,
      coverImage: coverImage || "",
      additionalImage1: additionalImage1 || "",
      additionalImage2: additionalImage2 || "",
      status: status ? status.toLowerCase() : 'draft'
    });

    await newArticle.save();
    res.status(201).json({ message: 'Article created successfully', article: newArticle });
  } catch (error) {
    console.error('Error creating article:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update article content
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content, category, coverImage, additionalImage1, additionalImage2 } = req.body;

  if (!ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid article ID' });
  if (!title || !content || !category) return res.status(400).json({ message: 'Missing required fields' });

  // Sanitize inputs
  const sanitizedTitle = sanitizeHtml(title, { allowedTags: [] });
  const sanitizedContent = sanitizeHtml(content, { allowedTags: [] });

  try {
    const updatedArticle = await Article.findByIdAndUpdate(
      id,
      {
        title: sanitizedTitle,
        content: sanitizedContent,
        category,
        coverImage: coverImage || "",
        additionalImage1: additionalImage1 || "",
        additionalImage2: additionalImage2 || ""
      },
      { new: true }
    );

    if (!updatedArticle) return res.status(404).json({ message: 'Article not found' });

    res.json({ message: 'Article updated successfully', article: updatedArticle });
  } catch (error) {
    console.error('Error updating article:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update article status only
router.put('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid article ID' });

  const validStatuses = ['draft', 'pending', 'approved', 'review'];
  if (!status || !validStatuses.includes(status.toLowerCase())) {
    return res.status(400).json({ message: 'Invalid or missing status' });
  }

  try {
    const updatedArticle = await Article.findByIdAndUpdate(id, { status: status.toLowerCase() }, { new: true });
    if (!updatedArticle) return res.status(404).json({ message: 'Article not found' });

    res.json({ message: 'Status updated successfully', article: updatedArticle });
  } catch (error) {
    console.error('Error updating article status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/:id/approve', async (req, res) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid article ID' });

  try {
    // Update in main Article collection
    const article = await Article.findById(id);
    if (!article) return res.status(404).json({ message: 'Article not found in main collection' });

    article.status = 'approved';
    await article.save();

    // Update or create in EditorArticle collection
    const editorArticle = await EditorArticle.findById(id);

    if (editorArticle) {
      editorArticle.status = 'approved';
      await editorArticle.save();
    } else {
      // Create new document in EditorArticle collection, copying data from main article
      const newEditorArticle = new EditorArticle({
        ...article.toObject(),
        _id: article._id, // keep same ID
      });
      await newEditorArticle.save();
    }

    res.json({ message: 'Article approved and updated in both collections' });
  } catch (error) {
    console.error('Error approving article in both collections:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
