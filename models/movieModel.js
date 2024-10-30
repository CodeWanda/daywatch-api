const axios = require('axios');
const config = require('../config/radarrConfig');
const { TMDB_API_URL, TMDB_API_KEY } = require('../config/tmdbConfig');  // Configuration TMDb

// Fonction pour obtenir tous les films depuis Radarr et enrichir avec TMDb
const getAllMovies = async () => {
  const response = await axios.get(`${config.RADARR_API_URL}/movie`, {
    headers: { 'X-Api-Key': config.RADARR_API_KEY }
  });

  const movies = response.data;

  // Enrichir chaque film avec des informations supplémentaires depuis TMDb
  const enrichedMovies = await Promise.all(movies.map(async (movie) => {
    try {
      const tmdbResponse = await axios.get(`${TMDB_API_URL}/movie/${movie.tmdbId}`, {
        params: { api_key: TMDB_API_KEY, append_to_response: 'videos,credits' }
      });

      const tmdbData = tmdbResponse.data;

      return {
        ...movie,
        overview: movie.overview || tmdbData.overview,  // Utiliser le synopsis de TMDb si celui de Radarr est vide
        trailer: tmdbData.videos.results.find(video => video.type === 'Trailer')?.key || null,  // Trailer
        actors: tmdbData.credits.cast.map(actor => actor.name)  // Liste des acteurs
      };
    } catch (error) {
      console.error(`Erreur lors de la récupération des détails TMDb pour le film ${movie.title}:`, error);
      return movie;  // Retourner le film sans enrichissement si une erreur survient
    }
  }));

  return enrichedMovies;
};

// Fonction pour obtenir un film par ID et enrichir avec TMDb
const getMovieById = async (id) => {
  const response = await axios.get(`${config.RADARR_API_URL}/movie/${id}`, {
    headers: { 'X-Api-Key': config.RADARR_API_KEY }
  });

  const movie = response.data;

  try {
    const tmdbResponse = await axios.get(`${TMDB_API_URL}/movie/${movie.tmdbId}`, {
      params: { api_key: TMDB_API_KEY, append_to_response: 'videos,credits' }
    });

    const tmdbData = tmdbResponse.data;

    return {
      ...movie,
      overview: movie.overview || tmdbData.overview,
      trailer: tmdbData.videos.results.find(video => video.type === 'Trailer')?.key || null,
      actors: tmdbData.credits.cast.map(actor => actor.name)
    };
  } catch (error) {
    console.error(`Erreur lors de la récupération des détails TMDb pour le film ${movie.title}:`, error);
    return movie;
  }
};

// Fonction pour obtenir les genres disponibles depuis TMDb
const getGenres = async () => {
  const response = await axios.get(`${TMDB_API_URL}/genre/movie/list`, {
    params: { api_key: TMDB_API_KEY }
  });
  return response.data.genres;
};

// Fonction pour obtenir des films par genre avec des détails enrichis via TMDb
const getMoviesByGenre = async (genreId) => {
  const response = await axios.get(`${TMDB_API_URL}/discover/movie`, {
    params: {
      api_key: TMDB_API_KEY,
      with_genres: genreId
    }
  });

  const movies = response.data.results;

  // Enrichir chaque film avec des détails supplémentaires depuis TMDb
  const enrichedMovies = await Promise.all(movies.map(async (movie) => {
    try {
      const movieDetails = await axios.get(`${TMDB_API_URL}/movie/${movie.id}`, {
        params: { api_key: TMDB_API_KEY, append_to_response: 'videos,credits' }
      });

      const details = movieDetails.data;

      return {
        ...movie,
        overview: details.overview,  // Ajouter le synopsis
        trailer: details.videos.results.find(video => video.type === 'Trailer')?.key || null,  // Ajouter la bande-annonce
        actors: details.credits.cast.map(actor => actor.name)  // Ajouter les acteurs
      };
    } catch (error) {
      console.error(`Erreur lors de la récupération des détails pour le film ${movie.title}:`, error);
      return movie;  // Retourner le film sans enrichissement en cas d'erreur
    }
  }));

  return enrichedMovies;
};

module.exports = {
  getAllMovies,
  getMovieById,
  getGenres,
  getMoviesByGenre
};