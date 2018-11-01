## NodeJS + Express 300英雄战绩网爬虫

## 安装

    npm install three-crawler --save

## 使用
    const threeCrawler = require('three-crawler')

    let options = {
        Gid:'110031621' //起始抓取场次的Gid
        urlLength:'100' // 总共抓取的url长度
    }
    threeCrawler(options, (data)=>{
        console.log(data)
    })

## License 

MIT
        
