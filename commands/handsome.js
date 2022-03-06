const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed } = require('discord.js');

const pokeArray = ['Shroomish', 'Bidoof', 'Chansey', 'Chimecho', 'Lickitounge', 
    'Ludicolo', 'Metapod', 'Pickachu', 'Psyduck', 'Smoochum', 'Snorelax', 'Wooper'];

module.exports = {
	data: new SlashCommandBuilder()
		.setName('handsome')
		.setDescription('Replies with a picture of a handsome Pokémon'),
	async execute(interaction) {
        i = Math.floor( Math.random() * pokeArray.length );
        const imgString = pokeArray[i];
        console.log('Handsome'+imgString+'.png');
        const pic = new MessageAttachment('./assets/HandsomePokemon/Handsome'+imgString+'.png');

        const exampleEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Handsome '+imgString) 
			.setImage('attachment://poke.png'); //takes attachment from send method below

        await interaction.channel.send({ embeds: [exampleEmbed], 
			files: [{ attachment:'assets/HandsomePokemon/Handsome'+imgString+'.png',
			name:'poke.png'}] });
    },
};