const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { convertLolName, getUserInfo, getRankedData } = require("../globals.js");
const { Chart } = "chart.js";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ranked")
    .setDescription("Shows your ranked champion winrates")
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

    // get User data from lol api
    let userData = await getUserInfo(username, tag);

    // get Ranked data from lol api
    let rankData = await getRankedData(userData.puuid);

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

    let rankedIndex = 100;
    let flexIndex = 100;

    // console.log(rankData);

    // map each item in rankData and assign the right index to each queue type.
    // RANKED_SOLO_5x5 RANKED_FLEX_SR CHERRY(arena)
    for (let i = 0; i < rankData.length; i++) {
      if (rankData[i].queueType === "RANKED_FLEX_SR") {
        flexIndex = i;
      } else if (rankData[i].queueType === "RANKED_SOLO_5x5") {
        rankedIndex = i;
      }
    }
    // WORK IN PROGRESS I GUESS
    var chart = new Chart(context, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            data: winloss,
            backgroundColor: [
              "rgba(75, 192, 192, 0.5)",
              "rgba(255, 99, 132, 0.5)",
            ],
            borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
            borderWidth: 5,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            grid: {
              display: true,
              drawBorder: true,
              drawOnChartArea: true,
              drawTicks: true,
            },
            ticks: {
              color: "#ffffff",
            },
          },
          y: {
            grid: {
              drawBorder: false,
              color: function (context) {
                if (context.tick.value > 0) {
                  return "#ffffff";
                } else if (context.tick.value < 0) {
                  return "#ffffff";
                }

                return "#ffffff";
              },
            },
            ticks: {
              color: "#ffffff",
            },
          },
        },
      },
    });

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
      .setThumbnail("attachment://solo.png");

    await interaction.reply({
      embeds: [exampleEmbed],
      files: [
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
