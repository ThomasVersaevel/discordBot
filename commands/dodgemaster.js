const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const fs = require("fs");
const { apiKey } = require('../config.json');
const shortcuts  = require('../api-shortcuts.json');
const fetch = require('node-fetch');
const { LolApi, Constants } = require('twisted');
const {convertLolName} = require('../globals.js');

module.exports = {
    data: new SlashCommandBuilder()
		.setName('dodgemaster')
		.setDescription('Shows the amount of skillshots you dodged last game')
        .addStringOption(option =>
			option.setName('lolname')
				.setDescription('Summoner Name')
				.setRequired(true)),
    async execute(interaction) {

        let username = convertLolName(interaction.options.getString('lolname'), interaction.member.id); //uses globals
        
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
       // await interaction.reply("Gathering data, please wait.");
                   
        let tempLink = `https://europe.api.riotgames.com/lol/match/v5/matches/${matchIdData[0]}?api_key=${apiKey}`
		const matchResponse = await fetch(tempLink);
		let matchData = await matchResponse.json();
        //console.log(matchData.info);
        // participant index for finding you in each game
        var partIndex = 0;
        for (var i = 0; i < 10; i++) {
            if (matchData.info.participants[i].puuid === puuid) {
                partIndex = i;
            }
        }
        //console.log(matchData.info.teams[0]);
        const partData = matchData.info.participants[partIndex];
        var exampleEmbed = new MessageEmbed()
            .setColor('#3FFFFF')
            .setTitle(username)
            .addField('Played '+partData.championName, 'Dodged '+partData.challenges.skillshotsDodged+' skillshots last game\n'
                + 'Hit '+partData.challenges.skillshotsHit+' skillshots last game', true)
            .setThumbnail('attachment://icon.png');
        await interaction.reply({ embeds: [exampleEmbed], 
            files: [{ attachment: icon,
            name:'icon.png'}] });                
    },
};