var MailBox = require('../lib/core/mailbox');
var config = require('../config');

var mailBox = new MailBox();

mailBox.connect({
    category: 'net',
    options: {
        host: 'localhost',
        port: config._default.host_port
    }
});
