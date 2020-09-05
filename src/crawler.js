const cheerio = require("cheerio")
const superagent = require("superagent")
const checkVaild = require('./checkVaild').checkVaild
const getData = require('./parser').getData
const eventEmitter = require('./eventEmitter')
const proxyTest = require('./ippool')
const pLimit = require('p-limit')
const colors = require('colors')
const flatten = require('array-flatten')
const fs = require('fs')
require('superagent-charset')(superagent)
require('superagent-proxy')(superagent)

const baseUrl = "http://300report.jumpw.com/match.html?id="

const threeHData = async ({ Gid, urlLength, proxy}, cb) => {
    //let proxyList = await proxyTest()
    //console.log(proxyList)
    const limit = pLimit(3)
    //let pool = proxy ? await proxyTest(0) : []
    const errLength = []
    const list = []
    let count = 1
    eventEmitter.on("get_page", async() => {
        let tryTime = 0
        const taskQueue = list.map( ( url ) => {
            return limit(() => fetchUrl(url))
        })

        async function fetchUrl(myurl) {
            await sleep(800)
            console.log(`当前并发数为 ${limit.activeCount}`.rainbow)
            let fetchStart = new Date().getTime()
            //let proxyIp = pool[ Math.floor(Math.random() * pool.length) ]
            try{
                const result = await superagent
                                    .get(myurl)
                                    //.proxy(proxyIp)
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
                writeToFile($)

                return getData($)

            } catch(e) { 
                console.log(`请求失败: ${e}`.red.bgGreen)
                // errLength.push(myurl) 
                // pool = pool.filter( ip => ip !== proxy)
                // eventEmitter.emit('refreshPool')
                // if(pool.length === 0) {
                //     tryTime += 1
                //     pool = await proxyTest(tryTime * 100)
                // }
            }
            
        }

        (async ()=> {
            const result = await Promise.all(taskQueue)
            console.log(`抓取完毕, 成功抓取 ${list.length - errLength.length} 条网页`.green)
            cb(flatten(result))
        })()
    })

    function getUrl() {
        for (let i = 0; i < urlLength; i++) {
            list.push(`${baseUrl}${Gid++}`)
        }
        eventEmitter.emit("get_page")
    }
    getUrl()

}

function sleep(time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, time)
    })
}

function writeToFile($) {
    let data = getData($)
    data = data.map( i => JSON.stringify(i))
    fs.appendFileSync('./result/data.json', data.concat(['']).join(','), (err) => {
        if(err) console.log(err)
    })
}



module.exports = threeHData