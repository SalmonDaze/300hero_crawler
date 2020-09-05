const threeHData = require('./crawler')
const mergeData = require('./merge')
const fs = require('fs')

let options = {
    Gid:'78094704', //起始抓取场次的Gid
    urlLength:'10000', // 总共抓取的url长度
    proxy: true,
}
threeHData(options, (data)=>{
    
})
