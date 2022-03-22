/**
 * @author hotsuitor@qq.com
 * @createTime 2018/2/23
 * @version v3.0  2018/4/3
 * @version v3.1  2018/4/10
 * @version v3.3  2018/4/12
 */
//地图容器
var chart = echarts.init(document.getElementById('main'))
chart.showLoading()

loadMap(searchtime)

/**
 * 封装绘制地图函数，month 改变 map重新渲染
 */
function loadMap(searchtime) {
    let mapName = '中国';
    //绘制全国地图
    $.getJSON(chinaJson, function (data) {
        chart.hideLoading();
        mapChina = data;
        let mapJsonData = [] // 组装临时数据，用于地图上 label和value的渲染
        for (var i = 0; i < data.features.length; i++) {
            mapJsonData.push({
                id: data.features[i].id,
                name: data.features[i].properties.name,
            })
        }
        $('#select-date').val(searchtime);

        //注册地图
        echarts.registerMap(mapName, data);
        //绘制地图，样式，第一次渲染
        renderMap(mapName, data);

        /**获取省份数据*/
        Promise.all([ajaxRequest(getProvNumberUrl, searchtime)]).then(
            (result) => {
                renderPrimaryMap(result);
            },
            (error) => {
                console.error('拿不到省份数据');
                alert("没有找到资源");;
            }
        )

        /**
         * @description: 渲染二级地图，城市
         * @param {Array}  result=后台返回的地区关联数据
         * @param {Boolean} flag=不用后台数据渲染
         * @return:
         */
        function renderPrimaryMap(result) {
            let tmp = [];
            curMonthResult = result[0];
            if (curMonthResult.errcode == 1) {
                tmp = valueType(curMonthResult);
            }
            //获取最大值，并排序
            let maxData = getMaxDataAndSort(tmp);
            //绘制地图，拿到数据后再渲染一次
            renderMap(mapName, data, tmp, maxData.maxData);
        }
    })
}

/**
 * 数据处理
 * @param curMonthResult 响应数据
 * @returns {[]}
 */
function valueType(curMonthResult) {
    let tmp = [];
    for (let i = 0; i < curMonthResult.msg.length; i++) {
        tmp.push({
            id: curMonthResult.msg[i].cityid, //需要加上cityid传递渲染，下一级地图渲染需要用到
            name: curMonthResult.msg[i].city,
            value: curMonthResult.msg[i].orderCount,
            value2: curMonthResult.msg[i].driverNumber,
            value3: curMonthResult.msg[i].vehicleNumber
        })
    }
    return tmp;
}

function jump(division) {
    console.log(division);
    location.href='coordinate?'+'division=' + encodeURI(division);
}

