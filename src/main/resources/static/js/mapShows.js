var loc = location.href;
var n1 = loc.length;
var n2 = loc.indexOf('=');
var division = decodeURI(loc.substr(n2+1,n1-n2));
console.log(division);

$.post("PointAggregation?division="+division,function (list) {
    data1(list);
});

function data1(list) {
    var cluster, markers = [];

    var map = new AMap.Map("container", {
        resizeEnable: true,
        center: [105, 34],
        zoom: 4
    });
    map.on('rightclick', function (e) {
        location.href = '/';
    });

    for (var i = 0; i < list.length; i += 1) {
        markers.push(new AMap.Marker({
            position: list[i],
            content: '<div style="background-color: hsla(180, 100%, 50%, 0.7); height: 24px; width: 24px; border: 1px solid hsl(180, 100%, 40%); border-radius: 12px; box-shadow: hsl(180, 100%, 50%) 0px 0px 1px;"></div>',
            offset: new AMap.Pixel(-15, -15)
        }))
    }

    var count = markers.length;
    console.log(count);
    var _renderClusterMarker = function (context) {
        var factor = Math.pow(context.count / count, 1 / 18);
        var div = document.createElement('div');
        var Hue = 180 - factor * 180;
        var bgColor = 'hsla(' + Hue + ',100%,50%,0.7)';
        var fontColor = 'hsla(' + Hue + ',100%,20%,1)';
        var borderColor = 'hsla(' + Hue + ',100%,40%,1)';
        var shadowColor = 'hsla(' + Hue + ',100%,50%,1)';
        div.style.backgroundColor = bgColor;
        var size = Math.round(30 + Math.pow(context.count / count, 1 / 5) * 20);
        div.style.width = div.style.height = size + 'px';
        div.style.border = 'solid 1px ' + borderColor;
        div.style.borderRadius = size / 2 + 'px';
        div.style.boxShadow = '0 0 1px ' + shadowColor;
        div.innerHTML = context.count;
        div.style.lineHeight = size + 'px';
        div.style.color = fontColor;
        div.style.fontSize = '14px';
        div.style.textAlign = 'center';
        context.marker.setOffset(new AMap.Pixel(-size / 2, -size / 2));
        context.marker.setContent(div)
    };

    addCluster(0);

    function addCluster(tag) {
        if (cluster) {
            cluster.setMap(null);
        }
        if (tag == 2) {//完全自定义
            cluster = new AMap.MarkerClusterer(map, markers, {
                gridSize: 80,
                renderClusterMarker: _renderClusterMarker
            });
        } else if (tag == 1) {//自定义图标
            var sts = [{
                url: "https://a.amap.com/jsapi_demos/static/images/blue.png",
                size: new AMap.Size(32, 32),
                offset: new AMap.Pixel(-16, -16)
            }, {
                url: "https://a.amap.com/jsapi_demos/static/images/green.png",
                size: new AMap.Size(32, 32),
                offset: new AMap.Pixel(-16, -16)
            }, {
                url: "https://a.amap.com/jsapi_demos/static/images/orange.png",
                size: new AMap.Size(36, 36),
                offset: new AMap.Pixel(-18, -18)
            }, {
                url: "https://a.amap.com/jsapi_demos/static/images/red.png",
                size: new AMap.Size(48, 48),
                offset: new AMap.Pixel(-24, -24)
            }, {
                url: "https://a.amap.com/jsapi_demos/static/images/darkRed.png",
                size: new AMap.Size(48, 48),
                offset: new AMap.Pixel(-24, -24)
            }];
            cluster = new AMap.MarkerClusterer(map, markers, {
                styles: sts,
                gridSize: 80
            });
        } else {//默认样式
            cluster = new AMap.MarkerClusterer(map, markers, {gridSize: 80});
        }
    }
}
