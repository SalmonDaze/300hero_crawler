const flatten = require('array-flatten')

/**
 * 
 * @param {string} str 待处理字符串
 * 
 * @return {string} 返回英雄名称
 */

/**
 * 
 * @param {string} str kda字符串 10/5/6
 * 
 * @return {object} 返回处理过的kda对象
 */
function getKda(str) {
    const arr = str.split("/")
    let [ kill, death, assist ] = arr
    return {
        kill,
        death,
        assist
    }

}

function getData($) {
    let dataArr = []
    let table1 = $(".datatable").eq(0).find('tr')
    let table2 = $(".datatable").eq(1).find('tr')
    for (let i = 1; i < 8; i++) {
        let isWin = false
        let isWin1 = false
        let heroname = /\([0-9]+\)(.*)\(lv\.[0-9]+\)/.test(table1
            .eq(i)
            .children()
            .eq(1)
            .text()) && RegExp.$1
        let herokda = table1
            .eq(i)
            .children()
            .eq(2)
            .text()
        let winStats = table1
            .eq(i)
            .children()
            .eq(3)
            .text()
        let tower_destroy = table1
            .eq(i)
            .children()
            .eq(4)
            .text()
        let farm = table1
            .eq(i)
            .children()
            .eq(5)
            .text()
        let money = table1
            .eq(i)
            .children()
            .eq(6)
            .text()
        let heroname1 = /\([0-9]+\)(.*)\(lv\.[0-9]+\)/.test(table2
            .eq(i)
            .children()
            .eq(1)
            .text()) && RegExp.$1
        let herokda1 = table2
            .eq(i)
            .children()
            .eq(2)
            .text()
        let winStats1 = table2
            .eq(i)
            .children()
            .eq(3)
            .text()
        let tower_destroy1 = table2
            .eq(i)
            .children()
            .eq(4)
            .text()
        let farm1 = table2
            .eq(i)
            .children()
            .eq(5)
            .text()
        let money1 = table2
            .eq(i)
            .children()
            .eq(6)
            .text()
        isWin = winStats.indexOf('胜') > -1 ? true : false
        isWin1 = winStats1.indexOf('胜') > -1 ? true : false
        const {
            kill,
            death,
            assist
        } = getKda(herokda)
        const kda1 = getKda(herokda1)
        let hero = {
            heroname:heroname,
            isWin: isWin,
            tower_destroy: tower_destroy,
            farm: farm,
            money: money,
            kill,
            death,
            assist
        }
        let hero1 = {
            heroname: heroname1,
            isWin: isWin1,
            tower_destroy: tower_destroy1,
            farm: farm1,
            money: money1,
            kill: kda1.kill,
            death: kda1.death,
            assist: kda1.assist
        }
        dataArr.push(hero)
        dataArr.push(hero1)
    }
    return flatten(dataArr)
}

module.exports = {
    getData
}