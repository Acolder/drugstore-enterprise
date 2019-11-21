<template>
  <div class="page-container">
    <!-- <div @click="checkRecipe('847540583630114816')">1122</div> -->
    <!--<v-location :list="locationList"></v-location>-->
    <!-- <v-crumbs :Chat="true"></v-crumbs> -->
    <div class="display-box main-box" v-if="doctorInfos">
      <div class="box-flex chat-box box-vertical">
        <div class="head">
          <label class="txt">{{doctorInfos.realname}}医生</label>
          <!-- <label class="count-down">咨询时间: 10:12</label> -->
        </div>
        <div class="box-flex vchat-box">
          <v-chatbox ref="chatbox" v-if="userInfo && doctorInfos" :doctor-info="doctorInfos" :user-info="userInfo" :end-count-down="endCountDown" @commandWatch="commandWatchs" @checkBigImg="checkBigImg" @checkRecipe="checkRecipe"></v-chatbox>
        </div>
        <div class="bottom">
          <div class="import-box" v-if="roomState.state != 3">
            <!-- <div class="tool-box">
              <div class="left" style="margin-right: 10px">表情</div>
              <div class="left" style="margin-right: 10px">图片</div>
              <div class="left" style="margin-right: 10px">音频</div>
              <div class="left" style="margin-right: 10px" @click="callVideos">视频</div>
            </div> -->
            <textarea class="import-input" placeholder="请输入文字" v-model="msgTxt" @keydown.prevent.enter @keyup.enter="sendMsg(msgTxt)"></textarea>
            <!--<form class="webuploader" name="webuploader_form" enctype="multipart/form-data">-->
            <!--<input type="file" id="webuploader_file" multiple accept="image/*" v-show="false" class="form-control" name="file" @change="uploadImg" />-->
            <!--<label for="webuploader_file" class="left blue-btn">添加图片</label>-->
            <!--</form>-->
            <div class="right send-btn" v-on:click="sendMsg(msgTxt)">发送</div>
          </div>
        </div>
      </div>
      <div class="doctor-box">
        <div class="doctor-info-box" v-show="!hasVideo && !loadingAnswer">
          <div class="doctor-info">
            <img v-bind:src="doctorPhotopath" class="doctor-img" />
            <label class="doctor-name">{{doctorInfos.realname}}医生</label>
            <div class="class-box">
              <img src="./img/icon-qk.png" />
              <label class="class-name">{{doctorInfos.departname}}</label>
            </div>
            <div class="class-box">
              <img src="./img/icon-hospital.png" />
              <label class="hospital-name">{{doctorInfos.hostname}}</label>
            </div>
          </div>
          <div class="good-intro-box">
            <div class="good-intro">
              <label class="left tlt">简介：</label>
              <label class="txt">{{doctorInfos.personalinfo}}</label>
            </div>
            <div class="good-intro clearfix">
              <label class="left tlt">擅长：</label>
              <label class="txt">{{doctorInfos.expert}}</label>
            </div>
          </div>
          <div class="operate-btn">
            <div class="btn" @click="callVideos">
              <img src="./img/icon-video.png" />
              <label>视频问诊</label>
            </div>
            <!-- <router-link to="/home/record" class="btn">
              <img src="./img/icon-wzjl.png" />
              <label>问诊记录</label>
            </router-link> -->
          </div>
        </div>
        <div class="waiting-video" v-show="loadingAnswer">
          <img v-bind:src="doctorPhotopath" class="doctor-img" />
          <label class="doctor-name">{{doctorInfos.realname}}医生</label>
          <p class="hint">视频正在接通，请稍等...</p>
          <img src="./img/btn-endtalk.png" class="hungup-btn" @click="hungupTalk" />
        </div>
        <div class="in-the-video" v-show="hasVideo && isHungup && !loadingAnswer">
          <div class="video-box" id="video-box"></div>
          <label class="doctor-name">{{doctorInfos.realname}}医生</label>
          <div class="video-box" id="video-main"></div>
          <label class="count-down">{{countDownTxt}}</label>
          <img class="hungup-btn" @click="hungupTalk" src="./img/btn-endtalk.png" />
        </div>
        <div class="has-video" v-show="hasVideo && isAccept && !loadingAnswer">
          <img v-bind:src="doctorPhotopath" class="doctor-img" />
          <label class="doctor-name">{{doctorInfos.realname}}医生</label>
          <p class="txt">医生邀请您进行视频会诊，请回应...</p>
          <div class="btn-box">
            <div class="left" @click="hungupTalk">
              <img src="./img/btn-endtalk.png" />
              <label>挂断</label>
            </div>
            <div class="right" @click="acceptVideos">
              <img src="./img/btn-talk.png" />
              <label>接听</label>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="video-boxs" v-show="showVideo">
      <div id="video-main"> </div>
      <div id="video-box">
        <div class="video-child"></div>
      </div>
      <div v-show="loadingAnswer">等待对方接听...</div>
      <div v-show="isAccept" @click="acceptVideos">接听</div>
      <div v-show="isReject" @click="rejectTalk">拒绝</div>
      <div v-show="isHungup" @click="hungupTalk">挂断</div>
    </div> -->
    <div class="common-mask" v-show="showBigImg" @click="hideMask"></div>
    <div class="big-img" v-show="showBigImg"><img :src="bigImg" /></div>
    <!-- <div class="recipe-box" v-show="showRecipe">
      <div class="head">
        <label class="txt"></label>
        <label class="stamp" @click="goPrint">打印</label>
      </div>
      <div class="img-box" id="recipe-img-box">
        <img src="http://rongcloud-image.ronghub.com/image_jpeg__RC-2018-07-20_44_1532069193789?e=2147483647&token=livk5rb3__JZjCtEiMxXpQ8QscLxbNLehwhHySnX:eVwrKSvmg_t8bMe8R57KgmRDnWQ=" class="recipe-img" />
      </div>
    </div> -->
    <el-dialog title="处方" :visible.sync="showRecipe" :center="true" top="60px" :modal-append-to-body="false" :close-on-click-modal="false" custom-class="el-recipe-box">
      <iframe :src="recipeUrl" frameborder="0" style="width:100%;height:100%">
      </iframe>
    </el-dialog>
  </div>
