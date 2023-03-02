const ngrok = require('ngrok');
const startChrome = require("start-chrome");

const argv = require('minimist')(process.argv.slice(2));
if (argv['h'] !== undefined || argv['csv'] === undefined || argv['port'] === undefined) {
    console.log('Usage: node startRadarWithCsv.js --csv file.csv --port 9999');
} else {
    (async function() {
        const url = await ngrok.connect({addr: argv['port']});
        console.log(`Start radar with generated CSV file ${argv['csv']}`);
        startChrome(`https://radar.thoughtworks.com/?sheetId=${url}/${argv['csv']}`);
    })();
}