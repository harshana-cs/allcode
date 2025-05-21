// controllers/adsController.js
const Ad = require('../models/ad'); // ✅ Corrected path

async function getTopAd(req, res) {
  try {
    const topAd = await Ad.findOne({ position: 'Top' });
    if (topAd) {
      res.json(topAd);
    } else {
      res.status(404).send('Top ad not found');
    }
  } catch (err) {
    res.status(500).send('Error fetching top ad');
  }
}

module.exports = { getTopAd };
async function getBottomAd(req, res) {
    try {
      const bottomAd = await Ad.findOne({ position: 'Bottom' });
      if (bottomAd) {
        res.json(bottomAd);
      } else {
        res.status(404).send('Bottom ad not found');
      }
    } catch (err) {
      res.status(500).send('Error fetching bottom ad');
    }
  }
  
  module.exports = { getTopAd, getBottomAd };
  
