const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed } = require('discord.js');

const pokeArray = ['Shroomish', 'Bidoof', 'Chansey', 'Chimecho', 'Lickitounge', 
    'Ludicolo', 'Metapod', 'Pikachu', 'Psyduck', 'Smoochum', 'Snorelax', 'Wooper',
    'shroomish', 'bidoof', 'chansey', 'chimecho', 'lickitounge', 
    'ludicolo', 'metapod', 'pikachu', 'psyduck', 'smoochum', 'snorelax', 'wooper'];

module.exports = {
	data: new SlashCommandBuilder()
		.setName('handsome')
		.setDescription('Replies with a picture of a handsome Pokémon')
        .addStringOption(option =>
			option.setName('pokemon')
				.setDescription('Choose the pokemon')
				.setRequired(false)),
	async execute(interaction) {

        if (interaction.options.get('pokemon')) {
            imgString = interaction.options.getString('pokemon');
            if (!pokeArray.includes(imgString)) { //array.includes is case sensitive
                 await interaction.reply({content:'Die pokemon is niet handsome', ephemeral: true});
                 return;
            }
        } else {
            i = Math.floor( Math.random() * pokeArray.length );
            imgString = pokeArray[i];
        }
        console.log('Handsome'+imgString+'.png'); // to see which one
        const exampleEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Handsome '+imgString) 
			.setImage('attachment://poke.png'); //takes attachment from send method below

        await interaction.reply({ embeds: [exampleEmbed], 
			files: [{ attachment:'assets/HandsomePokemon/Handsome'+imgString+'.png',
			name:'poke.png'}] });
    },
};