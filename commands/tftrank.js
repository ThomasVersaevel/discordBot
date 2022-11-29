const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const shortcuts = require('../api-shortcuts.json');
const fetch = require('node-fetch');
const { tftKey, apiKey } = require('../config.json');
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
        // turns out double up ranks are in league/v4
        const lolSummonerLink =  `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${username}?api_key=${apiKey}`
		const lolSummonerResponse = await fetch(lolSummonerLink);
		let lolSummonerData = await lolSummonerResponse.json();

        patchNr = shortcuts['patch']; //required for data dragon
        let tftlink = `https://euw1.api.riotgames.com/tft/summoner/v1/summoners/by-puuid/${puuid}?api_key=${tftKey}`
        const tftResponse = await fetch(tftlink);
        let tftData = await tftResponse.json();

        let tftRankedLink = `https://euw1.api.riotgames.com/tft/league/v1/entries/by-summoner/${tftData.id}?api_key=${tftKey}`
        const tftRankResponse = await fetch(tftRankedLink);
        let tftRankData = await tftRankResponse.json();
        
        let lolRankedLink = `https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${lolSummonerData.id}?api_key=${apiKey}`
        const lolRankResponse = await fetch(lolRankedLink);
        let lolRankData = await lolRankResponse.json();

        let rank = 'Unranked';
        let hyperRank = 'Unranked';
        let doubleRank = 'Unranked';
        let doubleDivision = '';
        let division = '';

        if (tftRankData.length > 1) {
            if (tftRankData[0].queueType == 'RANKED_TFT') {
                rank = tftRankData[0].tier; //ranked tft
                division = tftRankData[0].rank;
            } else if (tftRankData[1].queueType == 'RANKED_TFT') {
                rank = tftRankData[1].tier; //ranked tft	
                division = tftRankData[0].rank;
            }
            if (tftRankData[0].hasOwnProperty('ratedTier')) { //hyperrol
                hyperRank = tftRankData[0].ratedTier;
            } else if (tftRankData[1].hasOwnProperty('ratedTier')) {
                hyperRank = tftRankData[1].ratedTier;
            }
            if (lolRankData[0].queueType == 'RANKED_TFT_DOUBLE_UP') {
                doubleRank = lolRankData[0].tier; //ranked tft
                doubleDivision = lolRankData[0].rank
            } else if (lolRankData[1].queueType == 'RANKED_TFT_DOUBLE_UP') {
                doubleRank = lolRankData[1].tier; //ranked tft
                doubleDivision = lolRankData[0].rank	
            }
        } else if (tftRankData.length == 1) {
            if (tftRankData[0].queueType == 'RANKED_TFT') {
                rank = tftRankData[0].tier; //ranked tft
                division = tftRankData[0].rank;
            }
            if (tftRankData[0].hasOwnProperty('ratedTier')) { //hyperrol
                hyperRank = tftRankData[0].ratedTier;
            }
            if (lolRankData[0].queueType == 'RANKED_TFT_PAIRS') {
                doubleRank = lolRankData[0].tier; //ranked tft
                doubleDivision = lolRankData[0].rank	
            } 
        } 
        
        doubleRank = doubleRank.substring(0, 1) + doubleRank.substring(1).toLowerCase()

        if (hyperRank.toLowerCase() == 'orange') {
            hyperRank = 'Hyper';
        }
        hyperRank = hyperRank.substring(0, 1) + hyperRank.substring(1).toLowerCase();
        rank = rank.substring(0, 1) + rank.substring(1).toLowerCase();
        if (hyperRank == 'Unranked') {
            hyperEmblem = 'assets/ranked-emblems/Grey_tier.png';
        } else {
            hyperEmblem = 'assets/ranked-emblems/' + hyperRank + '_tier.png';
        }
        hyperRank = hyperRank + ' Tier';
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

        var exampleEmbed = new MessageEmbed()
            .setColor(embedColor)
            .setTitle('' + tftData.name)
            //.addField(''+tftData.name, '\u200b', true)
            .addField('Double up: ' + doubleRank + ' ' + doubleDivision, '\u200b', false)
            .addField('Rank: ' + rank + ' ' + division, '\u200b', false)
            .setImage('attachment://rankedImg.png')
            .setThumbnail('attachment://double.png')
            .setFooter({ text: 'Hyperrol rank: ' + hyperRank, iconURL: 'attachment://icon.png' });

        await interaction.reply({
            embeds: [exampleEmbed],
            files: [{ attachment: hyperEmblem, name: 'icon.png' },
            { attachment: 'assets/ranked-emblems/Emblem_' + rank + '.png', name: 'rankedImg.png' },
            { attachment: 'assets/ranked-emblems/Emblem_' + doubleRank + '.png', name: 'double.png' }
            ]
        });

    },
}
