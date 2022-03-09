const { SlashCommandBuilder } = require('@discordjs/builders');
const rp = require('request-promise');
const fs = require("fs");
const puppeteer = require('puppeteer');
const $ = require('cheerio');
//const package = require("./package.json");
var url = 'http://na.op.gg/summoner/userName=';

module.exports = {
    data: new SlashCommandBuilder()
		.setName('aram')
		.setDescription('Shows your aram stats!')
        .addStringOption(option =>
			option.setName('lolname')
				.setDescription('Summoner Name')
				.setRequired(true)),
    async execute(interaction) {
        
        /*
        What I could do is print out the rank and stats in that box (in a emmbed message),
        then take a photo of the top 3 or so champions that user has played and display below. 
        */
        //const args = interaction.content.slice(package.prefix.length).trim().split(/ +/g);

        const args  = interaction.options.getString('lolname')

        let urlAdd = ""+args;
       
        urlWithName = url + urlAdd;
        console.log(urlWithName);

        const puppeteer = require('puppeteer');

        async function run() {
            // let browser = await puppeteer.launch();//({ headless: false });
            const browser = await puppeteer.launch({
                ignoreHTTPSErrors: true,
                args: ['--disable-setuid-sandbox', '--no-sandbox']
            })
            let page = await browser.newPage();
            await page.setViewport({ width: 1920, height: 1080 });
            await page.goto(urlWithName);
            await page.screenshot({ path: './image.png', clip: { x: 460, y: 600, width: 300, height: 1033 } });
            await interaction.reply(urlAdd + " Stats", { files: ["image.png"] });
            console.log("here");
            browser.close();
        }

        // async function deleteFile() {
        //     console.log("here2");
        //     const file = 'image.png';

        //     await fs.access(file, fs.constants.F_OK, (err) => {
        //         `${file} ${err ? ImgExists = false : ImgExists = true}`;
        //     });
        //     if (ImgExists) {
        //         fs.unlink('image.png', (err) => {
        //             if (err) throw err;
        //             console.log('image.png was deleted');
        //         });
        //     }
        // }

        run();
       // deleteFile()

        puppeteer
        .launch()
        .then(function (browser) {
            return browser.newPage();
        })
        .then(function (page) {
            return page.goto(url).then(function () {
                return page.content();
            });
        })
        .then(function (html) {
            $('.wins', html).each(function () {
                console.log($(this).text());
                interaction.reply($(this).text());
            });
            $('.losses', html).each(function () {
                console.log($(this).text());
            });
            $('.winratio', html).each(function () {
                console.log($(this).text());
            });
            $('.LeagueName', html).each(function () {
                console.log($(this).text());
            });
            $('.tierRank', html).each(function () {
                console.log($(this).text());
            });
            $('.ChampionName', html).each(function () {
                console.log($(this).text());
            });

            // console.log($('.wins', html).text());
        })
        .catch(function (err) {
            //handle error
        });
    }
}