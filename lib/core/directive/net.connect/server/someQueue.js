let async = require('async');
let Q = require('q');

// 指令队列
// 此指令队列 即约束主动行为 也约束被动行为？
// 如 主动init 被动也会接收 init
// 然后 主动crypto 被动也会crypto 处理一个 主动 + 被动 ？

// 主动执行队列
function ActiveQueue(handler) {
    this.handler = handler;
    let result = Q("init Queue");

    // 并发量设置为1 ,顺序执行
    // 因为有的方法是异步方法,使用此目的 仅仅是将其拼接成q的顺序执行
    let queue = async.queue(function(func, callback) {

        // 如果有一环节出现error 后面的还会执行么
        result = result.then(function() {
            console.log(func);
            // 怎样能直接把方法传进来？
            return handler[func]();
        });
        // 这个callback 如果不调用 当执行一个的时候 就不会继续执行队列中的其它的 卡住了
        callback();
    }, 1);

    queue.drain = function() {
        console.log('all items have been processed');
    };

    // push 方法
    this.push = function(...func) {
        for (let temp of func) {
            // console.log(temp);
            // console.log(temp.name);
            queue.push(temp);
        }
    };
}

exports.ActiveQueue = ActiveQueue;

// 被动执行队列
// 被动指令有可能是 由于通讯双方中  由一方通知另一方接下来需要等待执行一下指令
function UnActiveQueue() {

}

exports.UnActiveQueue = UnActiveQueue;

// 交互执行队列
// 每一个指令是主动加被动 每一对执行完毕后,才会执行下一个指令
// 如果仅仅包含指令名称,那其实就是一个数组了
//
function InteractiveQueue(...directives) {

    this.next = function() {
        return directives.shift();
    };

}

exports.InteractiveQueue = InteractiveQueue;
