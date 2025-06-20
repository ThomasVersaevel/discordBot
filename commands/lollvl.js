const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const {
  convertLolName,
  getUserInfo,
  getUserIcon,
  getSummonerData,
} = require("../globals.js");

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
    );

    let data = await getUserInfo(username, tag);
    let icon = await getUserIcon(data);
    let sumData = await getSummonerData(data.puuid);

    var exampleEmbed = new MessageEmbed()
      .setColor("blue")
      .setTitle(data.gameName)
      .addFields([
        {
          name: "Level:",
          value: sumData.summonerLevel.toString(),
          inline: true,
        },
      ])
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
