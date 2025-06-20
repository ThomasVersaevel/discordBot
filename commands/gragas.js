const { SlashCommandBuilder } = require("@discordjs/builders");

const gragasJokes = [
  "Gragas is so fat, when Alistar tried to headbutt him he was put in a coma.",
  "Gragas is so fat, Bas is er niks bij.",
  "Gragas is so fat, when he recalled there was an earthquake on spawn.",
  "Gragas is so fat, he starts the game already fed.",
  "Gragas is so fat, he had to recall twice to return to the fountain.",
  "Gragas is so fat, when Vladimir used transfusion he got diabetes.",
  "Gragas is so fat, Blitzcrank knocked him up and got stuck.",
  "Gragas is so fat, Twisted Fate can't even see all of him when he ults.",
  "Gragas is so fat, when Swain ulted he ate all the ravens.",
  "Gragas is so fat, he can't even fit into a Giant's Belt.",
  "Gragas is so fat, UFO Corki tried to claim him as a new planet.",
  "Gragas is so fat, when he went into the river it flooded the entire rift.",
  "Gragas is so fat, Orianna's ball orbits him.",
  "Gragas is so fat, when Cho'Gath ulted him he got 6 stacks.",
  "Gragas is so fat, Caitlyn had to stop putting cupcakes in her traps.",
  "Gragas is so fat, Brand's ultimate bounces between his buttcheeks.",
  "Gragas is so fat, on ARAM he ate all the porosnax.",
  "Gragas is so fat, he takes inspiration runes just for the biscuits.",
  "Gragas is so fat, when Sett ulted him he shattered the rift.",
  "Gragas is so fat, when Akshan killed him he resurrected a whole buffet.",
  "Gragas is so fat, when Lulu ulted him it crashed EUW.",
  "Gragas is so fat, maar jij nog dikker."
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("gragas")
    .setDescription("Replies with a fat Gragas joke.")
    .addIntegerOption(option =>
      option
        .setName("nr")
        .setDescription("Choose the joke by number 0 to 20.")
        .setRequired(false)
    ),

  async execute(interaction) {
    let i;

    const option = interaction.options.get("nr");
    if (option && Number.isInteger(option.value) && option.value >= 0 && option.value < gragasJokes.length - 1) {
      i = option.value;
    } else {
      i = Math.floor(Math.random() * 21);
    }

    const joke = gragasJokes[i] ?? gragasJokes[21]; // fallback joke
    await interaction.reply(joke);
  }
};
