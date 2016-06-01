/**
 * 传送的基本单元
 * @param {[type]} sendto   [description]
 * @param {[type]} postform [description]
 * @param {[type]} content  [description]
 */
function Letter(sendto, postfrom, content) {
    var args = Array.prototype.slice.call(arguments);
    if (args.length === 1) {
        // 可以只设置一个内容参数
        content = args[0];
        this.content = content;
        this.sendto = sendto = null;
        this.postfrom = postfrom = null;

    } else {
        this.sendto = sendto;
        this.postfrom = postfrom;
        this.content = content;
    }
}

Letter.prototype.setSendTo = function(sendto) {
    this.sendto = sendto;
};

Letter.prototype.setPostfrom = function(postfrom) {
    this.postfrom = postfrom;
};

/**
 * 设置消息公钥,公钥只是用来对方发消息(消息指的是解密的密码)
 * @param  {[type]} pem [description]
 * @return {[type]}     [description]
 */
Letter.prototype.setPem = function(pem) {

};

module.exports = Letter;
