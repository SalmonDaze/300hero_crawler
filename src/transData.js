const fs = require('fs')
const mergeData = require('./mergeData')

let rawData = fs.readFileSync('data.json')
const data = mergeData(JSON.parse(rawData))()
fs.writeFileSync('merge.json', JSON.stringify(data))