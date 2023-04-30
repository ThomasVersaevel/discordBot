const { SlashCommandBuilder } = require('@discordjs/builders');
const { tftKey, apiKey } = require('../config.json');
const fetch = require('node-fetch');
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