const cheerio = require('cheerio')
const charset = require('superagent-charset')
const superagent = require('superagent')
const async = require('async')
const express = require('express')
const eventproxy = require('eventproxy')
const ep = eventproxy()
const app = express()
const fs = require('fs')

charset(superagent)

let baseUrl = 'http://300report.jumpw.com/match.html?id='
let Gid = 110031621
errLength = []
list = []

app.get('/',function(req,res,next){
    
    (function(url){
        superagent.get(url).charset('utf-8').end((err,sres)=>{
            if(err){
                console.log(`抓取${url}时出错！`)
            }
            ep.emit('get_page',`get ${Gid} Successful!`)
        })
    })(`${baseUrl}${Gid}`)

    ep.after('get_page',1,(eps)=>{
        let currencyCount = 0
        let num = -4

        let fetchUrl = function(myurl,callback){
            let fetchStart = new Date().getTime()
            currencyCount++
            num = num + 1
            console.log('现在的并发数是',currencyCount,',正在抓取的是',myurl)
            superagent.get(myurl).charset('utf-8').end(function(err,ssres){
                if(err){
                    callback(err,myurl +' error happened !')
                    errLength.push(myurl)
                    return next(err)
                }

                let time = new Date().getTime() - fetchStart
                console.log('抓取' + myurl + ' 成功 ',',耗时'+time+'毫秒')
                currencyCount--

                let $ = cheerio.load(ssres.text)
                getData($,(data)=>{
                    console.log(data.join(','))
                })
            })
        }

        async.mapLimit(list,5,function(myurl,callback){
            fetchUrl(myurl,callback)
        },function(err,result){
            console.log('抓取完毕')
        })
    })

})

function getHero(str){
    let arr = str.split('')
    let start = arr.indexOf(')') + 1
    let end = arr.lastIndexOf('(')
    let heroname = arr.slice(start,end).join('')
    return heroname
}

function getKda(str){
    let arr = str.split('/')
    let obj = {
        kill:arr[0],
        death:arr[1],
        assist:arr[2],
    }
    return obj
}
function getData($,callback){
    let dataArr = []
    for(let i=1;i<8;i++){
        let isWin = false
        let isWin1 = false
        let heroname = $('.datatable tbody tr').eq(i).children().eq(1).text()
        let herokda = $('.datatable tbody tr').eq(i).children().eq(2).text()
        let winStats = $('.datatable tbody tr').eq(i).children().eq(3).text()
        let tower_destroy = $('.datatable tbody tr').eq(i).children().eq(4).text()
        let farm = $('.datatable tbody tr').eq(i).children().eq(5).text()
        let money = $('.datatable tbody tr').eq(i).children().eq(6).text()
        let heroname1 = $('.list_bx .datatable').eq(1).children().children().eq(i).children().eq(1).text()
        let herokda1 = $('.list_bx .datatable').eq(1).children().children().eq(i).children().eq(2).text()
        let winStats1 = $('.list_bx .datatable').eq(1).children().children().eq(i).children().eq(3).text()
        let tower_destroy1 = $('.list_bx .datatable').eq(1).children().children().eq(i).children().eq(4).text()
        let farm1 = $('.list_bx .datatable').eq(1).children().children().eq(i).children().eq(5).text()
        let money1 = $('.list_bx .datatable').eq(1).children().children().eq(i).children().eq(6).text()
        isWin = winStats === ('胜利' || '首胜') ? true : false
        isWin1 = winStats1 === ('胜利' || '首胜') ? true : false
        let hero = {
            heroname : getHero(heroname),
            isWin : isWin,
            tower_destroy : tower_destroy,
            farm : farm,
            money : money,
            kda: getKda(herokda),
        }
        let hero1 = {
            heroname : getHero(heroname1),
            isWin : isWin1,
            tower_destroy : tower_destroy1,
            farm : farm1,
            money : money1,
            kda: getKda(herokda1),
        }
        dataArr.push(hero)
        dataArr.push(hero1)
        }
    callback(dataArr)
}

function wFile(data){
    fs.writeFile('../result/result.txt',data,function(err){
        if(err){
            console.log('写入失败')
        }else{
            console.log('写入成功！')
        }
    })
}

app.get('/write',(req,res)=>{
    wFile()
})

app.listen(3000,()=>{
    console.log('Server is running')
})