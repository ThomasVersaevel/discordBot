const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('gragas')
		.setDescription('Replies with a fat Gragas joke.')
		.addIntegerOption(option =>
			option.setName('nr')
				.setDescription('Choose the joke by number 0 to 20.')
				.setRequired(false)),
	async execute(interaction) {
    }
}