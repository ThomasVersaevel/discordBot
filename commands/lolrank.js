const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { convertLolName, getUserInfo, getRankedData } = require("../globals.js");

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
    const { username, tag } = convertLolName(
      interaction.options.getString("lolname"),
      interaction.member.id
    );

    let userData = await getUserInfo(username, tag);

    // get Ranked data from lol api
    let rankData = await getRankedData(userData.puuid);

    console.log("rankdata: ", rankData);

    if (
      !Array.isArray(rankData) ||
      !rankData.some(
        (entry) =>
          entry.queueType === "RANKED_SOLO_5x5" ||
          entry.queueType === "RANKED_FLEX_SR" ||
          entry.queueType === "CHERRY"
      )
    ) {
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

    let rankedIndex;
    let flexIndex;

    console.log(rankData);

    // map each item in rankData and assign the right index to each queue type.
    // RANKED_SOLO_5x5 RANKED_FLEX_SR
    for (let i = 0; i < rankData.length; i++) {
      if (rankData[i].queueType === "RANKED_FLEX_SR") {
        flexIndex = i;
      } else if (rankData[i].queueType === "RANKED_SOLO_5x5") {
        rankedIndex = i;
      }
    }

    if (typeof rankedIndex !== "undefined") {
      soloRank = rankData[rankedIndex].tier; //ranked solo
      soloDivision = rankData[rankedIndex].rank;
      soloLp = rankData[rankedIndex].leaguePoints;
      soloWins = rankData[rankedIndex].wins;
      soloLosses = rankData[rankedIndex].losses;
    }
    if (typeof flexIndex !== "undefined") {
      flexRank = rankData[flexIndex].tier; //ranked flex
      flexDivision = rankData[flexIndex].rank;
      flexLp = rankData[flexIndex].leaguePoints;
      flexWins = rankData[flexIndex].wins;
      flexLosses = rankData[flexIndex].losses;
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

    const highestIsSolo = getRankIndex(soloRank) >= getRankIndex(flexRank);

    // Helper to build field object
    function buildRankField(queue, rank, division, lp, wins, losses) {
      const winRate =
        wins !== 0 && losses !== 0
          ? `${wins} Wins ${losses} Losses ${Math.round(
              (wins / (wins + losses)) * 100
            )}% WR`
          : "\u200b";

      return {
        name: `${queue} Rank: ${rank} ${division} ${lp}LP`,
        value: winRate,
        inline: false,
      };
    }

    const highestRankField = highestIsSolo
      ? buildRankField(
          "Solo",
          soloRank,
          soloDivision,
          soloLp,
          soloWins,
          soloLosses
        )
      : buildRankField(
          "Flex",
          flexRank,
          flexDivision,
          flexLp,
          flexWins,
          flexLosses
        );

    const lowestRankField = highestIsSolo
      ? buildRankField(
          "Flex",
          flexRank,
          flexDivision,
          flexLp,
          flexWins,
          flexLosses
        )
      : buildRankField(
          "Solo",
          soloRank,
          soloDivision,
          soloLp,
          soloWins,
          soloLosses
        );

    // Determine correct emblem attachments
    const higherRank = highestIsSolo ? soloRank : flexRank;
    const lowerRank = highestIsSolo ? flexRank : soloRank;

    const exampleEmbed = new MessageEmbed()
      .setColor(embedColor)
      .setTitle(`${userData.gameName}`)
      .addFields(lowestRankField, highestRankField)
      .setImage("attachment://flex.png")
      .setThumbnail("attachment://solo.png");

    await interaction.reply({
      embeds: [exampleEmbed],
      files: [
        {
          attachment: `assets/ranked-emblems/Emblem_${higherRank}.png`,
          name: "flex.png",
        },
        {
          attachment: `assets/ranked-emblems/Emblem_${lowerRank}.png`,
          name: "solo.png",
        },
      ],
    });
  },
};
