var RongIMClient = RongIMLib.RongIMClient;
// 监听消息
var messageListener = function(callback) {
  RongIMClient.setOnReceiveMessageListener({
    // 接收到的消息
    onReceived: function (message) {
      // 判断消息类型
      callback && callback(message);
      console.log(message);
      // msgObserverList.notify(message);
      // console.log(msgObserverList.notify(message));
    }
  });
}

//发送消息
var sendMessage = function (targetId, msg, msgType, callback) {
  console.log(msgType,targetId);
  if (msgType === 'txt') {
    // msg = {content: msg, messageName: 'TextMessage'};
    msg = new RongIMLib.TextMessage({content: msg});
  }
  // msg = new RongIMLib.TextMessage({content: msg});
  console.log (msg);
  RongIMClient.getInstance ().sendMessage (RongIMLib.ConversationType.GROUP, targetId, msg, {
    // 发送消息成功
    onSuccess: function (message) {
      //message 为发送的消息对象并且包含服务器返回的消息唯一Id和发送消息时间戳
      callback && callback (message);
      if (!callback) {
        updateConversationList ();
        updateMessage (message);
      }
    },
    onError: function (errorCode, message) {
      console.log(errorCode,message);
      var info = '';
      switch (errorCode) {
        case RongIMLib.ErrorCode.TIMEOUT:
          info = '超时';
          break;
        case RongIMLib.ErrorCode.UNKNOWN_ERROR:
          info = '未知错误';
          break;
        case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
          info = '在黑名单中，无法向对方发送消息';
          break;
        case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
          info = '不在讨论组中';
          break;
        case RongIMLib.ErrorCode.NOT_IN_GROUP:
          info = '不在群组中';
          break;
        case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
          info = '不在聊天室中';
          break;
        default:
          info = x;
          break;
      }
      alert ('发送失败:' + info);
    },
  });
};
// 发送自定义消息
var sendCustomMessage = function (groupid, data, callback) {
  let messageName = 'CustomMessage'; // 消息名称。
  let objectName = 'app:drugstorePatient'; // 消息内置名称，请按照此格式命名。
  let mesasgeTag = new RongIMLib.MessageTag(true, true);// 消息是否保存是否计数，true true 保存且计数，false false 不保存不计数。
  let prototypes = ['content']; // 消息类中的属性名。
  RongIMClient.registerMessageType(messageName, objectName, mesasgeTag, prototypes);
  let conversationType = RongIMLib.ConversationType.GROUP; //单聊,其他会话选择相应的消息类型即可。
  let targetId = groupid; // 想获取自己和谁的历史消息，targetId 赋值为对方的 Id。
  let msg = new RongIMClient.RegisterMessage.CustomMessage({ content: data });
  RongIMClient.getInstance().sendMessage(conversationType, targetId, msg, {
    onSuccess: function (message) {
      console.info('发送成功!');
      callback(message);
    },
    onError: function (errorCode) {
      console.info('发送失败!');
    }
  });
};
export {
  sendMessage,
  messageListener,
  sendCustomMessage
};
