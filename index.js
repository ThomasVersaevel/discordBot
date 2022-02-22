// Require the necessary discord.js classes
// ## use " node . " to run the bot ##

const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection();
//client.user.setStatus('online'); //added this

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});


// on for bot command interaction
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'fat_joke') {
		await interaction.reply('Gragas is so fat, when alistar tried to headbut him he was put in a coma.');
	} else if (commandName === 'test') {
		await interaction.reply('test command succesfull.');
	}
});

// Login to Discord with your client's token
client.login(token);



