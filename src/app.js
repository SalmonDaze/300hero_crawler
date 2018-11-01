const cheerio = require('cheerio')
const charset = require('superagent-charset')
const superagent = require('superagent')
const async = require('async')
const express = require('express')
const eventproxy = require('eventproxy')
const ep = eventproxy()
const app = express()
const fs = require('fs')
const path = require('path')

const three_getData = ( options, rescallback)=>{
    app.get('/',function(req,res,next){
        let baseUrl = 'http://300report.jumpw.com/match.html?id='
        let Gid = options.Gid //110031621
        let errLength = []
        let list = []
        let count = 1
    
        ep.after('get_page',1,(eps)=>{
            let currencyCount = 0
            let num = -4
    
            let fetchUrl = function(myurl,callback){
                let fetchStart = new Date().getTime()
                currencyCount++
                num = num + 1
                console.log('现在的并发数是',currencyCount,',正在抓取的是',myurl)
                superagent.get(myurl).end(function(err,ssres){
                    let $ = cheerio.load(ssres.text)
    
                    if(err || !checkVaild($,myurl)){
                        errLength.push(myurl)
                        callback(err,myurl +' error happened !')
                        return next(err)
                    }
                    
    
                    let time = new Date().getTime() - fetchStart
                    console.log('抓取成功 ',',耗时'+time+'毫秒')
                    currencyCount--
    
                    getData($,(data)=>{
                        console.log('成功抓取 '+ count + '个网页' )
                        callback(null,data)
                        rescallback(data)
                        count++
                })
            })
        }
    
            async.mapLimit(list, 5, function(myurl,callback){
                fetchUrl(myurl,callback)
            },function(err,result){
                console.log('抓取完毕,一共抓取'+list.length+'条数据')
                console.log('不符合的链接共有'+errLength.length+'条')
            })
        })
    
        function getURL(){
            for(let i=0;i<options.urlLength;i++){
                list.push(`${baseUrl}${Gid++}`)
            }
            ep.emit('get_page',`get ${Gid} Successful!`)
        }
    
        getURL()
    
    })
    
        
    
    function checkVaild($,url){
        //检测比赛的模式,若为战场或者比赛人数不满14则跳过
        let datamsg = $('.datamsg').html()
        let matchType = datamsg.slice(39 ,datamsg.indexOf(' '))
        let playerCount = $('.datatable tbody > tr').length - 2
         if(matchType !== '&#x7ADF;&#x6280;&#x573A;' || playerCount != 14){
             return false
         }else{
            return true
         }
         
    }
    
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
        let table1 =  $('.datatable tbody > tr')
        let table2 = $('.list_bx .datatable').eq(1).children().children()
        for(let i=1;i<8;i++){
            let isWin = false
            let isWin1 = false
            let heroname =table1.eq(i).children().eq(1).text()
            let herokda = table1.eq(i).children().eq(2).text()
            let winStats = table1.eq(i).children().eq(3).text()
            let tower_destroy = table1.eq(i).children().eq(4).text()
            let farm = table1.eq(i).children().eq(5).text()
            let money = table1.eq(i).children().eq(6).text()
            let heroname1 = table2.eq(i).children().eq(1).text()
            let herokda1 = table2.eq(i).children().eq(2).text()
            let winStats1 = table2.eq(i).children().eq(3).text()
            let tower_destroy1 = table2.eq(i).children().eq(4).text()
            let farm1 = table2.eq(i).children().eq(5).text()
            let money1 = table2.eq(i).children().eq(6).text()
            isWin = winStats === ('胜利' || '首胜') ? true : false
            isWin1 = winStats1 === ('胜利' || '首胜') ? true : false
            let hero = {
                heroname : getHero(heroname),
                isWin : isWin,
                tower_destroy : tower_destroy,
                farm : farm,
                money : money,
                kda: JSON.stringify(getKda(herokda)),
            }
            let hero1 = {
                heroname : getHero(heroname1),
                isWin : isWin1,
                tower_destroy : tower_destroy1,
                farm : farm1,
                money : money1,
                kda: JSON.stringify(getKda(herokda1)),
            }
            dataArr.push(hero)
            dataArr.push(hero1)
            }
        callback(dataArr)
    }

    app.listen(3000)
}

module.exports = three_getData
