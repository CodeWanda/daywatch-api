const express = require('express');
const router = express.Router();
const trailerController = require('../controllers/trailerController');

// Route pour récupérer les trailers des films à venir
router.get('/upcoming', trailerController.getUpcomingTrailers);

// Route pour récupérer les trailers des films récemment sortis
router.get('/recent', trailerController.getRecentTrailers);

module.exports = router;