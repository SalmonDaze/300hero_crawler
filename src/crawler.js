const cheerio = require("cheerio")
const superagent = require("superagent")
const checkVaild = require('./checkVaild').checkVaild
const getData = require('./dataHandle').getData
const eventEmitter = require('./eventEmitter')
const proxyTest = require('./ippool')
const pLimit = require('p-limit')
const colors = require('colors')
const flatten = require('array-flatten')
const fs = require('fs')
require('superagent-charset')(superagent)
require('superagent-proxy')(superagent)
const threeHData = async (options, cb) => {
    //let proxyList = await proxyTest()
    //console.log(proxyList)
    const limit = pLimit(5)
    let baseUrl = "http://300report.jumpw.com/match.html?id="
    let Gid = options.Gid //110031621
    let errLength = []
    let list = []
    let count = 1
    let allData = []
    eventEmitter.on("get_page", async () => {
        let currencyCount = 0
        let num = -4
        //const pool = await proxyTest()
        //console.log(pool)
        const taskQueue = list.map( url => {
            return limit(() => fetchUrl(url))
        })
        
        async function fetchUrl(myurl) {
            await sleep(800)
            console.log(`当前并发数为 ${limit.activeCount}`.rainbow)
            let fetchStart = new Date().getTime()
            num = num + 1
            try{
                const result = await superagent
                                    .get(myurl)
                                    //.proxy(pool[Math.floor(Math.random() * pool.length)])
                                    .timeout(4000)
                let $ = cheerio.load(result && result.text, {decodeEntities: false})
                if (!result || ( result && result.status !== 200 ) || !checkVaild($)) {
                    errLength.push(myurl)
                    console.log(`检测到无效场次,跳过`.red)
                    return []
                }
                let time = new Date().getTime() - fetchStart
                console.log(`抓取成功 ${count} 个网页成功,耗时 ${time} 毫秒`.blue)
                count++
                
                let data = getData($)
                data = data.map( i => JSON.stringify(i))
                fs.appendFileSync('data.json', data.concat(['']).join(','), (err) => {
                    if(err) console.log(err)
                })
                return getData($)

            } catch(e) { console.log('请求失败'.red.bgGreen);errLength.push(myurl) }
            
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

function sleep(time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, time)
    })
}



module.exports = threeHData