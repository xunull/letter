var Q = require('q');

function Connect() {

}

var connect = new Connect();

module.exports = connect;

Connect.prototype.init = function(letter, handler) {
    let deferred = Q.defer();
    //TODO 假设init 成功
    if (true) {
        handler.startWork();
        deferred.resolve();
    } else {
        deferred.reject(null);
    }
    return deferred.promise;
};

Connect.prototype.close = function(letter) {

};

Connect.prototype.reject = function(letter) {

};
