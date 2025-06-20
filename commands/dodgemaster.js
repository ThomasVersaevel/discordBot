const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { apiKey } = require("../config.json");
const shortcuts = require("../api-shortcuts.json");
const fetch = require("node-fetch");
const { convertLolName, getUserInfo, getUserIcon } = require("../globals.js");

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
    const matchLink = `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?api_key=${apiKey}&start=0&count=1`;
    const matchIdResponse = await fetch(matchLink);
    let matchIdData = await matchIdResponse.json();

    // ## From here its the reply ##
    let icon = await getUserIcon(userData);
    // await interaction.reply("Gathering data, please wait.");

    let tempLink = `https://europe.api.riotgames.com/lol/match/v5/matches/${matchIdData[0]}?api_key=${apiKey}`;
    const matchResponse = await fetch(tempLink);
    let matchData = await matchResponse.json();

    const partData = matchData.info.participants.find((p) => p.puuid === puuid);

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
