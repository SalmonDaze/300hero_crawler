function convertData(obj, target) {
    for(let i in obj) {
        if( i !== 'winRound' && i !== 'round' ){
            obj[ i ] = +obj[ i ]
            obj[ i ] += +target[ i ]
        }
    }
    obj.winRound = target.isWin ? obj.winRound + 1 : obj.winRound
    obj.round += 1
}

function mergeData(arr) {
    let allData = {}
    return function() {
        for( const prop of arr ) {
            if( prop.heroname in allData ) {
                convertData( allData[ prop.heroname ], prop )

            } else {
                allData[ prop.heroname ] = {
                    tower_destroy: prop.tower_destroy,
                    farm: prop.farm,
                    money: prop.money,
                    kill: prop.kill,
                    death: prop.death,
                    assist: prop.assist,
                    winRound: ~~prop.isWin,
                    round: 1
                }
            }
        }
        return allData
    }
}

module.exports = mergeData