// 指令处理的都是letter 是通用的
// letter 有生命周期
// 假设有init ,start ,pause ,restart ,destory 等
// 指令需要改,现在和socket硬关联上了


var EventEmitter = require('events');
var Q = require('q');
var uuid = require('uuid');

var connectDirective = require('./connect');
var MailBox = require('../../../mailbox');
var ConnectCenter = require('../../../connect_center');
var someQueue = require('./someQueue');
var directiveQueue = new someQueue.ActiveQueue();

var state = {
    init: 'init',
    start: 'start',
    work: 'work',
    pause: 'pause',
    restart: 'restart',
    destroy: 'destory'
};

/**
 * [Handler description]
 * @param {[type]} connector 底层实现的connector
 */
function Handler(connector, connectOptions) {
    // 初始状态就是init 状态
    this.state = state.start;
    this.connector = connector;
    this.directive = new Directive();
    // 消息等待队列
    this.waitingLetterQueue = [];
    // 指令执行队列 (主动方法)
    this.directiveQueue = [];

    if (connectOptions.crypto) {
        // 需要加密

        directiveQueue.push(this.connectorInit, this.setCrypto);

    } else {
        // 不需要加密
        this.connectorInit();
    }
}

// var bb = {
//     temp: temp
// };
//
// function temp() {
//     console.log('sfdsfsdfdsfsf');
// }

/**
 * 执行队列中的方法
 * @return {[type]} [description]
 */
Handler.prototype.executeQueue = function() {

};

Handler.prototype.connectorInit = function() {
    let deferred = Q.defer();
    let letter = {
        signature: uuid.v4(),
        category: {
            connect: null
        },
        directive: {
            connect: {
                init: null
            }
        }
    };
    this.postLetter(letter);

    this.waitingLetterQueue.push(this.directive.connect);
};


module.exports = Handler;

// 分发指令一种是使用对象的方法
// 使用对象方法能判断出是否实现了有关指令(事件的方式应该也可以查出来)
// 一种是使用事件
// 使用事件方式可以很随意，但是随机太多 也不是是一件好事情
Handler.prototype.handle = function(letter) {
    if (!this.waitingLetter(letter, this)) {
        switch (this.state) {
            case state.init:
                this.init(letter, this);
                break;
            case state.start:
                this.start(letter);
                break;
            case state.work:
                this.work(letter, this);
                break;
            case state.pause:
                this.pause(letter);
                break;
            case state.restart:
                this.restart(letter);
                break;
            case state.destory:
                this.destory(letter);
                break;
            default:
                // 没有
        }
    }
};

// 以下命令暂时 设置为handler的方法
// 不过handler 的方法 现在的模式 是 directive的 具体指令 , 现在暂时不冲突
// 专门处理初始化时
Handler.prototype.init = function(letter) {

};

Handler.prototype.start = function(letter) {
    if (letter.category !== undefined && letter.category !== null) {
        // 有种类名称的会有特殊的相关的handler 处理
        // 有一种是预先定义好的handler 此中handler 在 server,client 都会有想相关的处理

        if (letter.category_alias !== undefined) {
            // 有种类别名的情况，这种情况是自定义了handler 的 时候,
            // 系统为了避免种类名称冲突,会自动给letter 设置一个种类别名
            // 种类别名可能没有语义含义,目的就是为了防止冲突
            // 同时保留category 用来表达真正的意义

        } else {
            // 有category 并且没有别名的情况 ,大多数都是系统已经定义好的处理方法
        }

    } else {
        // 没有定义category 都会有本层处理,如果有相应的处理方法就会被执行，否者被忽略
        let directive = Object.keys(letter.directive)[0];
        this.directive[directive](letter, this);
    }

};

Handler.prototype.pause = function(letter) {

};

Handler.prototype.restart = function(letter) {

};

Handler.prototype.destory = function(letter) {

};

function Directive() {

}

// 与连接有关的指令
Directive.prototype.connect = function(letter, handler) {
    let directive = Object.keys(letter.directive.connect)[0];
    let deferred = Q.defer();
    // 返回的是 q promise
    return connectDirective[directive](letter, handler);
};

Handler.prototype.startWork = function() {
    var that = this;
    var mailbox = new MailBox({
        handler: that
    });

    ConnectCenter.emitter.emit('connected', mailbox);
    this.connector.startWork();

};

Handler.prototype.waitingLetter = function(letter, handler) {
    let waiting = this.waitingLetterQueue.shift();
    if (undefined !== waiting) {
        waiting(letter, handler);
        // 不管里面是不是同步操作,这个地方的返回值是告诉外层处理方法,此方法已经消费了letter
        return true;
    } else {
        // 没有等待
        return false;
    }
};

Handler.prototype.setCrypto = function() {
    let deferred = Q.defer();
    let signature = uuid.v4();
    let letter = {
        signature: signature,
        category: {
            connect: null
        },
        directive: {
            connect: {
                crypto: null
            }
        },
        crypto: {
            // 公钥加密的内容,公钥也解不开,
            // 传给对方公钥,对方会利用此公钥加密对方的公钥,并返回
            // 利用对方的公钥加密一个 加密密码给对方
            // 或者简单点弄，对方直接用公钥加密一个密码 返回
            public_str: null,
        }
    };
    this.postLetter(letter);
    this.waitingLetterQueue.push(function(letter) {
        if (letter.signature !== signature) {
            // 两次消息的签名不一致,认为是个假消息
            deferred.reject(null);
        } else {
            deferred.resolve();
        }
    });
    return deferred.promise;
};

// handler 发送letter
Handler.prototype.postLetter = function(letter) {
    // 调用底层connector 的 postletter 方法
    this.connector.postLetter(letter);
};
