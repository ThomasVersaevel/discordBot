const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const {
  convertLolName,
  getUserInfo,
  getUserIcon,
  getMatchData,
  getMatchDetails,
} = require("../globals.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("dodgemaster")
    .setDescription("Shows the amount of skillshots you dodged last game")
    .addStringOption((option) =>
      option
        .setName("lolname")
        .setDescription("Summoner Name")
        .setRequired(true)
    ),
  async execute(interaction) {
    const { username, tag } = convertLolName(
      interaction.options.getString("lolname"),
      interaction.member.id
    );

    // ## obtain summoner info ##
    const userData = await getUserInfo(username, tag);
    const puuid = userData.puuid; // id of user
    // ## obtain 20 match IDs (default) ##
    let matchIdData = await getMatchData(puuid, 0, 1);

    // ## From here its the reply ##
    let icon = await getUserIcon(userData);

    let matchData = await getMatchDetails(matchIdData);

    const partData = matchData.info.participants.find((p) => p.puuid === puuid);
    console.log(partData.challenges);

    var exampleEmbed = new MessageEmbed()
      .setColor("#3FFFFF")
      .setTitle(username)
      .addFields([
        {
          name: "Played",
          value:
            `${partData.championName}\n` +
            `Dodged ${partData.challenges.skillshotsDodged} skillshots last game\n` +
            `Hit ${partData.challenges.skillshotsHit} skillshots last game`,
          inline: true,
        },
      ])
      .setThumbnail("attachment://icon.png");

    await interaction.reply({
      embeds: [exampleEmbed],
      files: [{ attachment: icon, name: "icon.png" }],
    });
  },
};
