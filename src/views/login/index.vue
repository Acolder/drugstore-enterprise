<template>
  <div class="login-wrap">
    <div class="content">
      <div class="content_header">
        <div class="header">
          <img src="../layout/img/pic_icon@2x.png" alt="">
          <span class="title">药葫芦&nbsp;|&nbsp;商户中心</span>
          <!-- <span class="row_line">|</span>
          <span class="subtitle">商户中心</span> -->
        </div>
      </div>
      <login v-if="show === '1'" @ForgetPassword="GoForgetPassword" @ReginsterAccount="GoReginsterAccount"></login>
      <register v-if="show === '2'" @GoLogin="GoLogin"></register>
      <resetPassword v-if="show === '3'" @GoLogin="GoLogin"></resetPassword>
    </div>
    <div class="foot">
      <p>互联网药品信息服务资格证书编号（粤ICP备15012374）-经营性-2018-0180</p>
      <p>Copyright ©2018 康美药业股份有限公司. All rights reserved. 粤ICP证 10204402号-6</p>
    </div>
  </div>
</template>

<script>
import login from './component/longin';
import register from './component/register';
import resetPassword from './component/resetPassword';
export default {
  data() {
    return {
      show: '1'
    };
  },
  components: {
    'login': login,
    'register': register,
    'resetPassword': resetPassword
  },
  methods: {
    // 忘记密码
    GoForgetPassword() {
      this.show = '3';
    },
    // 注册账号
    GoReginsterAccount() {
      this.show = '2';
    },
    // 登录
    GoLogin() {
      this.show = '1';
    }
  }
};
</script>

<style lang="less" scoped>
.login-wrap{
  background: url('./img/bg.png') no-repeat;
  overflow: hidden;
  min-height: 100%;
  .content{
    margin-top: 100px;
    min-height: 700px;
    .content_header{
      margin-bottom: 50px;
      .header{
        width: 300px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        img{
          width: 50px;
          height: 50px;
        }
        .title{
          margin-left: 15px;
          font-size: 24px;
          color: #0ccdd3;
          font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
        }
      }
    }
  }
}
.foot{
  padding: 30px 0;
  text-align: center;
  height: 150px;
  p{
    margin-top: 20px;
  }
}
</style>
