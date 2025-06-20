const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

const pokeArray = [
  "Shroomish",
  "Bidoof",
  "Chansey",
  "Chimecho",
  "Lickitounge",
  "Ludicolo",
  "Metapod",
  "Pikachu",
  "Psyduck",
  "Smoochum",
  "Snorelax",
  "Wooper",
  "Shroomish",
  "Bidoof",
  "Chansey",
  "Chimecho",
  "Lickitounge",
  "Ludicolo",
  "Metapod",
  "Pikachu",
  "Psyduck",
  "smoochum",
  "Snorelax",
  "Wooper",
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("handsome")
    .setDescription("Replies with a picture of a handsome Pokémon")
    .addStringOption((option) =>
      option
        .setName("pokemon")
        .setDescription("Choose the pokemon")
        .setRequired(false)
    ),

  // if pokemon is specified return that one else return a random one
  async execute(interaction) {
    const input = interaction.options.get("pokemon")?.value;
    const pokeName = input
      ? pokeArray.find((p) => p.toLowerCase() === input.toLowerCase())
      : pokeArray[(Math.random() * pokeArray.length) | 0];

    if (!pokeName) {
      await interaction.reply({
        content: "Die Pokémon is niet handsome.",
        ephemeral: true,
      });
      return;
    }

    console.log("Handsome" + pokeName + ".png"); // to see which one
    const exampleEmbed = new MessageEmbed()
      .setColor("#0099ff")
      .setTitle("Handsome " + pokeName)
      .setImage("attachment://poke.png"); //takes attachment from send method below

    await interaction.reply({
      embeds: [exampleEmbed],
      files: [
        {
          attachment: "assets/HandsomePokemon/Handsome" + pokeName + ".png",
          name: "poke.png",
        },
      ],
    });
  },
};
