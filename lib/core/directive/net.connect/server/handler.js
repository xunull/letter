// 指令处理的都是letter 是通用的
// letter 有生命周期
// 假设有init ,start ,pause ,restart ,destory 等
// 指令需要改,现在和socket硬关联上了

var connectDirective = require('./connect');
var EventEmitter = require('events');

var evenEmitter = new EventEmitter();

var state = {
    init: 'init',
    start: 'start',
    pause: 'pause',
    restart: 'restart',
    destroy: 'destory'
};

function Handler() {
    this.evenEmitter = evenEmitter;
    // 初始状态就是init 状态
    this.state = state.init;

}

module.exports = new Handler();

// 分发指令一种是使用对象的方法
// 使用对象方法能判断出是否实现了有关指令(事件的方式应该也可以查出来)
// 一种是使用事件
// 使用事件方式可以很随意，但是随机太多 也不是是一件好事情
Handler.prototype.handle = function(letter, socket) {
    switch (this.state) {
        case state.init:
            this.init(letter, socket);
            break;
        case state.start:
            this.start(letter, socket);
            break;
        case state.pause:
            this.pause(letter, socket);
            break;
        case state.restart:
            this.restart(letter, socket);
            break;
        case state.destory:
            this.destory(letter, socket);
            break;
        default:
            // 没有
    }


};

// 以下命令暂时 设置为handler的方法
// 不过handler 的方法 现在的模式 是 directive的 具体指令 , 现在暂时不冲突
// 专门处理初始化时
Handler.prototype.init = function(letter, socket) {

};

Handler.prototype.start = function(letter, socket) {
    if (letter.category === undefined || letter.category === null) {
        // 有种类名称的会有特殊的相关的handler 处理
        // 有一种是预先定义好的handler 此中handler 在 server,client 都会有想相关的处理

        if (letter.category_alias !== undefined) {
            // 有种类别名的情况，这种情况是自定义了handler 的 时候,
            // 系统为了避免种类名称冲突,会自动给letter 设置一个种类别名
            // 种类别名可能没有语义含义,目的就是为了防止冲突
            // 同时保留category 用来表达真正的意义

        } else {

        }

    } else {
        let directive = Object.keys(letter.directive)[0];
        this[directive](letter, socket);
    }
};

Handler.prototype.pause = function(letter, socket) {

};

Handler.prototype.restart = function(letter, socket) {

};

Handler.prototype.destory = function(letter, socket) {

};

// 与连接有关的指令
Handler.prototype.connect = function(letter, socket) {
    let directive = Object.keys(letter.directive.connect)[0];
    connectDirective[directive](letter, socket, this);
};
