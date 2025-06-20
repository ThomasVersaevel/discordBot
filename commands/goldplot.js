const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageAttachment } = require("discord.js");
const Canvas = require("canvas");
const { Chart, LineController } = require("chart.js");
const {
  convertLolName,
  getUserInfo,
  getMatchData,
  getMatchDetails,
} = require("../globals.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("goldplot")
    .setDescription("Gold distribution over last game")
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
    let userData = await getUserInfo(username, tag);
    const puuid = userData.puuid; // id of user
    let matchIdData = await getMatchData(puuid, 0, 1);

    await interaction.reply("Gold over time for " + username + "'s last game");

    // ## obtain match info ##
    let matchData = await getMatchDetails(matchIdData);
    console.log(matchData.info.frames[0].participantFrames["1"].totalGold); // here you get frames wich is an array by timestamps

    var blueTeamGold = [];
    var redTeamGold = [];
    var time = [];

    for (var i = 0; i < matchData.info.frames.length; i++) {
      var bGold = 0;
      var rGold = 0;
      var goldThisFrame = 0;
      for (var j = 1; j < 11; j++) {
        // loop through all players
        if (
          matchData.info.frames[i].participantFrames[j.toString()].totalGold
        ) {
          if (j < 6) {
            goldThisFrame +=
              matchData.info.frames[i].participantFrames[j.toString()]
                .totalGold;
          } else {
            goldThisFrame -=
              matchData.info.frames[i].participantFrames[j.toString()]
                .totalGold;
          }
        }
      }
      if (goldThisFrame >= 0) {
        bGold = goldThisFrame;
      } else {
        rGold = goldThisFrame;
      }
      blueTeamGold.push(bGold);
      redTeamGold.push(rGold);
      time.push(Math.round(matchData.info.frames[i].timestamp / 60000));
    }
    // chart.js
    const canvas = Canvas.createCanvas(1000, 750);
    const context = canvas.getContext("2d");

    class NegativeColor extends LineController {
      draw() {
        // Call bubble controller method to draw all the points
        super.draw(arguments);

        Chart.defaults.NegativeColor = Chart.helpers.clone(Chart.defaults.line);

        // get the min and max values
        var min = Math.min.apply(null, this.chart.data.datasets[0].data);
        var max = Math.max.apply(null, this.chart.data.datasets[0].data);
        var yScale = this.getScaleForId(this.getDataset().yAxisID);

        // figure out the pixels for these and the value 0
        var top = yScale.getPixelForValue(max);
        var zero = yScale.getPixelForValue(0);
        var bottom = yScale.getPixelForValue(min);

        // build a gradient that switches color at the 0 point
        //var ctx = this.chart.chart.ctx;
        var gradient = context.createLinearGradient(0, top, 0, bottom);
        var ratio = Math.min((zero - top) / (bottom - top), 1);
        gradient.addColorStop(0, "rgba(75,192,192,0.4)");
        gradient.addColorStop(ratio, "rgba(75,192,192,0.4)");
        gradient.addColorStop(ratio, "rgba(0,0,0,0)");
        gradient.addColorStop(1, "rgba(0,0,0,0)");
        this.chart.data.datasets[0].backgroundColor = gradient;
      }
    }
    NegativeColor.defaults = LineController.defaults;
    NegativeColor.id = "negativeColor";
    Chart.register(NegativeColor);
    console.log(Chart.controllers);

    Chart.defaults.font.size = 36;

    var chart = new Chart(context, {
      type: "line",
      data: {
        labels: time,
        datasets: [
          {
            data: blueTeamGold,
            fill: true,
            backgroundColor: ["rgba(39, 148, 245, 0.55)"],
            borderColor: ["rgba(49, 102, 236, 1)"],
            borderWidth: 5,
          },
          {
            data: redTeamGold,
            fill: true,
            backgroundColor: ["rgba(221, 27, 27, 0.55)"],
            borderColor: ["rgba(221, 27, 27, 1)"],
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
            display: false,
            grid: {
              display: true,
              drawBorder: true,
              drawOnChartArea: true,
              drawTicks: true,
            },
            ticks: {
              color: "#ffffff",
              autoSkip: true,
              // maxTicksLimit: 2
            },
          },
          y: {
            beginAtZero: true,
            grid: {
              drawBorder: false,
              color: "#ffffff",
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
