var EventEmitter = require('events');

var _ = require('lodash');

var logger = require('../../common/logger');
var session = require('./session');
var server = require('../net/server');
var MailBox = require('./mailbox');

// 这个是底层的实现
// 如果在这个文件中调用底层,就不可以自由的更换底层的实现
// 如果变成在底层中emit 此文件中的事件,那么需要把底层在其他的文件中引入,在其他的文件中多了一个引入
var connect_net = require('../middle/connect_net_server');

var connectEmitter = new EventEmitter();

let default_config = {
    connecter: 'net',
    host_port: 15577
};

/**
 * connect 要连接的不一定会是本身的net 也有可能是socketio 也会可能是其他的postmail
 * @param {[type]} options [description]
 */
function Connect(options) {
    this.options = _.extend(default_config, options);
    this.init();
}

Connect.prototype.init = function() {
    switch (this.options.connecter) {
        case 'net':
            initNetServer.apply(this, []);
            break;
        case 'socketio':

            break;
        default:

    }
};

function initNetServer() {
    this.server = require('../net/server');
    this.connecter = require('../middle/connect_net_server')(this.server);
}

/**
 * mailbox 的id 应该什么时候生称？
 *
 * @param  {[type]} 'connected'       [description]
 * @param  {[type]} function(transfer [description]
 * @return {[type]}                   [description]
 */
connect_net.on('connected', function(transfer) {
    var mailbox = new MailBox();
    mailbox.transfer = transfer;

    connectEmitter.emit('mailbox-connected', mailbox);
});

module.exports = Connect;

/**
 * 请求连接
 * @param  {[type]} 'connecting' [description]
 * @param  {[type]} function(    [description]
 * @return {[type]}              [description]
 */
connectEmitter.on('connecting', function(data) {

});

/**
 * 连接成功
 * @param  {[type]} 'connected' [description]
 * @param  {[type]} function(   [description]
 * @return {[type]}             [description]
 */
connectEmitter.on('connected', function() {

});

/**
 * 连接结束
 * @param  {[type]} 'end_connect' [description]
 * @param  {[type]} function(     [description]
 * @return {[type]}               [description]
 */
connectEmitter.on('end_connect', function() {

});

/**
 * 连接中断
 * @param  {[type]} 'disconnect' [description]
 * @param  {[type]} function(    [description]
 * @return {[type]}              [description]
 */
connectEmitter.on('disconnect', function() {

});

/**
 * 重新连接
 * @param  {[type]} 'reconnect' [description]
 * @param  {[type]} function(   [description]
 * @return {[type]}             [description]
 */
connectEmitter.on('reconnect', function() {

});
