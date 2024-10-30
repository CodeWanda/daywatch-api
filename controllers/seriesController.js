const seriesModel = require('../models/seriesModel');

// Récupérer toutes les séries
const getAllSeries = async (req, res) => {
  try {
    const series = await seriesModel.getAllSeries();
    res.json(series);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des séries' });
  }
};

// Récupérer une série par ID
const getSeriesById = async (req, res) => {
  const seriesId = req.params.id;
  try {
    const series = await seriesModel.getSeriesById(seriesId);
    res.json(series);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de la série' });
  }
};

// Récupérer les "tags" (genres simulés)
const getTags = async (req, res) => {
  try {
    const tags = await seriesModel.getTags();
    res.json(tags);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des tags' });
  }
};

// Récupérer les séries par tag (genre simulé)
const getSeriesByTag = async (req, res) => {
  const tagId = req.params.tagId;
  try {
    const series = await seriesModel.getSeriesByTag(tagId);
    res.json(series);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des séries par tag' });
  }
};

module.exports = {
  getAllSeries,
  getSeriesById,
  getTags,
  getSeriesByTag
};