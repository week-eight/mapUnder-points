/**
 * 抽取出公共的配置文件
 *
 */
//34个省、市、自治区的名字拼音映射数组
var provinces = {
  //23个省
  台湾: 'taiwan',
  河北: 'hebei',
  山西: 'shanxi',
  辽宁: 'liaoning',
  吉林: 'jilin',
  黑龙江: 'heilongjiang',
  江苏: 'jiangsu',
  浙江: 'zhejiang',
  安徽: 'anhui',
  福建: 'fujian',
  江西: 'jiangxi',
  山东: 'shandong',
  河南: 'henan',
  湖北: 'hubei',
  湖南: 'hunan',
  广东: 'guangdong',
  海南: 'hainan',
  四川: 'sichuan',
  贵州: 'guizhou',
  云南: 'yunnan',
  陕西: 'shanxi1',
  甘肃: 'gansu',
  青海: 'qinghai',
  //5个自治区
  新疆: 'xinjiang',
  广西: 'guangxi',
  内蒙古: 'neimenggu',
  宁夏: 'ningxia',
  西藏: 'xizang',
  //4个直辖市
  北京: 'beijing',
  天津: 'tianjin',
  上海: 'shanghai',
  重庆: 'chongqing',
  //2个特别行政区
  香港: 'xianggang',
  澳门: 'aomen'
}
//直辖市和特别行政区-只有二级地图，没有三级地图
var special = ['北京', '天津', '上海', '重庆', '香港', '澳门']
//china.json 文件
let chinaJson = 'map/china.json'
let provinceJson = 'map/province/'
let cityJson = 'map/city/'
var mapdata = []
let geoCoordMap = {}
//存储切换的每一级地图信息
let mapStack = []
let curMap = {}
//初始化地图配置
let option = {}

var max = 480,
  min = 9
var maxSize4Pin = 100,
  minSize4Pin = 20

//默认当前月份时间
let now = new Date()
let year = now.getFullYear()
let month =
  now.getMonth() + 1 > 9 ? now.getMonth() + 1 : '0' + (now.getMonth() + 1)
let searchtime = year + '-' + month
let lastMonth = year + '-' + (month - 1)
// console.log(lastMonth);
// 如果没有传递时间参数tmonth，默认当前月份
function getQueryString(name) {
  var reg = new RegExp(name + '=(.*)?', 'i')
  var r = window.location.search.substr(1).match(reg)
  if (r != null) return unescape(r[1])
  return null
}
let tmonth = getQueryString('tmonth')
if (tmonth) {
  searchtime = tmonth.substr(0, 7)
  year = tmonth.substr(0, 4)
}
console.log(tmonth, searchtime)
function getPrefixUrlPath() {
  let reg = new RegExp('(.*/)', 'i')
  let prefixUrl = self.location.href.match(reg)[0]
  return prefixUrl
}
//跳转前缀url
let baseUrl = getPrefixUrlPath()
let argTmonth = '&tmonth=' + searchtime
// let getProvNumberUrl = 'mock/province.json'
let getProvNumberUrl = 'nationwide'
let getCityNumberUrl = 'mock/city/'
// let getCityNumberUrl = 'city'
let getAreaNumberUrl = 'mock/area'
let getRegionPreMonthCusUrl = ''

/** 获取全国省份客户数、销售额 */
let customerNum = []
let provinceSaleData = []
let lastMonthData = []
//获取城市销售数据
let citySaleData = []
//获取区域销售数据
let areaSaleData = []
//排序数据
let sortData = []
let sortSaleData = []
//销售排序标题
let saleTitleData = []
let lastMonthSortData = []
//排序后的标题
let titledata = []
function numDescSort(a, b) {
  return a['value'] - b['value']
}

var domain = document.domain
// console.log(domain)
var domain = window.location.href
// console.log(domain)
//去除鼠标默认右键菜单
let tree = document.getElementById('main')
tree.oncontextmenu = function() {
  return false
}

/**
 * @description: 封装请求方法
 * @param {String}  url
 * @param {String}  exist
 * @param {String}  searchtime='2018-05-01'
 * @param {Object} postData=请求参数
 * @return:
 */
function ajaxRequest(url, searchtime, postData = {}) {
  searchtime = searchtime || searchtime
  let data = {
    key: 'key',
    searchtime: searchtime
  }
  data[postData['parentid']] = postData['value']
  data['region'] = postData['region']
  data['year'] = postData['year']
  console.log("ajaxdata", data);
  return $.ajax({
    url,
    method: 'GET',
    dataType: 'json',
    data: data,
    headers: {
      'content-type': 'application/json'
    }
  })
}


function stringToJson(data) {
  let result = Object.create(null)
  if (Object.prototype.toString.call(data) !== '[object Object]') {
    try {
      result = JSON.parse(data)
    } catch {
      throw TypeError('数据转换成JSON出错')
    }
  }
  return result
}
