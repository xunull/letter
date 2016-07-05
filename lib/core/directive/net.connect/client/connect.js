var Q = require('q');
var uuid = require('uuid');

var crypto = require('../../../../crypto/crypto');

function Connect() {

}

var connect = new Connect();

module.exports = connect;

Connect.prototype.init = function(letter, handler) {
    console.log(letter);
    var deferred = Q.defer();
    var back_letter = {
        signature: letter.signature,
        directive: {
            connect: {
                init: null
            }
        }
    };
    deferred.resolve(back_letter);
    return deferred.promise;
};

Connect.prototype.crypto = function(letter, handler) {
    let deferred = Q.defer();
    let public_str = letter.crypto.public_str;

    // 使用uuid 作为密码
    // let secret = uuid.v4();
    let secret = '12345678';

    let encryptSecret = crypto.publicEncrypt(public_str, secret);

    let json = encryptSecret.toJSON();
    console.log('密码为:');
    console.log(secret);
    // console.log(encryptSecret.toString());
    letter.crypto.encryptSecret = JSON.stringify(encryptSecret.toJSON());

    deferred.resolve(letter);

    setTimeout(function() {
        handler.crypto = true;
        handler.encryptSecret = secret;
        let letter = {
            directive: {
                test: null
            }
        };
        letter = JSON.stringify(letter);
        letter = crypto.cipher(letter, secret);
        handler.evenEmitter.emit('letter', letter);
    }, 5000);

    return deferred.promise;
};
