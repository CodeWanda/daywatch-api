// controllers/sportsController.js
const axios = require('axios');
const { API_SPORTS_KEY } = require('../config/eventConfig');

// Map pour déterminer le sous-domaine approprié pour chaque sport
const sportHosts = {
    football: 'v3.football.api-sports.io',
    basketball: 'v1.basketball.api-sports.io',
    nba: 'v2.nba.api-sports.io',
    mma: 'v1.mma.api-sports.io',
};

// Map pour déterminer le chemin approprié pour chaque sport
const sportEndpoints = {
    football: 'fixtures',
    mma: 'fights',
    basketball: 'games',
    nba: 'games',
};

// Fonction pour récupérer les grands matchs à venir sur les cinq prochains jours pour tous les sports, y compris le football
const fetchFutureGames = async (req, res) => {
    const sports = req.query.sports ? req.query.sports.split(',') : ['football', 'mma', 'basketball', 'nba'];
    const today = new Date();
    const tomorrow = new Date(today.setDate(today.getDate() + 1));
    const dates = [1, 2, 3, 4, 5].map(daysAhead => { 
        const date = new Date(tomorrow);
        date.setDate(tomorrow.getDate() + daysAhead - 1);
        return date.toISOString().split('T')[0];
    }); // Les cinq prochains jours

    try {
        const responses = {};

        // Boucle pour récupérer les données de chaque sport
        for (const sport of sports) {
            const host = sportHosts[sport.trim().toLowerCase()];
            const endpoint = sportEndpoints[sport.trim().toLowerCase()];

            if (!host || !endpoint) {
                console.log(`Aucun hôte ou endpoint pour le sport : ${sport}`);
                continue; // Ignorer les sports invalides
            }

            // Pour tous les sports, y compris le football, récupération sur les cinq prochains jours
            const sportResponses = [];
            for (const date of dates) {
                const response = await axios.get(`https://${host}/${endpoint}`, {
                    headers: {
                        'x-rapidapi-key': API_SPORTS_KEY,
                        'x-rapidapi-host': host
                    },
                    params: { date }
                });
                sportResponses.push(...(response.data?.response || []));
                console.log(`Réponse ${sport} pour la date ${date}:`, response.data);
            }
            responses[sport] = sportResponses;
        }

        res.json(responses);
    } catch (error) {
        console.error('Erreur lors de la récupération des matchs futurs :', error.response?.data || error.message);
        res.status(500).json({ message: 'Erreur lors de la récupération des matchs futurs', error: error.response?.data || error.message });
    }
};

const fetchTodayGames = async (req, res) => {
    const sports = req.query.sports ? req.query.sports.split(',') : ['football', 'mma', 'basketball', 'nba'];
    const today = new Date().toISOString().split('T')[0]; // Date d'aujourd'hui

    try {
        const responses = {};

        for (const sport of sports) {
            const host = sportHosts[sport.trim().toLowerCase()];
            const endpoint = sportEndpoints[sport.trim().toLowerCase()];

            if (!host || !endpoint) {
                console.log(`Aucun hôte ou endpoint pour le sport : ${sport}`);
                continue;
            }

            // Appel de l'API pour la date d'aujourd'hui
            const response = await axios.get(`https://${host}/${endpoint}`, {
                headers: {
                    'x-rapidapi-key': API_SPORTS_KEY,
                    'x-rapidapi-host': host
                },
                params: { date: today } // Paramètre `date` pour aujourd'hui
            });

            responses[sport] = response.data.response || [];
            console.log(`Réponse ${sport} pour aujourd'hui :`, response.data);
        }

        res.json(responses);
    } catch (error) {
        console.error('Erreur lors de la récupération des matchs d\'aujourd\'hui :', error.response?.data || error.message);
        res.status(500).json({ message: 'Erreur lors de la récupération des matchs d\'aujourd\'hui', error: error.response?.data || error.message });
    }
};

// Fonction pour récupérer les matchs en fonction de paramètres de recherche personnalisés
const fetchGamesWithParams = async (req, res) => {
    const { sports, date, season, league, team } = req.query; // Extraction des paramètres de la requête
    const selectedSports = sports ? sports.split(',') : ['football', 'mma', 'basketball', 'nba'];

    try {
        const responses = {};

        for (const sport of selectedSports) {
            const host = sportHosts[sport.trim().toLowerCase()];
            const endpoint = sportEndpoints[sport.trim().toLowerCase()];

            if (!host || !endpoint) {
                console.log(`Aucun hôte ou endpoint pour le sport : ${sport}`);
                continue;
            }

            // Construction des paramètres pour la requête en fonction des sports et des paramètres fournis
            const params = {};
            if (date) params.date = date;
            if (season && sport === 'football') params.season = season; // Le paramètre `season` est spécifique au football
            if (league) params.league = league;
            if (team) params.team = team;

            const response = await axios.get(`https://${host}/${endpoint}`, {
                headers: {
                    'x-rapidapi-key': API_SPORTS_KEY,
                    'x-rapidapi-host': host
                },
                params
            });

            responses[sport] = response.data.response || [];
            console.log(`Réponse ${sport} avec paramètres :`, response.data);
        }

        res.json(responses);
    } catch (error) {
        console.error('Erreur lors de la récupération des matchs avec paramètres :', error.response?.data || error.message);
        res.status(500).json({ message: 'Erreur lors de la récupération des matchs avec paramètres', error: error.response?.data || error.message });
    }
};

module.exports = { fetchFutureGames, fetchTodayGames, fetchGamesWithParams };