var EventEmitter = require('events');
var Q = require('q');
var uuid = require('uuid');

var StringBuffer = require('../../common/stringbuffer');
var server = require('../net/server');
var logger = require('../../common/logger');
var config = require('../../config');
var op_type = require('../core/op_type');
var Transfer = require('../core/transfer');

var _DEFAULT_DELIMITER = "$",
    _DEFAULT_OP_DELIMITER = "|";

var emitter = new EventEmitter();

module.exports = emitter;

// 类似继承(javascript中已经有了继承)
function AgentTransfer() {

}

AgentTransfer.prototype[op_type.connect.init] = function() {
    console.log('与客户端初始化成功');
    emitter.emit('connected', this);
};

AgentTransfer.prototype[op_type.connect.version] = function() {
    //TODO
    console.log('version is ok');
};

AgentTransfer.prototype[op_type.connect.is_encode] = function() {
    console.log(arguments);
};

AgentTransfer.prototype.postLetter = function(letter) {
    letter = JSON.stringify(letter);
    var sb = new StringBuffer();
    sb.appendArg(op_type.letter.post_letter)
        .appendArg(letter);
    this.socket.write(sb.toString(), 'utf8');
};

AgentTransfer.prototype.close = function() {
    // 这个socket 没有close 方法
    this.socket.destroy();
};

server.on('connect', function(socket) {
    var transfer = new Transfer();
    var agent_transfer = new AgentTransfer();
    agent_transfer.socket = socket;

    console.log('客户端连接');
    var sb = new StringBuffer();
    transfer.remote_identifier = sb.append(socket.remoteAddress).append(':').append(socket.remotePort);

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

        processData(data, transfer, agent_transfer);
    });

    // 建立连接后第一个发送初始化数据
    sendInit(socket, transfer);

});

function processData(data, transfer, agent_transfer) {
    var arr = data.split(_DEFAULT_OP_DELIMITER);

    arr.forEach(function(op) {
        var arr2 = op.split(_DEFAULT_DELIMITER);
        if (arr2[0] !== '') {
            transfer[arr2[0]](agent_transfer[arr2[0]], ...arr2.slice(1));
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