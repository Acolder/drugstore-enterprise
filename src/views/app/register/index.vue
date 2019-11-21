<template>
  <div class="register-wrap">
    <div class="register">
    <!-- <h1 class="title-wrap">药葫芦商户注册</h1> -->
      <el-form :model="user" :rules="rules2" ref="ruleForm2" label-position="left" label-width="85px" class="register-container">
        <el-form-item label="账号:" prop="userName">
          <el-input type="text" placeholder="请输入数字字母组合的账号" v-model="user.userName"></el-input>
        </el-form-item>
        <el-form-item label="密码:" prop="password">
          <el-input type="password" placeholder="请输入6~20个字符密码" v-model="user.password"></el-input>
        </el-form-item>
        <el-form-item label="密码确认:" prop="passwordToo">
          <el-input type="password" placeholder="请再次输入密码" v-model="user.passwordToo"></el-input>
        </el-form-item>
        <el-form-item label="手机号:" prop="phone">
          <el-input type="text" placeholder="请输入手机号" v-model="user.phone"></el-input>
        </el-form-item>
        <el-form-item label="验证码:" prop="phoneCode" class="text-code">
          <el-input type="text" placeholder="请输入验证码" v-model="user.phoneCode"></el-input>
          <el-button class="getCode" @click="getCode">{{sendcode_msg}}</el-button>
        </el-form-item>
        <el-form-item label="邮箱:" prop="email">
          <el-input type="text" placeholder="请输入邮箱" v-model="user.email"></el-input>
        </el-form-item>
        <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit" :loading="logining">立即注册</el-button>
        <!-- <p class="GoLogin" @click="GoLogin">已有账号?去登录</p> -->
      </el-form>
    </div>
  </div>
</template>

<script>
import { register } from '@/api/user';
import javaRequest from '@/utils/javaApiRequest';
export default {
  data() {
    return {
      logining: false,
      user: {
        userName: '',
        password: '',
        passwordToo: '',
        phone: '',
        phoneCode: '',
        email: ''
      },
      rules2: {
        userName: [
          { required: true, validator: this.validAccount, trigger: 'blur' },
        ],
        password: [
          { required: true, validator: this.validPassword, trigger: 'blur' },
        ],
        passwordToo: [
          { required: true, validator: this.validPasswordToo, trigger: 'blur' },
        ],
        phone: [
          { required: true, validator: this.validPhone, trigger: 'blur' },
        ],
        phoneCode: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
        ],
        email: [
          { required: true, validator: this.validEmail, trigger: 'blur' },
        ],
      },
      sendcode_msg: '获取验证码',
      phoneTrue: false
    };
  },
  methods: {
    // 账号验证
    isvalidAccount(str) {
      const reg = /^[a-zA-Z0-9]/;
      return reg.test(str);
    },
    validAccount(rule, value, callback) {
      if (!value) {
        callback(new Error('请输入账号'));
      } else if (!this.isvalidAccount(value)) {
        callback(new Error('请输入字母、数字或者字母数字组合的账号'));
      } else {
        callback();
      }
    },
    // 手机号验证
    isvalidPhone(str) {
      const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
      return reg.test(str);
    },
    validPhone(rule, value, callback) {
      if (!value) {
        callback(new Error('请输入电话号码'));
      } else if (!this.isvalidPhone(value)) {
        callback(new Error('请输入正确的11位手机号码'));
      } else {
        callback();
        this.phoneTrue = true;
      }
    },
    // 密码验证
    isvalidPassword(str) {
      const reg = /^([a-zA-Z0-9\.\@\!\#\$\%\^\&\*\(\)]){6,20}$/i;
      return reg.test(str);
    },
    validPassword(rule, value, callback) {
      if (!value) {
        callback(new Error('请输入密码'));
      } else if (!this.isvalidPassword(value)) {
        callback(new Error('请输入6~20位长度的密码'));
      } else {
        callback();
      }
    },
    // 密码确认验证
    isvalidPasswordToo(str) {
      if (str === this.user.password) {
        return true;
      } else {
        return false;
      }
    },
    validPasswordToo(rule, value, callback) {
      if (!value) {
        callback(new Error('请再次输入密码'));
      } else if (!this.isvalidPasswordToo(value)) {
        callback(new Error('两次输入密码不一致'));
      } else {
        callback();
      }
    },
    // 邮箱验证
    isvalidEmail(str) {
      const reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
      return reg.test(str);
    },
    validEmail(rule, value, callback) {
      if (!value) {
        callback(new Error('请输入邮箱'));
      } else if (!this.isvalidEmail(value)) {
        callback(new Error('请输入正确的邮箱'));
      } else {
        callback();
      }
    },
    // 获取验证码
    getCode() {
      let _self = this;
      let param = {
        phone: this.user.phone
      };
      if ((_self.sendcode_msg === '重新发送' || _self.sendcode_msg === '获取验证码') && this.user.phone && this.phoneTrue) {
        javaRequest.post('/mall_manage_seller/back/login/getPhoneCode', param).then(res => {
          if (res.status === 200 && res.data.resultCode === '0') {
            let duration = 60;
            let timer = setInterval(() => {
              duration--;
              _self.sendcode_msg = duration + 's';
              if (duration === 0) {
                _self.sendcode_msg = '重新发送';
                clearInterval(timer);
              }
            }, 1000);
          }
        });
      }
    },
    handleSubmit() {
      let _self = this;
      _self.$refs.ruleForm2.validate((valid) => {
        if (valid) {
          register(_self.user).then((res) => {
            if (res.status === 200 && res.data.resultCode === '0') {
              let msg = res.data.msg;
              _self.$message.success(msg);
              _self.$router.push('/success');
            }
          });
        }
        else {
          return false;
        }
      });
    },
  },
  created() {
    (function(doc, win) {
      let docEl = doc.documentElement;
      let resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
      let recalc = function() {
        let clientWidth = docEl.clientWidth;
        if (!clientWidth) return;
        docEl.style.fontSize = (clientWidth >= 750 ? 100 : clientWidth / 750 * 100) + 'px';
      };

      if (!doc.addEventListener) return;
      win.addEventListener(resizeEvt, recalc, false);
      doc.addEventListener('DOMContentLoaded', recalc, false);
    })(document, window);
  }
};
</script>

<style lang="less" scoped>
.register-wrap{
  width: 100%;
  height: 100%;
  .title-wrap{
    font-size: .32rem;
    padding: .15rem 0;
    color: #555555;
    font-weight: normal;
    text-align: center;
  }
}
.register{
  width: 100%;
  height: 100%;
  padding-bottom: 35px;
  .register-container{
    padding: .20rem .5rem;
    .text-code{
      /deep/ .el-input{
        // width: 2.6rem;
        // height: .4rem;
        width: 120px;
      }
    }
    .getCode{
      // padding: .2rem .2rem;
      // border: 1px solid #ccc;
      // border-radius: .1rem;
      // line-height: .35rem;
      // margin-left: .1rem;
      // cursor: pointer;
      padding: 0 15px;
      border: 1px solid #ccc;
      border-radius: 10px;
      line-height: 40px;
      margin-left: 10px;
      cursor: pointer;
    }
    .GoLogin{
      text-align: right;
      color: #409EFF;
      margin-top: .1rem;
      cursor: pointer;
    }
  }
  /deep/ .el-form-item__label{
    text-align: right;
  }
  /deep/ .el-input__inner{
    background: url('./img/login_user.png') no-repeat;
    border: none;
    background-size: 100% 100%;
  }
}
</style>

