const movieModel = require('../models/movieModel');

// Récupérer tous les films
const getAllMovies = async (req, res) => {
  try {
    const movies = await movieModel.getAllMovies();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des films' });
  }
};

// Récupérer un film par ID
const getMovieById = async (req, res) => {
  const movieId = req.params.id;
  try {
    const movie = await movieModel.getMovieById(movieId);
    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du film' });
  }
};

// Récupérer les films par genre
const getMoviesByGenre = async (req, res) => {
  const genreId = req.params.genreId;
  try {
    const movies = await movieModel.getMoviesByGenre(genreId);
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des films par genre' });
  }
};

// Récupérer les genres de films disponibles
const getGenres = async (req, res) => {
  try {
    const genres = await movieModel.getGenres();
    res.json(genres);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des genres' });
  }
};

module.exports = {
  getAllMovies,
  getMovieById,
  getMoviesByGenre,
  getGenres
};