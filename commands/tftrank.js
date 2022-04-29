const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const shortcuts  = require('../api-shortcuts.json');
const fetch = require('node-fetch');
const { tftKey } = require('../config.json');
const { convertLolName } = require('../globals.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tftrank')
		.setDescription('Shows your tft rank')
        .addStringOption(option =>
			option.setName('lolname')
				.setDescription('Summoner Name')
				.setRequired(true)),
    async execute(interaction) {

        let username = convertLolName(interaction.options.getString('lolname'), interaction.member.id); //uses globals
        
        const link = `https://euw1.api.riotgames.com/tft/summoner/v1/summoners/by-name/${username}?api_key=${tftKey}`
		const response = await fetch(link);
		let data = await response.json();
        const puuid = data.puuid
        //console.log(data);
        patchNr = '12.7.1'; //required for data dragon
        let icon = `http://ddragon.leagueoflegends.com/cdn/${patchNr}/img/profileicon/${data.profileIconId}.png`
        let tftlink = `https://euw1.api.riotgames.com/tft/summoner/v1/summoners/by-puuid/${puuid}?api_key=${tftKey}`
        const tftResponse = await fetch(tftlink);
        let tftData = await tftResponse.json();

        let tftRankedLink = `https://euw1.api.riotgames.com/tft/league/v1/entries/by-summoner/${tftData.id}?api_key=${tftKey}`
        const tftRankResponse = await fetch(tftRankedLink);
        let tftRankData = await tftRankResponse.json();
        
        console.log(tftRankData);
        let rank = 'Unranked';
        let hyperRank = 'Unranked';
        if (tftRankData.length > 1) {
            if (tftRankData[0].queueType == 'RANKED_TFT') {
                rank = tftRankData[0].tier; //ranked tft
            } else if (tftRankData[1].queueType == 'RANKED_TFT' ) { 
                rank = tftRankData[1].tier; //ranked tft	
            }
            if (tftRankData[0].hasOwnProperty('ratedTier')) { //hyperrol
               hyperRank = tftRankData[0].ratedTier;
            } else if (tftRankData[1].hasOwnProperty('ratedTier')) {
               hyperRank = tftRankData[1].ratedTier;
            }
        } else if (tftRankData.length == 1) {
            if (tftRankData[0].queueType == 'RANKED_TFT') {
                rank = tftRankData[0].tier; //ranked tft
            }
            else if (tftRankData[0].hasOwnProperty('ratedTier')) { //hyperrol
               hyperRank = tftRankData[0].ratedTier;
            } 
        }
        if (hyperRank.toLowerCase() == 'orange') {
            hyperRank = 'Hyper';
        }
        hyperRank = hyperRank.substring(0, 1) + hyperRank.substring(1).toLowerCase();
        rank = rank.substring(0, 1)+ rank.substring(1).toLowerCase();
        if (hyperRank == 'Unranked') {
            hyperEmblem = 'assets/ranked-emblems/Grey_tier.png';
        } else {
            hyperEmblem = 'assets/ranked-emblems/'+hyperRank+'_tier.png';
        }
        hyperRank = hyperRank+' Tier';
        var embedColor = getRankColor(rank);


        function getRankColor(rank) {
            switch (rank) {
                case 'Iron':
                    return '#615959';
                break;
                case 'Bronze':
                    return '#925235';
                break;
                case 'Silver':
                    return '#839da5';
                break;
                case 'Gold':
                    return '#dfa040'; 
                break;
                case 'Platinum':
                    return '#539591';
                break;
                case 'Diamond':
                    return '#686cdd';
                break;
                case 'Master':
                    return '#8154a6';
                break;
                case 'Grandmaster':
                    return '#f12227';
                break;
                case 'Challenger':
                    return '#fcf4e1';
                break;
                default:
                    return '#d1d1d1';
            }    
        }

        let tftMatchLink = `https://europe.api.riotgames.com/tft/match/v1/matches/by-puuid/${puuid}/ids?api_key=${tftKey}`
        const tftMatchResponse = await fetch(tftMatchLink);
        let tftMatchData = await tftMatchResponse.json();

        var exampleEmbed = new MessageEmbed()
            .setColor(embedColor)
            .setTitle('')
            .addField(''+tftData.name, '\u200b', true)
            .addField('Hyperrol rank: '+hyperRank, '\u200b', false)
            .addField('Rank: '+rank, '\u200b', false)
            .setImage('attachment://rankedImg.png')
            .setThumbnail('attachment://icon.png');

        await interaction.reply({ embeds: [exampleEmbed], 
			files: [{ attachment: hyperEmblem, name:'icon.png'},
             {attachment:'assets/ranked-emblems/Emblem_'+ rank +'.png', name:'rankedImg.png'}]
        });
                      
    },
};
