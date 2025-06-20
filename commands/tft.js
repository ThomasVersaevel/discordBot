const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { convertLolName, getTftData, getUserInfo } = require("../globals.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tft")
    .setDescription("Shows your tft rank")
    .addStringOption((option) =>
      option
        .setName("lolname")
        .setDescription("Summoner Name")
        .setRequired(true)
    ),
  async execute(interaction) {
    const { username, tag } = convertLolName(
      interaction.options.getString("lolname"),
      interaction.member.id
    ); //uses globals

    let data = getUserInfo(username, tag);
    const puuid = data.puuid;
    // turns out double up ranks are in league/v4

    let tftData = getTftData(puuid);

    console.log("tftData: ", tftData);

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

    let rankedIndex;
    let hyperIndex;

    console.log(tftData);

    for (let i = 0; i < tftData.length; i++) {
      if (tftData[i].queueType === "RANKED_TFT") {
        rankedIndex = i;
      } else if (tftData[i].queueType === "RANKED_TFT_TURBO") {
        hyperIndex = i;
      }
    }
    if (typeof rankedIndex !== "undefined") {
      rankedRank = tftData[rankedIndex].tier; // ranked tft
      rankedDivision = tftData[rankedIndex].rank;
      rankedLp = tftData[rankedIndex].leaguePoints;
      rankedWins = tftData[rankedIndex].wins;
      rankedLosses = tftData[rankedIndex].losses;
    }

    if (typeof hyperIndex !== "undefined") {
      hyperRank = tftData[hyperIndex].ratedTier; // hyperrol
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
