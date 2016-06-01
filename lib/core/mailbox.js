var EventEmitter = require('events');

function MailBox() {
    this.evenEmitter = new EventEmitter();
    // 此三项可能都会是唯一标识
    this.address = null;
    this.id=null;
    this.name=null;
}

/**
 * 发送接口
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
MailBox.prototype.transfer = function(letter) {

};

/**
 * 连接到postoffice的方法
 * @param  {[type]} host [description]
 * @return {[type]}      [description]
 */
MailBox.prototype.connect = function(host) {

};
