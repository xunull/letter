
// 不同种类的letter的指令不一定会相同
// 暂时认为一次传送一个指令,因为大多数的情况下都是传输一个指令，比如聊天
// 如果对于每个letter 都要判断指令的数量可以不会太好,不过这也就是多点代码，多执行几条命令的事情，
// 性能不一定就会受到影响
// directiveFunc 是一方传给另一方的 处理letter的方法,比如当对方还并不知晓如何处理此letter时
//                又或者这个letter 需要使用一个特殊的function 处理

var directive = {

    set: {
        username: null,
    },
    get: {

    },
    receive: {
        message: null
    },
    send: {
        message: null
    },
    channel: {

    },
    client: {
        user_presence: null,
        sign_in: null,
        init_userList: null  // 参数就是userlist
    },
    directiveFunc:null

};
