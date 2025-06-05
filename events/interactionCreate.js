const { MessageEmbed } = require("discord.js");
const tftJson = require("../tftset14.json");
const { random } = require("lodash");
const fs = require("fs");

module.exports = {
  name: "interactionCreate",
  execute(interaction) {
    console.log(
      `${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`
    );

    if (!interaction.isButton()) return; // add extra if for when more buttons exist
    if (interaction.customId === "lockin") {
      // if lockin pressed disable all roll buttons, if lockin pressed again unlock em
      if (
        interaction.message.components[
          interaction.message.components.length - 1
        ].components[0].label === "Lock In"
      ) {
        for (let i = 0; i < interaction.message.components.length - 1; i++) {
          // for all rows in the components array
          for (
            let j = 0;
            j < interaction.message.components[i].components.length;
            j++
          ) {
            interaction.message.components[i].components[j].setDisabled(true);
          }
        }
        interaction.message.components[
          interaction.message.components.length - 1
        ].components[0].setLabel("Unlock");

        interaction.update({ components: interaction.message.components });
        return; // return ends the event
      } else {
        for (let i = 0; i < interaction.message.components.length - 1; i++) {
          // for all rows in the components array
          for (
            let j = 0;
            j < interaction.message.components[i].components.length;
            j++
          ) {
            interaction.message.components[i].components[j].setDisabled(false);
          }
        }
        interaction.message.components[
          interaction.message.components.length - 1
        ].components[0].setLabel("Lock In");

        interaction.update({ components: interaction.message.components });
        return; // return ends the event
      }
    }
    //get traits from each embed
    let traits = [];
    let origins = [];
    let kings = [];
    let colors = [];
    embedList = interaction.message.embeds;

    // TODO add another player to the lobby by button
    // Super TODO add 'finished' button that gets match result and adds it to embed

    // take amount of embeds for max
    let max = interaction.message.embeds.length;
    // on button press fetch embed corresponding to ID and update it
    for (let i = 1; i <= max; i++) {
      traits.push(interaction.message.embeds[i - 1].fields[1].value);
      origins.push(interaction.message.embeds[i - 1].fields[0].value);
      kings.push(interaction.message.embeds[i - 1].fields[2].value);
      colors.push(interaction.message.embeds[i - 1].color);
    }

    for (let i = 1; i <= max; i++) {
      if (interaction.customId === "bb" + i) {
        // replace with for up to 5 if exists

        console.log("Button " + i + " pressed");

        embedList[i - 1] = reroll(i);
        interaction.update({
          embeds: embedList,
        });
      }
    }
    function reroll(i) {
      let trait = roll(tftJson.traits, traits);
      let origin = roll(tftJson.origins, origins);
      let king = rollKing(trait, origin);

      // add choices to overlap list
      traits.push(trait);
      origins.push(origin);
      kings.push(king);

      const playerName = interaction.member.nickname
        ? interaction.member.nickname
        : interaction.user.username;
      const newEmbed = new MessageEmbed()
        .setColor(colors[(i - 1) % 4])
        .setTitle(i + ". " + playerName)
        .addFields(
          { name: "Origin:", value: origin, inline: true },
          { name: "Trait:", value: trait, inline: true },
          { name: "King", value: "👑 " + king, inline: true }
        );
      return newEmbed;
    }
    function roll(list, overlaplist) {
      while (true) {
        // don't allow overlap
        choice = list[random(0, list.length - 1)];
        if (!overlaplist.includes(choice)) {
          return choice;
        }
      }
    }
    function rollKing(t, o) {
      let traitChampions = Array.isArray(tftJson[t]) ? tftJson[t] : [];
      let originChampions = Array.isArray(tftJson[o]) ? tftJson[o] : [];

      let list = [...new Set([...traitChampions, ...originChampions])];
      return list[random(0, list.length - 1)];
    }
  },
};
