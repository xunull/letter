/**
 * 接收连接,接收letter,派发letter
 */

var _ = require('lodash');

// 处理跟底层的连接
var Connect = require('./connect');

var logger = require('../../common/logger');
var uuid = require('uuid');

// 默认配置对象
let default_config = {
    connector: 'net',
    host_port: 15577
};

function PostOffice(options) {
    // 融合 options 和 default_config 对象
    this.options = _.extend(default_config, options);
    this.connect = new Connect(options);
}

module.exports = PostOffice;

/**
 * 引用所有连接到此的邮箱
 */
var mailboxs = new Map();
