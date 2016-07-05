var Q = require('q');
var crypto = require('../../../../crypto/crypto');

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


Connect.prototype.crypto = function(letter, handler) {
    let deferred = Q.defer();
    let public_str = letter.crypto.public_str;

    let encryptSecret = letter.crypto.encryptSecret;

    let decryptSecret = crypto.privateDecrypt(handler.rsa.private_str, Buffer.from(JSON.parse(encryptSecret).data));
    console.log('密码为:');
    console.log(decryptSecret.toString());
    // 这个是所有消息的解密密码
    handler.decryptSecret = decryptSecret.toString();
    handler.crypto = true;

    deferred.resolve(letter);
    return deferred.promise;
};

Connect.prototype.close = function(letter) {

};

Connect.prototype.reject = function(letter) {

};
