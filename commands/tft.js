const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageAttachment, MessageEmbed } = require("discord.js");
const shortcuts = require("../api-shortcuts.json");
const fetch = require("node-fetch");
const { tftKey, apiKey } = require("../config.json");
const { convertLolName } = require("../globals.js");
const tftrank = require("./tftrank");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tft")
    .setDescription("Shows your tft profile")
    .addStringOption((option) =>
      option
        .setName("lolname")
        .setDescription("Summoner Name")
        .setRequired(true)
    ),
  async execute(interaction) {
    let username = convertLolName(
      interaction.options.getString("lolname"),
      interaction.member.id
    ); //uses globals

    const link = `https://euw1.api.riotgames.com/tft/summoner/v1/summoners/by-name/${username}?api_key=${tftKey}`;
    const response = await fetch(link);
    let data = await response.json();
    const puuid = data.puuid;

    patchNr = shortcuts["patch"]; //required for data dragon

    let tftRankedLink = `https://euw1.api.riotgames.com/tft/league/v1/entries/by-summoner/${data.id}?api_key=${tftKey}`;
    const tftRankResponse = await fetch(tftRankedLink);
    let tftRankData = await tftRankResponse.json();
    console.log(tftRankData);

    await interaction.reply("Tft");
    // var exampleEmbed = new MessageEmbed()
    //     .setColor(embedColor)
    //     .setTitle('' + tftData.name)
    //     .setImage('attachment://rankedImg.png')
    //     .setThumbnail('attachment://double.png')
    //     .setFooter({ text: 'Hyperrol rank: ' + hyperRank, iconURL: 'attachment://icon.png' });

    // await interaction.reply({
    //     embeds: [exampleEmbed],
    //     files: [{ attachment: hyperEmblem, name: 'icon.png' },
    //     { attachment: 'assets/ranked-emblems/Emblem_' + rank + '.png', name: 'rankedImg.png' },
    //     { attachment: 'assets/ranked-emblems/Emblem_' + doubleRank + '.png', name: 'double.png' }
    //     ]
    // });
  },
};
