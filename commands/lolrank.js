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

    console.log(rankData);

    let rank = "Unranked";
    let arenaRank = "Unranked";
    let flexRank = "Unranked";
    let flexDivision = "";
    let division = "";
    let lp = 0;
    let wins = 0;
    let losses = 0;

    let rankedIndex = 0;

    /*

    if (tftRankData[0].queueType == "RANKED_TFT") {
    } else if (tftRankData[1].queueType == "RANKED_TFT") {
      rankedIndex = 1;
    }
    rank = tftRankData[rankedIndex].tier; //ranked tft
    division = tftRankData[rankedIndex].rank;
    lp = tftRankData[rankedIndex].leaguePoints;
    wins = tftRankData[rankedIndex].wins;
    losses = tftRankData[rankedIndex].losses;
    if (rankData.length > 0) {
      if (rankData[0].queueType == "RANKED_TFT_DOUBLE_UP") {
      } else if (rankData[1].queueType == "RANKED_TFT_DOUBLE_UP") {
        doubleUpIndex = 1;
      }
      flexRank = rankData[0].tier; //ranked tft
      flexDivision = rankData[0].rank;

      // Deprecated in API
      // if (tftRankData[0].hasOwnProperty('ratedTier')) { //hyperrol
      //     hyperRank = tftRankData[0].ratedTier;
      // } else if (tftRankData[1].hasOwnProperty('ratedTier')) {
      //     hyperRank = tftRankData[1].ratedTier;
      // }
    }

    flexRank = flexRank.substring(0, 1) + flexRank.substring(1).toLowerCase();

    if (arenaRank.toLowerCase() == "orange") {
      arenaRank = "Hyper";
    }
    arenaRank =
      arenaRank.substring(0, 1) + arenaRank.substring(1).toLowerCase();
    rank = rank.substring(0, 1) + rank.substring(1).toLowerCase();
    if (arenaRank == "Unranked") {
      hyperEmblem = "assets/ranked-emblems/Grey_tier.png";
    } else {
      hyperEmblem = "assets/ranked-emblems/" + arenaRank + "_tier.png";
    }
    arenaRank = arenaRank + " Tier";
    var embedColor = getRankColor(rank);

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
 */
    var exampleEmbed = new MessageEmbed()
      .setColor(embedColor)
      .setTitle("" + tftData.name)
      //.addField(''+tftData.name, '\u200b', true)
      .addField("Double up: " + flexRank + " " + flexDivision, "\u200b", false)
      .addField(
        "Rank: " + rank + " " + division + " LP: " + lp,
        wins +
          " Wins " +
          losses +
          " Losses " +
          "WR: " +
          Math.round((wins / (wins + losses)) * 100, 1) +
          "%",
        false
      )
      .setImage("attachment://rankedImg.png")
      .setThumbnail("attachment://double.png")
      .setFooter({
        text: "Hyperrol rank: " + arenaRank,
        iconURL: "attachment://icon.png",
      });

    await interaction.reply({
      embeds: [exampleEmbed],
      files: [
        { attachment: hyperEmblem, name: "icon.png" },
        {
          attachment: "assets/ranked-emblems/Emblem_" + rank + ".png",
          name: "rankedImg.png",
        },
        {
          attachment: "assets/ranked-emblems/Emblem_" + flexRank + ".png",
          name: "double.png",
        },
      ],
    });
  },
};
