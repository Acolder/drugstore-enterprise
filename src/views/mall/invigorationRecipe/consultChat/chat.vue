<template>
  <div class="chat-txt-box" id="chatBox">
    <ul>
      <li class="clearfix" v-for="(msgDatas, i) in msgData" :key="msgDatas[i]" v-if="msgDatas.messageType !=='VoiceMessage' && msgDatas.objectName !== 'app:evaluate'">
        <div class="info-box" :class="userId === msgDatas.senderUserId ? 'self-box' : 'other-box'" v-if="msgDatas.objectName !== 'app:endConsult'">
          <div class="info-main other" v-if="userId != msgDatas.senderUserId">
            <img v-if="doctorInfo.doctorphotopath" :src="doctorInfo.doctorphotopath.substr(0, 4) === 'http' ? doctorInfo.doctorphotopath : 'https://dadmin.kangmei.com.cn/file/photos/' + doctorInfo.doctorphotopath" class="pic" />
            <img v-else src="./img/doctor-img.png" class="pic" />
            <div class="message">
              <label class="txt" v-if="msgDatas.messageType === 'TextMessage' && msgDatas.msgTxt" v-html="msgDatas.msgTxt"></label>
              <label class="txt" v-if="msgDatas.messageType === 'TextMessage' && !msgDatas.msgTxt">{{msgDatas.content.content}}</label>
              <img class="img" @click="checkBigImg(msgDatas.content.imageUri)" v-if="msgDatas.messageType === 'ImageMessage'" :src="msgDatas.content.imageUri" />
              <label class="txt" v-if="msgDatas.messageType === 'VoiceMessage'" @click="playAudio(msgDatas.content.content)">声音</label>
              <div class="recipe-box" v-if="msgDatas.messageType === 'UnknownMessage' && msgDatas.objectName === 'app:dialecticalPresc'" @click="checkRecipe(msgDatas.content.message.content.content)">
                <img class="left icon" src="./img/icon-cf.png" />
                <div class="left txt-box">
                  <label class="txt1">{{msgDatas.content.message.content.content.description}}</label>
                  <label class="txt2">点击查看</label>
                </div>
              </div>
              <i class="i-icon"></i>
            </div>
            <label class="time">{{timesToTime(msgDatas.sentTime)}}</label>
          </div>
          <div class="info-main self" v-else>
            <div class="message">
              <label class="txt" v-if="msgDatas.messageType === 'TextMessage' && msgDatas.msgTxt" v-html="msgDatas.msgTxt"></label>
              <label class="txt" v-if="msgDatas.messageType === 'TextMessage' && !msgDatas.msgTxt">{{msgDatas.content.content}}</label>
              <img class="img" @click="checkBigImg(msgDatas.content.imageUri)" v-if="msgDatas.messageType === 'ImageMessage'" :src="msgDatas.content.imageUri" />
              <!-- <div class="txt" v-if="msgDatas.messageType === 'video' && msgDatas.msgTxt">{{msgDatas.msgTxt}}</div> -->
              <label class="txt" v-if="msgDatas.messageType === 'VoiceMessage'" @click="playAudio(msgDatas.content.content)">声音</label>
              <div class="member-box" v-if="msgDatas.messageType === 'CustomMessage' && msgDatas.objectName === 'app:drugstorePatient'">
                <img class="img_lef" src="./img/icon_member.png" alt="">
                <div class="member_info_box">
                  <div class="member_info">
                    <span>{{msgDatas.content.content.name}}</span>
                    <span>{{msgDatas.content.content.gender}}</span>
                    <span>{{msgDatas.content.content.age}}岁</span>
                  </div>
                  <div class="member_desc">{{msgDatas.content.content.diease}}</div>
                </div>
              </div>
              <i class="i-icon"></i>
              <div class="el-loading-mask" style="display:none">
                <div class="el-loading-spinner">
                  <svg viewBox="25 25 50 50" class="circular">
                    <circle cx="50" cy="50" r="20" fill="none" class="path"></circle>
                  </svg>
                </div>
              </div>
            </div>
            <!-- <img :src="userInfo.storeLogo ? userInfo.storeLogo : 'https://uploads.kangmei.com.cn/Files/20190425/bmet22g3.rqa.png'" class="pic" /> -->
            <img src="./img/head_jzr_huanzheman.png" class="pic" />
            <!-- <img v-else src="./img/head_jzr_huanzhewoman.png"  class="pic" /> -->
            <label class="time">{{timesToTime(msgDatas.sentTime)}}</label>
          </div>
        </div>
        <span class="end-txt" v-if="msgDatas.messageType === 'UnknownMessage' && msgDatas.objectName === 'app:endConsult'">本次问诊结束，如有问题可再次咨询</span>
      </li>
    </ul>
  </div>
