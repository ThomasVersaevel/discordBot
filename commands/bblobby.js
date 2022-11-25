const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed, MessageActionRow, MessageButton, Events } = require('discord.js');
const shortcuts = require('../api-shortcuts.json');
const fetch = require('node-fetch');
const { apiKey } = require('../config.json');
const { convertLolName } = require('../globals.js');
const tftJson = require('../tftset8.json');
const { random } = require('lodash');

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
        let row = new MessageActionRow()

        // initial roll
        var embedList = rollTraits();

        await interaction.reply({ // multiple embeds all with a picture for the king
            embeds: embedList,
            files: kingIcons,
            components: [row]
        });

        
        // TODO images of champions and traits Needs embed per player
        // TODO add another player to the lobby by button
        // Super TODO add 'finished' button that gets match result and adds it to embed

        // creates an embed and rolls traits origins and kings for each player
        function rollTraits() {

            let traits = []
            let origins = []
            let kings = []
            let eList = []

            // for each participant in nrPlayers we want to show a roll button, a king and the traits in one embed per player
            for (let i = 1; i <= nrp; i++) {
                // initial version text only
                let trait = roll(tftJson.traits, traits);
                let origin = roll(tftJson.origins, origins);
                let king = roll(tftJson.champions, kings)

                // add choices to overlap list
                traits.push(trait);
                origins.push(origin);
                kings.push(king);

                let kingIcon = `assets/tftset8/` + king + `.jpg`;
                kingIcons.push({ attachment: kingIcon, name: 'icon' + i + '.jpg' })


                    row.addComponents(
                        new MessageButton()
                            .setCustomId('bb'+i) // 'roll' + i
                            .setLabel('Roll ' + i)
                            .setStyle('PRIMARY'),
                    );
                //rows.push(row); // prep for multiple buttons

                var embed = new MessageEmbed()// empty: '\u200b'
                    .setColor('#BBBBBB')
                    .setTitle('Player ' + parseInt(i))
                    .setThumbnail('attachment://icon' + i + '.jpg')
                    .addFields(
                        { name: 'Trait:', value: trait, inline: true },
                        { name: 'Origin:', value: origin, inline: true },
                        { name: 'King' + ':', value: king, inline: true },
                    )
                eList.push(embed);
            }
            return eList;
        }

        function roll(list, overlaplist) {
            while (true) { // don't allow overlap
                choice = list[random(0, list.length - 1)];
                if (!overlaplist.includes(choice)) {
                    return choice;
                }
            }
        }
    }
}