//地图单击事件
chart.on('click', function (params) {
    // 没有省id，有市id  证明目前地图在市中
    if (!params.data.id && params.data.cityid) {
        let area = params.data.cityid.substring(0, 2);
        if (area == 50 || area == 31 || area == 12 || area == 11) {
            console.error('直辖市 - 该地图没有下一级地区了');
            jump(params.data.cityid);
            return;
        }
        if (params.data.cityid.substring(4, 6) !== '00') {
            console.error('该地图没有下一级地区了');
            jump(params.data.cityid);
            return;
        }
    }
    //隐藏右键返回菜单
    $('#contextMenu').hide()
    let mapJsonData = [] // 渲染地图name的数组
    if (params.name in provinces) {
        //二级直辖市数据渲染
        if (special.indexOf(params.name) >= 0) {
            let postData2 = {
                parentid: 'provinceid',
                value: params.data.id,
            }
            if (params.data.id == 500000 || params.data.id == 310000 || params.data.id == 120000 || params.data.id == 110000) {
                getSecondMap(params);
            } else {
                getAreaNumber(params.name, params.data.id, searchtime);
            }
        } else {
            let postData2 = {
                parentid: 'provinceid',
                value: params.data.id,
            }
            //如果点击的是34个省、市、自治区，绘制选中地区的二级地图
            getSecondMap(params)
        }
    } else {
        //显示县级地图
        getThridMap(params)
    }

    /**
     * @description: 请求获取二级地图json文件
     * @param {Object} params=地图参数
     * @return:
     */
    function getSecondMap(params) {
        $.getJSON(provinceJson + provinces[params.name] + '.json', function (data) {
            echarts.registerMap(params.name, data)
            for (var i = 0; i < data.features.length; i++) {
                // 读取地图的 name 用来组成 echart 需要的形式
                mapJsonData.push({
                    name: data.features[i].properties.name,
                    value: Math.floor(Math.random() * 10000),
                })
            }
            renderMap(params.name, mapJsonData)
            if (params.data.id !== 'undifiend') {
                getCityNumber(params.name, params.data.id, searchtime, data)
            }
        })
    }

    /**
     * @description: 请求获取三级地图json文件
     * @param {Object} params=地图参数
     * @return:
     */
    function getThridMap(params) {
        $.getJSON(cityJson + cityMap[params.name] + '.json', function (data) {
            echarts.registerMap(params.name, data)
            let mapJsonData = []
            for (var i = 0; i < data.features.length; i++) {
                mapJsonData.push({
                    name: data.features[i].properties.name,
                })
            }
            renderMap(params.name, mapJsonData)

            if (params.data.cityid) {
                let postData3 = {
                    parentid: 'cityid',
                    value: params.data.cityid,
                }
                //这里传递的城市名有问题“北京市”，渲染地图的名字是“北京”，所以地图名要用原来的名字渲染
                getAreaNumber(params.name, params.data.cityid, searchtime, data)
            }
        })
    }

    /**
     * 绑定数据入栈事件
     */
    let n = 1
    if (special.indexOf(params.seriesName) == -1) {
        n = 2
    }
    // FiXED:  2级下钻会有问题， 函数顶部加入下钻层级判断
    if (mapStack.length < n) {
        //将上一级地图信息压入mapStack
        mapStack.push({
            mapName: curMap.mapName,
            mapJson: curMap.mapJson,
            colorMax: curMap.colorMax,
            sortData: curMap.sortData,
            titledata: curMap.titledata,
        })
    }
})

/**
 * 右键直接返回上一级
 */
chart.on('contextmenu', (params) => {
    goBack()
})

/**
 * 封装返回上一级事件
 */
function goBack() {
    //获取上一级地图信息
    let map = mapStack.pop()
    if (!map) {
        console.log('没有入栈数据了')
        return
    }
    echarts.registerMap(map.mapName, map.mapJson)
    sortData = map.sortData
    titledata = map.titledata
    renderMap(map.mapName, map.mapJson, map.sortData, map.colorMax)
}

/**
 *
 * @param {地图标题} mapTitle
 * @param {客户数} customerNum
 * @param {地图json数据} mapJson
 * @param {最大颜色值} colorMax
 */
