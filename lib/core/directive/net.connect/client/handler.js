// 指令处理的都是letter 是通用的

var connectDirective = require('./connect');
var EventEmitter = require('events');

var crypto = require('../../../../crypto/crypto');

var evenEmitter = new EventEmitter();

function Handler() {
    this.initVariable();
    this.evenEmitter = evenEmitter;
    this.directive = new Directive();
}

/**
 * 初始化相关变量
 * @return {[type]} [description]
 */
Handler.prototype.initVariable = function() {
    // 默认是不开启加密的
    this.crypto = false;
};

module.exports = new Handler();

// 分发指令一种是使用对象的方法
// 使用对象方法能判断出是否实现了有关指令(事件的方式应该也可以查出来)
// 一种是使用事件
// 使用事件方式可以很随意，但是随机太多 也不是是一件好事情
Handler.prototype.handle = function(letter) {

    let directive = Object.keys(letter.directive)[0];
    if (undefined === this.directive[directive]) {
        console.log(directive + '指令没有实现');
    } else {
        this.directive[directive](letter, this);
    }

};

function Directive() {

}

// 与连接有关的指令
Directive.prototype.connect = function(letter, handler) {

    let directive = Object.keys(letter.directive.connect)[0];

    if (undefined === connectDirective[directive]) {
        console.log(directive + '指令没有实现');
    } else {
        connectDirective[directive](letter, handler).then(function(data) {
            data = JSON.stringify(data);
            console.log(handler.crypto);
            if (handler.crypto) {
                data = crypto.cipher(data, handler.encryptSecret).toString();
                console.log('data为:');
                console.log(data);
            }
            handler.evenEmitter.emit('letter', data);
        });
    }

};
