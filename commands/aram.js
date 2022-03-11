const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const fs = require("fs");
const { apiKey } = require('../config.json');
const shortcuts  = require('../api-shortcuts.json');
const fetch = require('node-fetch');
const { LolApi, Constants } = require('twisted');

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
        const sumLink = `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${username}?type=normal&api_key=${apiKey}`
		const sumResponse = await fetch(sumLink);
        let sumData = await sumResponse.json();
        const puuid = sumData.puuid; // id of user
        // ## obtain 20 match IDs (default) ##
        const matchLink = `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?api_key=${apiKey}`
		const matchIdResponse = await fetch(matchLink);
		let matchIdData = await matchIdResponse.json();
        //console.log(matchIdData);


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
        var startIndex = 0;
        // ## obtain match info from 20 IDs ##
        for (var id = 0; id < matchIdData.length; id++) { //for in uses id as an iterator thus ddo data[id]
            
            let tempLink = `https://europe.api.riotgames.com/lol/match/v5/matches/${matchIdData[id]}?api_key=${apiKey}`
		    const matchResponse = await fetch(tempLink);
		    let matchData = await matchResponse.json();
            //console.log(matchData.info);
            // ## check only for ARAM ##
            if (matchData.info.gameMode === 'ARAM' && idNr < 22) { //ensure no more than 22 matched displayed
                //console.log('found aram match');
                
                // participant index for finding you in each game
                var partIndex = 0;
                for (var i = 0; i < 10; i++) {
                    if (matchData.info.participants[i].puuid === puuid) {
                        partIndex = i;
                    }
                }
                const partData = matchData.info.participants[partIndex];

                outcome = matchData.info.participants[partIndex].win ? ':green_circle:' : ':red_circle:';

                let timestampMin = matchData.info.gameDuration / .6;
                let timestamp = timestampMin.toString();
                if (timestamp.length < 4) {
                    timestamp = 0+timestamp; 
                }
                let seconds = parseInt(timestamp.substring(2,4))/100 * 60;
                let secondsString = seconds.toString().replace('.', '0');
                let stamp = timestamp.substring(0,2)+":"+ secondsString.substring(0,2);
                let kda = partData.kills+"/"+partData.deaths+"/"+partData.assists;

                exampleEmbed
                    .addField(outcome+" " + " " + kda, 
                    partData.championName+"  "+stamp, true);
            }
            if (idNr < 22 && id == 19) { //method to keep looking for 20 aram games
                startIndex += 20;
                if (startIndex < 21) {
                    id = 0;
                    // ## obtain 20 more match IDs ##
                    const matchLink = `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=${startIndex}&api_key=${apiKey}`
                    const matchIdResponse = await fetch(matchLink);
                    matchIdData = await matchIdResponse.json();
                    console.log('restarting at '+startIndex);
                }            
            }
        }

        if ((idNr-1) % 3 == 1) {
            exampleEmbed
                .addField('\u200b', '\u200b', true);
        } else if ((idNr-1) % 3 == 2) {
            exampleEmbed
                .addField('\u200b', '\u200b', true)
                .addField('\u200b', '\u200b', true);
        }

        await interaction.followUp({ embeds: [exampleEmbed], 
            files: [{ attachment: icon,
            name:'icon.png'}] });

        
    }
}