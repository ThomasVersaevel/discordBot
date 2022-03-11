const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const fs = require("fs");
const { apiKey } = require('../config.json');
const shortcuts  = require('../api-shortcuts.json');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
		.setName('aram')
		.setDescription('Shows your aram stats')
        .addStringOption(option =>
			option.setName('lolname')
				.setDescription('Summoner Name')
				.setRequired(true)),
    async execute(interaction) {

        let username = interaction.options.getString('lolname');
        if (username === 'reign') { //kevin simpelmaker
            username = 'reıgn';
        } else if (username === 'me') {
            const id = interaction.member.id;
            username = shortcuts[id];
        }
        // ## obtain summoner info ##
        const sumLink = `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${username}?api_key=${apiKey}`
		const sumResponse = await fetch(sumLink);
        let sumData = await sumResponse.json();
        const puuid = sumData.puuid; // id of user
        // ## obtain 20 match IDs (default) ##
        const matchLink = `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?api_key=${apiKey}`
		const matchIdResponse = await fetch(matchLink);
		let matchIdData = await matchIdResponse.json();
        console.log(matchIdResponse);


        // ## From here its the reply ##
        patchNr = shortcuts['patch'];
        let icon = `http://ddragon.leagueoflegends.com/cdn/${patchNr}/img/profileicon/${sumData.profileIconId}.png`
        await interaction.reply("Gathering data, please wait.");

        var exampleEmbed = new MessageEmbed() // empty field .addField('\u200b', '\u200b')
            .setColor('#ffffff')
            .setTitle(sumData.name)
            .addField('Aram history', '\u200b', false)
            .setThumbnail('attachment://icon.png');
   
        var idNr = 1;
        // ## obtain match info from 20 IDs ##
        for (var id = 0; id < matchIdData.length; id++) { //for in uses id as an iterator thus ddo data[id]
            
            let tempLink = `https://europe.api.riotgames.com/lol/match/v5/matches/${matchIdData[id]}?api_key=${apiKey}`
		    const matchResponse = await fetch(tempLink);
		    let matchData = await matchResponse.json();
            // ## check only for ARAM ##
            if (matchData.info.gameMode === 'ARAM') {
                //console.log('found aram match');
                

                var index = 0;
                for (var i = 0; i < 10; i++) {
                    if (matchData.info.participants[i].puuid === puuid) {
                        index = i;
                    }
                }
                const partData = matchData.info.participants[index];

                if( matchData.info.participants[index].win ) {
                    outcome = ':green_circle:';
                } else {
                    outcome = ':red_circle:';
                }
                // console.log(matchData);
                exampleEmbed
                    .addField(outcome+' Match '+ parseInt(idNr++), 
                    partData.championName + " " + partData.kills+"/"+partData.deaths+"/"+partData.assists, true);
            }
        }
        await interaction.followUp({ embeds: [exampleEmbed], 
            files: [{ attachment: icon,
            name:'icon.png'}] });

        
    }
}