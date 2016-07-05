var EventEmitter = require('events');
var Q = require('q');
var uuid = require('uuid');

var StringBuffer = require('../../../common/stringbuffer');
var server = require('../../net/server');
var logger = require('../../../common/logger');
var config = require('../../../config');
var op_type = require('../../core/op_type');
var Transfer = require('../../core/transfer');

// handler 方式使用事件的方式传递letter了
// 系统中事件对象太多是不是不好？
var Handler = require('../../core/directive/net.connect/server/handler');

var emitter = new EventEmitter();

function Connector(connect) {
    this.server = connect.server;
    this.connect = connect;

    if (connect.options.crypto) {
        // 与客户端的通讯需要加密
    } else {
        // 与客户端的通讯不需要加密
    }

    this.server.on('connect', function(socket) {
        logger.debug('有客户端连接');

        socket.postLetter = function(letter) {
            socket.write(JSON.stringify(letter), 'utf8');
            console.log('传送letter 为:' + letter.toString());
        };

        socket.startWork = function() {
            setKeepAlive(socket);
        };

        var handler = new Handler(socket, connect.options);

        // handler 如果使用了是事件 是不是就不能 将handler 变成 单个实例的？
        // 假如使用事例模式 当并发多了后 当socket 接收消息 然后在寻找对应的handler
        // 其中有没有寻找对象 所花的时间呢 大量的对象寻找
        // 但不管用什么方式 只要对象多 都避免不了对象的寻址 即使将socket 和 handler 关联在一起
        // TODO 难道关联在一起有内存优化？
        // handler.evenEmitter.on('letter', function(letter) {
        //     socket.write(JSON.stringify(letter), 'utf8');
        //     console.log('传送letter 为:' + letter.toString());
        // });

        socket.on('close', function(had_error) {
            if (had_error) {
                logger.info('客户端关闭出错');
            } else {
                logger.info('客户端关闭正常');
            }
        });

        // 接收data 完全是不受控制的
        // 合理的使用 应该也要对接收进行控制
        socket.on('data', function(data) {
            console.log(data.toString());
            handler.handle(JSON.parse(data.toString()), socket);
        });

        // connectorInit(socket);

    });
}

/**
 * 生命周期方法 init 只会被执行一次
 * @param  {[type]} socket [description]
 * @return {[type]}        [description]
 */
function connectorInit(socket) {
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
    socket.write(JSON.stringify(letter), 'utf8');
}

/**
 * 开始使用
 * @return {[type]} [description]
 */
function connectorStart() {

}

/**
 * 暂停使用
 * @return {[type]} [description]
 */
function connectorPause() {

}

/**
 * 摧毁连接
 * @return {[type]} [description]
 */
function connectorDestory() {

}

/**
 * 设置socket 连接为长连接
 * @param {[type]} socket [description]
 */
function setKeepAlive(socket) {
    socket.setKeepAlive();
}

module.exports = Connector;
