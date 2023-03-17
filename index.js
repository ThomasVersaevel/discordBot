// ## use " node . " to run the bot and deploy-commands.js to activate commands ##

const fs = require("fs");
const {
  Client,
  Collection,
  Intents,
} = require("discord.js");
const { token } = require("./config.json");
const aramwl = require("./winslosses.json");
const tankMeta = require(`./events/tankMeta.js`);
const aramUpdate = require(`./events/aramUpdate.js`);

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

/**
 * Register commands
 */
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
loop();

function loop() {
  //console.log("Aram stats update");

  // retrieveNewAramGames('Fractaldarkness');

  for (entry in aramwl) {
    // loop over players in aram json file (in the event)
    aramUpdate.execute(entry);
  }
  setTimeout(loop, 60000 * 60 * 3); // 60000 * 60 * 3 = every 3 hours
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
  if (tank_meta.some((word) =>
      message.content.toLowerCase().includes(word.toLowerCase()))) 
  {
    tankMeta.execute(message); // proper way to call an event
  } else {
    messageCreate.execute(message); // call event
  }
});

// Login to Discord with your client's token
client.login(token);
