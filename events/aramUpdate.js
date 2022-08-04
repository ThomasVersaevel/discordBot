const aramwl = require('../winslosses.json');
const oldlist = require('../oldmatchlist.json');
const fs = require("fs");
const fetch = require('node-fetch');
const { apiKey } = require('../config.json');
/** per user: grab wins/losses from json
       grab match ids from other json
       compare ids to find new entries
       get results from new entries
       add results to wins/losses json
   */
module.exports = {
    name: 'aramUpdate',
    once: true,
    execute(client) {
        console.log('start update');
        loop();

        function loop() {

            console.log("Aram stats update");

            for (entry in aramwl) {
                sumData = retrieveNewAramGames(entry);
            }
            setTimeout(loop, 60000);
        }

        async function retrieveNewAramGames(entry) {
            const link = `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${entry}?api_key=${apiKey}`
            const response = await fetch(link);
            sumData = await response.json();
            const puuid = sumData.puuid; // id of user
            const matchLink = `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?api_key=${apiKey}&queue=450&start=0&count=10`
            const matchIdResponse = await fetch(matchLink);
            let matchIdData = await matchIdResponse.json();

            let oldMatchList = oldlist['' + entry]; //list of matchids by sumname (json)
            var win = 0;
            var lose = 0;
            let newMatchList = [];
            for (var id = 0; id < matchIdData.length; id++) {
                if (!oldMatchList['' + entry].includes(matchIdData[id])) {
                    newMatchList.push(matchIdData[id]);
                    let tempLink = `https://europe.api.riotgames.com/lol/match/v5/matches/${matchIdData[id]}?api_key=${apiKey}`
                    const matchResponse = await fetch(tempLink);
                    let matchData = await matchResponse.json();
                    // if Match not yet used, check win or lose
                    var partIndex = 0;
                    for (var i = 0; i < 10; i++) {
                        if (matchData.info.participants[i].puuid === puuid) {
                            partIndex = i;
                        }
                    }
                    matchData.info.participants[partIndex].win ? win++ : lose++;
                }
                // add new matches to oldMatchList
                oldMatchList.concat(newMatchList);
                oldlist[entry] = oldMatchList;
            }
            // add wins and losses to total
            aramwl['' + entry].wins += win;
            aramwl['' + entry].losses += lose;
        }
    },
};