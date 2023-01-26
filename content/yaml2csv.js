const yaml = require('js-yaml');
const fs = require('fs');
const jsonexport = require('jsonexport');
var argv = require('minimist')(process.argv.slice(2));
if (argv['h'] !== undefined || argv['i'] === undefined || argv['o'] === undefined) {
    console.log('Usage: node yaml2csv.js -i input.yaml -o output.csv');
} else {
    console.log(`Converting input YAML file ${argv['i']} to output CSV file ${argv['o']}`);
    try {
        const json = yaml.safeLoad(fs.readFileSync(argv['i'], 'utf8'));
        jsonexport(json, function(err, csv) {
            if(err) return console.log(err);
            fs.writeFileSync(argv['o'], csv);
        });
    } catch (e) {
        console.log(e);
    }
}