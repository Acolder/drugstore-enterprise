
(function (dependencies) {
  let global = dependencies.global;
  let RongIMLib = dependencies.RongIMLib;
  let RongIMClient = RongIMLib.RongIMClient;
  console.log(RongIMClient);
  function ObserverList() {

    let checkIndexOutBound = function (index, bound) {
      return index > -1 && index < bound;
    };

    this.observerList = [];

    this.add = function (observer, force) {
      force && (this.observerList.length = 0);
      this.observerList.push(observer);
    };

    this.get = function (index) {
      if (checkIndexOutBound(index, this.observerList.length)) {
        return this.observerList[index];
      }
    };

    this.count = function () {
      return this.observerList.length;
    };

    this.removeAt = function (index) {
      checkIndexOutBound(index, this.observerList.length) && this.observerList.splice(index, 1);
    };

    this.remove = function (observer) {
      if (!observer) {
        this.observerList.length = 0;
        return;
      }
      /* eslint-disable */
      observer = Object.prototype.toString.call(observer) === '[object Function]' ? [observer] : observer;
      for (let i = 0, len = this.observerList.length; i < len; i++) {
        if (this.observerList[i] === observer[i]) {
          this.removeAt(i);
          break;
        }
      }
    };

    this.notify = function (val) {
      for (let i = 0, len = this.observerList.length; i < len; i++) {
        this.observerList[i](val);
      }
    };

    this.indexOf = function (observer, startIndex) {
      let i = startIndex || 0;
      let len = this.observerList.length;
      while (i < len) {
        if (this.observerList[i] === observer) {
          return i;
        }
        i++;
      }
      return -1;
    };
  }

  let msgObserverList = new ObserverList();

  let init = function (params, callbacks) {
    let appKey = params.appKey;
    let token = params.token;
    let navi = params.navi || '';

    if (navi !== '') {
      //私有云
      let config = {
        navi: navi
      }
      RongIMLib.RongIMClient.init(appKey, null, config);
    } else {
      //公有云
      RongIMLib.RongIMClient.init(appKey);
    }

    let instance = RongIMClient.getInstance();

    // 连接状态监听器
    RongIMClient.setConnectionStatusListener({
      onChanged: function (status) {
        console.log(status, RongIMLib.ConnectionStatus.CONNECTED, RongIMLib.ConnectionStatus.DISCONNECTED, RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT, RongIMLib.ConnectionStatus.DOMAIN_INCORRECT, RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE);
        switch (status) {
          case RongIMLib.ConnectionStatus.CONNECTED:
            callbacks.getInstance && callbacks.getInstance(instance);
            break;
          case RongIMLib.ConnectionStatus.DISCONNECTED:
            console.log('断开连接');
            reconnect();
            break;
          case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
            console.log('其他设备登录');
            callbacks.getAbnormal && callbacks.getAbnormal();
            break;
          case RongIMLib.ConnectionStatus.DOMAIN_INCORRECT:
            console.log('域名不正确');
            break;
          case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
            console.log('网络不可用');
            reconnect();
            break;
        }
      }
    });
    //开始链接
    RongIMClient.connect(token, {
      onSuccess: function (userId) {
        callbacks.getCurrentUser && callbacks.getCurrentUser({ userId: userId });
        console.log('链接成功');
      },
      onTokenIncorrect: function () {
        console.log('token无效');
      },
      onError: function (errorCode) {
        console.log(errorCode);
      }
    });
    // 重新链接
    function reconnect() {
      RongIMClient.reconnect({
        onSuccess: function(userId) {
          console.log('重新链接成功，用户id：' + userId);
        },
        onTokenIncorrect: function() {
          console.log('token无效');
        },
        onError:function(errorCode){
          var info = '';
          switch (errorCode) {
            case RongIMLib.ErrorCode.TIMEOUT:
              info = '超时';
              break;
            case RongIMLib.ErrorCode.UNKNOWN_ERROR:
              info = '未知错误';
              break;
            case RongIMLib.ErrorCode.UNACCEPTABLE_PROTOCOL_VERSION:
              info = '不可接受的协议版本';
              break;
            case RongIMLib.ErrorCode.IDENTIFIER_REJECTED:
              info = 'appkey不正确';
              break;
            case RongIMLib.ErrorCode.SERVER_UNAVAILABLE:
              info = '服务器不可用';
              break;
          }
          console.log(info);
        }
      });
    }
    RongIMLib.RongIMVoice.init();
  }

  let watch = function (watcher) {
    msgObserverList.add(watcher);
  };

  global.QuickInit = {
    init: init,
    watch: watch
  };
})({
  global: window,
  RongIMLib: RongIMLib
});
