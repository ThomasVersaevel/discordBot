const { SlashCommandBuilder } = require('@discordjs/builders');
const { tftKey, apiKey } = require('../config.json');
const fetch = require('node-fetch');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription('test'),
	async execute(interaction) {

		await interaction.reply('test');
	},
};