</template>
<script>
// import './rjs/RongIMLib-2.3.1';
import './js/init';
import './js/rong-calllib-util';
import './js/rong-calllib-agora';
import './js/rong-calllib-sendmsg';
import './js/rong-calllib';
import * as videoModule from './js/chat';
import Data from './js/config';
import * as imModule from './js/im';
import { timestampToTime } from '@/utils/date';
import { getRongcloudtoken, getLoginID } from '@/utils/auth';
export default {
  data() {
    return {
      accountMode: 1,
      // channelId: this.$route.query.channelId,
      // chatRoom: new chatRoom(),
      userId: '',
      loginInfo: null,
      chatRoom: {},
      unsbscribes: [],
      roomInfo: [],
      msgList: [],
      userName: '',
      Sending: false,
      inviteUserId: [],
      targetId: '',
      msgData: []
      // roomState: 0, //0:未就诊，1:候诊中，2:就诊中
      // 枚举消息类型
    };
  },
  props: {
    userInfo: {
      type: Object
    },
    doctorInfo: {
      type: Object
    },
    endCountDown: {
      type: String
    }
  },
  watch: {
    // msgData(newVal, oldVal) {
    //   console.log(oldVal);
    //   console.log(newVal);
    //   if (oldVal.length < 1) {
    //     location.reload();
    //   }
    // },
    endCountDown(newVal, oldVal) {
      console.log(newVal);
      if (newVal && newVal !== '') {
        let msg = {
          msgTxt: '通话时长 ' + newVal,
          messageType: 'TextMessage',
          senderUserId: this.userId,
          sentTime: Date.parse(new Date())
        };
        this.msgData.push(msg);
        this.scrollMsgToBottom();
      }
    }
  },
  mounted() {
    // this.getInit();
    // this.videoInit();
    // this.getInit();
    this.vInit();
    setTimeout(() => {
      let reloadAction = sessionStorage.getItem('reloadAction');
      console.log(this.msgData.length, reloadAction);
      // debugger;
      if (this.msgData.length < 1 && reloadAction !== '1') {
        sessionStorage.setItem('reloadAction', '1');
        location.reload();
      }
      else if (this.msgData.length > 0) {
        sessionStorage.removeItem('reloadAction');
      }
    }, 2000);
  },
  destroyed() {
    sessionStorage.removeItem('reloadAction');
  },
  methods: {
    vInit() {
      console.log(this.msgData);
      /* eslint-disable */
      let _this = this;
      // console.log(this.userInfo);
      // console.log(this.doctorInfo);
      this.userId = getLoginID();
      //  this.userId = '5b4ff5c358a4bf34250fa874'; 
      // console.log(this.userId);
      this.inviteUserId = [`doc${this.doctorInfo.doctorid}`];
      let token = getRongcloudtoken();
      // token = 'c/Xd7dpM8YXgGXtmMW56+GggL3VocKlVR7/eZsJrgXo4So9BFh+222xKQOcivuAOO2MJd6tqPzKTQ0mHfgec9SN/gh6WdBsWekGhjf92uqVzFhN0Z1PQcQ==';
      // console.log(token);
      this.targetId = this.doctorInfo.groupid;
      // console.log(this.targetId);
      //  this.targetId = '5c413fb4f865d45fa6075599';
      function onInitcomplete(error, callLib) {
        console.log(callLib);
      }
      let callbacks = {
        getInstance: function (instance) {
          // console.log(instance);
          _this.sendCustomMsag();
          _this.sendremarks();
          setTimeout(() => {
            _this.getHistoryMsg(instance);
          },500)
        },
        getCurrentUser: function (userInfo) {
          console.log(userInfo.userId);
        },
        getAbnormal: function() {
          _this.$confirm('已在其他设备登录', '提示', {
            confirmButtonText: '确定',
            type: 'warning',
            showClose: false,
            center: true,
            showCancelButton: false
          }).then(() => {
            _this.$router.push('/invigorationRecipe/invigorationRecipe');
          })
        }
      };
      let params = {
        appKey: Data.appKey,
        token: token
      };
      let mediaType = RongIMLib.MediaType;
      QuickInit.init(params, callbacks);
      this.messageListener();
      this.commandWatch();
    },
    // 消息监听
    messageListener() {
      let _this = this;
      console.log(this.targetId)
      imModule.messageListener(res => {
        console.log(res);
        console.log(res.targetId);
        if (res && res.targetId === _this.targetId) {
          if (res.messageType === 'TextMessage') {
            console.log(777);
            // let msg = RongIMLib.RongIMEmoji.emojiToSymbol(res.content.content);
            // console.log(RongIMLib.RongIMEmoji.symbolToHTML(msg));
            let msg = RongIMLib.RongIMEmoji.emojiToSymbol(res.content.content);
            msg = RongIMLib.RongIMEmoji.symbolToHTML(msg);
            res.msgTxt = msg;
          } else if (res.messageType === 'UnknownMessage') {
              // res.content.message.content.content = JSON.parse(res.content.message.content.content);
              try {
                res.content.message.content.content = JSON.parse(res.content.message.content.content);
              } catch (error) {
                console.log(error + '自定义消息格式不对：' + res.content.content)
              }
            }
          _this.msgData.push(res);
          console.log(_this.msgData);
          // sessionStorage.setItem('messageData', JSON.stringify(this.msgData));
          _this.scrollMsgToBottom();
          console.log(this.msgData);
        }
      });
    },
    // 获取历史消息
    getHistoryMsg(instance) {
      console.log(this.msgData);
      let _this = this;
      instance.getHistoryMessages(3, _this.targetId, 0, 20, {
        onSuccess: function (list, hasMsg) {
          console.log(list);
          console.log(hasMsg);
          list.forEach((res, i) => {
            if (i === 0) {
              let msg = {
                msgTxt: '正在问诊患者较多，请稍等片刻',
                messageType: 'TextMessage',
                senderUserId: _this.doctorInfo.doctorid,
                sentTime: res.sentTime + 1
              }
              if (res.messageType === 'CustomMessage') {
                // res.content.content = JSON.parse(res.content.content);
                try {
                  res.content.content = JSON.parse(res.content.content);
                } catch (error) {
                  console.log(error + '自定义消息格式不对：' + res.content.content)
                }
              }
              _this.msgData.push(res);
              _this.msgData.push(msg);
            }
            else {
              if (res.messageType === 'TextMessage') {
                let msg = RongIMLib.RongIMEmoji.emojiToSymbol(res.content.content);
                msg = RongIMLib.RongIMEmoji.symbolToHTML(msg);
                res.msgTxt = msg;
              } else if (res.messageType === 'CustomMessage') {
                // res.content.content = JSON.parse(res.content.content);
                try {
                  res.content.content = JSON.parse(res.content.content);
                } catch (error) {
                  console.log(error + '自定义消息格式不对：' + res.content.content)
                }
                // console.log(res.content.content);
              } else if (res.messageType === 'UnknownMessage') {
                console.log(res);
                // res.content.message.content.content = JSON.parse(res.content.message.content.content);
                try {
                  res.content.message.content.content = JSON.parse(res.content.message.content.content);
                } catch (error) {
                  console.log(error + '自定义消息格式不对：' + res.content.content)
                }
              }
              _this.msgData.push(res);
            }
          });
          // _this.msgData = list;
          _this.scrollMsgToBottom();
        },
        onError: function (error) {
          // APP未开启消息漫游或处理异常
          console.log(error);
        }
      });
    },
    // 音视频监听
    commandWatch() {
      let _this = this;
      videoModule.commandWatch(res => {
        if (res && res.targetId === this.targetId) {
          this.$emit('commandWatch', res);
          console.log(res);
        }
      })
    },
    // 音视频初始化
    videoInits(el, vel, callback) {
      console.log(el);
      console.log(vel);
      videoModule.videoInit(el, vel, callback);
    },
    // 拨打视频
    callVideos(callback) {
      console.log(this.inviteUserId);
      videoModule.callVideo(this.targetId, this.inviteUserId, callback);
    },
    // 接听视频
    acceptVideos() {
      videoModule.acceptVideo(this.targetId);
    },
    // 拒绝通话
    rejectTalk() {
      videoModule.reject(this.targetId);
    },
    // 挂断通话
    hungupTalk(callback) {
      videoModule.hungup(this.targetId, callback);
    },
    getMsg() {
      console.log(RongIMLib);
      console.log(RongIMLib.RongIMClient.getInstance);
      console.log(RongIMLib.RongIMClient.getInstance().getHistoryMessages);
      console.log(this.targetId);
    },
    // 发送消息
    sendMsg(msg) {
      console.log(this.msgData);
      imModule.sendMessage(this.targetId, msg, 'txt', (res) => {
        if (res) {
          console.log(res);
          this.msgData.push(res);
          // sessionStorage.setItem('messageData', JSON.stringify(this.msgData));
        }
      });
    },
    // 发送患者信息自定义消息
    sendCustomMsag() {
      console.log(this.msgData);
      let _this = this;
      let description = localStorage.getItem('description');
      let memberInfo = JSON.parse(localStorage.getItem('memberInfo'));
      console.log(memberInfo);
      let _name = memberInfo.name;
      let _age = memberInfo.age;
      let _gender = Number(memberInfo.gender) === 1 ? '男' : '女';
      let _telephone = memberInfo.mobile ? memberInfo.mobile  : this.userInfo.enterprise_regis_phone;
      let _userid = memberInfo.memberid;
      let _diease = description;
      // console.log(_diease);
      let data = { name: _name, age: _age, gender: _gender, telephone: _telephone, userid: _userid, diease: _diease };
      data = JSON.stringify(data);
      imModule.sendCustomMessage(this.targetId, data, (res) => {
        if (res) {
          res.content.content = JSON.parse(res.content.content);
          console.log(res);
          // this.msgData.push(res);
          // sessionStorage.setItem('messageData', JSON.stringify(this.msgData));
        }
      });
    },
    // 发送备注
    sendremarks() {
      let _this = this;
      let remarks = localStorage.getItem('remarks');
      console.log(remarks);
      if (remarks) {
        remarks = '备注：' + remarks
        setTimeout(() => {
          imModule.sendMessage(this.targetId, remarks, 'txt', (res) => {
            if (res) {
              // console.log(res);
              // this.msgData.push(res);
              // sessionStorage.setItem('messageData', JSON.stringify(this.msgData));
            }
          });
        },300)
      }
    },
    // 播放音频
    playAudio(audioFile) {
      console.log(audioFile);
      // 音频文件长度
      let duration = audioFile.length / 1024;
      // 预加载
      RongIMLib.RongIMVoice.preLoaded(audioFile, function () {
        // 播放声音
        console.log(333);
        RongIMLib.RongIMVoice.play(audioFile, duration);
      });
    },
    //滚动到底部
    scrollMsgToBottom: function () {
      setTimeout(function () {
        document.getElementById('chatBox').scrollTop = document.getElementById('chatBox').scrollHeight;
      }, 300);
    },
    // 时间转换
    timesToTime(timestamp) {
      let time = timestampToTime(timestamp, 1);
      return time
    },
    // 点击图片放大
    checkBigImg(url) {
      this.$emit('checkBigImg', url);
    },
    // 查看
    checkRecipe(msg) {
      console.log(msg);
      this.$emit('checkRecipe', msg);
    }
  }
};
</script>

