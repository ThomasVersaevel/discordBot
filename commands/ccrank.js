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
    .setName("ccrank")
    .setDescription("Shows the time CCing others")
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
    const puuid = userData.puuid;
    // ## obtain 20 match IDs (default) ##
    const matchLink = `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?api_key=${apiKey}&start=0&count=1`;
    const matchIdResponse = await fetch(matchLink);
    const matchIdData = await matchIdResponse.json();
    //console.log(matchIdData);
    await interaction.reply("Time CCing others in seconds from last game");

    // await interaction.reply("Gathering data, please wait.");

    let tempLink = `https://europe.api.riotgames.com/lol/match/v5/matches/${matchIdData[0]}?api_key=${apiKey}`;
    const matchResponse = await fetch(tempLink);
    let matchData = await matchResponse.json();
    //console.log(matchData.info);

    var namesB = [];
    var dodgesB = [];
    var namesR = [];
    var dodgesR = [];

    for (var i = 0; i < 10; i++) {
      if (i < 5) {
        namesB.push(matchData.info.participants[i].summonerName);
        dodgesB.push(matchData.info.participants[i].timeCCingOthers);
      } else {
        namesR.push(matchData.info.participants[i].summonerName);
        dodgesR.push(matchData.info.participants[i].timeCCingOthers);
      }
    }
    const arrayOfObjB = namesB.map(function (d, i) {
      return {
        label: d,
        data: dodgesB[i] || 0,
      };
    });
    const arrayOfObjR = namesR.map(function (d, i) {
      return {
        label: d,
        data: dodgesR[i] || 0,
      };
    });

    const sortedArrayOfObjB = arrayOfObjB.sort(function (a, b) {
      return b.data - a.data;
    });
    const sortedArrayOfObjR = arrayOfObjR.sort(function (a, b) {
      return b.data - a.data;
    });

    const newArrayLabel = [];
    const newArrayData = [];
    sortedArrayOfObjB.forEach(function (d) {
      newArrayLabel.push(d.label);
      newArrayData.push(d.data);
    });
    sortedArrayOfObjR.forEach(function (d) {
      newArrayLabel.push(d.label);
      newArrayData.push(d.data);
    });

    // for (var key in dodges) {
    //      console.log(dodges[key]);
    // }

    //console.log(names);

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
    const attachment = new MessageAttachment(canvas.toBuffer());

    await interaction.editReply({ files: [attachment] });
    //interaction.deleteReply();
  },
};
