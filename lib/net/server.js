var net = require('net');
var EventEmitter = require('events');
var config = require('../../config');

var logger = require('../../common/logger');
var server = net.createServer(function() {

});

var serverEmitter = new EventEmitter();

module.exports = serverEmitter;

// serverEmitter.emit('connect',socket);
// serverEmitter.on('connect', function(socket) {
//
// });

server.listen(config._default.host_port, function(err) {
    if (err) {
        logger.info(err);
    } else {
        logger.info('server 启动,端口为 ' + config._default.host_port);
    }
});

// 监听连接
server.on('connection', function(socket) {

    serverEmitter.emit('connect', socket);

    logger.info(socket.address());
    logger.info(socket.localPort);
    logger.info(socket.remoteAddress);
    logger.info(socket.remotePort);

    socket.on('close', function(had_error) {
        if (had_error) {
            logger.info('客户端关闭出错');
        } else {
            logger.info('客户端关闭正常');
        }
    });

    // 这个方法在server 端 应该无用
    socket.on('connect', function() {
        logger.info('socket connect');
    });

    socket.on('data', function(data) {
        // logger.info(data);
    });

    /**
     * 写入流 空的时候会调用
     */
    socket.on('drain', function() {

    });

    socket.on('end', function() {
        logger.info('socket end');
    });

    socket.on('error', function(error) {
        logger.info('socket error');
        logger.info(error);
    });

    socket.on('timeout', function() {
        logger.info('socket timeout');
    });

    // socket.end([data][, encoding])

    // socket.pause()

    // socket.setEncoding([encoding])

    // socket.setKeepAlive([enable][, initialDelay])

    // socket.setTimeout(timeout[, callback])

    // socket.write(data[, encoding][, callback])

});

/**
 * server close后会触发,并且需要连接都结束后触发
 * @param  {[type]} 'close'   [description]
 * @param  {[type]} function( [description]
 * @return {[type]}           [description]
 */
server.on('close', function(err) {

});

/**
 * 发生错误后server会被关闭
 * @param  {[type]} 'error'   [description]
 * @param  {[type]} function( [description]
 * @return {[type]}           [description]
 */
server.on('error', function(err) {
    logger.info('server has error!!!');
    logger.info(err);
});

/**
 * 关闭server
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
function closeServer(callback) {
    server.close(function() {
        logger.info('server has closed success');
        if (undefined !== callback) {
            callback();
        }
    });
}

serverEmitter.closeServer = closeServer;

/**
 * 获取当前连接的socket 数量
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
function getConnectionCount(callback) {
    server.getConnections(function(err, count) {
        callback(err, count);
    });
}

serverEmitter.getConnectionCount = getConnectionCount;
