var EventEmitter = require('events');

function MailBox() {
    this.evenEmitter = new EventEmitter();
}

/**
 * send 方法是放松任何内容的方法
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
MailBox.prototype.send = function(data) {

};
