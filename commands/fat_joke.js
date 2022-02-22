const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('fat_joke')
		.setDescription('Replies with a fat joke.'),
	async execute(interaction) {
		await interaction.reply('Gragas is so fat, when alistar tried to headbut him he was put in a coma.');
	},
};