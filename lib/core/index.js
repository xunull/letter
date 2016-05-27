var EventEmitter = require('events');

var session = require('./session');

var coreEmitter = new EventEmitter();

/**
 * 请求连接
 * @param  {[type]} 'connecting' [description]
 * @param  {[type]} function(    [description]
 * @return {[type]}              [description]
 */
coreEmitter.on('connecting',function(){

});

/**
 * 连接成功
 * @param  {[type]} 'connected' [description]
 * @param  {[type]} function(   [description]
 * @return {[type]}             [description]
 */
coreEmitter.on('connected',function(){

});

/**
 * 连接结束
 * @param  {[type]} 'end_connect' [description]
 * @param  {[type]} function(     [description]
 * @return {[type]}               [description]
 */
coreEmitter.on('end_connect',function(){

});

/**
 * 连接中断
 * @param  {[type]} 'disconnect' [description]
 * @param  {[type]} function(    [description]
 * @return {[type]}              [description]
 */
coreEmitter.on('disconnect',function(){

});

/**
 * 重新连接
 * @param  {[type]} 'reconnect' [description]
 * @param  {[type]} function(   [description]
 * @return {[type]}             [description]
 */
coreEmitter.on('reconnect',function(){

});
