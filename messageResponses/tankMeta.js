const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('tank meta') // message name
		.setDescription('Replies to tank meta references'),
	async execute(interaction) {
        const tank_meta = ['tank', 'meta', 'eng', 'scary', 'joey', 'angst', 'maokai',
        'tanky', 'ondoodbaar', 'unkillable', 'sejuani', 'sion', 'orn', 'corn'];

        // add sentence splitting

        const match = tank_meta.find(element => {
            if (element.includes(message.content.toLowerCase())) {
              return true;
            }
        });
        
        if (match) { // als het iritant word: && message.channel.name.toLowerCase() == "general"
            message.channel.send("Remember tank meta?");	
            //console.log("tank meta");
        }
    },
};