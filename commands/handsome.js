const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed } = require('discord.js');

const pokeArray = ['Shroomish', 'Bidoof', 'Chansey', 'Chimecho', 'Lickitounge', 
    'Ludicolo', 'Metapod', 'Pikachu', 'Psyduck', 'Smoochum', 'Snorelax', 'Wooper',
    'Shroomish', 'Bidoof', 'Chansey', 'Chimecho', 'Lickitounge', 
    'Ludicolo', 'Metapod', 'Pikachu', 'Psyduck', 'smoochum', 'Snorelax', 'Wooper'];

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
            imgString = interaction.options.getString('pokemon').toLowerCase();
            imgString = imgString.slice(0,1).toUpperCase() + imgString.slice(1,imgString.length);
            if (!pokeArray.includes(imgString)) { //array.includes is case sensitive
                 await interaction.reply({content:'Die pokemon is niet handsome', ephemeral: true});
                 return;
            }
        } else {
            i = Math.floor( Math.random() * pokeArray.length );
            imgString = pokeArray[i];
            imgString = imgString.slice(0,1).toUpperCase() + imgString.slice(1,imgString.length);
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