function renderMap(mapTitle, mapJson, customerNum,  colorMax = 1500) {
    //地图配置参数，参数按顺序渲染
    option = {
        backgroundColor: '#F7EED6', //地图画布背景颜色  "#F7EED6"米黄色  "#efefef"灰色
        title: {
            //地图文本
            text: mapTitle,
            subtext: '右键返回上一级',
            left: 'center',
            textStyle: {
                color: '#000',
                fontSize: 26,
                fontWeight: 'normal',
                fontFamily: 'Microsoft YaHei',
            },
            subtextStyle: {
                color: 'rgb(55, 75, 113)',
                fontSize: 18,
                fontWeight: 'normal',
                fontFamily: 'Microsoft YaHei',
            },
        },
        tooltip: {
            //提示框信息
            trigger: 'item',
            // formatter: '{b}'+'<br/>'+'{c0}',
            formatter: function (params) {
                var res = params.name+'<br/>';
                var myseries = option.series;
                    for(var j=0;j<myseries[0].data.length;j++){
                        if(myseries[0].data[j].name==params.name){
                            res+='订单数' +' : '+myseries[0].data[j].value+'</br>';
                            res+='司机人数' +' : '+myseries[0].data[j].value2+'</br>';
                            res+='车辆数' +' : '+myseries[0].data[j].value3+'</br>';
                        }
                    }
                return res;
            }
        },
        toolbox: {
            //工具box
            show: true,
            orient: 'vertical',
            left: 'right',
            top: 'center',
            right: 20,
            feature: {
                dataView: {readOnly: false},
                restore: {},
                saveAsImage: {},
            },
            iconStyle: {
                normal: {
                    color: '#fff',
                },
            },
        },
        //左下角的颜色条
        visualMap: {
            show: true,
            min: 0,
            max: colorMax,
            left: 'left',
            top: 'bottom',
            text: ['高', '低'], // 文本，默认为数值文本
            calculable: true,
            // seriesIndex: [1],    //会使颜色失效
            color: ['#c05050', '#e5cf0d', '#5ab1ef'], //色阶范围
            dimension: 0,
        },
        grid: {
            left: 130,
            top: 100,
            botton: 40,
            width: '20%',
        },
        xAxis: [
            {
                position: 'top',
                type: 'value',
                boundaryGap: false,
                splitLine: {
                    show: false,
                },
                axisLine: {
                    show: false,
                },
                axisTick: {
                    show: false,
                },
                axisLabel: {
                    color: '#ff461f',
                },
            },
        ],
        yAxis: [
            {
                type: 'category',
                data: titledata,
                triggerEvent: true,
                axisTick: {
                    alignWithLabel: true,
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        show: true,
                        color: '#2ec7c9',
                    },
                },
            },
        ],
        series: [
            {
                name: mapTitle, //上面的下钻用到seriesName绑定下一级，换name绑定
                type: 'map',
                map: mapTitle,
                roam: false,
                height: '100%',
                zoom: 0.75,
                z: 1,
                label: {
                    //地图上的文本标签
                    normal: {
                        show: true,
                        position: 'inside', //文本标签显示的位置
                        textStyle: {
                            color: '#fff', //文本颜色
                            fontSize: 14,
                        },
                        formatter: '{b}', //文本上显示的值  data:[{name: "地名", value: 数据}],  {b}表示label信息,{c}代表value
                    },
                    emphasis: {
                        show: true,
                        position: 'inside',
                        textStyle: {
                            color: '#fff',
                            fontSize: 13,
                        },
                    },
                },
                itemStyle: {
                    normal: {
                        areaColor: '#5ab1ef', //地图块颜色#DCE2F1  浅蓝#2B91B7
                        borderColor: '#EBEBE4', //#EBEBE4灰色
                    },
                    emphasis: {
                        areaColor: 'rgb(254,153,78)', //s鼠标放上去，地图块高亮显示的颜色
                    },
                },
                data: customerNum,
            },
            {
                name: mapTitle,
                type: 'bar',
                z: 4,
                label: {
                    normal: {
                        show: true,
                    },
                    empahsis: {
                        show: true,
                    },
                },
                itemStyle: {
                    emphasis: {
                        color: 'rgb(254,153,78)',
                    },
                },
                data: customerNum,
            },
        ],
        // 初始动画的时长，支持回调函数，可以通过每个数据返回不同的 delay 时间实现更戏剧的初始动画效果：
        animationDuration: 1000,
        animationEasing: 'cubicOut',
        // 数据更新动画的时长。
        animationDurationUpdate: 1000,
    }

    //渲染地图
    chart.setOption(option)
    //保存当前状态数据，用于入栈出栈
    curMap = {
        mapName: mapTitle,
        mapJson: mapJson,
        colorMax: colorMax,
        sortData: sortData,
        titledata: titledata,
    }
}

/**
 * 获取城市数据
 * @param {省份} name
 * @param {省份id} id
 * @param {月份} searchtime
 * @param {地图json数据} data
 */
function getCityNumber(name, id, searchtime, data) {
    if (!id) {
        return
    }
    let postData2 = {
        parentid: 'provinceid',
        value: id,
    }
    Promise.all([ajaxRequest(getCityNumberUrl, searchtime, postData2)]).then(
        (result) => {
            renderSecondMap(result);
        },
        (error) => {
            console.error('请求城市数据失败', error)
            renderSecondMap(data, true)
        }
    )

    /**
     * @description: 渲染二级地图，城市
     * @param {JSONString} resp=请求后台返回的地区关联数据
     * @param {Boolean} flag=标识位，请求mock数据失败，用地图数据渲染的 true=地图数据渲染
     * @return:
     */
    function renderSecondMap(resp, flag = false) {
        let tmp = []
        if (flag) {
            resp.features.forEach((item) => {
                tmp.push({
                    //需要加上cityid传递渲染，下一级地图渲染需要用到，点击的时候有判断，没有下级id直接return
                    cityid: item.id,
                    name: item.properties.name,
                    value: item.properties.childNum,
                })
            })
        } else {
            // curMonthResult = stringToJson(resp[0])
            curMonthResult = resp[0]
            if (curMonthResult.errcode == 1) {
                citySaleData = []
                for (let i = 0; i < curMonthResult.msg.length; i++) {
                    tmp.push({
                        cityid: curMonthResult.msg[i].cityid, //需要加上cityid传递渲染，下一级地图渲染需要用到
                        name: curMonthResult.msg[i].city,
                        value: curMonthResult.msg[i].orderCount,
                        value2: curMonthResult.msg[i].driverNumber,
                        value3: curMonthResult.msg[i].vehicleNumber
                    })
                }
            }
        }
        let maxData = getMaxDataAndSort(tmp)
        renderMap(name, data, tmp, maxData.maxData)
    }
}

