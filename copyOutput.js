const fsExtra = require('fs-extra')
const path = require('path')

const source = path.join(__dirname, 'radar.csv')
const destination = path.join(__dirname, 'items', 'radar.csv')

fsExtra
  .copy(source, destination)
  .then(() => console.log('File copied successfully'))
  .catch((err) => console.error('Error occurred while copying the file:', err))
