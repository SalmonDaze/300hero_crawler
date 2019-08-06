const threeHData = require('./crawler')

let options = {
    Gid:'128361474', //起始抓取场次的Gid
    urlLength:'1' // 总共抓取的url长度
}
threeHData(options, (data)=>{
    console.log(data)
})