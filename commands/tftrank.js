const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const shortcuts = require("../api-shortcuts.json");
const fetch = require("node-fetch");
const { tftKey, apiKey } = require("../config.json");
const { convertLolName } = require("../globals.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tftrank")
    .setDescription("Shows your tft rank")
    .addStringOption((option) =>
      option
        .setName("lolname")
        .setDescription("Summoner Name")
        .setRequired(true)
    ),
  async execute(interaction) {
    let username = convertLolName(
      interaction.options.getString("lolname"),
      interaction.member.id
    ); //uses globals

    const link = `https://euw1.api.riotgames.com/tft/summoner/v1/summoners/by-name/${username}?api_key=${tftKey}`;
    const response = await fetch(link);
    let data = await response.json();
    const puuid = data.puuid;
    // turns out double up ranks are in league/v4
    const lolSummonerLink = `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${username}?api_key=${apiKey}`;
    const lolSummonerResponse = await fetch(lolSummonerLink);
    let lolSummonerData = await lolSummonerResponse.json();

    patchNr = shortcuts["patch"]; //required for data dragon
    let tftlink = `https://euw1.api.riotgames.com/tft/summoner/v1/summoners/by-puuid/${puuid}?api_key=${tftKey}`;
    const tftResponse = await fetch(tftlink);
    let tftData = await tftResponse.json();

    let tftRankedLink = `https://euw1.api.riotgames.com/tft/league/v1/entries/by-summoner/${tftData.id}?api_key=${tftKey}`;
    const tftRankResponse = await fetch(tftRankedLink);
    let tftRankData = await tftRankResponse.json();

    let lolRankedLink = `https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${lolSummonerData.id}?api_key=${apiKey}`;
    const lolRankResponse = await fetch(lolRankedLink);
    let lolRankData = await lolRankResponse.json();

    let doubleRank = "Unranked";
    let doubleDivision = "";
    let doubleLp = 0;
    let doubleWins = 0;
    let doubleLosses = 0;

    let rankedRank = "Unranked";
    let rankedDivision = "";
    let rankedLp = 0;
    let rankedWins = 0;
    let rankedLosses = 0;

    let hyperRank = "Unranked";

    let rankedIndex = 100;
    let hyperIndex = 100;

    console.log(tftRankData);

    for (let i = 0; i < tftRankData.length; i++) {
      if (tftRankData[i].queueType === "RANKED_TFT") {
        rankedIndex = i;
      } else if (tftRankData[i].queueType === "RANKED_TFT_TURBO") {
        hyperIndex = i;
      }
    }
    if (rankedIndex < 99) {
      rankedRank = tftRankData[rankedIndex].tier; // ranked tft
      rankedDivision = tftRankData[rankedIndex].rank;
      rankedLp = tftRankData[rankedIndex].leaguePoints;
      rankedWins = tftRankData[rankedIndex].wins;
      rankedLosses = tftRankData[rankedIndex].losses;
    }

    if (hyperIndex < 99) {
      hyperRank = tftRankData[hyperIndex].ratedTier; // hyperrol
    }

    for (let i = 0; i < lolRankData.length; i++) {
      if (lolRankData[i].queueType === "RANKED_TFT_DOUBLE_UP") {
        doubleRank = lolRankData[i].tier;
        doubleDivision = lolRankData[i].rank;
        doubleLp = lolRankData[i].leaguePoints;
        doubleWins = lolRankData[i].wins;
        doubleLosses = lolRankData[i].losses;
      }
    }

    if (doubleRank) {
      doubleRank =
        doubleRank.substring(0, 1) + doubleRank.substring(1).toLowerCase();
    } else {
      doubleRank = "Unranked";
    }

    hyperRank =
      hyperRank.substring(0, 1) + hyperRank.substring(1).toLowerCase();

    rankedRank =
      rankedRank.substring(0, 1) + rankedRank.substring(1).toLowerCase();

    if (hyperRank.toLowerCase() == "orange") {
      hyperRank = "Hyper";
    }
    if (hyperRank == "Unranked") {
      hyperEmblem = "assets/ranked-emblems/Grey_tier.png";
    } else {
      hyperEmblem = "assets/ranked-emblems/" + hyperRank + "_tier.png";
    }
    hyperRank = hyperRank + " Tier";
    var embedColor = getRankColor(rankedRank);

    function getRankColor(rank) {
      switch (rank) {
        case "Iron":
          return "#615959";
        case "Bronze":
          return "#925235";
        case "Silver":
          return "#839da5";
        case "Gold":
          return "#dfa040";
        case "Platinum":
          return "#539591";
        case "Diamond":
          return "#686cdd";
        case "Master":
          return "#8154a6";
        case "Grandmaster":
          return "#f12227";
        case "Challenger":
          return "#fcf4e1";
        default:
          return "#d1d1d1";
      }
    }

    function getRankIndex(rank) {
      switch (rank) {
        case "Unranked":
          return 0;
        case "Iron":
          return 1;
        case "Bronze":
          return 2;
        case "Silver":
          return 3;
        case "Gold":
          return 4;
        case "Platinum":
          return 5;
        case "Emerald":
          return 6;
        case "Diamond":
          return 7;
        case "Master":
          return 8;
        case "Grandmaster":
          return 9;
        case "Challenger":
          return 10;
        default:
          return 0;
      }
    }

    let highestRankField = {};
    let lowestRankField = {};

    if (getRankIndex(rankedRank) >= getRankIndex(doubleRank)) {
      highestRankField = {
        name:
          "Ranked Rank: " +
          rankedRank +
          " " +
          rankedDivision +
          " " +
          rankedLp +
          "LP",
        value:
          rankedWins !== 0 && rankedLosses !== 0
            ? rankedWins +
              " Wins " +
              rankedLosses +
              " Losses " +
              Math.round((rankedWins / (rankedWins + rankedLosses)) * 100, 1) +
              "% WR"
            : "\u200b",
        inline: false,
      };
      lowestRankField = {
        name:
          "Double Up Rank: " +
          doubleRank +
          " " +
          doubleDivision +
          " " +
          doubleLp +
          "LP",
        value:
          doubleWins !== 0 && doubleLosses !== 0
            ? doubleWins +
              " Wins " +
              doubleLosses +
              " Losses " +
              Math.round((doubleWins / (doubleWins + doubleLosses)) * 100, 1) +
              "% WR"
            : "\u200b",
        inline: false,
      };
    } else {
      highestRankField = {
        name:
          "Double Up Rank: " +
          doubleRank +
          " " +
          doubleDivision +
          " " +
          doubleLp +
          "LP",
        value:
          doubleWins !== 0 && doubleLosses !== 0
            ? doubleWins +
              " Wins " +
              doubleLosses +
              " Losses " +
              Math.round((doubleWins / (doubleWins + doubleLosses)) * 100, 1) +
              "% WR"
            : "\u200b",
        inline: false,
      };
      lowestRankField = {
        name:
          "Ranked Rank: " +
          rankedRank +
          " " +
          rankedDivision +
          " " +
          rankedLp +
          "LP",
        value:
          rankedWins !== 0 && rankedLosses !== 0
            ? rankedWins +
              " Wins " +
              rankedLosses +
              " Losses " +
              Math.round((rankedWins / (rankedWins + rankedLosses)) * 100, 1) +
              "% WR"
            : "\u200b",
        inline: false,
      };
    }

    var exampleEmbed = new MessageEmbed()
      .setColor(embedColor)
      .setTitle("" + data.name)
      .addFields(lowestRankField, highestRankField)
      .setImage("attachment://rankedImg.png")
      .setThumbnail("attachment://double.png")
      .setFooter({
        text: "Hyperrol rank: " + hyperRank,
        iconURL: "attachment://icon.png",
      });

    await interaction.reply({
      embeds: [exampleEmbed],
      files: [
        { attachment: hyperEmblem, name: "icon.png" },
        {
          attachment:
            "assets/ranked-emblems/Emblem_" +
            (getRankIndex(rankedRank) >= getRankIndex(doubleRank)
              ? rankedRank
              : doubleRank) +
            ".png",
          name: "rankedImg.png",
        },
        {
          attachment:
            "assets/ranked-emblems/Emblem_" +
            (getRankIndex(doubleRank) > getRankIndex(rankedRank)
              ? rankedRank
              : doubleRank) +
            ".png",
          name: "double.png",
        },
      ],
    });
  },
};
