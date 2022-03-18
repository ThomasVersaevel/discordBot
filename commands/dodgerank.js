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
		.setName('dodgerank')
		.setDescription('Shows the ranking of best dodger in your previous game')
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
        await interaction.reply("Dodges for each player in last game");

        
        // ## From here its the reply ##
        patchNr = shortcuts['patch'];
        let icon = `http://ddragon.leagueoflegends.com/cdn/${patchNr}/img/profileicon/${sumData.profileIconId}.png`
       // await interaction.reply("Gathering data, please wait.");
                   
        let tempLink = `https://europe.api.riotgames.com/lol/match/v5/matches/${matchIdData[0]}?api_key=${apiKey}`
		const matchResponse = await fetch(tempLink);
		let matchData = await matchResponse.json();
        //console.log(matchData.info);

        var names = [];
        var dodges = [];
        var partIndex = 0;
        for (var i = 0; i < 10; i++) {
            names.push(matchData.info.participants[i].summonerName);
            dodges.push(matchData.info.participants[i].challenges.skillshotsDodged);
        }
        console.log(names);

         // chart.js code 
         const canvas = Canvas.createCanvas(1000, 750);
         const context = canvas.getContext('2d');
 
         Chart.defaults.font.size = 36;
 
         var chart = new Chart(context, {
             type: 'bar',
             data: {
                 labels: names,
                 datasets: [{
                     
                     data: dodges,
                     backgroundColor: [
                         "#64B1E4",
                         "#64B1E4",
                         "#64B1E4",
                         "#64B1E4",
                         "#64B1E4",
                         "#E89D99",
                         "#E89D99",
                         "#E89D99",
                         "#E89D99",
                         "#E89D99"
                         ],
                     borderColor: [
                         "009DFF",
                         "009dff",
                         "009dff",
                         "009dff",
                         "009dff",
                         "ff0c00",
                         "ff0c00",
                         "ff0c00",
                         "ff0c00",
                         "ff0c00"
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
    },
};