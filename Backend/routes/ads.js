// routes/ads.js
const express = require('express');
const router = express.Router();
const {getTopAd, getBottomAd} = require('../controllers/adsController'); // ✅ Corrected path

router.get('/top', getTopAd);
router.get('/bottom', getBottomAd);

module.exports = router;
