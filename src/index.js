const threeHData = require('./crawler')
const mergeData = require('./mergeData')
const fs = require('fs')

let options = {
    Gid:'128373573', //起始抓取场次的Gid
    urlLength:'500' // 总共抓取的url长度
}
threeHData(options, (data)=>{
    
})
let rawData = fs.readFileSync('data.json')
const data = mergeData(JSON.parse(rawData))()
fs.writeFileSync('merge.json', JSON.stringify(data))