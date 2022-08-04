const { SlashCommandBuilder } = require('@discordjs/builders');
const { aramupdater } = require('../events/aramUpdate.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription('test'),
	async execute(interaction) {
		
		await interaction.reply('test');
	},
};