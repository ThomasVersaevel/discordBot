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

        let colors = ["#5865f2", "#3ba55c", "#ed4245", "#4f545c"]
        let styles = ["PRIMARY", "SUCCESS", "DANGER", "SECONDARY"]
        let kingIcons = [];
        let row = new MessageActionRow();
        let row2 = new MessageActionRow();
        let row3 = new MessageActionRow();
        let rows = [];

        // create embeds
        var embedList = createEmbeds();
        rows.push(row);
        if (nrp > 4) { // max buttons per row is 5 but for color symmetry we will limit it to 4
            rows.push(row2); 
        }
        rows.push(row3)

        await interaction.reply({ // multiple embeds all with a picture for the king
            embeds: embedList,
            files: kingIcons,
            components: rows
        });
        // creates an embed and rolls traits origins and kings for each player
        function createEmbeds() {
            let eList = []
                row3.addComponents(
                    new MessageButton()
                        .setCustomId('lockin') // 'roll' + i
                        .setLabel('Lock In' )
                        .setStyle("PRIMARY"),
                    );
            // for each participant in nrPlayers we want to show a roll button, and fields for traits and king
            for (let i = 1; i <= nrp; i++) {

                let kingIcon = `assets/tft/questionmarkSquare.png`
                kingIcons.push({ attachment: kingIcon, name: 'icon' + i + '.jpg' })
                if (i < 5) {
                    row.addComponents(
                        new MessageButton()
                            .setCustomId('bb' + i) // 'roll' + i
                            .setLabel('Roll ' + i)
                            .setStyle(styles[(i-1)%4]),
                    );
                } else {
                    row2.addComponents(
                        new MessageButton()
                            .setCustomId('bb' + i) // 'roll' + i
                            .setLabel('Roll ' + i)
                            .setStyle(styles[(i-1)%4]),
                    );
                }

                var embed = new MessageEmbed()// empty: '\u200b'
                    .setColor(colors[(i-1)%4])
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
