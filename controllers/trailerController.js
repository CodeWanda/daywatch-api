const trailerModel = require('../models/trailerModel');

// Contrôleur pour obtenir les trailers des films à venir
const getUpcomingTrailers = async (req, res) => {
  try {
    const trailers = await trailerModel.getUpcomingTrailers();
    res.status(200).json({ trailers });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des trailers à venir' });
  }
};

// Contrôleur pour obtenir les trailers des films récemment sortis
const getRecentTrailers = async (req, res) => {
  try {
    const trailers = await trailerModel.getRecentTrailers();
    res.status(200).json({ trailers });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des trailers récemment sortis' });
  }
};

module.exports = {
  getUpcomingTrailers,
  getRecentTrailers
};