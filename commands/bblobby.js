const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed, MessageActionRow, MessageButton, Events } = require('discord.js');
const shortcuts = require('../api-shortcuts.json');
const fetch = require('node-fetch');
const { apiKey } = require('../config.json');
const { convertLolName } = require('../globals.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bblobby')
        .setDescription('Creates a Bronze Bravery Lobby')
        .addIntegerOption(option =>
            option.setName('nrp')
                .setDescription('Number of participants')
                .setRequired(true)),
    async execute(interaction) {

        let nrp = interaction.options.get('nrp').value;

        if (nrp <= 0 || nrp > 8) {
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

        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

        collector.on('collect', async i => {
            

            var newEmbed = rollTraits();

            await i.update({ embeds: [newEmbed] });
        });

        collector.on('end', collected => console.log(`Collected ${collected.size} items`));
        // TODO images of champions and traits
        // TODO add another player to the lobby by button
        // TODO overlap protection
        // Super TODO add 'finished' button that gets match result and adds it to embed

        // creates an embed and rolls traits origins and kings for each player
        function rollTraits() {
            var embed = new MessageEmbed()// empty: '\u200b'
            .setColor('#BBBBBB')
            .setTitle('Bronze Bravery!')
            .setThumbnail('attachment://icon.png');
            // for each participant in nrPlayers we want to show a roll button two rows for the trait and origin and one field for the king
            for (let i = 1; i <= nrp; i++) {
                // initial version text only
                let trait = 'new trait';
                let origin = 'random origin';
                let king = 'random king';

                embed.addFields({ name: 'Player ' + parseInt(i) + ':', value: king, inline: true },
                    { name: 'Trait:', value: trait, inline: false },
                    { name: 'Origin:', value: origin, inline: false }
                );
            }
            return embed;
        }
    }
}

