const { SlashCommandBuilder } = require('@discordjs/builders');
const {listDatabases} = require('../globals.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription('test'),
	async execute(interaction) {

        const dbs = listDatabases();

		await interaction.reply("test: ", dbs);
	}, 
}; 