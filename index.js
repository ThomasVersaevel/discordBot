// ## use " node . " to run the bot and deploy-commands.js to activate commands ##

const fs = require("fs");
const { Client, Collection, Intents } = require("discord.js");
const { token } = require("./config.json");
const shortcuts = require("./api-shortcuts.json");
const aramwl = require("./winslosses.json");
const tankMeta = require(`./events/tankMeta.js`);
const aramUpdate = require(`./events/aramUpdate.js`);
const birthdayEvent = require(`./events/birthdayEvent.js`);
const { short } = require("webidl-conversions");

// Create a new client instance
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_INTEGRATIONS,
    Intents.FLAGS.GUILD_WEBHOOKS,
    Intents.FLAGS.GUILD_MEMBERS,
  ],
});
// Login to Discord with your client's token
client.login(token);
// Start database
// startDatabase();
/**
 * Register commands
 */

let patchNr = fetch("https://ddragon.leagueoflegends.com/api/versions.json")
  .then((response) => response.json())
  .then((data) => {
    const currentPatch = data[0];
    console.log("Current patch:", currentPatch);
    shortcuts["patch"] = currentPatch; // update shortcuts with current patch
  });

client.commands = new Collection();
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));
// commands
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  // Set a new item in the Collection
  // With the key as the command name and the value as the exported module
  client.commands.set(command.data.name, command);
}

// Event on interaction for slash commands
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);
  console.log(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

/**
 *  event registration
 */
const eventFiles = fs
  .readdirSync(`./events/`)
  .filter((file) => file.endsWith(".js"));
for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => {
      event.execute(...args);
    });
  }
}

// ################### start aram updater ######################
aramLoop();

function aramLoop() {
  //console.log("Aram stats update");

  // retrieveNewAramGames('Fractaldarkness');

  for (entry in aramwl) {
    // loop over players in aram json file (in the event)
    aramUpdate.execute(entry);
  }
  setTimeout(aramLoop, 60000 * 60 * 3); // 60000 * 60 * 3 = every 3 hours
}

birthDayLoop();

function birthDayLoop() {
  birthdayEvent.execute();
  setTimeout(birthDayLoop, 60000 * 60 * 24);
}

const tank_meta = [
  "tank",
  "meta",
  " eng",
  "scary",
  "joey",
  "angst",
  "maokai",
  "dimetos",
  "tanky",
  "ondoodbaar",
  "unkillable",
  "sejuani",
  "sion",
  " orn",
  "corn",
];

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  // Tank meta
  if (
    tank_meta.some((word) =>
      message.content.toLowerCase().includes(word.toLowerCase())
    )
  ) {
    tankMeta.execute(message); // proper way to call an event
  }
});
