const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("thirtyseconds")
    .setDescription("Play thirty seconds")
    .addIntegerOption((option) =>
      option.setName("nr").setDescription("Number of teams").setRequired(false)
    ),
  async execute(interaction) {
    nr = interaction.options.get("nr").value;
    console.log(`Starting thirty seconds with ${nr} teams.`);

    // Create a lobby for thirty seconds. This contains a button to start the round and
    // two embeds, one for the questions (ephemeral for only current player) and one for inputing gotten answers
    // Need someway to register players in order to show card only to that player
    await interaction.reply("response");
  },
};
