const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const shortcuts  = require('../api-shortcuts.json');
const fetch = require('node-fetch');
const { apiKey } = require('../config.json');
const { convertLolName } = require('../globals.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lollvl')
		.setDescription('Shows your league of legends level')
        .addStringOption(option =>
			option.setName('lolname')
				.setDescription('Summoner Name')
				.setRequired(true)),
    async execute(interaction) {

        let username = convertLolName(interaction.options.getString('lolname'), interaction.member.id); //uses globals

        const link = `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${username}?api_key=${apiKey}`
		const response = await fetch(link);
		let data = await response.json();
        //console.log(data);
        patchNr = shortcuts['patch'];
        let icon = `http://ddragon.leagueoflegends.com/cdn/${patchNr}/img/profileicon/${data.profileIconId}.png`

        var exampleEmbed = new MessageEmbed()
            .setColor('blue')
            .setTitle(data.name)
            .addField('Level:' , ''+data.summonerLevel, true)

            .setThumbnail('attachment://icon.png');
        
            if (data.summonerLevel > 500) {
                exampleEmbed.setFooter('(nolife lol)');
            }

        await interaction.reply({ embeds: [exampleEmbed], 
			files: [{ attachment: icon,
			name:'icon.png'}] });
                      
    },
};