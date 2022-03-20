const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const fs = require("fs");
const { apiKey } = require('../config.json');
const shortcuts  = require('../api-shortcuts.json');
const fetch = require('node-fetch');
const Canvas = require('canvas');
const { Chart } = require('chart.js');

module.exports = {
    data: new SlashCommandBuilder()
		.setName('lineplot')
		.setDescription('Shows your aram wins and loses')
        .addStringOption(option =>
			option.setName('lolname')
				.setDescription('Summoner Name')
				.setRequired(true)),
    async execute(interaction) {

        let username = interaction.options.getString('lolname');
        if (username === 'reign') { //kevin simpelmaker
            username = 'reıgn';
        } else if (username === 'kokoala') {
            username = 'kôkoala';
        }
        else if (username === 'me') {
            const id = interaction.member.id;
            username = shortcuts[id];
        }
        username = username[0].toUpperCase() + username.substring(1);
        // ## obtain summoner info ##
        const sumLink = `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${username}?type=normal&api_key=${apiKey}`
		const sumResponse = await fetch(sumLink);
        let sumData = await sumResponse.json();
        const puuid = sumData.puuid; // id of user
        // ## obtain 20 match IDs (default) ##
        const matchLink = `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?api_key=${apiKey}&start=0&count=1`
		const matchIdResponse = await fetch(matchLink);
		let matchIdData = await matchIdResponse.json();
        //console.log(matchIdData);


        // ## From here its the reply ##
        patchNr = shortcuts['patch'];
        let icon = `http://ddragon.leagueoflegends.com/cdn/${patchNr}/img/profileicon/${sumData.profileIconId}.png`
        await interaction.reply("Gold over time for "+username+"'s last game");
        //interaction.deferReply();

        // var exampleEmbed = new MessageEmbed() // empty field .addField('\u200b', '\u200b')
        //     .setColor('#4e79a7')
        //     .setTitle(sumData.name)
        //     .addField('Aram wins and losses', '\u200b', false)
        //     .setThumbnail('attachment://icon.png')
        //     .setImage('attachment://canvas.png');
   
        var idNr = 1;
        var startIndex = 0;

        var wins = 0;
        var losses = 0;

        // ## obtain match info ##
        let tempLink = `https://europe.api.riotgames.com/lol/match/v5/matches/${matchIdData[0]}/timeline?api_key=${apiKey}`
		const matchResponse = await fetch(tempLink);
		let matchData = await matchResponse.json();
        console.log(matchData.info.frames[0].participantFrames['1'].totalGold); // here you get frames wich is an array by timestamps
               

        var blueTeamGold = [];
        var redTeamGold = [];
        var time = [];

        for (var i = 0; i < matchData.info.frames.length; i++) {
            var bGold = 0;
            var rGold = 0;
            for (var j = 1; j < 11; j++) { // loop through all players
                if (j < 6) {
                    bGold += matchData.info.frames[i].participantFrames[j.toString()].totalGold;
                } else {
                    bGold -= matchData.info.frames[i].participantFrames[j.toString()].totalGold;
                }
            }
            blueTeamGold.push(bGold); 
            redTeamGold.push(rGold);
            time.push(Math.round(matchData.info.frames[i].timestamp/60000));
        }

        // chart.js code
        const canvas = Canvas.createCanvas(1000, 750);
		const context = canvas.getContext('2d');

        Chart.defaults.font.size = 36;

        var chart = new Chart(context, {
            type: 'line',
            data: {
                labels: time,
                datasets: [{
                    data: blueTeamGold,
                    fill: true,
                    backgroundColor: [
                        "rgba(39, 148, 245, 0.55)"
                        ],
                    borderColor: [
                        "rgba(15, 83, 255, 1)"
                    ],
                    borderWidth: 5    
                },
                {
                    data: redTeamGold,
                    fill: true,
                    backgroundColor: [
                        "rgba(221, 27, 27, 0.55)"
                        ],
                    borderColor: [
                        "rgba(221, 27, 27, 1)"
                    ],
                    borderWidth: 5    
                }]
            },
            options: {
                plugins: {
                    legend: {
                        display: false
                    },
                },
                scales: {

                    x:  {
                        display: false,
                        grid: {
                            display: true,
                            drawBorder: true,
                            drawOnChartArea: true,
                            drawTicks: true,

                        },
                        ticks: {
                            color: '#ffffff',
                            autoSkip: true,
                           // maxTicksLimit: 2
                        }
                    },
                    y:  {
                        beginAtZero: true,
                        grid: {
                            drawBorder: false
                        },
                        ticks: {
                            color: '#ffffff'
                        }
                    }
                }
            }
        });  

        const background = await Canvas.loadImage('./assets/howlingAbyss.png');
        const chartImg = await Canvas.loadImage(chart.toBase64Image()); //this works better than JSON.stringify
        context.drawImage(background, 0, 0, canvas.width, canvas.height);
	    // Move the image downwards vertically and constrain its height to 200, so that it's square
	    context.drawImage(chartImg, 0, 0, canvas.width, canvas.height);  
        const attachment = new MessageAttachment(canvas.toBuffer()); 
  
        await interaction.followUp({ files: [attachment] });
    }
}