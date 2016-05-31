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
