var EventEmitter = require('events');
var Q = require('q');
var uuid = require('uuid');

var StringBuffer = require('../../../common/stringbuffer');
var server = require('../../net/server');
var logger = require('../../../common/logger');
var config = require('../../../config');
var op_type = require('../../core/op_type');
var Transfer = require('../../core/transfer');

var handler = require('../../core/directive/net.connect/server/handler');

var emitter = new EventEmitter();

function Connector(connect) {
    this.server = connect.server;
    this.connect = connect;

    this.server.on('connect', function(socket) {

        handler.evenEmitter.on('letter', function(letter) {
            socket.write(JSON.stringify(letter), 'utf8');
            console.log('传送letter 为:' + letter.toString());
        });

        console.log('客户端连接');


        socket.on('close', function(had_error) {
            if (had_error) {
                logger.info('客户端关闭出错');
            } else {
                logger.info('客户端关闭正常');
            }
        });

        socket.on('connect', function() {
            logger.info('socket connect');
        });

        // 接收data 完全是不受控制的
        // 合理的使用 应该也要对接收进行控制
        socket.on('data', function(data) {
            console.log(data.toString());
            handler.handle(JSON.parse(data.toString()));
        });

        socketInit(socket);

    });
}

function socketInit(socket) {
    let letter = {
        signature: uuid.v4(),
        directive: {
            connect: {
                init: null
            }
        }

    };
    socket.write(JSON.stringify(letter), 'utf8');
}

module.exports = Connector;

/**
 * 设置socket 连接为长连接
 * @param {[type]} socket [description]
 */
function setKeepAlive(socket) {
    logger.info(socket.remoteAddress, ' set keep alive');
    socket.setKeepAlive();
}

function connect_encode(socket, transfer) {
    var deferred = Q.defer();
    transfer.encode_id = uuid.v4();
    socket.write(op_type.connect.is_encode + transfer.encode_id, 'utf8');
    socket.on('data', function(data) {
        data = data.toString();
        if (op_type.connect.encode_true === data) {
            deferred.resolve();
        } else if (op_type.connect.encode_false === data) {
            deferred.resolve();
        } else {
            // 并没有应答本次操作
            deferred.reject(null);
        }
    });
    return deferred.promise;
}
