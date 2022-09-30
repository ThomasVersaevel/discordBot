const shortcuts  = require('./api-shortcuts.json');
const aramwl  = require('./winslosses.json');
const fetch = require('node-fetch');
const { apiKey } = require('./config.json');

module.exports = {
    convertLolName(username, id) {   
        if (username === 'reign') { //kevin simpelmaker
            username = 'reıgn';
        } else if (username === 'kokoala') {
            username = 'kôkoala';
        }
        else if (username === 'me') {
            username = shortcuts[id];
        }
        return username[0].toUpperCase() + username.substring(1);
    },

    async fetchApiEndpoint(link) {
		const response = fetch(link);
        return response.json();
    },

    async getUsernameFromPuuid(puuid) {
        const response = await fetch(`https://euw1.api.riotgames.com//tft/summoner/v1/summoners/by-puuid/${puuid}`)
        let data = await response.json()
        //console.log(data)
        return data.name
    }

}