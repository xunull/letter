/**
 * 接收连接,接收letter,派发letter
 */

var connect = require('./connect');
var logger = require('../../common/logger');
var mailboxs = new Map();

connect.on('connected', function(mailbox) {
    addMailbox(mailbox);
});

/**
 * 移除掉某个邮箱
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
function removeMailBox(id) {
    mailboxs.delete(id);
}

function addMailbox(mailbox) {
    logger.info('add a mailbox its id is '+mailbox.id);
    mailboxs.set(mailbox.id, mailbox);
}

function postLetter(letter) {
    var mailbox = mailboxs.get(letter.sendto);
    mailbox.postLetter(letter);
}
