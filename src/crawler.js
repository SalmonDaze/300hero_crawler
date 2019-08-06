const cheerio = require("cheerio")
const superagent = require("superagent")
const async = require("async")
const eventproxy = require("eventproxy")
const checkVaild = require('./checkVaild').checkVaild
const getData = require('./dataHandle').getData
const eventEmitter = require('./eventEmitter')
require('superagent-charset')(superagent)

const threeHData = (options, rescallback) => {
    let baseUrl = "http://300report.jumpw.com/match.html?id="
    let Gid = options.Gid //110031621
    let errLength = []
    let list = []
    let count = 1
    let allData = []
    eventEmitter.on("get_page", (eps) => {
        let currencyCount = 0
        let num = -4
        
        let fetchUrl = function (myurl, callback) {
            let fetchStart = new Date().getTime()
            currencyCount++
            num = num + 1
            superagent
                .get(myurl)
                .charset('utf-8')
                .end(function (err, ssres) {
                    let $ = cheerio.load(ssres.text, {decodeEntities: false})
                    if (err || !checkVaild($)) {
                        errLength.push(myurl)
                        callback(err, myurl + " error happened !")
                        return
                    }
                    let time = new Date().getTime() - fetchStart
                    console.log("抓取成功 ", ",耗时" + time + "毫秒")
                    currencyCount -= 1
                    getData($, (data) => {
                        console.log("成功抓取 " + count + "个网页")
                        callback(null, data)
                        allData = [...allData, ...data]
                        count++
                    })
                })
        }

        async.mapLimit(
            list,
            5,
            function (myurl, callback) {
                fetchUrl(myurl, callback)
            },
            function (err, result) {
                console.log("抓取完毕,一共抓取" + list.length + "条数据")
                console.log("不符合的链接共有" + errLength.length + "条")
                console.log(allData)
                rescallback(allData)
            }
        )
    })

    function getURL() {
        for (let i = 0; i < options.urlLength; i++) {
            list.push(`${baseUrl}${Gid++}`)
        }
        eventEmitter.emit("get_page")
    }

    getURL()
}



module.exports = threeHData