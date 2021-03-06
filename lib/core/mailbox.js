/**
 * 邮筒是双向的,user 会使用,postoffice 也会使用
 */

var EventEmitter = require('events');

var NetConnector = require('../middle/net/connect_net_client');

var default_config = {
    category: 'net'
};

function MailBox(options) {

    this.evenEmitter = new EventEmitter();
    // 此三项可能都会是唯一标识
    this.address = null;
    this.id = null;
    this.name = null;
    this.transfer = null;
    this._transfer = null;

    if (options !== undefined) {
        this.handler = options.handler;
    }

}

/**
 * 这个方法是客户端调用使用的
 * @param  {[type]} host [description]
 * @param  {[type]} port [description]
 * @return {[type]}      [description]
 */
MailBox.prototype.connect = function(connector) {
    switch (connector.category) {
        case 'net':
            let netConnector = new NetConnector();
            netConnector.connect(connector.options.host, connector.options.port);
            break;
        default:

    }


};


/**
 *
 * @param  {[type]} letter [description]
 * @return {[type]}        [description]
 */
MailBox.prototype.sendLetter = function(letter) {

};

module.exports = MailBox;
