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
        patchNr = shortcuts['patch']; //required for data dragon
        let LLegend = `http://ddragon.leagueoflegends.com/cdn/${patchNr}/img/profileicon/${data.profileIconId}.png`
        let LLegend2 = `https://raw.communitydragon.org/latest/game/assets/loot/companions/`
        let tftlink = `https://euw1.api.riotgames.com/tft/summoner/v1/summoners/by-puuid/${puuid}?api_key=${tftKey}`
        const tftResponse = await fetch(tftlink);
        let tftData = await tftResponse.json();

        await interaction.reply("Double up data for "+username);

        let tftMatchLink = `https://europe.api.riotgames.com/tft/match/v1/matches/by-puuid/${puuid}/ids?api_key=${tftKey}&start=0&count=10`
        const tftMatchResponse = await fetch(tftMatchLink);
        let tftMatches = await tftMatchResponse.json();
        let MData;
        for (var id = 0; id < tftMatches.length; id++) { 
            let tftMatchDataLink = `https://europe.api.riotgames.com/tft/match/v1/matches/${tftMatches[id]}?api_key=${tftKey}`
            const tftMatchDataResponse = await fetch(tftMatchDataLink);
            MData = await tftMatchDataResponse.json();
            console.log(MData.info);
            if (MData.info.queue_id == 1160) { //if double up game
                // participant index for finding you in each game
                var partIndex = 0;
                for (var i = 0; i < 8; i++) {
                    if (MData.info.participants[i].puuid === puuid) {
                        partIndex = i;
                        groupId = MData.info.participants[i].partner_group_id
                    } 
                }
                for (var i = 0; i < 8; i++) {
                    if (MData.info.participants[i].partner_group_id === groupId && MData.info.participants[i].puuid !== puuid) {
                        partnerPartIndex = i;
                        partnerNameFetch = await fetch(`https://euw1.api.riotgames.com//tft/summoner/v1/summoners/by-puuid/${puuid}`)//await getUsernameFromPuuid(MData.info.participants[i].puuid);
                        partnerName = await partnerNameFetch.json()
                        console.log(partnerName.name);
                    } 
                }
                const partData = MData.info.participants[partIndex];
                const partnerPartData = MData.info.participants[partnerPartIndex];
                let outcome = partData.placement/2;
                console.log('doubleup game: '+MData.info.participants);
                exampleEmbed
                    .addField(outcome, partnerName, true);
            }
        }

        exampleEmbed        
            .addField(''+tftData.name, '\u200b', true);

        await interaction.editReply({ embeds: [exampleEmbed], 
			files: [{ attachment: LLegend, name:'LLegend.png'}]});                 
    },
};