/**
 * 获取县区数据
 * @param {城市名} cityName
 * @param {城市id} cityId
 * @param {月份}  searchtime
 * @param {地图json数据} data
 */
function getAreaNumber(cityName, cityId, searchtime, data) {
    let postData3 = {
        parentid: 'provinceid',
        value: cityId,
    }
    Promise.all([ajaxRequest(getCityNumberUrl, searchtime, postData3)]).then(
        (result) => {
            renderThirdMap(result);

        },
        (error) => {
            console.error('获取县区数据失败', error)
            renderThirdMap(data, true)
        }
    )

    /**
     * @description: 渲染三级级地图，县区
     * @param {JSONString} resp=请求后台返回的地区关联数据
     * @param {Boolean} flag=标识位，请求mock数据失败，用地图数据渲染的 true=地图数据渲染
     * @return:
     */
    function renderThirdMap(resp, flag = false) {
        let tmp = []
        if (flag) {
            resp.features.forEach((item) => {
                tmp.push({
                    areaid: item.id,
                    name: item.properties.name,
                    value: Math.floor(Math.random() * 10 + 1),
                })
            })
        } else {
            // curMonthResult = stringToJson(resp[0])
            curMonthResult = resp[0]
            if (curMonthResult.errcode == 1) {
                areaSaleData = []
                for (let i = 0; i < curMonthResult.msg.length; i++) {
                    // 返回是一个数组，array({id: 1954, areaid: "440301", area: "深圳市", num: 0})
                    tmp.push({
                        cityid: curMonthResult.msg[i].cityid,
                        name: curMonthResult.msg[i].city,
                        value: curMonthResult.msg[i].orderCount,
                        value2: curMonthResult.msg[i].driverNumber,
                        value3: curMonthResult.msg[i].vehicleNumber
                    })
                }
            }
        }
        let maxData = getMaxDataAndSort(tmp)
        renderMap(cityName, data, tmp, maxData.maxData)
    }
}

let areaList = []
let vm = new Vue({
    el: '#trend-line',
    data: {
        areaList: areaList,
        modalTitle: [],
        cpModalTitle: [],
        searchtime: searchtime,
        time: 0,
        otime: 0,
    },
    methods: {
        setAreaList(data) {
            // let $_self = this
            // $_self._data.areaList = data //这里有个坑，_data
            this.areaList = data // vue是这样写的，内部有代理
        },
    },
    watch: {
        modalTitle(val, oldVal) {
            let $_self = this
            if (val.length > oldVal) {
                this.time++
                this.cpModalTitle.push(val)
            } else {
                // $_self._data.time--;
            }
        },
    },
})

/**
 *
 * @param {未排序数据} originData
 * @return {倒序排序的数据} maxData
 */
function getMaxDataAndSort(originData) {
    if (originData == 'undefined') {
        return
    }
    titledata = []
    sortData = []
    sortData = originData.sort(numDescSort)
    let maxData = sortData.slice(-1)[0]['value']
    let maxDataId = sortData.slice(-1)[0]['id']
    if (!maxDataId) {
        maxDataId = sortData.slice(-1)[0]['cityid'] ? sortData.slice(-1)[0]['cityid'] : sortData.slice(-1)[0]['areaid']
    }
    for (let i = 0; i < sortData.length; i++) {
        titledata.push(sortData[i].name)
    }
    areaList = [...sortData].reverse()
    vm.setAreaList(areaList)
    return {
        maxDataId,
        maxData,
    }
}
