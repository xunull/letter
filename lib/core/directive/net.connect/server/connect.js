var MailBox = require('../../../mailbox');
var ConnectCenter = require('../../../connect_center');

function Connect() {

}

var connect = new Connect();

module.exports = connect;

Connect.prototype.init = function(letter, socket, handler) {

    //TODO 假设init 成功
    if (true) {
        var mailbox = new MailBox({
            handler: handler
        });

        ConnectCenter.emitter.emit('connected', mailbox);

        setKeepAlive(socket);

    } else {

    }


};

Connect.prototype.close = function(letter) {

};


Connect.prototype.reject = function(letter) {

};

/**
 * 设置socket 连接为长连接
 * @param {[type]} socket [description]
 */
function setKeepAlive(socket) {
    socket.setKeepAlive();
}
