const express = require('express');
const path = require("path");

const argv = require('minimist')(process.argv.slice(2));
if (argv['h'] !== undefined || argv['port'] === undefined) {
    console.log('Usage: node serveCsv.js --port 9999');
} else {
    const port = argv['port'];

    const options = {
        dotfiles: 'ignore',
        etag: false,
        extensions: ['csv'],
        index: false,
        maxAge: '-1',
        redirect: false,
        setHeaders: function (res, path, stat) {
            res.set('content-type', 'text/csv; charset=utf-8');
            res.set('Access-Control-Allow-Origin', 'https://radar.thoughtworks.com');
        }
    }

    const app = express();
    app.use('/', express.static(path.join(__dirname, '.'), options));
    app.listen(port, () => console.log(`Ready to serve CSV files on port ${port}!`));
}