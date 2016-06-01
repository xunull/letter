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

module.exports = StringBuffer;
