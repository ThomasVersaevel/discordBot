const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const shortcuts  = require('../api-shortcuts.json');
const fetch = require('node-fetch');
const { tftKey } = require('../config.json');
const {convertLolName} = require('../globals.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('doubleup')
		.setDescription('Shows your double up stats')
        .addStringOption(option =>
			option.setName('lolname')
				.setDescription('Summoner Name')
				.setRequired(true)),
    async execute(interaction) {

        let username = convertLolName(interaction.options.getString('lolname'), interaction.member.id); //uses globals

        var exampleEmbed = new MessageEmbed()
        .setColor('#ffffff')
        .setTitle('')
        //.setImage('attachment://rankedImg.png')
        .setThumbnail('attachment://icon.png');

        const link = `https://euw1.api.riotgames.com/tft/summoner/v1/summoners/by-name/${username}?api_key=${tftKey}`
		const response = await fetch(link);
		let data = await response.json();
        const puuid = data.puuid
        //console.log(data);
        patchNr = '12.7.1'; //required for data dragon
        let LLegend = `http://ddragon.leagueoflegends.com/cdn/${patchNr}/img/profileicon/${data.profileIconId}.png`
        let LLegend2 = `https://raw.communitydragon.org/latest/game/assets/loot/companions/`
        let tftlink = `https://euw1.api.riotgames.com/tft/summoner/v1/summoners/by-puuid/${puuid}?api_key=${tftKey}`
        const tftResponse = await fetch(tftlink);
        let tftData = await tftResponse.json();

        let tftMatchLink = `https://europe.api.riotgames.com/tft/match/v1/matches/by-puuid/${puuid}/ids?api_key=${tftKey}&start=0&count=10`
        const tftMatchResponse = await fetch(tftMatchLink);
        let tftMatches = await tftMatchResponse.json();
        let MData;
        for (var id = 0; id < tftMatches.length; id++) { 
            let tftMatchDataLink = `https://europe.api.riotgames.com/tft/match/v1/matches/${tftMatches[id]}?api_key=${tftKey}`
            const tftMatchDataResponse = await fetch(tftMatchDataLink);
            MData = await tftMatchDataResponse.json();
            console.log(MData.info);
            if (MData.info.queue_id == 1150) { //if double up game
                let partner = 'error';
                let outcome = 'error';
                console.log('doubleup game: '+MData.info.participants);
                exampleEmbed
                    .addField(outcome, partner, true);
            }
        }

        exampleEmbed        
            .addField(''+tftData.name, '\u200b', true);

        await interaction.followUp({ embeds: [exampleEmbed], 
			files: [{ attachment: LLegend, name:'LLegend.png'}]});                 
    },
};