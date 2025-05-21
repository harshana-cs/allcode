// // controllers/adsController.js
// const Ad = require('../models/ads'); // ✅ Corrected path

// async function getTopAd(req, res) {
//   try {
//     const topAd = await Ad.findOne({ position: 'Top' });
//     if (topAd) {
//       res.json(topAd);
//     } else {
//       res.status(404).send('Top ad not found');
//     }
//   } catch (err) {
//     res.status(500).send('Error fetching top ad');
//   }
// }

// module.exports = { getTopAd };
// async function getBottomAd(req, res) {
//     try {
//       const bottomAd = await Ad.findOne({ position: 'Bottom' });
//       if (bottomAd) {
//         res.json(bottomAd);
//       } else {
//         res.status(404).send('Bottom ad not found');
//       }
//     } catch (err) {
//       res.status(500).send('Error fetching bottom ad');
//     }
//   }
  
//   module.exports = { getTopAd, getBottomAd };
  
// controllers/adsController.js
const Ad = require('../models/ads');

// Helper to add days to a date
function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// Get valid top ad
async function getTopAd(req, res) {
  try {
    const ads = await Ad.find({ position: 'Top' }).sort({ createdAt: -1 });

    const now = new Date();

    // Find the first unexpired ad
    const validAd = ads.find(ad => {
      const expiryDate = addDays(new Date(ad.createdAt), ad.duration);
      return expiryDate >= now;
    });

    if (validAd) {
      res.json(validAd);
    } else {
      res.status(404).send('No valid top ad found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching top ad');
  }
}

// Get valid bottom ad
async function getBottomAd(req, res) {
  try {
    const ads = await Ad.find({ position: 'Bottom' }).sort({ createdAt: -1 });

    const now = new Date();

    const validAd = ads.find(ad => {
      const expiryDate = addDays(new Date(ad.createdAt), ad.duration);
      return expiryDate >= now;
    });

    if (validAd) {
      res.json(validAd);
    } else {
      res.status(404).send('No valid bottom ad found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching bottom ad');
  }
}

module.exports = { getTopAd, getBottomAd };
