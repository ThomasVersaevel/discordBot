const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const { apiKey } = require('../config.json');
const shortcuts  = require('../api-shortcuts.json');
const fetch = require('node-fetch');
const {convertLolName, fetchApiEndpoint} = require('../globals.js');

module.exports = {
    data: new SlashCommandBuilder()
		.setName('aram')
		.setDescription('Shows your aram stats')
        .addStringOption(option =>
			option.setName('lolname')
				.setDescription('Summoner Name')
				.setRequired(true)),
    async execute(interaction) {

        let username = convertLolName(interaction.options.getString('lolname'), interaction.member.id); //uses globals

        // ## obtain summoner info ##
        //let sumData = await fetchApiEndpoint(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${username}?type=normal&api_key=${apiKey}`)
	
        const link = `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${username}?api_key=${apiKey}`
		const response = await fetch(link);
		let sumData = await response.json();

        const puuid = sumData.puuid; // id of user
        // ## obtain 20 match IDs (default) ##
        const matchLink = `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?api_key=${apiKey}&queue=450&start=0&count=21`
		const matchIdResponse = await fetch(matchLink);
		let matchIdData = await matchIdResponse.json();
        //console.log(matchIdData);

        // ## From here its the reply ##
        patchNr = shortcuts['patch'];
        let icon = `http://ddragon.leagueoflegends.com/cdn/${patchNr}/img/profileicon/${sumData.profileIconId}.png`
        let initReply = await interaction.reply("Gathering data, please wait.");
       
        var exampleEmbed = new MessageEmbed() // empty field .addField('\u200b', '\u200b')
            .setColor('#ffffff')
            .setTitle(sumData.name)
            .addField('Aram history', '\u200b', false)
            .setThumbnail('attachment://icon.png');
   
        var idNr = 1;
        var startIndex = 0;
        // ## obtain match info from 20 IDs ##
        for (var id = 0; id < matchIdData.length; id++) { //for in uses id as an iterator thus do data[id]
            
            let tempLink = `https://europe.api.riotgames.com/lol/match/v5/matches/${matchIdData[id]}?api_key=${apiKey}`
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

        if ((idNr-1) % 3 == 1) {
            exampleEmbed
                .addField('\u200b', '\u200b', true);
        } else if ((idNr-1) % 3 == 2) {
            exampleEmbed
                .addField('\u200b', '\u200b', true)
                .addField('\u200b', '\u200b', true);
        }
        
        await interaction.editReply( {content: '\u200b', embeds: [exampleEmbed], 
            files: [{ attachment: icon,
            name:'icon.png'}] });
    }
}