// routes/iptvRoutes.js

const express = require('express');
const router = express.Router();
const { getAllChannels, getPaginatedChannels, getFilteredChannels } = require('../controllers/iptvController');

// Route pour récupérer toutes les chaînes IPTV
router.get('/channels', getAllChannels);
router.get('/channelsPages/:page/:limit', getPaginatedChannels);
router.get('/channelsFilters', getFilteredChannels);

module.exports = router;