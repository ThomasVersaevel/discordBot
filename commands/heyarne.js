const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const shortcuts = require('../api-shortcuts.json');
const fetch = require('node-fetch');
const { apiKey } = require('../config.json');
const { convertLolName } = require('../globals.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('heyarne')
        .setDescription('Zou jij haar doen?'),
    async execute(interaction) {


        i = 0;
        await interaction.reply('@ChiliConArne')
        gifjes = [`https://media.giphy.com/media/Bzzh5R7AhykkutEOOb/giphy.gif`, `https://media.giphy.com/media/duRh726qABHZBwg1hJ/giphy.gif`, `https://media.giphy.com/media/WPtb7o4Drqw00tV8dB/giphy.gif`, `https://media.giphy.com/media/UuxG5u33mYn83F8Tbk/giphy.gif`, `https://media.giphy.com/media/mA1DOG3wSZX04Q1UBQ/giphy.gif`, `https://media.giphy.com/media/U5IlkmcUVN48znFUj8/giphy.gif`, `https://tenor.com/view/bye-salute-middle-finger-so-long-fuck-off-gif-17244340`, `https://tenor.com/view/sarah-cameron-gif-23495266`, `https://tenor.com/view/obx-pogue-blonde-sarah-cameron-gif-23934808`, `https://tenor.com/view/laughing-madelyn-cline-sarah-cameron-outer-banks-haha-gif-16882097`, `https://tenor.com/view/sarah-cameron-gif-23495271`, `https://tenor.com/view/sarah-cameron-gif-23495267`, `https://tenor.com/view/madelyn-cline-obx-outer-banks-gif-23065265`];
        if (i > 5) return;
        spam();

        function spam() {

            interaction.editReply({
                content: interaction.content + gifjes[i]
            });
            setTimeout(spam(), 1200); // 1.2 seconds
            i++
        }
    }
}