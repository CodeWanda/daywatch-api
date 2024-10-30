const express = require('express');
const movieController = require('../controllers/movieController');
const router = express.Router();

// Route pour récupérer tous les films
router.get('/movies', movieController.getAllMovies);

// Route pour récupérer un film par ID
router.get('/movies/:id', movieController.getMovieById);

// Route pour récupérer les films par genre
router.get('/movies/genre/:genreId', movieController.getMoviesByGenre);

// Route pour récupérer les genres disponibles
router.get('/genres', movieController.getGenres);

module.exports = router;