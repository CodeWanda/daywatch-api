// models/Channel.js

class Channel {
    constructor(name, logo, url) {
        this.name = name;
        this.logo = logo || 'Logo non disponible';
        this.url = url;
    }
}

module.exports = Channel;