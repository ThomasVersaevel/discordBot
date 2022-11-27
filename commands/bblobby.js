const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed, MessageActionRow, MessageButton, Events } = require('discord.js');
const shortcuts = require('../api-shortcuts.json');
const fetch = require('node-fetch');
const { apiKey } = require('../config.json');
const { convertLolName } = require('../globals.js');
const tftJson = require('../tftset8.json');
const { random } = require('lodash');

// ##### This command only creates the embeds for each player with the roll buttons the event handles the rolling
module.exports = {
    data: new SlashCommandBuilder()
        .setName('bblobby')
        .setDescription('Creates a Bronze Bravery Lobby')
        .addIntegerOption(option =>
            option.setName('nrp')
                .setDescription('Number of participants (0 to 8)')
                .setRequired(true)),
    async execute(interaction) {

        let nrp = interaction.options.get('nrp').value;

        if (nrp <= 0 || nrp > 8) {
            await interaction.reply({ content: 'Invalid amount of players entered', ephemeral: true });
            return;
        }

        let kingIcons = [];
        let row = new MessageActionRow();
        let rows = [];
        let row2 = new MessageActionRow();

        // create embeds
        var embedList = createEmbeds();
        rows.push(row);
        if (nrp > 5) { // max buttons per row is 5
            rows.push(row2);
        }

        await interaction.reply({ // multiple embeds all with a picture for the king
            embeds: embedList,
            files: kingIcons,
            components: rows
        });

        // creates an embed and rolls traits origins and kings for each player
        function createEmbeds() {
            let eList = []

            // for each participant in nrPlayers we want to show a roll button, and fields for traits and king
            for (let i = 1; i <= nrp; i++) {

                let kingIcon = `assets/tft/questionmarkSquare.png`
                kingIcons.push({ attachment: kingIcon, name: 'icon' + i + '.jpg' })
                if (i < 6) {
                    row.addComponents(
                        new MessageButton()
                            .setCustomId('bb' + i) // 'roll' + i
                            .setLabel('Roll ' + i)
                            .setStyle('PRIMARY'),
                    );
                } else {
                    row2.addComponents(
                        new MessageButton()
                            .setCustomId('bb' + i) // 'roll' + i
                            .setLabel('Roll ' + i)
                            .setStyle('PRIMARY'),
                    );
                }

                var embed = new MessageEmbed()// empty: '\u200b'
                    .setColor('#BBBBBB')
                    .setTitle('Player ' + parseInt(i))
                    .setThumbnail('attachment://icon' + i + '.jpg')
                    .addFields(
                        { name: 'Origin:', value: '\u200b', inline: true },
                        { name: 'Trait:', value: '\u200b', inline: true },
                        { name: 'King' + ':', value: '\u200b', inline: true },
                    )
                eList.push(embed);
            }
            return eList;
        }
    }
}
