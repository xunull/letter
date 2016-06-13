/**
 * 操作的类型
 * 通用型操作:服务端,客户端有相同的处理方法
 * 询问-应答型操作:发送方等待接收方返回结果
 */

var type = {
    connect: {
        init: '001001003',
        version: '001001001',
        version_ok: '0010010010',
        version_reject: '0010010011',
        is_encode: '001001002',
        encode_true: '0010010020',
        encode_false: '0010010021',
        encode_pub:'0010010022'
    },
    letter: {
        post_letter: '001002001'
    }
};

module.exports = type;
