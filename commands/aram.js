const { SlashCommandBuilder } = require('@discordjs/builders');
const rp = require('request-promise');
const fs = require("fs");
const { apiKey } = require('../config.json');
const { Kayn, REGIONS } = require('kayn')


module.exports = {
    data: new SlashCommandBuilder()
		.setName('aram')
		.setDescription('Shows your aram stats')
        .addStringOption(option =>
			option.setName('lolname')
				.setDescription('Summoner Name')
				.setRequired(true)),
    async execute(interaction) {
        const kayn = Kayn(apiKey)({
            region: REGIONS.EUROPE_WEST,
            apiURLPrefix: 'https://%s.api.riotgames.com',
            locale: 'en_US',
            debugOptions: {
                isEnabled: true,
                showKey: false,
            },
            requestOptions: {
                shouldRetry: true,
                numberOfRetriesBeforeAbort: 3,
                delayBeforeRetry: 1000,
                burst: false,
                shouldExitOn403: false,
            },
            cacheOptions: {
                cache: null,
                timeToLives: {
                    useDefault: false,
                    byGroup: {},
                    byMethod: {},
                },
            },
        })
        console.log('starting kayn api request');
        
        kayn.Summoner.by
        .name(interaction.options.getString('lolname'))
        .region(REGIONS.EUROPE_WEST) 
        .callback(function(unhandledError, summoner) {
            kayn.Matchlist.by
                .accountID(summoner.accountId)
                /* Note that region falls back to default if unused. */
                .query({
                    season: 12,
                    queue: [220, 240],
                })
                .then(function(matchlist) {
                    console.log('actual matches:', matchlist.matches)
                    console.log('total number of games:', matchlist.totalGames)
                })
                .catch(console.error)
        })


        const efficiently = async () => {
			console.time('efficiently')
			const { accountId } = await kayn.Summoner.by.name(interaction.options.getString('lolname'))
			const { matches } = await kayn.Matchlist.by
				.accountID(accountId)
				.query({ queue: 420 })
			const gameIds = matches.slice(0, 10).map(({ gameId }) => gameId)
			const requests = gameIds.map(kayn.Match.get)
			const results = await Promise.all(requests)
			console.log(results[0], results.length)
			console.timeEnd('efficiently')
		}
		//efficiently();
		// const main = async () => {
		// 	await efficiently(kayn)
		//  }
        //module.exports = main
       // await interaction.reply();
    }
}