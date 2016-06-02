var net = require('net');
var EventEmitter = require('events');

var logger = require('../../common/logger');
var op_type = require('../core/op_type');
var StringBuffer = require('../../common/stringbuffer');
var config = require('../../config');
var client = require('../net/client');

var transferEmitter = new EventEmitter();

var _DEFAULT_DELIMITER = "$",
    _DEFAULT_OP_DELIMITER = "|";

function Transfer() {
    this.socket = null;
    this.encode_id = null;
}

Transfer.prototype.postLetter = function(letter) {
    letter = JSON.stringify(letter);
    var sb = new StringBuffer();
    sb.appendArg(op_type.letter.post_letter)
        .appendArg(letter);
    this.socket.write(sb.toString(), 'utf8');
};

Transfer.prototype.connect = function(host, port) {
    var that = this;
    var socket = client.connect(host, port);
    this.socket = socket;

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


        logger.info(socket.address());
        logger.info(socket.localPort);
        logger.info(socket.remoteAddress);
        logger.info(socket.remotePort);
    });

    socket.on('data', function(data, transfer) {
        logger.info(data.toString());
        that.processData(data.toString());
    });

    /**
     * 写入流 空的时候会调用
     */
    socket.on('drain', function() {

    });

    socket.on('end', function() {
        logger.info('socket end');
    });

    socket.on('timeout', function() {
        logger.info('socket timeout');
    });

};

module.exports = Transfer;

/**
 *
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
Transfer.prototype.processData = function(data) {
    var that = this;
    var arr = data.split(_DEFAULT_OP_DELIMITER);
    console.log(arr.length);
    var sb = new StringBuffer();
    arr.forEach(function(op) {
        var arr2 = op.split(_DEFAULT_DELIMITER);
        if (arr2[0] !== '') {
            if (undefined === that[arr2[0]]) {
                logger.info(arr2[0] + ' 操作没有方法响应');
            } else {
                var result = that[arr2[0]](...arr2.slice(1));
                if (null !== result) {
                    sb.appendOp(result);
                }
            }
        } else {
            // 最后一个指令后有一个分隔符
        }
    });
    this.socket.write(sb.toString(), 'utf8');
};


Transfer.prototype[op_type.connect.init] = function() {
    var sb = new StringBuffer();
    sb.append(op_type.connect.init);
    return sb.toString();
};

Transfer.prototype[op_type.connect.version] = function() {
    //TODO
    console.log('version is ok');
    var sb = new StringBuffer();
    sb.append(op_type.connect.version);
    return sb.toString();
};

Transfer.prototype[op_type.connect.is_encode] = function() {
    var args = Array.prototype.slice.call(arguments);
    var encode_id = args[0];
    var sb = new StringBuffer();
    sb.append(op_type.connect.is_encode).appendArg(args[0]);
    if (config.encode) {
        sb.appendArg(op_type.connect.encode_true);
    } else {
        sb.appendArg(op_type.connect.encode_false);
    }
    return sb.toString();
};
