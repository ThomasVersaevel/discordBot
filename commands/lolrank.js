const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const shortcuts = require("../api-shortcuts.json");
const fetch = require("node-fetch");
const { apiKey } = require("../config.json");
const { convertLolName } = require("../globals.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lolrank")
    .setDescription("Shows your LoL rank")
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
    );

    // get User data from lol api
    const link = `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${username}?api_key=${apiKey}`;
    const response = await fetch(link);
    let userData = await response.json();
    const puuid = userData.puuid;

    patchNr = shortcuts["patch"]; //required for data dragon

    // get Ranked data from lol api
    let rankedLink = `https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${userData.id}?api_key=${apiKey}`;
    const rankResponse = await fetch(rankedLink);
    let rankData = await rankResponse.json();

    // Not working looks like nullable in an if statement resolves to true
    if (!rankData || rankData[0]?.queueType === "RANKED_TFT_DOUBLE_UP") {
      await interaction.reply({
        content: "That player does not have any ranked stats",
        ephemeral: true,
      });
      return;
    }

    let flexRank = "Unranked";
    let flexDivision = "";
    let flexLp = 0;
    let flexWins = 0;
    let flexLosses = 0;

    let soloRank = "Unranked";
    let soloDivision = "";
    let soloLp = 0;
    let soloWins = 0;
    let soloLosses = 0;

    let arenaRank = "Unranked";
    let arenaWins = 0;
    let arenaLosses = 0;

    let rankedIndex = 100;
    let flexIndex = 100;
    let arenaIndex = 100;

    // console.log(rankData);

    // map each item in rankData and assign the right index to each queue type.
    // RANKED_SOLO_5x5 RANKED_FLEX_SR CHERRY(arena)
    for (let i = 0; i < rankData.length; i++) {
      if (rankData[i].queueType === "RANKED_FLEX_SR") {
        flexIndex = i;
      } else if (rankData[i].queueType === "RANKED_SOLO_5x5") {
        rankedIndex = i;
      } else if (rankData[i].queueType === "CHERRY") {
        // save arena wins/losses
        arenaIndex = i;
      }
    }

    if (rankedIndex < 99) {
      soloRank = rankData[rankedIndex].tier; //ranked solo
      soloDivision = rankData[rankedIndex].rank;
      soloLp = rankData[rankedIndex].leaguePoints;
      soloWins = rankData[rankedIndex].wins;
      soloLosses = rankData[rankedIndex].losses;
    }
    if (flexIndex < 99) {
      flexRank = rankData[flexIndex].tier; //ranked flex
      flexDivision = rankData[flexIndex].rank;
      flexLp = rankData[flexIndex].leaguePoints;
      flexWins = rankData[flexIndex].wins;
      flexLosses = rankData[flexIndex].losses;
    }
    if (arenaIndex < 99) {
      arenaWins = rankData[arenaIndex].wins;
      arenaLosses = rankData[arenaIndex].losses;
    }

    if (soloRank) {
      soloRank = soloRank.substring(0, 1) + soloRank.substring(1).toLowerCase();
    } else {
      soloRank = "Unranked";
    }

    if (flexRank) {
      flexRank = flexRank.substring(0, 1) + flexRank.substring(1).toLowerCase();
    } else {
      flexRank = "Unranked";
    }

    if (arenaRank) {
      arenaRank =
        arenaRank.substring(0, 1) + arenaRank.substring(1).toLowerCase();
    }
    arenaEmblem = "assets/ranked-emblems/Emblem_Gladiator.png";

    var embedColor = getRankColor(flexRank);

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
        case "Emerald":
          return "#53bb91";
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

    let highestRankField = {};
    let lowestRankField = {};
    // Find highest rank
    if (getRankIndex(soloRank) >= getRankIndex(flexRank)) {
      highestRankField = {
        name:
          "Solo Rank: " + soloRank + " " + soloDivision + " " + soloLp + "LP",
        value:
          soloWins !== 0 && soloLosses !== 0
            ? soloWins +
              " Wins " +
              soloLosses +
              " Losses " +
              Math.round((soloWins / (soloWins + soloLosses)) * 100, 1) +
              "% WR"
            : "\u200b",
        inline: false,
      };
      lowestRankField = {
        name:
          "Flex Rank: " + flexRank + " " + flexDivision + " " + flexLp + "LP",
        value:
          flexWins !== 0 && flexLosses !== 0
            ? flexWins +
              " Wins " +
              flexLosses +
              " Losses " +
              Math.round((flexWins / (flexWins + flexLosses)) * 100, 1) +
              "% WR"
            : "\u200b",
        inline: false,
      };
    } else {
      highestRankField = {
        name:
          "Flex Rank: " + flexRank + " " + flexDivision + " " + flexLp + "LP",
        value:
          flexWins !== 0 && flexLosses !== 0
            ? flexWins +
              " Wins " +
              flexLosses +
              " Losses " +
              Math.round((flexWins / (flexWins + flexLosses)) * 100, 1) +
              "% WR"
            : "\u200b",
        inline: false,
      };
      lowestRankField = {
        name:
          "Solo Rank: " + soloRank + " " + soloDivision + " " + soloLp + "LP",
        value:
          soloWins !== 0 && soloLosses !== 0
            ? soloWins +
              " Wins " +
              soloLosses +
              " Losses " +
              Math.round((soloWins / (soloWins + soloLosses)) * 100, 1) +
              "% WR"
            : "\u200b",
        inline: false,
      };
    }

    var exampleEmbed = new MessageEmbed()
      .setColor(embedColor)
      .setTitle("" + userData.name)
      .addFields(lowestRankField, highestRankField)
      .setImage("attachment://flex.png")
      .setThumbnail("attachment://solo.png")
      .setFooter({
        text: "Arena wins: " + arenaWins + " losses: " + arenaLosses,
        iconURL: "attachment://arena.png",
      });

    await interaction.reply({
      embeds: [exampleEmbed],
      files: [
        { attachment: arenaEmblem, name: "arena.png" },
        {
          attachment:
            "assets/ranked-emblems/Emblem_" +
            (getRankIndex(flexRank) >= getRankIndex(soloRank)
              ? flexRank
              : soloRank) +
            ".png",
          name: "flex.png",
        },
        {
          attachment:
            "assets/ranked-emblems/Emblem_" +
            (getRankIndex(soloRank) > getRankIndex(flexRank)
              ? flexRank
              : soloRank) +
            ".png",
          name: "solo.png",
        },
      ],
    });
  },
};
