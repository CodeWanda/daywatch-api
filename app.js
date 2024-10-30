const express = require('express');
const cors = require('cors');
const movieRoutes = require('./routes/movieRoutes');
const seriesRoutes = require('./routes/seriesRoutes');
const trailerRoutes = require('./routes/trailerRoutes');
const iptvRoutes = require('./routes/iptvRoutes');
const sportsRoutes = require('./routes/eventRoutes');  // Import des routes pour les sports

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

// Activer CORS pour permettre les requêtes cross-origin
app.use(cors());

// Utiliser les routes définies
app.use('/api', movieRoutes);
app.use('/api', seriesRoutes);

// Middleware pour les routes IPTV
app.use('/api', iptvRoutes);

// Utilisation des routes pour les trailers
app.use('/api/trailers', trailerRoutes);

// Utiliser les routes définies pour les sports
app.use('/api/sports', sportsRoutes);  // Ajout des routes pour les sports

// Démarrer le serveur
app.get('/', async function (req, res) {
  res.status(200).json({ msg:"ça passe" })
});

module.exports = app;
