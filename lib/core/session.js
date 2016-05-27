var EventEmitter = require('events');
var uuid = require('uuid');

var sessionEmitter = new EventEmitter();

exports.put = function() {
    var sessionid = uuid.v4();

    sessionEmitter.on(sessionid, function() {

    });
};

exports.process = function(letter) {
    sessionEmitter.emit(sessionid, letter);
};

exports.end = function(sessionid) {

};
