// Require the necessary discord.js classes
// ## use " node . " to run the bot ##

const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');
const { MessageEmbed } = require('discord.js');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
// commands
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

// on for bot command interaction
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;
	
	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
// events
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// client.messages = new Collection();

// const messagefiles = fs.readdirSync('./messageResponses').filter(file => file.endsWith('.js'));
// // commands
// for (const file of messageFiles) {
// 	const messa = require(`./messageResponses/${file}`);
// 	client.messages.set(messa.data.name, messa);
// }
const tank_meta = ['tank', 'meta', 'eng', 'scary', 'joey', 'angst', 'maokai',
        'tanky', 'ondoodbaar', 'unkillable', 'sejuani', 'sion', 'orn', 'corn'];
client.on('messageCreate', async message =>  {
	if (message.author.bot) return;


	// Tank meta
	if (tank_meta.some(word => message.content.toLowerCase().includes(word.toLowerCase()))) {
		message.channel.send('Remember tank meta?');
	} else if (message.content.toLowerCase().includes('annie')) {
		message.channel.send('Ban ~~annie~~');
	} 
	if ( message.content.toLowerCase().includes('malzahar')) {
		message.channel.send('Gadverdakke M*lz*h*r');
	}
	else if ( message.content.toLowerCase().includes('malzahar')) {
		message.channel.send('Gadverdakke M*lz*h*r');
	}
});

// Login to Discord with your client's token
client.login(token);



