const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const winslosses = require('../winslosses.json');
const oldmatchlist = require('../oldmatchlist.json');
const shortcuts  = require('../api-shortcuts.json');
const fetch = require('node-fetch');
const { apiKey } = require('../config.json');
const { convertLolName, getDbClient, } = require('../globals.js');
const fs = require('fs');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('addaramstats')
        .setDescription('Adds your aram wins and losses for the /aramwr command')
        .addStringOption(option =>
            option.setName('lolname')
                .setDescription('Summoner Name')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('wins')
                .setDescription('Wins')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('losses')
                .setDescription('Losses')
                .setRequired(true)),
    async execute(interaction) {

        // get data from command
        let username = convertLolName(interaction.options.getString('lolname'));
        let wins = interaction.options.getString('wins');
        let losses = interaction.options.getString('losses');

        const link = `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${username}?api_key=${apiKey}`
        const response = await fetch(link);
        let data = await response.json();
        //console.log(data);
        patchNr = shortcuts['patch'];
        let icon = `http://ddragon.leagueoflegends.com/cdn/${patchNr}/img/profileicon/${data.profileIconId}.png`

        var exampleEmbed = new MessageEmbed()
            .setColor('#BBBBBB')
            .setTitle(data.name)
            .setThumbnail('attachment://icon.png');

        fs.readFile('./winslosses.json', "utf8", (err, winslosses) => {
            if (err) {
                console.log("File read failed:", err);
                return;
            }
        });
        fs.readFile('./oldmatchlist.json', "utf8", (err, oldmatchlist) => {
            if (err) {
                console.log("File read failed:", err);
                return;
            }
        });

        // check if username already exists
        if (!winslosses.hasOwnProperty(username)) {
            winslosses[username] = {"wins": parseInt(wins), "losses": parseInt(losses)};
            oldmatchlist[username] = [0,0];

            winslossesJ = JSON.stringify(winslosses);
            oldmatchlistJ = JSON.stringify(oldmatchlist);
            fs.writeFile('./winslosses.json', winslossesJ, err => {
                if (err) {
                    console.log('Error writing file', err)
                }
            });
            fs.writeFile('./oldmatchlist.json', oldmatchlistJ, err => {
                if (err) {
                    console.log('Error writing file', err)
                }
            });


            exampleEmbed.addFields( { name: '\u200b', value: 'Added ' + data.name + '\'s aram stats to the list', inline: true } );
        } else { // if already present
            exampleEmbed.addFields( { name: '\u200b', value: data.name + ' is already in the list', inline: true } );
        }        

        // const dataEntry = await findInDb({$and: [ {lolname: {$exists: true}}, 
        //     {lolname: {$eq: username}}]}, "aramWinrate", function(err, foundObj){
        //         if (foundObj) {
        //             console.log(foundObj);
        //         }
        //         else {
        //             console.log("No entry found");
        //         }
        // });

        // console.log(dataEntry);
        
        // addToDb({lolname: username, wins: parseInt(wins), losses: parseInt(losses)}, function(err, insertedObj) {
        //     console.log(insertedObj);
        // });
        // exampleEmbed.addFields( { name: '\u200b', value: 'Found ' + dataEntry, inline: true } );

        await interaction.reply({
            embeds: [exampleEmbed],
            files: [{
                attachment: icon,
                name: 'icon.png'
            }], ephemeral: true
        });

        function addToDb(addQuery, callback) {
            const client = getDbClient();
            const dbo = client.db("LolStats");
            dbo.collection("aramWinrate").insertOne(addQuery), function(err, obj) {
                if (err) throw err;
                console.log("1 document inserted");
                db.close();
                if (obj) {
                    return callback(null, obj);
                }
            }
        }

        async function findInDb(findQuery, collectionName, callback) {
            const client = getDbClient();
            const dbo = client.db("LolStats");
            dbo.collection(collectionName).find(findQuery, function(err, obj){
                if(err){
                    return callback(err);
                } else if (obj){
                    console.log("Found obj");
                    return callback(null, obj);
                } else {
                    console.log("Failed to find in db");
                    return callback();
                }
            });
        }
    },
};
