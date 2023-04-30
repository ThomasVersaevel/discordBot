const shortcuts  = require('./api-shortcuts.json');
const fetch = require('node-fetch');
const { apiKey } = require('./config.json');
const { MongoClient } = require('mongodb');
const url = `mongodb://127.0.0.1:27017/`;
let client;

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
    },

    //Database
    async startDatabase() {
        client = new MongoClient(url);
        try {
        await client.connect();
        } catch (e) {
            console.error(e);
        } 
    },
    
    async listDatabases(){
        databasesList = await client.db().admin().listDatabases();
     
        console.log("Databases:");
        return databasesList.databases.forEach(db => console.log(` - ${db.name}`));
    },

    getDbClient() {
        return client;
    }
    
}