const cheerio = require("cheerio")
const superagent = require("superagent")
const async = require("async")
const eventproxy = require("eventproxy")
const checkVaild = require('./checkVaild').checkVaild
const getData = require('./dataHandle').getData
const eventEmitter = require('./eventEmitter')
const proxyTest = require('./ippool')
const pLimit = require('p-limit')
const colors = require('colors')
const flatten = require('array-flatten')
require('superagent-charset')(superagent)
require('superagent-proxy')(superagent)
const threeHData = async (options, cb) => {
    //let proxyList = await proxyTest()
    //console.log(proxyList)
    const limit = pLimit(3)
    let baseUrl = "http://300report.jumpw.com/match.html?id="
    let Gid = options.Gid //110031621
    let errLength = []
    let list = []
    let count = 1
    let allData = []
    eventEmitter.on("get_page", () => {
        let currencyCount = 0
        let num = -4
        
        console.log(list)
        const taskQueue = list.map( url => {
            return limit(() => fetchUrl(url))
        })
        console.log(taskQueue)
        async function fetchUrl(myurl) {
            console.log(`当前并发数为 ${limit.activeCount}`.rainbow)
            let fetchStart = new Date().getTime()
            num = num + 1
            const result = await superagent
                                    .get(myurl)
                                    //.proxy(proxyList[ Math.floor(Math.random() * proxyList.length) ])
                                    .timeout(4000)
            let $ = cheerio.load(result && result.text, {decodeEntities: false})
            if (result.status && result.status !== 200 || !checkVaild($)) {
                errLength.push(myurl)
                return []
            }
            let time = new Date().getTime() - fetchStart
            console.log("抓取成功 " + count + " 个网页成功,耗时" + time + " 毫秒")
            count++
            return getData($)
        }

        (async ()=> {
            const result = await Promise.all(taskQueue)
            console.log(`抓取完毕, 成功抓取 ${list.length - errLength.length} 条网页`.green)
            cb(flatten(result))
        })()
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