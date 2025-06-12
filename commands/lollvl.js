const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageAttachment, MessageEmbed } = require("discord.js");
const shortcuts = require("../api-shortcuts.json");
const { convertLolName, getUserInfo, getUserIcon } = require("../globals.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lollvl")
    .setDescription("Shows your league of legends level")
    .addStringOption((option) =>
      option
        .setName("lolname")
        .setDescription("Summoner Name")
        .setRequired(true)
    ),
  async execute(interaction) {
    let { username, tag } = convertLolName(
      interaction.options.getString("lolname"),
      interaction.member.id
    ); //uses globals

    let data = await getUserInfo(username, tag);

    let icon = await getUserIcon(data);

    var exampleEmbed = new MessageEmbed()
      .setColor("blue")
      .setTitle(data.gameName)
      .addField("Level:", "" + data.summonerLevel, true)

      .setThumbnail("attachment://icon.png");

    if (data.summonerLevel > 1000) {
      exampleEmbed.setFooter({ text: "(nolife lol)" });
    }

    await interaction.reply({
      embeds: [exampleEmbed],
      files: [{ attachment: icon, name: "icon.png" }],
    });
  },
};
