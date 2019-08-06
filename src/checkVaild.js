const $ = require('cheerio')

function checkVaild($) {
    //检测比赛的模式,若为战场或者比赛人数不满14则跳过
    const matchMsg = $('.datamsg')
    let matchType = /类型:([\u4e00-\u9fa5]*)/.test(matchMsg) && RegExp.$1
    let playerCount = $(".datatable tbody > tr").length - 2
    return matchType === "竟技场" && playerCount === 14
}

module.exports = {
    checkVaild
}