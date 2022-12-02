// Require the necessary discord.js classes
// ## use " node . " to run the bot and deploy-commands.js to activate commands ##

const fs = require('fs');
const { Client, Collection, Intents, MessageAttachment, MessageEmbed } = require('discord.js');
const { token, apiKey } = require('./config.json');
const fetch = require('node-fetch');
const aramwl = require('./winslosses.json');
const matchListJson = require('./oldmatchlist.json');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_INTEGRATIONS, Intents.FLAGS.GUILD_WEBHOOKS, Intents.FLAGS.GUILD_MEMBERS] });

client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
// commands
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

// // on for button ineractions
// client.on('interactionCreate', async i => {
// 	if (!i.isButton()) return;
// 	console.log('pressed button');

// 	//await i.update

// });

// on for bot command interaction
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);
	console.log(interaction.commandName)
	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

const eventFiles = fs.readdirSync(`./events/`).filter(file => file.endsWith('.js'));
// event registration
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		//console.log('registering: ' + file);
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// ################### start aram updater ######################
loop();

function loop() {

	//console.log("Aram stats update");

	// retrieveNewAramGames('Fractaldarkness');

	for (entry in aramwl) { // loop over players in aram json file
		retrieveNewAramGames(entry);
	}
	setTimeout(loop, 60000 * 60 * 3); // 60000 * 60 * 3 = every 3 hours
}

async function retrieveNewAramGames(entry) {
	const link = `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${entry}?api_key=${apiKey}`
	const response = await fetch(link);
	sumData = await response.json();
	const puuid = sumData.puuid; // id of user
	// obtain 10 aram games by queue 450
	const matchLink = `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?api_key=${apiKey}&queue=450&start=0&count=10`
	const matchIdResponse = await fetch(matchLink);
	let matchIdData = await matchIdResponse.json();

	let oldMatchList = [];
	//console.log('doing new match logic for: ' + entry);

	for (var i = 0; i < matchListJson[entry].length; i++) {
		//console.log(match);
		if (matchListJson[entry][i] != 0) {
			oldMatchList.push(matchListJson[entry][i]) //list of matchids by sumname (json)
		}
	}
	//console.log(oldMatchList);
	var win = 0;
	var lose = 0;
	let newMatchList = oldMatchList;

	for (var id = 0; id < matchIdData.length; id++) {
		if (!oldMatchList.includes(matchIdData[id])) {
			console.log(entry + ' New match detected');
			newMatchList.push(matchIdData[id]);
			let tempLink = `https://europe.api.riotgames.com/lol/match/v5/matches/${matchIdData[id]}?api_key=${apiKey}`
			const matchResponse = await fetch(tempLink);
			let matchData = await matchResponse.json();
			// if Match not yet used, check win or lose
			var partIndex = 0;
			console.log('Match: ' + matchIdData[id] + ' Has participants: ' +matchData.info.participants[0])
			for (var i = 0; i < 10; i++) {
				if (matchData.info.participants[i].puuid === puuid) {
					partIndex = i; //find player's index
				}
			}
			matchData.info.participants[partIndex].win ? win++ : lose++;
		}
	}

	//console.log(newMatchList);
	matchListJson[entry] = newMatchList;
	fs.writeFile('./oldmatchlist.json', JSON.stringify(matchListJson), err => {
		if (err) console.log("Error writing file:", err);
	});
	// add wins and losses to total
	aramwl[entry].wins += win;
	aramwl[entry].losses += lose;
	fs.writeFile('./winslosses.json', JSON.stringify(aramwl), err => {
		if (err) console.log("Error writing file:", err);
	});
}
// ####################### end aram updater ##############################

const tank_meta = ['tank', 'meta', 'eng', 'scary', 'joey', 'angst', 'maokai', 'dimetos',
	'tanky', 'ondoodbaar', 'unkillable', 'sejuani', 'sion', 'orn', 'corn'];

const pokeArray = ['Shroomish', 'Bidoof', 'Chansey', 'Chimecho', 'Lickitounge',
	'Ludicolo', 'Metapod', 'Pickachu', 'Psyduck', 'Smoochum', 'Snorelax', 'Wooper'];

const lamaArray = ['laat maar', 'laatmaar', 'lamaar', 'lamar', 'lama', 'llama'];

const censorArray = ['kanker', 'kkr', 'kenker'];

var wordContainer = "";

