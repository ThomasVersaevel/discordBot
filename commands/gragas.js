const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('gragas')
		.setDescription('Replies with a fat Gragas joke.'),
	async execute(interaction) {
		i = Math.random() * 20;
		console.log(i);
		switch (true) {
			case i<1:
				await interaction.reply('Gragas is so fat, when Alistar tried to headbut him he was put in a coma.');
				break;
			case 1<=i && i < 2:
				await interaction.reply('Gragas is so fat, Bas is er niks bij.');
				break;
			case 2 <= i && i < 3:
				await interaction.reply('Gragas is so fat, when he recalled there was an earthquake on spawn.');
				break;
			case 3 <= i && i < 4:
				await interaction.reply('Gragas is so fat, he starts the game already fed.');
				break;
			case 4 <= i && i < 5:
				await interaction.reply('Gragas is so fat, he had to recal twice to return to the fountain.');
				break;
			case 5 <= i && i < 6:
				await interaction.reply('Gragas is so fat, when Vladimir used transfusion he got diabetes.');
				break;
			case 6 <= i && i < 7:
				await interaction.reply('Gragas is so fat, Blitzcrank knocked him up and got stuck.');
				break;
			case 7 <= i && i < 8:
				await interaction.reply('Gragas is so fat, Twisted Fate can\'t even see all of him when he ults.');
				break;
			case 8 <= i && i < 9:S
				await interaction.reply('Gragas is so fat, when Swain ulted he ate all the ravens.');
				break;
			case 9 <= i && i < 10:
				await interaction.reply('Gragas is so fat, he can\'t even fit into a Giant\'s Belt.');
				break;	
			case 10 <= i && i < 11:
				await interaction.reply('Gragas is so fat, UFO Corki tried to claim him as a new planet.');
				break;	
			case 10 <= i && i < 11:
				await interaction.reply('Gragas is so fat, when Lulu ulted him it crashed EUW.');
				break;	
			case 11 <= i && i < 12:
				await interaction.reply('Gragas is so fat, when he went into the river it flooded the entire rift.');
				break;	
			case 12 <= i && i < 13:
				await interaction.reply('Gragas is so fat, Orianna\'s ball orbits him.');
				break;	
			case 13 <= i && i < 14:
				await interaction.reply('Gragas is so fat, when Cho\'Gath ulted him he got 6 stacks.');
				break;	
			case 14 <= i && i < 15:
				await interaction.reply('Gragas is so fat, Caitlyn had to stop putting cupcakes in her traps.');
				break;	
			case 15 <= i && i < 16:
				await interaction.reply('Gragas is so fat, Brand\'s ultimate bounces between his buttcheeks.');
				break;	
			case 16 <= i && i < 17:
				await interaction.reply('Gragas is so fat, on ARAM he ate all the porosnax.');
				break;
			case 17 <= i && i < 18:
				await interaction.reply('Gragas is so fat, he takes inspiration runes just for the biscuits.');
				break;
			case 18 <= i && i < 19:
				await interaction.reply('Gragas is so fat, when Sett ulted him he shattered the rift.');
				break;
			case 19 <= i && i < 20:
				await interaction.reply('Gragas is so fat, when Akshan killed him he resurected a whole buffet.');
				break;
		}	
		//await interaction.reply('response');
	},
};