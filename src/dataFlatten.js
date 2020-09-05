const fs = require('fs')
const mergeData = require('./merge')

let rawData = fs.readFileSync('./result/data.json')
const data = mergeData(JSON.parse(rawData))()
fs.writeFileSync('./result/merge.json', JSON.stringify(data))