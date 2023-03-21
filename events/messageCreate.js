const { MessageEmbed } = require('discord.js');

/**
 * On message events
 */
module.exports = {
    name: 'messageCreate',
    execute(message) {

        const lamaArray = ["laat maar", "laatmaar", "lamaar", "lamar", "lama", "llama"];

        const censorArray = ["kanker", "kkr", "kenker"];

        var wordContainer = "";
        const pokeArray = [
            "Shroomish",
            "Bidoof",
            "Chansey",
            "Chimecho",
            "Lickitounge",
            "Ludicolo",
            "Metapod",
            "Pickachu",
            "Psyduck",
            "Smoochum",
            "Snorelax",
            "Wooper",
        ];
        if (message.content.toLowerCase().includes("annie")) {
            message.channel.send("Ban ~~annie~~");
        }
        if (message.content.toLowerCase().includes("malzahar")) {
            message.channel.send(`Gadverdakke M\*lz\*h\*r`);
        }
        if (message.content.toLowerCase().includes("handsome")) {
            i = Math.floor(Math.random() * pokeArray.length);
            const imgString = pokeArray[i];
            console.log("Handsome" + imgString + ".png");
            const pic = new MessageAttachment(
                "./assets/HandsomePokemon/Handsome" + imgString + ".png"
            );
            // inside a command, event listener, etc.
            const exampleEmbed = new MessageEmbed()
                .setColor("#0099ff")
                .setTitle("Handsome " + imgString)
                .setImage("attachment://poke.png"); //takes attachment from send method below

            message.channel.send({
                embeds: [exampleEmbed],
                files: [
                    {
                        attachment: "./assets/HandsomePokemon/Handsome" + imgString + ".png",
                        name: "poke.png",
                    },
                ],
            });
        }
        if (
            message.content.toLowerCase().includes("aram") &&
            (message.content.toLowerCase().includes("tijd") ||
                message.content.toLowerCase().length < 11)
        ) {
            const exampleEmbed = new MessageEmbed()
                .setColor("#05AA47")
                .setImage("attachment://aram.png"); //takes attachment from send method below

            message.channel.send({
                embeds: [exampleEmbed],
                files: [
                    {
                        attachment: "./assets/AramOetang.png",
                        name: "aram.png",
                    },
                ],
            });
        }

        // triggers on any message with tft time/tijd in it except links
        if (
            message.content.toLowerCase().includes("tft") &&
            (message.content.toLowerCase().includes("tijd") ||
                message.content.toLowerCase().includes("time")) &&
            !message.content.toLowerCase().includes("/tft/")
        ) {
            const exampleEmbed = new MessageEmbed()
                .setColor("#05AA47")
                .setImage("attachment://aram.png"); //takes attachment from send method below

            message.channel.send({
                embeds: [exampleEmbed],
                files: [
                    {
                        attachment: "./assets/tftea.png",
                        name: "aram.png",
                    },
                ],
            });
        }
        // ### sluipschutters ###
        if (message.content.toLowerCase().includes("boeie")) {
            const exampleEmbed = new MessageEmbed()
                .setColor("#E50000")
                .setImage("attachment://sluipschutter.png"); //takes attachment from send method below

            message.channel.send({
                embeds: [exampleEmbed],
                files: [
                    {
                        attachment: "./assets/SluipSchutters/boeie.png",
                        name: "sluipschutter.png",
                    },
                ],
            });
        } else if (message.content.toLowerCase().includes("allebei")) {
            const exampleEmbed = new MessageEmbed()
                .setColor("#E50000")
                .setImage("attachment://sluipschutter.png"); //takes attachment from send method below

            message.channel.send({
                embeds: [exampleEmbed],
                files: [
                    {
                        attachment: "./assets/SluipSchutters/allebei.png",
                        name: "sluipschutter.png",
                    },
                ],
            });
        } else if (
            censorArray.some((word) =>
                message.content.toLowerCase().includes(word.toLowerCase())
            )
        ) {
            var edit = message.content.toLowerCase().split(" ");
            messageContent = message.content.toLowerCase();
            for (var i = 0; i < edit.length; i++) {
                if (censorArray.some((word) => edit[i].includes(word))) {
                    messageContent = messageContent.replace(edit[i], "####");
                }
            }
            message.delete();
            message.channel.send(`${message.author.username}: ${messageContent}`);
        } else if (message.content.toLowerCase().includes("ik dacht dat dat kon")) {
            const exampleEmbed = new MessageEmbed()
                .setColor("#E50000")
                .setImage("attachment://sluipschutter.png"); //takes attachment from send method below

            message.channel.send({
                embeds: [exampleEmbed],
                files: [
                    {
                        attachment: "./assets/SluipSchutters/ikdachtdatdatkon.png",
                        name: "sluipschutter.png",
                    },
                ],
            });
        } else if (message.content.toLowerCase().includes("moet kunnen")) {
            const exampleEmbed = new MessageEmbed()
                .setColor("#E50000")
                .setImage("attachment://sluipschutter.png"); //takes attachment from send method below

            message.channel.send({
                embeds: [exampleEmbed],
                files: [
                    {
                        attachment: "./assets/SluipSchutters/moetkunnen.png",
                        name: "sluipschutter.png",
                    },
                ],
            });
        } else if (message.content.toLowerCase().includes("blij ")) {
            const exampleEmbed = new MessageEmbed()
                .setColor("#E50000")
                .setImage("attachment://sluipschutter.png"); //takes attachment from send method below

            message.channel.send({
                embeds: [exampleEmbed],
                files: [
                    {
                        attachment: "./assets/SluipSchutters/groteblij.png",
                        name: "sluipschutter.png",
                    },
                ],
            });
        }
        // ### lama ###
        if (
            lamaArray.some((word) =>
                message.content.toLowerCase().includes(word.toLowerCase())
            )
        ) {
            const exampleEmbed = new MessageEmbed()
                .setColor("#E50000")
                .setImage("attachment://lamazitte.png"); //takes attachment from send method below

            message.channel.send({
                embeds: [exampleEmbed],
                files: [
                    {
                        attachment: "./assets/lamazitte.png",
                        name: "lamazitte.png",
                    },
                ],
            });
        } //joeys neus

        if (message.content.toLowerCase().includes("nico")) {
            const exampleEmbed = new MessageEmbed()
                .setColor("#E50000")
                .setImage("attachment://nico.gif"); //takes attachment from send method below

            message.channel.send({
                embeds: [exampleEmbed],
                files: [
                    {
                        attachment: "./assets/nico.gif",
                        name: "nico.gif",
                    },
                ],
            });
        }

        const increasedRandom = {
            //Returns true if chance is met >0.9 and increases every time it fails.
            baseChance: 0.1,
            getRandom: function () {
                let treshhold = Math.random + this.baseChance;
                if (treshhold > 0.9) {
                    return true;
                } else {
                    this.baseChance += 0.1;
                    console.log(treshhold);
                    return false;
                }
            },
        };

        //&& increasedRandom.getRandom()
        if (
            (message.author.id === "183976222215110656" && false) ||
            message.content.toLowerCase().includes("joeytrigger")
        ) {
            // big joey meme
            const exampleEmbed = new MessageEmbed()
                .setColor("#E1C699")
                .setTitle("Grote neus!")
                .setImage("attachment://neus.png"); //takes attachment from send method below

            message.channel.send({
                embeds: [exampleEmbed],
                files: [
                    {
                        attachment: "./assets/neus/neus1.png",
                        name: "neus.png",
                    },
                ],
            });
            message.channel.send({
                embeds: [exampleEmbed],
                files: [
                    {
                        attachment: "./assets/neus/neus2.png",
                        name: "neus.png",
                    },
                ],
            });
            message.channel.send({
                embeds: [exampleEmbed],
                files: [
                    {
                        attachment: "./assets/neus/neus3.png",
                        name: "neus.png",
                    },
                ],
            });
        }
    },
};