const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const shortcuts  = require('../api-shortcuts.json');
const fetch = require('node-fetch');
const { apiKey } = require('../config.json');
const { convertLolName } = require('../globals.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bronzebravery')
		.setDescription('The rules for Bronze Bravery TFT'),
    async execute(interaction) {
        let icon = `assets/tft/pengu.jpg`;
        
        var exampleEmbed = new MessageEmbed()
            .setColor('brown')
            .setTitle('Bronze Bravery TFT rules')
            .addField('Use the website:', `https://www.ultimate-bravery.net/tft`,false)
            .addField('1: No overlap', 'All players must roll until no synergies or kings overlap.',false)
            .addField('2: Your champion pool', 'You may only use champions from the rolled origin and trait.',false)
            .addField('3: Champion pool additions', 'You add any champ obtained through the carousel, augments or loot orbs to your champion pool.',false)
            .addField('4: The kings presence', 'You must always buy or take your king when available and they must be on the board.',false)
            .addField('5: The king is rich', 'Your king must have the most items, this is counted in the three item slots and may be tied.',false)
            .addField('6: Specifics', 'When you first obtain your king you dont have to sell champions with items to satisfy rule 5 and components count as full items',false)
            .setThumbnail('attachment://icon.png')
            .setFooter('Do this in ranked, pussy');


        await interaction.reply({ embeds: [exampleEmbed], 
			files: [{ attachment: icon,
			name:'icon.png'}] });
                
    },
};