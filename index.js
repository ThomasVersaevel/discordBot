// Require the necessary discord.js classes
// ## use " node . " to run the bot ##

const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');
// const { channel } = require('diagnostics_channel');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

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

// const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
// // events
// for (const file of eventFiles) {
// 	const event = require(`./events/${file}`);
// 	if (event.once) {
// 		client.once(event.name, (...args) => event.execute(...args));
// 	} else {
// 		client.on(event.name, (...args) => event.execute(...args));
// 	}
// }

client.on('messageCreate', async message =>  {
	if (message.author.bot) return;

	if (message.content.toLowerCase() === 'tank meta'){ // als het iritant word: && message.channel.name.toLowerCase() == "general"
		//await message.reply('Tank Meta is eng');
			
		console.log("tank meta");
	}
});

// Login to Discord with your client's token
client.login(token);



