const threeHData = require('./crawler')
const mergeData = require('./mergeData')
const fs = require('fs')

let options = {
    Gid:'128373573', //起始抓取场次的Gid
    urlLength:'10', // 总共抓取的url长度
    proxy: true,
}
threeHData(options, (data)=>{
    
})
