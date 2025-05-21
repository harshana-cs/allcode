
const express = require('express');
const router = express.Router();
const News = require('../models/News');

router.get('/approved-news', async (req, res) => {
  try {
    console.log('Fetching approved news with status "Approved"');

    const approvedNews = await News.find({ 
      status: { $regex: '^approved$', $options: 'i' } 
    }).sort({ createdAt: -1 });

    console.log('Approved news fetched:', approvedNews);

    if (approvedNews.length === 0) {
      console.log('No approved news found');
    }

    res.json(approvedNews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch approved news' });
  }
});

module.exports = router;