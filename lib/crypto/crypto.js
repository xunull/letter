var crypto = require('crypto');
var ursa = require('ursa');
var Q = require('q');
var fs = require('fs');

exports.cipher = function(data, pwd, type = 'aes192', data_encoding = 'utf8', result_encoding = 'hex') {
    var cipher = crypto.createCipher(type, pwd);
    // 如果不指定 input_encoding 那么data 必须是一个buffer
    cipher.update(data, data_encoding, result_encoding);
    return cipher.final(result_encoding);
};

exports.decipher = function(data, pwd, type = 'aes192', data_encoding = 'hex', result_encoding = 'utf8') {
    var decipher = crypto.createDecipher(type, pwd);
    decipher.update(data, data_encoding, result_encoding);
    return decipher.final(result_encoding);
};

exports.createRSA = function(modulusBits = 2048, exponent = 65537) {
    var private_key = ursa.generatePrivateKey(modulusBits, exponent);

    var rsa = {
        private_key: private_key,
        private_str: private_key.toPrivatePem().toString(),
        public_str: private_key.toPublicPem().toString()
    };

    return rsa;
};

/**
 *  data是buffer 类型
 *  返回值是buffer类型
 */
exports.privateEncrypt = function(private_str, data) {
    return crypto.privateEncrypt(private_key, data);
};

/**
 *  data是buffer 类型
 *  返回值是buffer类型
 */
exports.privateDecrypt = function(private_str, data) {
    return crypto.privateDecrypt(private_str, data);
};

/**
 *  data是buffer 类型
 *  返回值是buffer类型
 */
exports.publicEncrypt = function(public_str, data) {
    return crypto.publicEncrypt(public_str, data);
};

/**
 *  data是buffer 类型
 *  返回值是buffer类型
 */
exports.publicDecrypt = function(public_str, data) {
    return crypto.publicDecrypt(public_str, data);
};