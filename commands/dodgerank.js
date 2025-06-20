const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageAttachment } = require("discord.js");
const Canvas = require("canvas");
const { Chart } = require("chart.js");
const {
  convertLolName,
  getUserInfo,
  getMatchData,
  getMatchDetails,
} = require("../globals.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("dodgerank")
    .setDescription("Shows the ranking of best dodger in your previous game")
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
    // ## obtain 20 match IDs (default) ##
    let matchIdData = await getMatchData(puuid, 0, 1);
    //console.log(matchIdData);
    await interaction.reply("Dodges for each player in last game");

    // ## From here its the reply ##

    let matchData = await getMatchDetails(matchIdData);
    console.log(matchData.info.participants);

    var namesB = [];
    var dodgesB = [];
    var namesR = [];
    var dodgesR = [];

    for (var i = 0; i < 10; i++) {
      if (i < 5) {
        namesB.push(matchData.info.participants[i].riotIdGameName);
        dodgesB.push(
          matchData.info.participants[i].challenges.skillshotsDodged
        );
      } else {
        namesR.push(matchData.info.participants[i].riotIdGameName);
        dodgesR.push(
          matchData.info.participants[i].challenges.skillshotsDodged
        );
      }
    }
    arrayOfObjB = namesB.map(function (d, i) {
      return {
        label: d,
        data: dodgesB[i] || 0,
      };
    });
    arrayOfObjR = namesR.map(function (d, i) {
      return {
        label: d,
        data: dodgesR[i] || 0,
      };
    });

    sortedArrayOfObjB = arrayOfObjB.sort(function (a, b) {
      return b.data - a.data;
    });
    sortedArrayOfObjR = arrayOfObjR.sort(function (a, b) {
      return b.data - a.data;
    });

    let newArrayLabel = [];
    let newArrayData = [];
    sortedArrayOfObjB.forEach(function (d) {
      newArrayLabel.push(d.label);
      newArrayData.push(d.data);
    });
    sortedArrayOfObjR.forEach(function (d) {
      newArrayLabel.push(d.label);
      newArrayData.push(d.data);
    });

    // chart.js code
    const canvas = Canvas.createCanvas(1000, 750);
    const context = canvas.getContext("2d");

    Chart.defaults.font.size = 36;

    var chart = new Chart(context, {
      type: "bar",
      data: {
        labels: newArrayLabel,
        datasets: [
          {
            data: newArrayData,
            backgroundColor: [
              "#64B1E4",
              "#64B1E4",
              "#64B1E4",
              "#64B1E4",
              "#64B1E4",
              "#ea7872",
              "#ea7872",
              "#ea7872",
              "#ea7872",
              "#ea7872",
            ],
            borderColor: [
              "#009DFF",
              "#009dff",
              "#009dff",
              "#009dff",
              "#009dff",
              "#f74d47",
              "#f74d47",
              "#f74d47",
              "#f74d47",
              "#f74d47",
            ],
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
    const attachment = new MessageAttachment(
      canvas.toBuffer(),
      "dodgestats.png"
    );

    await interaction.editReply({ files: [attachment] });
  },
};
