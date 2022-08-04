const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const fs = require("fs");
const { apiKey } = require('../config.json');
const shortcuts  = require('../api-shortcuts.json');
const aramwl  = require('../winslosses.json');
const fetch = require('node-fetch');
const Canvas = require('canvas');
const { Chart } = require('chart.js');
const { Util } = require('util');
const {convertLolName} = require('../globals.js');

module.exports = {
    data: new SlashCommandBuilder()
		.setName('aramwr')
		.setDescription('Shows your lifetime aram wins and loses')
        .addStringOption(option =>
			option.setName('lolname')
				.setDescription('Summoner Name')
				.setRequired(true)),
    async execute(interaction) {

       let username = convertLolName(interaction.options.getString('lolname'), interaction.member.id); //uses globals
       const link = `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${username}?api_key=${apiKey}`
       const response = await fetch(link);
       let sumData = await response.json();
       // ## From here its the reply ##
        patchNr = shortcuts['patch'];
        let icon = `http://ddragon.leagueoflegends.com/cdn/${patchNr}/img/profileicon/${sumData.profileIconId}.png`
        await interaction.reply("ARAM wins and losses for "+username);

        console.log(username);
        wins = aramwl[''+username].wins;
        losses = aramwl[''+username].losses;
        console.log(wins + ' ' + losses);
        // chart.js code
        var winloss = [wins, losses];
        var labels = ['wins', 'losses'];

        const canvas = Canvas.createCanvas(1000, 750);
		const context = canvas.getContext('2d');

        Chart.defaults.font.size = 36;

        var chart = new Chart(context, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    
                    data: winloss,
                    backgroundColor: [
                        "rgba(75, 192, 192, 0.5)",
                        "rgba(255, 99, 132, 0.5)"
                        ],
                    borderColor: [
                        "rgba(75, 192, 192, 1)",
                        "rgba(255, 99, 132, 1)"
                    ],
                    borderWidth: 5    
                }]
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: 'Total games: '+ (wins+losses) + '    Winrate: ' + (100 * (wins/(losses+wins))).toFixed(2) + '%',
                        color: '#ffffff'
                    },
                    legend: {
                        display: false
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
                            color: '#ffffff'
                        }
                    },
                    y: {
                      grid: {
                        drawBorder: false,
                        color: function(context) {
                                if (context.tick.value > 0) {
                                return '#ffffff';
                            } else if (context.tick.value < 0) {
                                return '#ffffff';
                            } 
              
                            return '#ffffff';
                            },
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
        interaction.deleteReply();
    }
}