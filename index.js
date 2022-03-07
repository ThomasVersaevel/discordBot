// Require the necessary discord.js classes
// ## use " node . " to run the bot ##

const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');
const { MessageAttachment, MessageEmbed } = require('discord.js');

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
const tank_meta = ['tank', 'meta', 'eng', 'scary', 'joey', 'angst', 'maokai', 'dimetos',
        'tanky', 'ondoodbaar', 'unkillable', 'sejuani', 'sion', 'orn', 'corn'];

const pokeArray = ['Shroomish', 'Bidoof', 'Chansey', 'Chimecho', 'Lickitounge', 
    'Ludicolo', 'Metapod', 'Pickachu', 'Psyduck', 'Smoochum', 'Snorelax', 'Wooper'];

const lamaArray = ['laat maar', 'laatmaar', 'lamaar', 'lamar', 'lama', 'llama'];	


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
	if ( message.content.toLowerCase().includes('handsome')) {

		i = Math.floor( Math.random() * pokeArray.length );
        const imgString = pokeArray[i];
        console.log('Handsome'+imgString+'.png');
        const pic = new MessageAttachment('./assets/HandsomePokemon/Handsome'+imgString+'.png');
        // inside a command, event listener, etc.
        const exampleEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Handsome '+imgString) 
			.setImage('attachment://poke.png'); //takes attachment from send method below

        message.channel.send({ embeds: [exampleEmbed], 
			files: [{ attachment:'assets/HandsomePokemon/Handsome'+imgString+'.png',
			name:'poke.png'}] });
	}
	if (message.content.toLowerCase().includes('aram')) {
		const exampleEmbed = new MessageEmbed()
		.setColor('#05AA47')
		.setImage('attachment://aram.png'); //takes attachment from send method below

		message.channel.send({ embeds: [exampleEmbed], 
			files: [{ attachment:'assets/AramOetang.png',
			name:'aram.png'}] });
	}

	if (message.content.toLowerCase().includes('tft') || message.content.toLowerCase().includes('tft?')) {
	const exampleEmbed = new MessageEmbed()
	.setColor('#05AA47')
	.setImage('attachment://aram.png'); //takes attachment from send method below

	message.channel.send({  embeds: [exampleEmbed], 
		files: [{ attachment:'assets/Tftea.png',
		name:'aram.png'}] });
	}
	// ### sluipschutters ###
	if (message.content.toLowerCase().includes('boeie')) {
		const exampleEmbed = new MessageEmbed()
		.setColor('#E50000')
		.setImage('attachment://sluipschutter.png'); //takes attachment from send method below

		message.channel.send({ embeds: [exampleEmbed], 
			files: [{ attachment:'assets/SluipSchutters/boeie.png',
			name:'sluipschutter.png'}] });
	}
	else if (message.content.toLowerCase().includes('allebei')) {
		const exampleEmbed = new MessageEmbed()
		.setColor('#E50000')
		.setImage('attachment://sluipschutter.png'); //takes attachment from send method below

		message.channel.send({ embeds: [exampleEmbed], 
			files: [{ attachment:'assets/SluipSchutters/allebei.png',
			name:'sluipschutter.png'}] });
	}
	else if (message.content.toLowerCase().includes('ik dacht dat dat kon')) {
		const exampleEmbed = new MessageEmbed()
		.setColor('#E50000')
		.setImage('attachment://sluipschutter.png'); //takes attachment from send method below

		message.channel.send({ embeds: [exampleEmbed], 
			files: [{ attachment:'assets/SluipSchutters/ikdachtdatdatkon.png',
			name:'sluipschutter.png'}] });
	}
	else if (message.content.toLowerCase().includes('moet kunnen')) {
		const exampleEmbed = new MessageEmbed()
		.setColor('#E50000')
		.setImage('attachment://sluipschutter.png'); //takes attachment from send method below

		message.channel.send({ embeds: [exampleEmbed], 
			files: [{ attachment:'assets/SluipSchutters/moetkunnen.png',
			name:'sluipschutter.png'}] });
	}
	else if (message.content.toLowerCase().includes('blij')) {
		const exampleEmbed = new MessageEmbed()
		.setColor('#E50000')
		.setImage('attachment://sluipschutter.png'); //takes attachment from send method below

		message.channel.send({ embeds: [exampleEmbed], 
			files: [{ attachment:'assets/SluipSchutters/groteblij.png',
			name:'sluipschutter.png'}] });
	}
	// ### lama ###
	if ( lamaArray.some(word => message.content.toLowerCase().includes(word.toLowerCase())) ) {
		const exampleEmbed = new MessageEmbed()
		.setColor('#E50000')
		.setImage('attachment://lamazitte.png'); //takes attachment from send method below

		message.channel.send({ embeds: [exampleEmbed], 
			files: [{ attachment:'assets/lamazitte.png',
			name:'lamazitte.png'}] });
	} //joeys neus

	const increasedRandom = { //Returns true if chance is met >0.9 and increases every time it fails.
		baseChance: 0.1,
		getRandom: function() {
			let treshhold = Math.random + this.baseChance;
			if (treshhold > 0.9) {
				return true;
			} else {
				this.baseChance += 0.1;
				console.log(treshhold);
				return false;
			}
		}
	  };

 //&& increasedRandom.getRandom()
	if ((message.author.id === '183976222215110656' && false|| message.content.toLowerCase().includes('joeytrigger'))) { // big joey meme
		const exampleEmbed = new MessageEmbed()
		.setColor('#E1C699')
		.setTitle('Grote neus!')
		.setImage('attachment://neus.png'); //takes attachment from send method below

		message.channel.send({ embeds: [exampleEmbed], 
			files: [{ attachment:'assets/neus/neus1.png',
			name:'neus.png'}] });
		message.channel.send({ embeds: [exampleEmbed], 
			files: [{ attachment:'assets/neus/neus2.png',
			name:'neus.png'}] });
		message.channel.send({ embeds: [exampleEmbed], 
			files: [{ attachment:'assets/neus/neus3.png',
			name:'neus.png'}] });
	} // kevin 263730771917930518 nico 444814987966283777 Thomas 276755182694563850 ThomasDisco 848986609910939668 Kevin 263730771917930518
	if (message.author.id === '444814987966283777' || message.content.toLowerCase().includes('nico stil nu')) { // big joey meme
		//let nico = member.guild.channels.cache.get('848986609910939668');
		if (message.author.moderatable) {
			message.author.timeout(60*1000, 'sssst'); 
			message.channel.send('nico is nu even 1 minuut stil');
		} else {
			console.log('cant moderate member: '+message.author.id);
		}
	}
});

// Login to Discord with your client's token
client.login(token);