<style lang="less"  scoped>
/* @color999: #999; */
.chat-txt-box {
  height: 100%;
  padding: 0 0 15px;
  text-align: center;
  overflow: auto;
  ul {
    padding-bottom: 15px \0;
    .info-box {
      text-align: left;
      margin-top: 20px;
      .info-main {
        width: 100%;
      }
      .pic {
        display: inline-block;
        width: 42px;
        height: 42px;
        border-radius: 50%;
        margin: 0 10px;
      }
      .time{
        display: block;
        font-size: 12px;
        color: #999;
      }
      .message {
        position: relative;
        display: inline-block;
        max-width: 58%;
        padding: 13px;
        text-align: justify;
        border-radius: 5px;
        .member-box{
          display: flex;
          .img_lef{
            width: 45px;
            height: 50px;
          }
          .member_info_box{
            margin-left: 10px;
            height: 50px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .member_info{
              span{
                display: inline-block;
                margin:  0 5px;
              }
            }
            .member_desc{
              padding-left: 5px;
            }
          }
        }
        label {
          word-break: break-all;
        }
        .img {
          display: block;
          width: 100%;
          max-width: 460px;
          cursor: pointer;
        }
        .i-icon {
          position: absolute;
          top: -3px;
          width:0;
          height:0;
          border-width:7px 7px 7px 0;
          border-style:solid;
          transform:rotate(90deg);
          -ms-transform:rotate(90deg);
          -moz-transform:rotate(90deg);
          -webkit-transform:rotate(90deg);
          -o-transform:rotate(90deg);
        }
        .recipe-box {
          cursor: pointer;
          .icon {
            width: 41px;
            height: 48px;
            margin-right: 6px;
          }
          .txt-box {
            position: relative;
            label {
              cursor: pointer;
            }
            .txt1 {
              display: block;
              width: 182px;
            }
            .txt2 {
              // position: absolute;
              // bottom: 0;
              // right: 0;
              display: block;
              width: 182px;
              text-align: right;
              color: #0cbfc5;

            }
          }
        }
      }
    }
    .other-box {
      .message {
        background: #d4fbfb;
      }
      .pic {
        float: left;
      }
      .i-icon {
        left: -9px;
        background-position: 0px -1px;
        border-color:#d4fbfb transparent  transparent transparent;
      }
      .time {
        margin-left: 68px;
      }
    }
    .self-box {
      .message {
        background: #0cbfc5;
        color: #fff;
      }
      .pic {
        float: right;
      }
      .self {
        text-align: right;
        .i-icon {
          right: -8px;
          border-color:transparent  transparent #0cbfc5 transparent ;
        }
      }
      .time {
        margin-right: 68px;
      }
    }
    .end-txt {
      display: inline-block;
      padding: 2px 7px;
      margin: 5px 0 2px;
      background: #ece9e9;
      color: #666;
      border-radius: 3px;
    }
  }
}

// .main-box .chat-box .other-box .custom_txt {
//   text-align: center;
// }

// .main-box .other-box .custom_txt .message {
//   color: #fff;
//   margin: 0 auto;
//   width: auto;
//   padding: 1px 10px;
//   background: #dcdcdc;
//   font-size: 12px;
// }

// .main-box .other-box .custom_txt .i-icon {
//   display: none;
// }


.webuploader {
  display: inline;
}

.el-loading-mask {
  margin: 13px;
  background-color: rgba(0, 0, 0, 0.65);
}
</style>