</template>
<script>
import ajax from '@/utils/doctorApiRequest';
import chatbox from './chat.vue';
import { getSellerInfo } from '@/api/user';
// import crumbs from '@/components/crumbs/Crumbs';
import doctorImg from './img/doctor-img.png';
export default {
  data() {
    return {
      doctorInfos: null,
      doctorPhotopath: '',
      userInfo: null,
      roomState: 2,
      msgTxt: '',
      hasVideo: false, // 有待接视频
      // showVideo: false, // 视频窗口
      loadingAnswer: false, // 等待接听
      isAccept: false, // 接听按钮
      isReject: false, // 拒绝接听按钮
      isHungup: false,
      showBigImg: false,
      bigImg: '',
      showRecipe: false,
      countDownTxt: '',
      endCountDown: '',
      recipeUrl: ''
    };
  },
  components: {
    'v-chatbox': chatbox,
    // 'v-crumbs': crumbs
  },
  beforeDestroy() {
    console.log(this.loadingAnswer || this.hasVideo || this.isHungup || this.isAccept);
    if (this.loadingAnswer || this.hasVideo || this.isHungup || this.isAccept) {
      this.hungupTalk();
    }
  },
  mounted() {
    this.getInit();
  },
  methods: {
    getInit() {
      getSellerInfo().then(res => {
        console.log(res);
        if (res.status === 200) {
          let resData = res.data;
          if (resData.resultCode === '0') {
            this.userInfo = resData.resultData;
            console.log(this.userInfo);
          }
          else {
            this.$message({
              message: resData.message,
              type: 'error'
            });
            this.$router.push('/login');
          }
        }
      });
      this.doctorInfos = JSON.parse(sessionStorage.getItem('doctorInfo'));
      console.log(this.doctorInfos);
      if (this.doctorInfos.doctorphotopath) {
        this.doctorPhotopath = this.doctorInfos.doctorphotopath.substr(0, 4) === 'http' ? this.doctorInfos.doctorphotopath : 'https://dadmin.kangmei.com.cn/file/photos/' + this.doctorInfos.doctorphotopath;
      }
      else {
        this.doctorPhotopath = doctorImg;
      }
      console.log(this.doctorInfos);
      if (!this.doctorInfos) {
        this.$router.push('/invigorationRecipe/invigorationRecipe');
      }
    },
    // 音视频监听
    commandWatchs(res) {
      console.log(res);
      if (res) {
        console.log(res);
        let messageType = res.messageType;
        console.log(messageType);
        if (messageType === 'InviteMessage') {
          this.hasVideo = true;
          // this.showVideo = true;
          this.isAccept = true;
          this.isReject = true;
        }
        if (messageType === 'RingingMessage') {
          this.hasVideo = true;
          this.loadingAnswer = true;
        }
        if (messageType === 'AcceptMessage') {
          this.loadingAnswer = false;
          this.isAccept = false;
          this.isReject = false;
          this.hasVideo = true;
          this.isHungup = true;
          this.countDown();
        }
        if (messageType === 'HungupMessage') {
          this.hasVideo = false;
          this.loadingAnswer = false;
          this.hungupTalk();
          console.log(this.isHungup);
          // if (!this.isHungup) {
          //   this.$message({
          //     message: '对方已挂断',
          //     type: 'error'
          //   });
          // }
        }
      }
    },
    // 拨打视频
    callVideos() {
      let el = document.getElementById('video-main');
      let vel = document.getElementById('video-box');
      this.$refs.chatbox.videoInits(el, vel, res => {
        // console.log(res);
        this.hungupTalk();
      });
      this.$refs.chatbox.callVideos(res => {
        this.hasVideo = false;
        this.loadingAnswer = true;
        this.isAccept = false;
        console.log(res);
        if (res.code === 4 || res.code === 15) {
          this.$message({
            message: '医生正在候诊中，请稍等...',
            type: 'warning'
          });
        }
        if (res.info && res.code !== 15 && res.code !== 4) {
          this.$message({
            message: res.info,
            type: 'warning'
          });
        }
        if (this.loadingAnswer && res.code === 15) {
          this.$message({
            message: '医生未接听',
            type: 'warning'
          });
          this.hasVideo = false;
          this.loadingAnswer = false;
        }
      });
    },
    // 接听视频
    acceptVideos() {
      // acceptVideo(targetId);
      let el = document.getElementById('video-main');
      let vel = document.getElementById('video-box');
      this.$refs.chatbox.videoInits(el, vel);
      this.$refs.chatbox.acceptVideos();
      this.isAccept = false;
      this.isReject = false;
      this.hasVideo = true;
      this.isHungup = true;
      this.countDown();
    },
    // 拒绝通话
    rejectTalk() {
      this.$refs.chatbox.rejectTalk(this.targetId);
      this.hasVideo = false;
      this.isAccept = false;
      this.isReject = false;
    },
    // 挂断通话
    hungupTalk() {
      this.$refs.chatbox.hungupTalk((res) => {
        if (res) {
          if (res.status.code === 3) {
            this.hasVideo = false;
            this.isHungup = false;
            this.loadingAnswer = false;
            this.$message({
              message: '通话已结束',
              type: 'warning'
            });
          }
        }
      });
      // if (this.hasVideo && this.isHungup) {

      // }
    },
    // 发送消息
    sendMsg(msg) {
      console.log(msg);
      if (msg.trim() === '') {
        this.msgTxt = '';
        return false;
      }
      else {
        this.$refs.chatbox.sendMsg(msg);
        this.msgTxt = '';
        this.$refs.chatbox.scrollMsgToBottom();
      }
    },
    // 查看大图
    checkBigImg(url) {
      this.showBigImg = true;
      this.bigImg = url;
    },
    // 关闭大图或查看
    hideMask() {
      this.showBigImg = false;
      // this.showRecipe = false;
    },
    // 查看
    checkRecipe(msg) {
      console.log(msg);
      let orderId = msg.orderId;
      // let orderId = '831952551950684160';
      let url = `/api/order/getPatientOrderDetail/${orderId}`;
      console.log(orderId);
      ajax.get(url).then(res => {
        if (res.status === 200 && res.data.code === 0) {
          let recipeUrl = res.data.data.docprescriptions[0].recipe_pic_url;
          console.log(recipeUrl);
          if (recipeUrl && recipeUrl !== '') {
            this.showRecipe = true;
            this.recipeUrl = res.data.data.docprescriptions[0].recipe_pic_url;
          }
          else {
            this.$alert('还没生成建议单哦~', '', {
              showClose: false,
              confirmButtonText: '确定',
              confirmButtonClass: 'cinfirmBtn',
              customClass: 'prompt'
            });
          }
        }
        console.log(res);
      });

    },
    // 打印
    goPrint() {
      let printHtml = document.getElementById('recipe-img-box').innerHTML;
      // let thisHtml = document.body.innerHTML;
      document.body.innerHTML = printHtml;
      // let wind = window.open('', '_self');
      window.print();
      // document.body.innerHTML = thisHtml;
      location.reload();
      return false;
      // wind.document.body.innerHTML = printHtml;
      // wind.print();
    },
    // 计时
    countDown() {
      /*eslint-disable*/
      let hour = 0;
      let minute = 0;
      let second = 0;
      let setVal = setInterval(() => {
        if (!this.hasVideo && !this.loadingAnswer) {
          this.endCountDown = this.countDownTxt;
          clearInterval(setVal);
        }
        second += 1;
        if (second === 60) {
          second = 0;
          minute += 1;
          if (minute === 60) {
            minute = 0;
            hour += 1;
          }
        }
        this.countDownTxt = this.toTwo(hour) + ':' + this.toTwo(minute) + ':' + this.toTwo(second);
      }, 1000);
    },
    toTwo(num) {
      if (num < 10) {
        return '0' + num;
      }
      else {
        return num;
      }
    }
  }
};
</script>
<style lang="less" scoped>
@import '../../../../styles/common.less';
@green-color: #0ccdd3;
@color333: #333;
@color666: #666;
@color999: #999;
@color000: #000;
.video-boxs {
  position: fixed;
  top: 100px;
  left: 200px;
  width: 600px;
  height: 500px;
  border: solid 1px #eee;
  background: #fff;
}
// #video-main {
//   float: left;
//   width: 300px;
//   height: 400px;
//   border-right: solid 1px #eee;
//   border-bottom: solid 1px #eee;
//   background: #000;
// }
// #video-box {
//   float: left;
//   width: 298px;
//   height: 400px;
//   border-bottom: solid 1px #eee;
//   background: #000;
// }
#video-box div {
  width: 100%;
  height: 100%;
} 
.video-box > div > div {
  position: absolute;
  top: 0;
  left: 0;
} 
.blue-btn {
  display: inline-block;
  width: 110px;
  height: 34px;
  color: #fff;
  line-height: 34px;
  text-align: center;
  border-radius: 5px;
  background: #27a2ff;
  cursor: pointer;
}
.page-container {
  height: 100%;
  /deep/ .el-dialog__body {
    height: 85%;
  }
}
.main-box {
  width: 100%;
  height: 100%;
  max-height: 595px;
  margin: 15px 0 56px;
  .chat-box {
    max-width: 808px;
    max-height: 730px;
    background: @white-color;
    height: 595px;
    .vchat-box{
      overflow: hidden;
    }
    .head {
      display: block;
      position: relative;
      width: 100%;
      height: 40px;
      line-height: 40px;
      text-align: center;
      background: @green-color;
      color: @white-color;
      .txt {
        font-size: 18px;
      }
      .count-down {
        position: absolute;
        right: 14px;
        font-size: 14px;
      }
    }
    .import-box {
      height: 90px;
      border-top: @line-border;
      .import-input {
        display: block;
        width: 100%;
        height: 66px;
        padding: 8px 36px;
        line-height: 20px;
        font-size: 14px;
        border: none;
        overflow: auto;
        color: #333;
      }
    }
    .send-btn {
      .border-radius-btn(24px,16px,@green-color,3px,14px);
      margin: 0 10px 3px 0;
      cursor: pointer;
    }
  }
  .doctor-box {
    position: relative;
    width: 256px;
    // height: 100%;
    height: 595px;
    max-height: 595px;
    // padding-bottom: 15px;
    text-align: center;
    margin-left: 20px;
    background: @white-color;
    box-shadow: 2px 3px 6px 1px #d1f3f3;
    .doctor-img {
      display: block;
      width: 106px;
      height: 106px;
      border-radius: 50%;
      margin: 0 auto 12px;
    }
    .doctor-name {
      font-size: 18px;
    }
    .doctor-info-box{
      position: relative;
      height: 100%;
      overflow: hidden;
      .doctor-info {
        margin: 30px 0 0;
        padding-bottom: 20px;
        border-bottom: @line-border;
        .class-box, .hospital-box {
          font-size: 16px;
          color: @color666;
          text-align: center;
          margin-top: 6px;
          // padding: 15px;
          padding: 3px;
          line-height: 22px;
          img {
            display: inline-block;
            width: 14px;
            height: 14px;
            margin-right: 3px;
            vertical-align: middle;
          }
        }
      }
      .good-intro-box {
        max-height: 534px;
        max-height: 509px\0;
        margin-top: 16px;
        overflow: hidden;
        .good-intro {
          min-height: 22px;
          padding: 0 16px;
          line-height: 22px;
          text-align: justify;
          margin-bottom: 13px;
          max-height: 108px;
          overflow: hidden;
          .tlt {
            color: @color333;
          }
          .txt {
            word-wrap: break-word;
            color: @color666;
          }
        }
      }
      .operate-btn {
        position: absolute;
        bottom: 20px;
        width: 100%;
        .btn {
          width: 156px;
          .border-radius-btn(38px,0,@green-color,3px,16px);
          cursor: pointer;
          display: block;
          margin: 14px auto 0;
          img {
            display: inline-block;
            width: 15px;
            height: 18px;
            margin-right: 3px;
            vertical-align: middle;
          }
          label {
            cursor: pointer;
          }
        }
      }
    }
    .waiting-video {
      width: 100%;
      .align-center(absolute);
      .hint {
        color: @green-color;
        margin: 40px 0 76px;
      }
      .hungup-btn {
        width: 33px;
        height: 33px;
        cursor: pointer;
      }
    }
    .in-the-video {
      height: 100%;
      padding: 10px 10px 0;
      .video-box {
        width: 100%;
        height: 40.4%;
        background: @color000;
        position: relative;
         /deep/ div {
           width: 100%;
          height: 100%;
        }
      }
      /deep/ .video-box > div {
        position: absolute;
      }
      .doctor-name {
        display: block;
        margin: 5px 0 10px;
      }
      .count-down {
        display: block;
        margin-top: 6px;
      }
      .hungup-btn {
        width: 33px;
        height: 33px;
        display: inline-block;
        margin-top: 8px;
        cursor: pointer;
      }
    }
    .has-video {
      width: 100%;
      .align-center(absolute);
      .txt {
        color: @green-color;
        margin: 40px 0 70px;
      }
      .btn-box {
        padding: 0 26px;
        text-align: center;
        div {
          cursor: pointer;
          label {
            display: block;
            color: @color999;
            cursor: pointer;
          }
        }
      }
    }
  }
}
// .box-vertical {
//   display: -webkit-box;
// }
.big-img {
    max-width: 85%;
    max-height: 85%;
    overflow: scroll;
  .align-center(fixed);
  img {
    width: 100%;
    height: 100%;
  }
}
// .recipe-box{
//   width: 80%;
//   .align-center(fixed);
//   .head {
//     position: relative;
//     height: 50px;
//     line-height: 50px;
//     color: @white-color;
//     text-align: center;
//     background: @green-color;
//     .txt {
//       font-size: 18px;
//     }
//     .stamp {
//       position: absolute;
//       top: 8px;
//       right: 10px;
//       font-size: 14px;
//       .background-radius-btn(34px, 18px, @green-color, 3px ,14px);
//       border: solid 1px @white-color;
//       cursor: pointer;
//     }
//   }
//   .recipe-img {
//     width: 100%;
//     max-height: 750px;
//   }
// }
// .recipe-box {
//   /deep/.el-dialog--center {
//     .align-center(absolute);
//     margin-top: 0 !important;
//     width: 60%;
//     height: 86%;
//   }
//   /deep/.el-dialog__body {
//     height: 100%;
//   }
// }
</style>
