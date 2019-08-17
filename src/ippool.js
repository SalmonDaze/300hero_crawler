const cheerio = require("cheerio")
const superagent = require("superagent")
require('superagent-charset')(superagent)
require('superagent-proxy')(superagent)
let ip = require('./ip')

const url = 'http://www.66ip.cn/mo.php?sxb=&tqsl=100&port=&export=&ktip=&sxa=&submit=%CC%E1++%C8%A1&textarea=http%3A%2F%2Fwww.66ip.cn%2F%3Fsxb%3D%26tqsl%3D100%26ports%255B%255D2%3D%26ktip%3D%26sxa%3D%26radio%3Dradio%26submit%3D%25CC%25E1%2B%2B%25C8%25A1'

function getProxyIp() {
    return new Promise((resolve, reject) => {
        superagent
            .get(url)
            .charset('utf-8')
            .end(function (err, res) {
                try {
                    if( err ) throw err
                    const $ = cheerio.load(res.text, {decodeEntities: false})
                    let ipArray = $('body').text().match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d{1,4}/g)
                    ipArray = ipArray.map(( i ) => 'http://' + i)
                    resolve(ipArray)
                } catch(e) {
                    return reject(e)
                }
                
            })
    })
}

function testIp( ip ) {
    return new Promise((resolve, reject) => {
            superagent
                .get('https://www.baidu.com/')
                .proxy(ip)
                .timeout(3000)
                .end((err, rres) => {
                    try {
                        if( rres && rres.status === 200 ) resolve(ip)
                        if(err) throw(err)
                    } catch(e) {
                        return reject(e)
                    }
                })
        
    })
}

async function proxyTest() {
    let enableIp = []
    let proxyIpList = ip.map(i => `${i.protocol.toLowerCase()}://${i.ip}:${i.port}`)
    console.log(proxyIpList.length)
    //let proxyIpList = await getProxyIp()
    for(let i = 0 ; i < proxyIpList.length - 400  ; i++ ) {
        console.log('测试IP可用进度: ' + Math.floor( i / (proxyIpList.length - 400) * 100) + '%')
        try{
            enableIp.push(await testIp(proxyIpList[i]))
        } catch(e) {
            //console.log(e)
        }
    }
    console.log('当前可用ip池: ' + enableIp)
    return enableIp
}

module.exports = proxyTest