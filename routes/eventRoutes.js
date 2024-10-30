const express = require('express');
const { fetchFutureGames, fetchTodayGames, fetchGamesWithParams } = require('../controllers/eventController');

const router = express.Router();

// Route pour récupérer les matchs d'aujourd'hui
router.get('/big-games/today', fetchTodayGames);

// Route pour rechercher les matchs avec des paramètres
router.get('/big-games/search', fetchGamesWithParams);

// Route pour récupérer les grands matchs à venir
router.get('/big-games/upcoming/:sports', fetchFutureGames);

module.exports = router;
