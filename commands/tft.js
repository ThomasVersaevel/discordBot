const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const shortcuts  = require('../api-shortcuts.json');
const fetch = require('node-fetch');
const { apiKey } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tft')
		.setDescription('Shows your league of legends level')
        .addStringOption(option =>
			option.setName('lolname')
				.setDescription('Summoner Name')
				.setRequired(true)),
    async execute(interaction) {

        // dit moet naar een global method
        let username = interaction.options.getString('lolname');
        if (username === 'reign') { //kevin simpelmaker
            username = 'reıgn';
        } else if (username === 'kokoala') {
            username = 'kôkoala';
        } else if (username === 'me') {
           const id = interaction.member.id;
           username = shortcuts[id];
           //console.log(username);
        }
        username = username[0].toUpperCase() + username.substring(1);

        const link = `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${username}?api_key=${apiKey}`
		const response = await fetch(link);
		let data = await response.json();
        const puuid = data.puuid
        //console.log(data);
        patchNr = '12.5.1';
        let icon = `http://ddragon.leagueoflegends.com/cdn/${patchNr}/img/profileicon/${data.profileIconId}.png`

        let tftlink = `https://euw1.api.riotgames.com//tft/summoner/v1/summoners/by-puuid/${puuid}?api_key=${apiKey}`
        const tftResponse = await fetch(tftlink);
        let tftData = await tftResponse.json();
        console.log(tftData.name);

        var exampleEmbed = new MessageEmbed()
            .setColor('blue')
            .setTitle('')
            .addField('Level:' , ''+data.summonerLevel, true)

            .setThumbnail('attachment://icon.png');

        await interaction.reply({ embeds: [exampleEmbed], 
			files: [{ attachment: icon,
			name:'icon.png'}] });
                      
    },
};