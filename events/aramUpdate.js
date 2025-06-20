const fs = require("fs");
const { apiKey } = require("../config.json");
const matchListJson = require("../oldmatchlist.json");
const aramwl = require("../winslosses.json");
/**
 * On message events
 */
module.exports = {
  name: "aramUpdate",
  execute(entry) {
    return;
    retrieveNewAramGames(entry);
    async function retrieveNewAramGames(entry) {
      const link = `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${entry}?api_key=${apiKey}`;
      const response = await fetch(link);
      sumData = await response.json();
      const puuid = sumData.puuid; // id of user
      // obtain 10 aram games by queue 450
      const matchLink = `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?api_key=${apiKey}&queue=450&start=0&count=10`;
      const matchIdResponse = await fetch(matchLink);
      let matchIdData = await matchIdResponse.json();

      let oldMatchList = [];
      // console.log('doing aram update for: ' + entry);

      for (var i = 0; i < matchListJson[entry].length; i++) {
        //console.log(match);
        if (matchListJson[entry][i] != 0) {
          oldMatchList.push(matchListJson[entry][i]); //list of matchids by sumname (json)
        }
      }
      //console.log(oldMatchList);
      var win = 0;
      var lose = 0;
      let newMatchList = oldMatchList;

      for (var id = 0; id < matchIdData.length; id++) {
        if (!oldMatchList.includes(matchIdData[id])) {
          // console.log(entry + " New match detected: " + matchIdData[id]);
          newMatchList.push(matchIdData[id]);
          let tempLink = `https://europe.api.riotgames.com/lol/match/v5/matches/${matchIdData[id]}?api_key=${apiKey}`;
          const matchResponse = await fetch(tempLink);
          let matchData = await matchResponse.json();
          // if Match not yet used, check win or lose
          var partIndex = 0;
          if (!matchData.info) {
          } else {
            for (var i = 0; i < 10; i++) {
              //console.log(matchIdData[id] + ' partIndex: '+ i + ' - ' + matchData.info)
              if (matchData.info.participants[i].puuid === puuid) {
                partIndex = i; //find player's index
                break;
              }
            }
            matchData.info.participants[partIndex].win ? win++ : lose++;
          }
        }
      }

      //console.log(newMatchList);
      matchListJson[entry] = newMatchList;
      fs.writeFile(
        "../oldmatchlist.json",
        JSON.stringify(matchListJson),
        (err) => {
          if (err) console.log("Error writing file:", err);
        }
      );
      // add wins and losses to total
      aramwl[entry].wins += win;
      aramwl[entry].losses += lose;

      fs.writeFile("../winslosses.json", JSON.stringify(aramwl), (err) => {
        if (err) console.log("Error writing file:", err);
      });
    }
  },
};
