var net = require('net');
var EventEmitter = require('events');

var logger = require('../../../common/logger');
var op_type = require('../../core/op_type');
var StringBuffer = require('../../../common/stringbuffer');
var config = require('../../../config');
var client = require('../../net/client');

var handler = require('../../core/directive/net.connect/client/handler');



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
    handler.evenEmitter.on('letter', function(letter) {
        // that.socket.write(JSON.stringify(letter), 'utf8');
        that.socket.write(letter, 'utf8');
        // console.log('传送letter 为:' + JSON.stringify(letter));
    });

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
        handler.handle(JSON.parse(data.toString()));

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
