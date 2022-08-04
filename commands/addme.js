const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const shortcuts  = require('../api-shortcuts.json');
const fetch = require('node-fetch');
const { apiKey } = require('../config.json');
const { convertLolName,  } = require('../globals.js');
const fs = require('fs');
const { short } = require('webidl-conversions');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addme')
		.setDescription('Adds your summoner name to the \'me\' list')
        .addStringOption(option =>
			option.setName('lolname')
				.setDescription('Summoner Name')
				.setRequired(true)),
    async execute(interaction) {

        let username = interaction.options.getString('lolname');

        const link = `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${username}?api_key=${apiKey}`
		const response = await fetch(link);
		let data = await response.json();
        //console.log(data);
        patchNr = shortcuts['patch'];
        let icon = `http://ddragon.leagueoflegends.com/cdn/${patchNr}/img/profileicon/${data.profileIconId}.png`

        var exampleEmbed = new MessageEmbed()
        .setColor('blue')
        .setTitle(data.name)
        .setThumbnail('attachment://icon.png');

        // json reading and writing
        let userId = interaction.member.id;

        fs.readFile('./api-shortcuts.json', "utf8", (err, shortcuts) => {
            if (err) {
              console.log("File read failed:", err);
              return;
            }
            console.log("File data:", shortcuts);
        });
        //shortcutsJ = JSON.parse(shortcuts);
        if (!shortcuts.hasOwnProperty(userId)) {
            // const userObject = { userId: username+',' };
            // userEntry = JSON.stringify(userObject);
 
            shortcuts[userId] = username;
            shortcutsJ = JSON.stringify(shortcuts);
            fs.writeFile('./api-shortcuts.json', shortcutsJ, err => {
                if (err) {
                    console.log('Error writing file', err)
                } else {
                    console.log('Successfully wrote username to file')
                }
            });
        
            exampleEmbed.addField('\u200b' , 'Added '+ data.name + ' to \'me\' list', true);
        } else { // if already present
            exampleEmbed.addField('\u200b' , shortcuts[userId] + ' is already in \'me\' list for you', true);
        }

        await interaction.reply({ embeds: [exampleEmbed], 
			files: [{ attachment: icon,
			name:'icon.png'}] });           
    },
};
