var EventEmitter = require('events');

var _ = require('lodash');

var logger = require('../../common/logger');
var session = require('./session');
var server = require('../net/server');
var MailBox = require('./mailbox');


// 这个是底层的实现
// 如果在这个文件中调用底层,就不可以自由的更换底层的实现
// 如果变成在底层中emit 此文件中的事件,那么需要把底层在其他的文件中引入,在其他的文件中多了一个引入

let default_config = {
    connecter: 'net',
    host_port: 15577
};

var connectEmitter = new EventEmitter();

/**
 * connect 要连接的不一定会是本身的net 也有可能是socketio 也会可能是其他的postmail
 * @param {[type]} options [description]
 */
function Connect(options) {
    this.options = _.extend(default_config, options);
    this.init();
    this.connectEmitter = connectEmitter;
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
    // 此服务器接收网络请求,就是开启tcp server
    this.server = require('../net/server');
    // 上一个仅是开启tcp server 这个负责处理 每个socket的行为
    // 这个connector 是 与 server 的 connector
    this.connector = require('../middle/net/connect_net_server')(this);
}

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
 * agentMailbox 需要各个实现者实现,类似于java 中的接口的意思
 * @param  {[type]} 'connected'           [description]
 * @param  {[type]} function(agentMailbox [description]
 * @return {[type]}                       [description]
 */
connectEmitter.on('connected', function(agentMailbox) {

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
