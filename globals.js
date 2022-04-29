const shortcuts  = require('./api-shortcuts.json');

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
		const sumResponse = await fetch(Link);
        return await sumResponse.json();
    }
}