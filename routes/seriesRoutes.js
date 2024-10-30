const express = require('express');
const seriesController = require('../controllers/seriesController');
const router = express.Router();

// Route pour récupérer toutes les séries
router.get('/series', seriesController.getAllSeries);

// Route pour récupérer une série par ID
router.get('/series/:id', seriesController.getSeriesById);

// Route pour récupérer les tags (genres simulés)
router.get('/tags', seriesController.getTags);

// Route pour récupérer les séries par tag
router.get('/series/tag/:tagId', seriesController.getSeriesByTag);

module.exports = router;