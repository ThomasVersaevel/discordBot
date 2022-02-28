const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

const pokeArray = ['Shroomish', 'Bidoof', 'Chansey', 'Chimecho', 'Lickitounge', 
    'Ludicolo', 'Metapod', 'Pickachu', 'Psyduck', 'Smoochum', 'Snorelax', 'Wooper'];

module.exports = {
	data: new SlashCommandBuilder()
		.setName('handsome')
		.setDescription('Replies with a picture of a handsome Pokémon'),
	async execute(interaction) {

        await interaction.reply('Handsome');

        i = Math.floor( Math.random() * pokeArray.length );
        const imgString = pokeArray[i];
        console.log('Handsome'+imgString+'.png');
        const pic = new MessageAttachment('../assets/HandsomePokemon/Handsome'+imgString+'.png');
        // inside a command, event listener, etc.
        const exampleEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Handsome Pokemon')
            .setURL('https://discord.js.org/')
            .setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
            .setDescription('Handsome '+imgString)
            .setThumbnail(pic)
            .addFields(
                { name: 'Regular field title', value: 'Some value here' },
                { name: '\u200B', value: '\u200B' },
                { name: 'Inline field title', value: 'Some value here', inline: true },
                { name: 'Inline field title', value: 'Some value here', inline: true },
            )
            .addField('Inline field title', 'Some value here', true)
            .setImage('https://i.imgur.com/AfFp7pu.png')
            .setTimestamp()
            .setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });

        channel.send({ embeds: [exampleEmbed] });

    },
};