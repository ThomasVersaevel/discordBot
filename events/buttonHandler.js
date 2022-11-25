module.exports = {
    name: 'buttonHandler',
    once: false,
    execute(interaction) {
        console.log('wtf work');
        //if (!interaction.isButton()) return;

        console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered a button.`);

        if (interaction.customId == bb1) {
            console.log('Button 1 pressed');
        }


    },
};
