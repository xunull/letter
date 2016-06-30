// 指令处理的都是letter 是通用的

var connectDirective = require('./connect');
var EventEmitter = require('events');

var evenEmitter = new EventEmitter();

function Handler() {
    this.evenEmitter = evenEmitter;
}

module.exports = new Handler();

// 分发指令一种是使用对象的方法
// 使用对象方法能判断出是否实现了有关指令(事件的方式应该也可以查出来)
// 一种是使用事件
// 使用事件方式可以很随意，但是随机太多 也不是是一件好事情
Handler.prototype.handle = function(letter) {

    let directive = Object.keys(letter.directive)[0];
    this[directive](letter);

};

// 与连接有关的指令
Handler.prototype.connect = function(letter) {
    let directive = Object.keys(letter.directive.connect)[0];
    connectDirective[directive](letter).then(function(data) {
        evenEmitter.emit('letter', data);
    });
};
