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
                .setDescription('Number of participants (0 to 5)')
                .setRequired(true)),
    async execute(interaction) {

        let nrp = interaction.options.get('nrp').value;

        if (nrp <= 0 || nrp > 5) {
            await interaction.reply({ content: 'Invalid amount of players entered', ephemeral: true });
            return;
        }

        let tftIcon = `assets/tft/pengu.jpg`;
        let rows = [];

        // roll button (singular for now)
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('roll') // 'roll' + i
                    .setLabel('Roll')
                    .setStyle('PRIMARY'),
            );
        rows.push(row); // prep for multiple buttons


        // initial roll
        var embed = rollTraits();

        await interaction.reply({
            embeds: [embed],
            files: [{ attachment: tftIcon, name: 'icon.png' }],
            components: rows
        });

        // button response
        const filter = i => i.customId === 'roll';

        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 1500000 });

        collector.on('collect', async i => {
            console.log('Roll button on: ' + filter.customId)
            var newEmbed = rollTraits();

            await i.update({ embeds: [newEmbed] });
        });

        collector.on('end', collected => console.log(`Collected ${collected.size} items`));
        // TODO images of champions and traits
        // TODO add another player to the lobby by button
        // Super TODO add 'finished' button that gets match result and adds it to embed

        // creates an embed and rolls traits origins and kings for each player
        function rollTraits() {

            let traits = []
            let origins = []
            let kings = []

            var embed = new MessageEmbed()// empty: '\u200b'
                .setColor('#BBBBBB')
                .setTitle('Bronze Bravery Lobby')
                .setThumbnail('attachment://icon.png');
            // for each participant in nrPlayers we want to show a roll button two rows for the trait and origin and one field for the king
            for (let i = 1; i <= nrp; i++) {
                // initial version text only
                let trait = roll(tftJson.traits, traits);
                let origin = roll(tftJson.origins, origins);
                let king = roll(tftJson.champions, kings);

                // add choices to overlap list
                traits.push(trait);
                origins.push(origin);
                kings.push(king);

                embed.addFields(
                    { name: '\u200b', value: '\u200b', inline: false },
                    { name: 'Player ' + parseInt(i) + ':', value: king, inline: false },
                    { name: 'Trait:', value: trait, inline: true },
                    { name: 'Origin:', value: origin, inline: true },
                );
            }
            return embed;
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
