function Connect() {

}

var connect = new Connect();

module.exports = connect;

Connect.prototype.init = function(letter) {
    console.log(letter);
};
