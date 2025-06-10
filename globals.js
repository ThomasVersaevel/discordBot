const shortcuts = require("./api-shortcuts.json");
const fetch = require("node-fetch");
const { apiKey } = require("./config.json");

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

  async fetchApiEndpoint(link) {
    const response = fetch(link);
    return response.json();
  },

  async getUsernameFromPuuid(puuid) {
    const response = await fetch(
      `https://euw1.api.riotgames.com/tft/summoner/v1/summoners/by-puuid/${puuid}`
    );
    let data = await response.json();
    console.log(data);
    return data.name;
  },

  async getUserInfo(username, tagline) {
    const link = `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${username}/${tagline}?api_key=${apiKey}`;
    const response = await fetch(link);
    return await response.json(); // returns {gameName, tagLine, puuid} needs /lol/summoner/v4/summoners/by-puuid/{encryptedPUUID} for sumlvl
  },
};
