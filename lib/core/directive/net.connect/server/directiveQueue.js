// 指令队列
// 此指令队列 即约束主动行为 也约束被动行为？
// 如 主动init 被动也会接收 init
// 然后 主动crypto 被动也会crypto 处理一个 主动 + 被动 ？

// 主动执行队列
function ActiveQueue() {

}

// 被动执行队列
// 被动指令有可能是 由于通讯双方中  由一方通知另一方接下来需要等待执行一下指令
function UnActiveQueue() {

}

// 交互执行队列
// 每一个指令是主动加被动 每一对执行完毕后,才会执行下一个指令
// 如果仅仅包含指令名称,那其实就是一个数组了
//
function InteractiveQueue(...directives) {

    this.next = function() {
        return directives.shift();
    };

}
