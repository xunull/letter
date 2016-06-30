var Q = require('q');


function Connect() {

}

var connect = new Connect();

module.exports = connect;

Connect.prototype.init = function(letter) {
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
