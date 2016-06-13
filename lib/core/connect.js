var EventEmitter = require('events');

var logger = require('../../common/logger');
var session = require('./session');
var server = require('../net/server');
var MailBox = require('./mailbox');

// 这个是底层的实现
// 如果在这个文件中调用底层,就不可以自由的更换底层的实现
// 如果变成在底层中emit 此文件中的事件,那么需要把底层在其他的文件中引入,在其他的文件中多了一个引入
var connect_net = require('../middle/connect_net_server');

var connectEmitter = new EventEmitter();

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

    connectEmitter.emit('connected', mailbox);
});

module.exports = connectEmitter;

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