client.on('messageCreate', async message => {
	if (message.author.bot) return;

	// Tank meta
	if (tank_meta.some(word => message.content.toLowerCase().includes(word.toLowerCase()))) {
		message.channel.send('Remember tank meta?');
	} else if (message.content.toLowerCase().includes('annie')) {
		message.channel.send('Ban ~~annie~~');
	}
	if (message.content.toLowerCase().includes('malzahar')) {
		message.channel.send('Gadverdakke M\*lz\*h\*r');
	}
	if (message.content.toLowerCase().includes('handsome')) {

		i = Math.floor(Math.random() * pokeArray.length);
		const imgString = pokeArray[i];
		console.log('Handsome' + imgString + '.png');
		const pic = new MessageAttachment('./assets/HandsomePokemon/Handsome' + imgString + '.png');
		// inside a command, event listener, etc.
		const exampleEmbed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Handsome ' + imgString)
			.setImage('attachment://poke.png'); //takes attachment from send method below

		message.channel.send({
			embeds: [exampleEmbed],
			files: [{
				attachment: 'assets/HandsomePokemon/Handsome' + imgString + '.png',
				name: 'poke.png'
			}]
		});
	}
	if (message.content.toLowerCase().includes('aram') && (message.content.toLowerCase().includes('tijd') || message.content.toLowerCase().length < 11)) {
		const exampleEmbed = new MessageEmbed()
			.setColor('#05AA47')
			.setImage('attachment://aram.png'); //takes attachment from send method below

		message.channel.send({
			embeds: [exampleEmbed],
			files: [{
				attachment: 'assets/AramOetang.png',
				name: 'aram.png'
			}]
		});
	}

	if (message.content.toLowerCase().includes('tft') && !message.content.toLowerCase().includes('/tft/')) {
		const exampleEmbed = new MessageEmbed()
			.setColor('#05AA47')
			.setImage('attachment://aram.png'); //takes attachment from send method below

		message.channel.send({
			embeds: [exampleEmbed],
			files: [{
				attachment: 'assets/Tftea.png',
				name: 'aram.png'
			}]
		});
	}
	// ### sluipschutters ###
	if (message.content.toLowerCase().includes('boeie')) {
		const exampleEmbed = new MessageEmbed()
			.setColor('#E50000')
			.setImage('attachment://sluipschutter.png'); //takes attachment from send method below

		message.channel.send({
			embeds: [exampleEmbed],
			files: [{
				attachment: 'assets/SluipSchutters/boeie.png',
				name: 'sluipschutter.png'
			}]
		});
	}
	else if (message.content.toLowerCase().includes('allebei')) {
		const exampleEmbed = new MessageEmbed()
			.setColor('#E50000')
			.setImage('attachment://sluipschutter.png'); //takes attachment from send method below

		message.channel.send({
			embeds: [exampleEmbed],
			files: [{
				attachment: 'assets/SluipSchutters/allebei.png',
				name: 'sluipschutter.png'
			}]
		});
	}
	else if (censorArray.some(word => message.content.toLowerCase().includes(word.toLowerCase()))) {
		var edit = message.content.toLowerCase().split(" ");
		messageContent = message.content.toLowerCase();
		for (var i = 0; i < edit.length; i++) {
			if (censorArray.some(word => edit[i].includes(word))) {
				messageContent = messageContent.replace(edit[i], '####');
			}
		}
		message.delete();
		message.channel.send(`${message.author.username}: ${messageContent}`);
	}

	else if (message.content.toLowerCase().includes('ik dacht dat dat kon')) {
		const exampleEmbed = new MessageEmbed()
			.setColor('#E50000')
			.setImage('attachment://sluipschutter.png'); //takes attachment from send method below

		message.channel.send({
			embeds: [exampleEmbed],
			files: [{
				attachment: 'assets/SluipSchutters/ikdachtdatdatkon.png',
				name: 'sluipschutter.png'
			}]
		});
	}
	else if (message.content.toLowerCase().includes('moet kunnen')) {
		const exampleEmbed = new MessageEmbed()
			.setColor('#E50000')
			.setImage('attachment://sluipschutter.png'); //takes attachment from send method below

		message.channel.send({
			embeds: [exampleEmbed],
			files: [{
				attachment: 'assets/SluipSchutters/moetkunnen.png',
				name: 'sluipschutter.png'
			}]
		});
	}
	else if (message.content.toLowerCase().includes('blij ')) {
		const exampleEmbed = new MessageEmbed()
			.setColor('#E50000')
			.setImage('attachment://sluipschutter.png'); //takes attachment from send method below

		message.channel.send({
			embeds: [exampleEmbed],
			files: [{
				attachment: 'assets/SluipSchutters/groteblij.png',
				name: 'sluipschutter.png'
			}]
		});
	}
	// ### lama ###
	if (lamaArray.some(word => message.content.toLowerCase().includes(word.toLowerCase()))) {
		const exampleEmbed = new MessageEmbed()
			.setColor('#E50000')
			.setImage('attachment://lamazitte.png'); //takes attachment from send method below

		message.channel.send({
			embeds: [exampleEmbed],
			files: [{
				attachment: 'assets/lamazitte.png',
				name: 'lamazitte.png'
			}]
		});
	} //joeys neus

	const increasedRandom = { //Returns true if chance is met >0.9 and increases every time it fails.
		baseChance: 0.1,
		getRandom: function () {
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
	if ((message.author.id === '183976222215110656' && false || message.content.toLowerCase().includes('joeytrigger'))) { // big joey meme
		const exampleEmbed = new MessageEmbed()
			.setColor('#E1C699')
			.setTitle('Grote neus!')
			.setImage('attachment://neus.png'); //takes attachment from send method below

		message.channel.send({
			embeds: [exampleEmbed],
			files: [{
				attachment: 'assets/neus/neus1.png',
				name: 'neus.png'
			}]
		});
		message.channel.send({
			embeds: [exampleEmbed],
			files: [{
				attachment: 'assets/neus/neus2.png',
				name: 'neus.png'
			}]
		});
		message.channel.send({
			embeds: [exampleEmbed],
			files: [{
				attachment: 'assets/neus/neus3.png',
				name: 'neus.png'
			}]
		});
	} // kevin 263730771917930518 nico 444814987966283777 Thomas 276755182694563850 ThomasDisco 848986609910939668 
	// if (message.author.id === '444814987966283777' || message.content.toLowerCase().includes('nico stil nu')) { // big joey meme
	// 	//let nico = member.guild.channels.cache.get('848986609910939668');
	// 	if (message.author.moderatable) {
	// 		message.author.timeout(60 * 1000, 'sssst');
	// 		message.channel.send('nico is nu even 1 minuut stil');
	// 	} else {
	// 		console.log('cant moderate member: '+message.author.id);
	// 	}
	// }
});

// Login to Discord with your client's token
client.login(token);



