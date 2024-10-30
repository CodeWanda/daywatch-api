const axios = require('axios');
const { TMDB_API_URL, TMDB_API_KEY } = require('../config/tmdbConfig');

// Fonction pour obtenir les bandes-annonces des films et séries à venir
const getUpcomingTrailers = async () => {
  // Récupérer les films à venir
  const movieResponse = await axios.get(`${TMDB_API_URL}/movie/upcoming`, {
    params: { api_key: TMDB_API_KEY, language: 'fr-FR' } // Ajout du paramètre language
  });
  const movies = movieResponse.data.results.map(movie => ({
    title: movie.title,
    releaseDate: movie.release_date,
    type: 'film' // Attribut pour indiquer que c'est un film
  }));

  // Récupérer les séries à venir
  const tvResponse = await axios.get(`${TMDB_API_URL}/tv/on_the_air`, {
    params: { api_key: TMDB_API_KEY, language: 'fr-FR' } // Ajout du paramètre language
  });
  const series = tvResponse.data.results.map(tvShow => ({
    title: tvShow.name,
    releaseDate: tvShow.first_air_date,
    type: 'série' // Attribut pour indiquer que c'est une série
  }));

  // Fusionner les résultats des films et des séries
  const enrichedTrailers = [...movies, ...series];

  return enrichedTrailers; // Retourner la liste enrichie
};

// Fonction pour obtenir les bandes-annonces des films et séries récemment sortis
const getRecentTrailers = async () => {
  // Récupérer les films récemment sortis
  const movieResponse = await axios.get(`${TMDB_API_URL}/movie/now_playing`, {
    params: { api_key: TMDB_API_KEY, language: 'fr-FR' } // Ajout du paramètre language
  });
  const movies = movieResponse.data.results.map(movie => ({
    title: movie.title,
    releaseDate: movie.release_date,
    type: 'film' // Attribut pour indiquer que c'est un film
  }));

  // Récupérer les séries récemment diffusées
  const tvResponse = await axios.get(`${TMDB_API_URL}/tv/airing_today`, {
    params: { api_key: TMDB_API_KEY, language: 'fr-FR' } // Ajout du paramètre language
  });
  const series = tvResponse.data.results.map(tvShow => ({
    title: tvShow.name,
    releaseDate: tvShow.first_air_date,
    type: 'série' // Attribut pour indiquer que c'est une série
  }));

  // Fusionner les résultats des films et des séries
  const enrichedTrailers = [...movies, ...series];

  return enrichedTrailers; // Retourner la liste enrichie
};

module.exports = {
  getUpcomingTrailers,
  getRecentTrailers
};