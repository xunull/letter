var EventEmitter = require('events');

var session = require('./session');
var server = require('../net/server');

var connectEmitter = new EventEmitter();

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

exports.connect = function(address) {
    connectEmitter.emit('connecting', {
        address: address
    });
};
