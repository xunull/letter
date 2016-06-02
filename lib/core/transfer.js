var op_type = require('./op_type');

function Transfer() {
    this.socket = null;
    this.encode_id = null;
    // 远程socket的标识
    this.remote_identifier = null;
}

module.exports = Transfer;

Transfer.prototype.next = function(callback, ...args) {

    if (undefined !== callback) {
        callback(...args);
    }
};

// 这些方法,如果(子类)没有定义实现,有的方法可能有默认的实现
Transfer.prototype[op_type.connect.init] = function(callback, ...args) {
    console.log('与目标连接成功');
    this.next(callback, ...args);
};

Transfer.prototype[op_type.connect.version] = function(callback, ...args) {
    //TODO
    console.log('version is ok');
    this.next(callback, ...args);

};

Transfer.prototype[op_type.connect.is_encode] = function(callback, ...args) {
    console.log(arguments);
    this.next(callback, ...args);
};

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