const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const shortcuts = require('../api-shortcuts.json');
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
            .setColor('black')
            .setTitle('Bronze Bravery TFT rules')
            .addFields(
                { name: 'To start a lobby use the command:', value: `/bblobby *#nr players*`, inline: false },
                { name: '1: Your champion pool', value: 'You may only use champions from the rolled origin and trait.', inline: false },
                { name: '2: Champion pool additions', value: 'You add any champ obtained through the carousel, augments or loot orbs to your champion pool.', inline: false },
                { name: '3: The kings presence', value: 'You must always buy or take your king when available and they must be on the board.', inline: false },
                { name: '4: The king is rich', value: 'Your king must have the most items, this is counted in the three item slots and may be tied.', inline: false },
                { name: '5: Specifics', value: 'When you first obtain your king you dont have to sell champions with items to satisfy rule 4 and components count as full items', inline: false }
            )
            .setThumbnail('attachment://icon.png')
            .setFooter({ text: 'Do this in ranked, pussy' });

        await interaction.reply({
            embeds: [exampleEmbed],
            files: [{
                attachment: icon,
                name: 'icon.png'
            }]
        });
    },
};