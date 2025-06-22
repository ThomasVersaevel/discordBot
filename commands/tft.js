const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const {
  convertLolName,
  getTftData,
  getUserInfo,
  getRankColor,
  getRankIndex,
} = require("../globals.js");

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

    // Helper to capitalize rank
    function capitalizeRank(rank) {
      if (!rank) return "Unranked";
      return rank.charAt(0).toUpperCase() + rank.slice(1).toLowerCase();
    }

    // Calculate winrate
    function calculateWR(wins, losses) {
      if (!wins && !losses) return "";
      return `${wins} Wins ${losses} Losses ${(
        (wins / (wins + losses)) *
        100
      ).toFixed(1)}% WR`;
    }

    // Get image file path for a rank
    function getRankImage(rank) {
      const validRanks = [
        "Iron",
        "Bronze",
        "Silver",
        "Gold",
        "Platinum",
        "Emerald",
        "Diamond",
        "Master",
        "Grandmaster",
        "Challenger",
      ];
      rank = capitalizeRank(rank);
      return `assets/ranked-emblems/Emblem_${
        validRanks.includes(rank) ? rank : "Unranked"
      }.png`;
    }

    // Get rank index for comparing
    function getRankIndex(rank) {
      const order = [
        "unranked",
        "iron",
        "bronze",
        "silver",
        "gold",
        "platinum",
        "emerald",
        "diamond",
        "master",
        "grandmaster",
        "challenger",
      ];
      return order.indexOf(rank.toLowerCase());
    }

    // Main function
    let ranked =
      tftData.find((entry) => entry.queueType === "RANKED_TFT") || {};
    let doubleUp =
      tftData.find((entry) => entry.queueType === "RANKED_TFT_DOUBLE_UP") || {};

    const rankedRank = capitalizeRank(ranked.tier || "Unranked");
    const rankedDivision = ranked.rank || "";
    const rankedLp = ranked.leaguePoints || 0;
    const rankedWins = ranked.wins || 0;
    const rankedLosses = ranked.losses || 0;

    const doubleRank = capitalizeRank(doubleUp.tier || "Unranked");
    const doubleDivision = doubleUp.rank || "";
    const doubleLp = doubleUp.leaguePoints || 0;
    const doubleWins = doubleUp.wins || 0;
    const doubleLosses = doubleUp.losses || 0;

    const embedColor = getRankColor(rankedRank); // Assume this function exists

    let highestRankField, lowestRankField;
    if (getRankIndex(rankedRank) >= getRankIndex(doubleRank)) {
      highestRankField = {
        name: `Ranked TFT: ${rankedRank} ${rankedDivision} ${rankedLp} LP`,
        value: calculateWR(rankedWins, rankedLosses) || "\u200b",
        inline: false,
      };
      lowestRankField = {
        name: `Double Up: ${doubleRank} ${doubleDivision} ${doubleLp} LP`,
        value: calculateWR(doubleWins, doubleLosses) || "\u200b",
        inline: false,
      };
    } else {
      highestRankField = {
        name: `Double Up: ${doubleRank} ${doubleDivision} ${doubleLp} LP`,
        value: calculateWR(doubleWins, doubleLosses) || "\u200b",
        inline: false,
      };
      lowestRankField = {
        name: `Ranked TFT: ${rankedRank} ${rankedDivision} ${rankedLp} LP`,
        value: calculateWR(rankedWins, rankedLosses) || "\u200b",
        inline: false,
      };
    }

    const rankedImage = getRankImage(rankedRank);
    const doubleImage = getRankImage(doubleRank);

    // Build embed
    const exampleEmbed = new MessageEmbed()
      .setColor(embedColor)
      .setTitle(userData.name)
      .addFields(lowestRankField, highestRankField)
      .setImage("attachment://rankedImg.png")
      .setThumbnail("attachment://double.png");

    // Respond
    await interaction.reply({
      embeds: [exampleEmbed],
      files: [
        { attachment: rankedImage, name: "rankedImg.png" },
        { attachment: doubleImage, name: "double.png" },
      ],
    });
  },
};
