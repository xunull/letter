var op_type = require('./op_type');
var logger = require('../../common/logger');
var StringBuffer = require('../../common/stringbuffer');

var _DEFAULT_DELIMITER = "$",
    _DEFAULT_OP_DELIMITER = "|";

/**
 * 因为postoffice可能会调用下层的方法,
 * 因此在transfer 中 需要持有agent的引用
 */
function Transfer() {
    this.socket = null;
    this.encode_id = null;
    // 远程socket的标识
    this.remote_identifier = null;
    this.agent_transfer = null;
}

module.exports = Transfer;

/**
 * [function description]
 * @param  {[type]}   agent_transfer [代理转换]
 * @param  {Function} callback       [调用的方法]
 * @param  {[type]}   result         [本身的处理结果]
 * @param  {[type]}   ...args        [命令参数]
 * @return {[type]}                  [description]
 */
Transfer.prototype.next = function(callback, result, ...args) {
    if (undefined !== this.agent_transfer[callback]) {
        this.agent_transfer[callback](...args);
    } else {
        logger.info(callback, ' 方法未实现');
    }
};

// 这些方法,如果(子类)没有定义实现,有的方法可能有默认的实现
Transfer.prototype[op_type.connect.init] = function(agent_transfer, ...args) {
    console.log('与目标连接成功');
    this.next(agent_transfer, op_type.connect.init, ...args);
};

Transfer.prototype[op_type.connect.version] = function(agent_transfer, ...args) {
    //TODO
    console.log('version is ok');
    this.next(agent_transfer, op_type.connect.version, ...args);

};

Transfer.prototype[op_type.connect.is_encode] = function(agent_transfer, ...args) {
    // console.log(arguments);
    this.next(agent_transfer, op_type.connect.is_encode, ...args);
};

/**
 * 接收客户端的公钥
 * @param  {[type]} agent_transfer [description]
 * @param  {[type]} ..args   [description]
 * @return {[type]}          [description]
 */
Transfer.prototype[op_type.connect.encode_pub] = function(agent_transfer, ...args) {

};

/**
 *
 * @param  {[type]} data [接收到的原始数据]
 * @return {[type]}      [处理后的结果]
 */
Transfer.prototype.processData = function(data, agent_transfer) {
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
 * 发送letter 的方法
 * @param  {[type]} letter [description]
 * @return {[type]}        [description]
 */
Transfer.prototype.postLetter = function(letter, callback) {
    letter = JSON.stringify(letter);
    var sb = new StringBuffer();
    sb.appendArg(op_type.letter.post_letter)
        .appendArg(letter);
    next(callback, sb.toString());
};

Transfer.prototype.close = function(callback) {
    next(callback);
};
