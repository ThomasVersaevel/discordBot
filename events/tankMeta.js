const { MessageEmbed } = require("discord.js");
const tftJson = require("../tftset8.json");
const { random } = require("lodash");
const fs = require("fs");

module.exports = {
  name: "tankMeta",
  execute(message) {

    const imgArray = fs.readdirSync("./assets/tankMeta");
    if (random(0, 6) < 1) {
      var img = './assets/tankMeta/' + imgArray[random(0, imgArray.length - 1)];
      console.log(img);
      var exampleEmbed = new MessageEmbed()
        .setColor("black")
        .setTitle("Remember tank meta?")
        .setImage("attachment://img.png");

      message.channel.send({
        embeds: [exampleEmbed],
        files: [{ attachment: img, name: "img.png" }],
      });
    } else {
      message.channel.send("Remember tank meta?");
    }
  },
};
