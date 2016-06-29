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


function Connecter(server) {
    this.server = server;

    this.server.on('connect', function(socket) {
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
            agent_transfer.processData(data, transfer, agent_transfer);
        });

        // 建立连接后第一个发送初始化数据
        sendInit(socket, transfer);

    });
}

module.exports = Connecter;

// 类似继承(javascript中已经有了继承)
function AgentTransfer() {

}

AgentTransfer.prototype[op_type.connect.init] = function() {
    console.log('与客户端初始化成功');
    // logger.info(this);

    setKeepAlive(this.socket);
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

/**
 * 此方法不可以使用返回值的形式,有些操作可能是异步的(获取好友列表这种)
 * 对于一次多条指令的,需要所有的指令的异步处理都完事后返回给客户端
 *   var result = transfer.processData(data, agent_transfer);
 *   this.socket.write(result, 'utf8');
 * @param  {[type]} data           [description]
 * @param  {[type]} transfer       [description]
 * @param  {[type]} agent_transfer [description]
 * @return {[type]}                [description]
 */
AgentTransfer.prototype.processData = function(data, transfer) {
    var that = this;
    var ops = data.split(_DEFAULT_OP_DELIMITER);

    var sb = new StringBuffer();
    ops.forEach(function(op) {
        var args = op.split(_DEFAULT_DELIMITER);
        // args[0] 是指令名称, 从1开始是指令的参数
        if (args[0] !== '') {
            if (undefined === that[args[0]]) {
                logger.info(args[0] + ' 操作没有方法响应');
            } else {
                var result = that[args[0]](agent_transfer, ...args.slice(1));
                if (null !== result) {
                    sb.appendOp(result);
                }
            }
        } else {
            // 最后一个指令后有一个分隔符
        }
    });
    return sb.toString();
};





/**
 * 设置socket 连接为长连接
 * @param {[type]} socket [description]
 */
function setKeepAlive(socket) {
    logger.info(socket.remoteAddress, ' set keep alive');
    socket.setKeepAlive();
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
