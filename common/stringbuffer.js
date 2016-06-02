var _DEFAULT_ARG_DELIMITER = "$",
    _DEFAULT_OP_DELIMITER = "|";

function StringBuffer() {
    this._strings_ = [];
}
StringBuffer.prototype.append = function(str) {
    this._strings_.push(str);
    return this;
};
StringBuffer.prototype.toString = function() {
    return this._strings_.join("");
};

// 在别的部分修改原型对于所有对象都会会生效

/**
 * str 是下一个指令
 * @param  {[type]} str [description]
 * @return {[type]}     [description]
 */
StringBuffer.prototype.appendOp = function(str) {
    if (this._strings_.length !== 0) {
        this._strings_.push(_DEFAULT_OP_DELIMITER);
    }
    this._strings_.push(str);
    return this;
};

/**
 * str 是下一个参数
 * @param  {[type]} str [description]
 * @return {[type]}     [description]
 */
StringBuffer.prototype.appendArg = function(str) {
    if (this._strings_.length !== 0) {
        this._strings_.push(_DEFAULT_ARG_DELIMITER);
    }
    this._strings_.push(str);
    return this;
};

module.exports = StringBuffer;
