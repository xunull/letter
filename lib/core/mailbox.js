/**
 * 邮筒是双向的,user 会使用,postoffice 也会使用
 */

var EventEmitter = require('events');
var Transfer = require('../middle/connect_net_client');

function MailBox() {
    this.evenEmitter = new EventEmitter();
    // 此三项可能都会是唯一标识
    this.address = null;
    this.id = null;
    this.name = null;
    this.transfer = null;
    this._transfer = null;
}

/**
 * 这个方法是客户端调用使用的
 * @param  {[type]} host [description]
 * @param  {[type]} port [description]
 * @return {[type]}      [description]
 */
MailBox.prototype.connect = function(host, port) {

    var transfer = new Transfer();
    transfer.connect(host, port);
    this.transfer = transfer;
};

MailBox.prototype.sendLetter = function(letter) {
    this.transfer.postLetter(letter);
};

module.exports = MailBox;
