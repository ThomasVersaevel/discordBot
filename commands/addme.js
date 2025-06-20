const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const shortcuts = require("../api-shortcuts.json");
const fs = require("fs");
const { convertLolName } = require("../globals.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("addme")
    .setDescription("Adds your summoner name to the 'me' list")
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

    const userData = getUserIfno(username, tag);
    //console.log(data);
    const patchNr = shortcuts["patch"];
    let icon = `http://ddragon.leagueoflegends.com/cdn/${patchNr}/img/profileicon/${useruserData.profileIconId}.png`;

    var exampleEmbed = new MessageEmbed()
      .setColor("blue")
      .setTitle(userData.name)
      .setThumbnail("attachment://icon.png");

    // json reading and writing
    let userId = interaction.member.id;

    fs.readFile("./api-shortcuts.json", "utf8", (err, shortcuts) => {
      if (err) {
        console.log("File read failed:", err);
        return;
      }
      console.log("File userData:", shortcuts);
    });

    if (shortcuts.userId === undefined) {
      // const userObject = { userId: username+',' };
      // userEntry = JSON.stringify(userObject);

      shortcuts[userId] = username;
      const shortcutsJ = JSON.stringify(shortcuts);
      fs.writeFile("./api-shortcuts.json", shortcutsJ, (err) => {
        if (err) {
          console.log("Error writing file", err);
        } else {
          console.log("Successfully wrote username to file");
        }
      });

      exampleEmbed.addField(
        "\u200b",
        "Added " + userData.name + " to 'me' list",
        true
      );
    } else {
      // if already present
      exampleEmbed.addField(
        "\u200b",
        shortcuts[userId] + " is already in 'me' list",
        true
      );
    }

    await interaction.reply({
      embeds: [exampleEmbed],
      files: [{ attachment: icon, name: "icon.png" }],
      ephemeral: true,
    });
  },
};
