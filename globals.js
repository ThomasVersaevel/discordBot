const shortcuts = require("./api-shortcuts.json");
const fetch = require("node-fetch");
const { apiKey, tftKey } = require("./config.json");

const RANKS = {
  Unranked: { index: 0, color: "#d1d1d1" },
  Iron: { index: 1, color: "#615959" },
  Bronze: { index: 2, color: "#925235" },
  Silver: { index: 3, color: "#839da5" },
  Gold: { index: 4, color: "#dfa040" },
  Platinum: { index: 5, color: "#539591" },
  Emerald: { index: 6, color: "#50c878" }, // custom color for Emerald
  Diamond: { index: 7, color: "#686cdd" },
  Master: { index: 8, color: "#8154a6" },
  Grandmaster: { index: 9, color: "#f12227" },
  Challenger: { index: 10, color: "#fcf4e1" },
};

module.exports = {
  convertLolName(fullname, id) {
    let username = fullname.toLowerCase().split("#")[0];
    let tag = fullname.toUpperCase().split("#")[1] || "EUW";

    if (username === "reign" || username === "Reign") {
      username = "reıgn";
    } else if (username.toLowerCase() === "kokoala") {
      username = "kôkoala";
    } else if (username === "me") {
      username = shortcuts[id];
    }
    console.log(username);

    return { username: username[0].toUpperCase() + username.substring(1), tag };
  },

  getRankColor(rank) {
    return RANKS[rank]?.color || "#d1d1d1";
  },

  getRankIndex(rank) {
    return RANKS[rank]?.index || "0";
  },

  // Endpoints

  async getUserInfo(username, tagline) {
    const response = await fetch(
      `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${username}/${tagline}?api_key=${apiKey}`
    );
    return await response.json(); // returns {gameName, tagLine, puuid} needs /lol/summoner/v4/summoners/by-puuid/{encryptedPUUID} for sumlvl
  },

  async getUserIcon(userdata) {
    let patchNr = shortcuts["patch"];
    return `http://ddragon.leagueoflegends.com/cdn/${patchNr}/img/profileicon/${userdata.profileIconId}.png`;
  },

  async getRankedData(puuid) {
    const response = await fetch(
      `https://euw1.api.riotgames.com/lol/league/v4/entries/by-puuid/${puuid}?api_key=${apiKey}`
    );
    return await response.json();
  },

  async getSummonerData(puuid) {
    const summonerResponse = await fetch(
      `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${apiKey}`
    );
    return await summonerResponse.json();
  },

  async getMatchData(puuid, start, count) {
    const matchIdResponse = await fetch(
      `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?api_key=${apiKey}&start=${start}&count=${count}`
    );
    return await matchIdResponse.json(); // returns an array of match IDs
  },

  async getMatchDetails(matchIdData) {
    const matchResponse = await fetch(
      `https://europe.api.riotgames.com/lol/match/v5/matches/${matchIdData[0]}/timeline?api_key=${apiKey}`
    );
    return await matchResponse.json(); // returns match details
  },

  async getTftData(puuid) {
    // const accountID = await fetch(
    //   `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${apiKey}`
    // );
    // const accountData = await accountID.json();
    // console.log(accountData);

    const tftResponse = await fetch(
      `https://euw1.api.riotgames.com/tft/summoner/v1/summoners/by-puuid/${puuid}?api_key=${tftKey}`
    );
    return await tftResponse.json(); // returns {id, accountId, puuid, profileIconId, summonerLevel}
  },

  async getTftRankedData(puuid) {
    const tftRankResponse = await fetch(
      `https://euw1.api.riotgames.com/tft/league/v1/by-puuid/${puuid}?api_key=${tftKey}`
    );
    return await tftRankResponse.json();
  },
};
