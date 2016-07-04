/**
 * 接收连接,接收letter,派发letter
 */
var EventEmitter = require('events');


var _ = require('lodash');

// 处理跟底层的连接
var ConnectCenter = require('./connect_center');

var logger = require('../../common/logger');
var uuid = require('uuid');

// 默认配置对象
let default_config = {
    connector: 'net',
    host_port: 15577,
    crypto: false
};

// 这样的类定义 更像是闭包,而不是 class
function PostOffice(options) {
    // 融合 options 和 default_config 对象
    this.options = _.extend(default_config, options);
    this.mailboxs = new Map();
    this.connectCenter = new ConnectCenter(options, this);
    this.emitter = new EventEmitter();

}
//定义以下这些方法是因为 有可能有管理员会在postoffice 的角度上操作,
//而他不需要知道postoffice的底层细节

/**
 * 添加一个邮筒
 * @param  {[type]} mailbox [description]
 * @return {[type]}         [description]
 */
PostOffice.prototype.addMailbox = function(mailbox) {
    this.mailboxs.set(mailbox.id, mailbox);

};

/**
 * 移除一个邮筒
 * @param  {[type]} mailbox [description]
 * @return {[type]}         [description]
 */
PostOffice.prototype.removeMailBox = function(mailbox) {
    this.mailbox.delete(mailbox.id);
};

module.exports = PostOffice;

/**
 * 引用所有连接到此的邮箱
 * postoffice 尽量不要使用静态成员,因为postoffice 可能有多个
 */
// PostOffice.mailboxs = new Map();
