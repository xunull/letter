var MailBox = require('../lib/core/mailbox');
var config = require('../config');

var mailBox = new MailBox();

mailBox.connect('localhost', config._default.host_port);
