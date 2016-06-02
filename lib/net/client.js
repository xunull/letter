var _url = require('url');
var _net = require('net');

var config = require('../../config');
var logger = require('../../common/logger');

var _opts = {
    host: null,
    port: config._default.host_port
};

function createOpts(host, port) {
    var args = Array.prototype.slice.call(arguments);
    var opts;
    if (args.length === 1) {
        if (typeof host === 'string') {
            var index = host.indexOf(':');
            if (index !== -1) {
                host = host.substring(0, index);
                port = host.substring(index);
            } else {
                port = config._default.host_port;
            }
            opts = _copy(_opts, {
                host: host,
                port: port
            });
        } else {
            opts = _copy(_opts, args[0]);
        }
    } else {
        // 分别指定了 host 和 port
        opts = _copy(_opts, {
            host: host,
            port: port
        });
    }
    return opts;
}

exports.connect = function(host, port) {
    var opts = createOpts(host, port);
    logger.info(opts);

    var socket = _net.connect(opts.port, opts.host, function() {

    });

    socket.on('error', function(error) {

        logger.info('socket error');
        logger.info(error);
    });

    return socket;
};

function _copy(dist, obj) {
    var result = {};
    for (var key in dist) {
        result[key] = dist[key];
    }
    for (var key2 in obj) {
        result[key2] = obj[key2];
    }
    return result;
}
