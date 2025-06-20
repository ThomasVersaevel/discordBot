const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { convertLolName, getTftData, getUserInfo, getRankColor, getRankIndex } = require("../globals.js");

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

    let userData = await getUserInfo(username, tag);
    const puuid = userData.puuid;

    let tftData = await getTftData(puuid);

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

    let rankedIndex;
    let doubleIndex;

    console.log(tftData);

    for (let i = 0; i < tftData.length; i++) {
      if (tftData[i].queueType === "RANKED_TFT") {
        rankedIndex = i;
      }
    }
    if (typeof rankedIndex !== "undefined") {
      rankedRank = tftData[rankedIndex].tier; // ranked tft
      rankedDivision = tftData[rankedIndex].rank;
      rankedLp = tftData[rankedIndex].leaguePoints;
      rankedWins = tftData[rankedIndex].wins;
      rankedLosses = tftData[rankedIndex].losses;
    }

    if (doubleRank) {
      doubleRank =
        doubleRank.substring(0, 1) + doubleRank.substring(1).toLowerCase();
    } else {
      doubleRank = "Unranked";
    }

    rankedRank =
      rankedRank.substring(0, 1) + rankedRank.substring(1).toLowerCase();
    var embedColor = getRankColor(rankedRank);

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
      .setTitle("" + userData.name)
      .addFields(lowestRankField, highestRankField)
      .setImage("attachment://rankedImg.png")
      .setThumbnail("attachment://double.png");

    await interaction.reply({
      embeds: [exampleEmbed],
      files: [
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
