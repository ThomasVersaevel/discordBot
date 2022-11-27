const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed, MessageActionRow, MessageButton, Events } = require('discord.js');
const shortcuts = require('../api-shortcuts.json');
const fetch = require('node-fetch');
const { apiKey } = require('../config.json');
const { convertLolName } = require('../globals.js');
const tftJson = require('../tftset8.json');
const { random } = require('lodash');

module.exports = {
	name: 'interactionCreate',
	execute(interaction) {
		console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`);

		if (!interaction.isButton()) return;

		//get traits from each embed
		let traits = []
		let origins = []
		let kings = []
		let kingIcons = [];
		embedList = interaction.message.embeds;
		let kingIcon = ``;

		// TODO Add color to each player and match it with their button
        // TODO add another player to the lobby by button
        // Super TODO add 'finished' button that gets match result and adds it to embed

		// take amount of embeds for max i
		let max = interaction.message.embeds.length;
		// on button press fetch embed corresponding to ID and update it
		for (let i = 1; i <= max; i++) {
			traits.push(interaction.message.embeds[i - 1].fields[1].value)
			origins.push(interaction.message.embeds[i - 1].fields[0].value)
			kings.push(interaction.message.embeds[i - 1].fields[2].value)
		}
		console.log(traits + ' Origin: ' + origins);
		for (let i = 1; i <= max; i++) {
			if (interaction.customId === 'bb' + i) { // replace with for up to 5 if exists

				console.log('Button ' + i + ' pressed');
				//console.log(interaction.message.embeds[i - 1]);

				embedList[i - 1] = reroll(i);
				interaction.update({
					embeds: embedList,
					files: [{ attachment: kingIcon, name: 'icon' + i + '.jpg' }]
				});
			}
		}
		function reroll(i) {
			let trait = roll(tftJson.traits, traits);
			let origin = roll(tftJson.origins, origins);
			let king = rollKing(trait, origin);

			// add choices to overlap list
			traits.push(trait);
			origins.push(origin);
			kings.push(king);

			kingIcon = `assets/tftset8/` + king + `.jpg`;

			const newEmbed = new MessageEmbed()
				.setColor('#BBBBBB')
				.setTitle(i + '. ' + interaction.member.nickname)
				.setThumbnail('attachment://icon' + i + '.jpg')
				.addFields(
					{ name: 'Origin:', value: origin, inline: true },
					{ name: 'Trait:', value: trait, inline: true },
					{ name: 'King' + ':', value: king, inline: true },
				)
			return newEmbed;
		}
		function roll(list, overlaplist) {
			while (true) { // don't allow overlap
				choice = list[random(0, list.length - 1)];
				if (!overlaplist.includes(choice)) {
					return choice;
				}
			}
		}
		function rollKing(t, o) {
			list = [...new Set([...tftJson[t], ...tftJson[o]])];
			return list[random(0, list.length - 1)];
		}
	},
};