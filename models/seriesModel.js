const axios = require('axios');
const config = require('../config/sonarrConfig');
const { THETVDB_API_URL, THETVDB_API_KEY } = require('../config/thetvdbConfig');  // Configuration TheTVDB

// Fonction pour obtenir toutes les séries depuis Sonarr et enrichir avec TheTVDB
const getAllSeries = async () => {
  const response = await axios.get(`${config.SONARR_API_URL}/series`, {
    headers: { 'X-Api-Key': config.SONARR_API_KEY }
  });

  const seriesList = response.data;

  // Enrichir chaque série avec des informations supplémentaires depuis TheTVDB
  const enrichedSeriesList = await Promise.all(seriesList.map(async (series) => {
    try {
      const tvdbResponse = await axios.get(`${THETVDB_API_URL}/series/${series.tvdbId}`, {
        params: { 
          api_key: THETVDB_API_KEY,
          language: 'fr-FR'  // Ajouter la langue pour obtenir les résultats en français
        }
      });

      const tvdbData = tvdbResponse.data;

      return {
        ...series,
        overview: tvdbData.overview || series.overview,  // Utiliser le synopsis de TheTVDB s'il est disponible, sinon celui de Sonarr
        actors: Array.isArray(tvdbData.actors) ? tvdbData.actors.map(actor => actor.name) : [],  // Liste des acteurs
        similarSeries: Array.isArray(tvdbData.recommendations) ? tvdbData.recommendations.map(similar => similar.name) : []  // Séries similaires
      };
    } catch (error) {
      console.error(`Erreur lors de la récupération des détails TheTVDB pour la série ${series.title}:`, error);
      return series;  // Retourner la série sans enrichissement si une erreur survient
    }
  }));

  return enrichedSeriesList;
};

// Fonction pour obtenir une série par ID et enrichir avec TheTVDB
const getSeriesById = async (id) => {
  const response = await axios.get(`${config.SONARR_API_URL}/series/${id}`, {
    headers: { 'X-Api-Key': config.SONARR_API_KEY }
  });

  const series = response.data;

  try {
    const tvdbResponse = await axios.get(`${THETVDB_API_URL}/series/${series.tvdbId}`, {
      params: { api_key: THETVDB_API_KEY }
    });

    const tvdbData = tvdbResponse.data;

    return {
      ...series,
      overview: series.overview || tvdbData.overview,
      actors: tvdbData.actors.map(actor => actor.name),
      similarSeries: tvdbData.recommendations.map(similar => similar.name)
    };
  } catch (error) {
    console.error(`Erreur lors de la récupération des détails TheTVDB pour la série ${series.title}:`, error);
    return series;
  }
};

// Fonction pour obtenir les tags disponibles (pour simuler les genres dans Sonarr)
const getTags = async () => {
  const response = await axios.get(`${config.SONARR_API_URL}/tag`, {
    headers: { 'X-Api-Key': config.SONARR_API_KEY }
  });
  return response.data;
};

// Fonction pour obtenir des séries par tag avec des détails enrichis
const getSeriesByTag = async (tagId) => {
  const response = await axios.get(`${config.SONARR_API_URL}/series`, {
    headers: { 'X-Api-Key': config.SONARR_API_KEY }
  });

  // Filtrer les séries par tag
  const seriesList = response.data.filter(series => series.tags.includes(tagId));

  // Enrichir chaque série avec des détails supplémentaires depuis TheTVDB
  const enrichedSeriesList = await Promise.all(seriesList.map(async (series) => {
    try {
      const seriesDetails = await axios.get(`${THETVDB_API_URL}/series/${series.tvdbId}`, {
        params: { api_key: THETVDB_API_KEY }
      });

      const details = seriesDetails.data;

      return {
        ...series,
        overview: details.overview,  // Ajouter le synopsis
        actors: details.actors.map(actor => actor.name),  // Ajouter les acteurs
        similarSeries: details.recommendations.map(similar => similar.name)  // Ajouter des séries similaires
      };
    } catch (error) {
      console.error(`Erreur lors de la récupération des détails pour la série ${series.title}:`, error);
      return series;  // Retourner la série sans enrichissement en cas d'erreur
    }
  }));

  return enrichedSeriesList;
};

module.exports = {
  getAllSeries,
  getSeriesById,
  getTags,
  getSeriesByTag
};