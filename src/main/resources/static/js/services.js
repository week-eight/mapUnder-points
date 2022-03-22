/*
 * @Author: hotsuitor@qq.com
 * @Date: 2019-08-16 10:29:47
 * @LastEditors: hs
 * @LastEditTime: 2020-04-10 09:46:45
 * @Description: 爬虫爬取mock数据的代码，使用demo文件的代码不需要用到
 */
const http = require('http')
const fs = require('fs')
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}
http
  .createServer((request, response) => {
    response.writeHead(200, {
      'Content-Type': 'application/json;chartset=utf-8'
    })
    let result = fs.readFileSync(
      resolve('../../mock/province.json'),
      'utf-8',
      (err, data) => {
        if (err) {
          throw new Error('读取文件出错')
        }
        console.log(data)
        return data
      }
    )
    response.end(result)
  })
  .listen(8889)

// 终端打印如下信息
console.log('Server running at http://127.0.0.1:8889/')
