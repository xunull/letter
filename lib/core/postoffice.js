/**
 * 接收连接,接收letter,派发letter
 */

var connect = require('./connect');
var logger = require('../../common/logger');
var uuid = require('uuid');

/**
 * 引用所有连接到此的邮箱
 */
var mailboxs = new Map();

/**
 * 监听邮箱上线的事件
 * 应该有两种上线模式,一种是自动上线模式,
 * 一种是使用帐号模式,在系统中持有固定的帐号
 * @param  {[type]} 'connected'      [description]
 * @param  {[type]} function(mailbox [description]
 * @return {[type]}                  [description]
 */
connect.on('connected', function(mailbox) {
    addMailbox(mailbox);
});

/**
 * 移除掉某个邮箱
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
function removeMailBox(id) {
    logger.info('remove a mailbox its id is ', mailbox.id);
    mailboxs.delete(id);
}

/**
 * map 中 加入某邮箱
 * @param {[type]} mailbox [description]
 */
function addMailbox(mailbox) {
    setMailboxId(mailbox);
    logger.info('add a mailbox its id is ' + mailbox.id);
    mailboxs.set(mailbox.id, mailbox);
}

/**
 * 设置mailbox 的id
 * 可能会有多种实现
 * 暂时使用uuid
 * @param {[type]} mailbox [description]
 */
function setMailboxId(mailbox) {
    mailbox.id = uuid.v4();
}

/**
 * 转发信件
 * @param  {[type]} letter [description]
 * @return {[type]}        [description]
 */
function postLetter(letter) {
    var mailbox = mailboxs.get(letter.sendto);
    mailbox.postLetter(letter);
}
