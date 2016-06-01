var EventEmitter = require('events');
var Q = require('q');
var uuid = require('uuid');

var StringBuffer = require('../../common/stringbuffer');
var server = require('../net/server');
var logger = require('../../common/logger');

var config = require('../../config');
var op_type = require('../net/op_type');

var _DEFAULT_DELIMITER = "$",
    _DEFAULT_OP_DELIMITER = "|";

var transferEmitter = new EventEmitter();

function Transfer() {
    this.encode_id = null;

}

// TODO
// 在这个地方修改的原型会不会在别的地方加载的模块也会起作用
StringBuffer.prototype.appendOp = function(str) {
    this._strings_.push(str);
    this._strings_.push(_DEFAULT_OP_DELIMITER);
    return this;
};

Transfer.prototype[op_type.connect.basic] = function() {

};

Transfer.prototype[op_type.connect.version] = function() {
    //TODO
    console.log('version is ok');
};

Transfer.prototype[op_type.connect.is_encode] = function() {
    console.log(arguments);
};

server.on('connect', function(socket) {
    var transfer = new Transfer();
    console.log('客户端连接');
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

    socket.on('connect', function() {
        logger.info('socket connect');
    });

    // 接收data 完全是不受控制的
    // 合理的使用 应该也要对接收进行控制
    socket.on('data', function(data) {
        data = data.toString();

        processData(data, transfer);
    });

    sendInit(socket, transfer);

});

function processData(data, transfer) {
    var arr = data.split(_DEFAULT_OP_DELIMITER);
    console.log(arr.length);
    arr.forEach(function(op) {
        var arr2 = op.split(_DEFAULT_DELIMITER);
        if (arr2[0] !== '') {
            transfer[arr[0]](arr2.slice(1));
        } else {
            // 最后一个指令后有一个分隔符
        }

    });
}

function sendInit(socket, transfer) {
    transfer.encode_id = uuid.v4();
    var sb = new StringBuffer();
    var encode_sb = new StringBuffer();
    encode_sb.append(op_type.connect.is_encode).append(_DEFAULT_DELIMITER).append(transfer.encode_id);
    sb.appendOp(op_type.connect.init)
        .appendOp(op_type.connect.version)
        .appendOp(encode_sb.toString());
    socket.write(sb.toString(), 'utf8');
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
