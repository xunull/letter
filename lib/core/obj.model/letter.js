
// letter 是信息的抽象
//
// category 标明消息的种类，如基本消息，聊天消息
// directive 是指令,表明如何处理letter
// message 是普通的消息
// 以下对象信息 不一定会都包含,也不一定每种letter 对象都会包含
// user 实体对象信息
// letter 实体对象信息,一般来说外层letter消息的指令会是向其他层传递此letter，并且其并不能打开letter
//        如何处理letter要看directive

var letter = {
  category:null,
  directive:null,
  message:null,
  user:null,
  letter:null
};
