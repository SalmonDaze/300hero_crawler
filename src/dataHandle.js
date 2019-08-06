
/**
 * 
 * @param {string} str 待处理字符串
 * 
 * @return {string} 返回英雄名称
 */

function getHero(str) {
    const heroNameReg = /\)([^\(.*\)]*)/
    const heroName = heroNameReg.test(str) && RegExp.$1
    return heroName
}

/**
 * 
 * @param {string} str kda字符串 10/5/6
 * 
 * @return {object} 返回处理过的kda对象
 */
function getKda(str) {
    const arr = str.split("/")
    let [ kill, death, assist ] = arr
    return obj = {
        kill,
        death,
        assist
    }
    
}
function getData($, callback) {
    let dataArr = []
    let table1 = $(".datatable tbody > tr")
    let table2 = $(".list_bx .datatable")
        .eq(1)
        .children()
        .children()
    for (let i = 1; i < 8; i++) {
        let isWin = false
        let isWin1 = false
        let heroname = table1
            .eq(i)
            .children()
            .eq(1)
            .not('a')
            .text()
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
        let heroname1 = table2
            .eq(i)
            .children()
            .eq(1)
            .text()
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
        isWin = winStats === ("胜利" || "首胜") ? true : false
        isWin1 = winStats1 === ("胜利" || "首胜") ? true : false
        let hero = {
            heroname: getHero(heroname),
            isWin: isWin,
            tower_destroy: tower_destroy,
            farm: farm,
            money: money,
            kda: getKda(herokda)
        }
        let hero1 = {
            heroname: getHero(heroname1),
            isWin: isWin1,
            tower_destroy: tower_destroy1,
            farm: farm1,
            money: money1,
            kda: getKda(herokda1)
        }
        dataArr.push(hero)
        dataArr.push(hero1)
    }
    callback(dataArr)
}

module.exports = {
    getData
}