const axios = require('axios');
const Channel = require('../models/channelModel');

// Fonction pour analyser le contenu M3U
const parseM3U = (content) => {
    const channels = [];
    const lines = content.split('\n');
    let channel = {};

    lines.forEach((line) => {
        line = line.trim();
        if (line.startsWith('#EXTINF:')) {
            const nameMatch = line.match(/,(.*)/);
            const logoMatch = line.match(/tvg-logo="([^"]+)"/);

            channel.name = nameMatch ? nameMatch[1] : 'Nom inconnu';
            channel.logo = logoMatch ? logoMatch[1] : 'Logo non disponible';
        } else if (line && !line.startsWith('#')) {
            channel.url = line;
            channels.push(new Channel(channel.name, channel.logo, channel.url));
            channel = {};
        }
    });

    return channels;
};

// Fonction pour récupérer et analyser les fichiers M3U
const fetchM3U = async (url) => {
    try {
        const response = await axios.get(url);
        return parseM3U(response.data);
    } catch (error) {
        console.error(`Erreur lors de la récupération de l'URL : ${url} - ${error.message}`);
        return [];
    }
};

// Contrôleur pour récupérer toutes les chaînes
const getAllChannels = async (req, res) => {
    const iptvUrls = require('../config/iptvUrls');
    let allChannels = [];

    for (let url of iptvUrls) {
        const channels = await fetchM3U(url);
        allChannels = allChannels.concat(channels);
    }

    return allChannels; // Retourner le tableau de chaînes
};

// Ajustement de getFilteredChannels pour gérer les erreurs
const getFilteredChannels = async (req, res) => {
    const allChannels = await getAllChannels(req, res);
    
    // Vérification si allChannels est un tableau
    if (!Array.isArray(allChannels)) {
        return res.status(500).json({ message: "Erreur lors de la récupération des chaînes" });
    }

    return allChannels.map(channel => ({
        name: channel.name,
        url: channel.url
    }));
};

const getPaginatedChannels = async (req, res) => {
    const page = parseInt(req.params.page, 10) || 1; 
    const limit = parseInt(req.params.limit, 10) || 100;

    try {
        // Calcul des index de début et de fin pour la pagination
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        // Récupération de toutes les chaînes
        const allChannels = await getAllChannels(); // Assurez-vous que getAllChannels fonctionne correctement et renvoie un tableau complet

        // Pagination des chaînes
        const paginatedChannels = allChannels.slice(startIndex, endIndex);

        // Calcul du nombre total de pages
        const totalChannels = allChannels.length;
        const totalPages = Math.ceil(totalChannels / limit);

        // Envoi de la réponse avec les informations de pagination
        res.json({
            page,
            limit,
            totalChannels,
            totalPages, // Ajout de totalPages ici
            data: paginatedChannels,
        });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des chaînes" });
    }
};


module.exports = { getAllChannels, getPaginatedChannels, getFilteredChannels };