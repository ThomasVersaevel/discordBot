const fs = require("fs");
const birthDayJson = require("../birthdays.json");


/**
 * On message events
 */
module.exports = {
    name: 'birthdayEvent',
    // For each entry of birtDayJson check if today is their birth month and then day
    execute() {
        var today = new Date();
       // console.log(birthDayJson);
        for (var i = 0; i < birthDayJson.length; i++) {
            console.log("this is p: " + p)
        }
    }    
};