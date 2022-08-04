const shortcuts  = require('./api-shortcuts.json');
const aramwl  = require('./winslosses.json');
const fetch = require('node-fetch');

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

    fetchApiEndpoint(link) {
		const response = fetch(link);
        return response.json();
    },

    /** per user: grab wins/losses from json
        grab match ids from other json
        compare ids to find new entries
        get results from new entries
        add results to wins/losses json
    */
    aramStatsUpdate() {
        console.log("aram stats update");
 
        
        for (entry in aramwl) {
           retrieveNewAramGames(entry);
        }


        return new Promise(resolve => setTimeout(resolve, 1000 * 60 ));
    }
    retrieveNewAramGames(entry) {
        
    }
}