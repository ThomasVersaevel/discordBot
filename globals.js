const shortcuts  = require('./api-shortcuts.json');
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
    }
}