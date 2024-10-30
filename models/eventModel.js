// models/Game.js

class Game {
    constructor(id, sport, league, match, date, status, liveUrl) {
        this.id = id;                   // ID unique du match
        this.sport = sport;              // Sport (ex: football, basketball)
        this.league = league;            // Nom de la ligue (ex: NBA, Ligue 1)
        this.match = match;              // Détail du match (ex: Team A vs Team B)
        this.date = date;                // Date et heure du match
        this.status = status;            // Statut du match (en direct, terminé, etc.)
        this.liveUrl = liveUrl || null;  // URL pour regarder le match en direct (si disponible)
    }
}

module.exports = Game;
