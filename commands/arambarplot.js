const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageAttachment } = require("discord.js");
const { apiKey } = require("../config.json");
const shortcuts = require("../api-shortcuts.json");
const fetch = require("node-fetch");
const Canvas = require("canvas");
const { Chart } = require("chart.js");
const { convertLolName, getUserInfo } = require("../globals.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("arambarplot")
    .setDescription(
      "Shows your aram wins and loses over the last 20 games in a bar plot"
    )
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

    // ## obtain summoner info ##
    const userData = await getUserInfo(username, tag);
    const puuid = userData.puuid; // id of user

    // ## obtain 20 match IDs (default) for only aram queue 450##
    const matchLink = `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?api_key=${apiKey}&queue=450`;
    const matchIdResponse = await fetch(matchLink);
    let matchIdData = await matchIdResponse.json();

    // ## From here its the reply ##
    await interaction.reply(
      "ARAM wins and losses over the last 20 games for " + username
    );

    var idNr = 1;

    var wins = 0;
    var losses = 0;

    // ## obtain match info from 20 IDs ##
    for (var id = 0; id < matchIdData.length; id++) {
      //for in uses id as an iterator thus ddo data[id]

      let tempLink = `https://europe.api.riotgames.com/lol/match/v5/matches/${matchIdData[id]}?api_key=${apiKey}`;
      const matchResponse = await fetch(tempLink);
      let matchData = await matchResponse.json();
      //console.log(matchData.info);
      // ## check only for ARAM ##
      //console.log('found aram match');

      // participant index for finding you in each game
      var partIndex = 0;
      for (var i = 0; i < 10; i++) {
        if (matchData.info.participants[i].puuid === puuid) {
          partIndex = i;
        }
      }
      const partData = matchData.info.participants[partIndex];

      matchData.info.participants[partIndex].win ? wins++ : losses++;

      idNr++;
    }

    // chart.js code
    var winloss = [wins, losses];
    var labels = ["wins", "losses"];

    const canvas = Canvas.createCanvas(1000, 750);
    const context = canvas.getContext("2d");

    Chart.defaults.font.size = 36;

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

    const background = await Canvas.loadImage("./assets/howlingAbyss.png");
    const chartImg = await Canvas.loadImage(chart.toBase64Image()); //this works better than JSON.stringify
    context.drawImage(background, 0, 0, canvas.width, canvas.height);
    // Move the image downwards vertically and constrain its height to 200, so that it's square
    context.drawImage(chartImg, 0, 0, canvas.width, canvas.height);
    const attachment = new MessageAttachment(canvas.toBuffer());

    await interaction.editReply({ files: [attachment] });
  },
};
