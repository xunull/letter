var EventEmitter = require('events');

var routerEmitter = new EventEmitter();

// 如果使用斜线,最后的source 会自动被添加上转义斜线的 棒棒哒
// var parentPath = '/';

// 分割路径
// 结尾不使用g 不论调用多少次exec 都只能找到第一个,使用g多次调用exec可以持续查找
// var uri_reg = /[^(${parentPath})][^\/]+/g;

// var temp = `[^(${parentPath})][^\/]+`;
//
// var uri_reg = new RegExp(temp);

var childrenRouterMap = new Map();

exports.route = function(letter) {

    var path = letter.orignPath;
    var parentPath = letter.parentPath;
    var template = `^${parentPath}\/[^\/]+`;
    var uri_reg = new RegExp(template);
    console.log(uri_reg.source);
    var result = uri_reg.exec(path);
    if (result) {
        console.log(result);
        // 改变parentpath
        var tempPath = result[0];
        var tempIndex = tempPath.lastIndexOf('/');
        console.log(tempIndex);
        var routerPath = tempPath.substring(tempIndex);
        console.log(routerPath);
        letter.parentPath = letter.parentPath + routerPath;
        console.log(letter.parentPath);
        if (0 === childrenRouterMap.size) {
            console.log('没有route事件处理');
            if (0 === routerEmitter.listeners('process').length) {
                console.log('没有process事件处理');
            } else {

            }
        } else {
            passToChild(routerPath,letter);
        }
    } else {
        // 基本百分之百都会符合route 如果仅仅以目前的策略
        // TODO
        throw new RouteException('bad uri');
    }
};

function passToChild(routerPath, letter) {
    var child = childrenRouterMap.get(routerPath);
    if (null === child) {
        console.log('没有找到处理 ' + routerPath + '的router');
    } else {
        child.route(letter);
    }

}

function RouteException(message) {
    this.message = message;
    this.name = 'RouteException';
}

exports.addRoute = function(routerPath, router) {
    childrenRouterMap.put(routerPath, router);
};
