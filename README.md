# mapUnder-points
地图下钻、地图点聚合
> 对前端代码不是太熟悉，有错误请提出，共同学习！

![map drill down](./src/main/resources/static/img/show.gif)
# 技术
SpringBoot   后端  
SpringBoot-thymeleaf、js   前端  
mysql   数据库  
# 数据库
使用时请先参考[添加数据库](./src/main/resources/sql)
# 地图下钻
参考：https://github.com/touxing/echarts3-chinese-map-drill-down  
参考上面的代码，在原基础上添加每个地区展示多个数据值，在原基础上增加后端代码。
# 地图点聚合
使用高德地图，请先请求高德key，[将key添加到js中](./src/main/resources/templates/coordinate.html)

使用右键返回上一层，全国->全省->全市(最大下钻到县区)->全县区的点聚合
