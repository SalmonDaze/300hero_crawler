const threeHData = require('./crawler')
const mergeData = require('./mergeData')
const fs = require('fs')

let options = {
    Gid:'128373573', //起始抓取场次的Gid
    urlLength:'10' // 总共抓取的url长度
}
threeHData(options, (data)=>{
    let res = mergeData(data)
    console.log(res())
    let str = JSON.stringify(res())
    fs.writeFile('data.json',str,function(err){
        if (err) { console.log(err) }
    })
})