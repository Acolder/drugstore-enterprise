<template>
  <div>
    <h1 class="title-wrap">找回密码</h1>
    <div class="resetPassword">
      <div class="header">
        <div class="header_item header_acv">
          <div class="num">1</div>
          <div class="step_text">身份验证</div>
          <div class="stepLine"></div>
        </div>
        <div class=" header_item" :class="stepNum >= 2 ? 'header_acv ' : ''">
          <div class="num">2</div>
          <div class="step_text">重置密码</div>
          <div class="stepLine"></div>
        </div>
        <div class="header_item_over" :class="stepNum === 3 ? 'header_acv ' : ''">
          <div class="num">3</div>
          <div class="step_text">完成</div>
        </div>
        <div class="header_two"></div>
      </div>
      <el-form :model="user" :rules="rules2" ref="ruleForm2" label-position="left" label-width="85px" class="login-container">
        <div v-if="stepNum === 1">
          <el-form-item prop="account">
            <el-input class="text" type="text" placeholder="账号" v-model.trim="user.account">
              <template slot="prepend">
                <i class="iconfont icon-touxiang"></i>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="phoneCode">
            <el-input class="text-code text" type="text" placeholder="验证码" v-model.trim="user.phoneCode">
              <template slot="prepend">
                <i class="iconfont icon-yanzhengma"></i>
              </template>
            </el-input>
            <button type="button" class="getCode" @click.prevent="getCode">{{sendcode_msg}}</button>
          </el-form-item>
          <el-button type="primary" style="width:100%;" @click.native.prevent="nextStep">下一步</el-button>
        </div>
        <div v-if="stepNum === 2">
          <el-form-item prop="onePassword">
            <el-input class="text" type="password" placeholder="密码，6-20个字母或数字密码" v-model.trim="user.onePassword">
              <template slot="prepend">
                <i class="iconfont icon-mima"></i>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="twoPassword">
            <el-input class="text" type="password" placeholder="请再次输入密码" v-model.trim="user.twoPassword">
              <template slot="prepend">
                <i class="iconfont icon-mima"></i>
              </template>
            </el-input>
          </el-form-item>
          <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit" :loading="logining">下一步</el-button>
        </div>
        <div v-if="stepNum === 3">
          <el-form-item>
            <p class="success_icon">
              <i class="el-icon-success"></i>
            </p>
          </el-form-item>
          <el-button type="primary" style="width:100%;" @click.native.prevent="success">完成</el-button>
        </div>
        <!-- <p class="GoLogin" @click="GoLogin">去登录</p> -->
        <div class="goLogin_wrap">
          <span class="previous" v-if="stepNum === 2" @click="backPreviousStep">
            <i class="el-icon-arrow-left">返回上一步</i>
          </span>
          <span class="GoLogin" @click="GoLogin">去登录</span>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { resetPassword } from '@/api/user';
import javaRequest from '@/utils/javaApiRequest';
export default {
  data() {
    return {
      logining: false,
      user: {
        account: '',
        onePassword: '',
        twoPassword: '',
        phoneCode: '',
      },
      rules2: {
        account: [
          { required: true, message: '请输入账号', trigger: 'blur' },
        ],
        onePassword: [
          { required: true, validator: this.validPassword, trigger: 'blur' },
        ],
        twoPassword: [
          { required: true, validator: this.validPasswordToo, trigger: 'blur' },
        ],
        phoneCode: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
        ],
      },
      sendcode_msg: '获取验证码',
      stepNum: 1
    };
  },
  methods: {
    // 密码验证
    isvalidPassword(str) {
      const reg = /^([a-zA-Z0-9\.\@\!\#\$\%\^\&\*\(\)]){6,20}$/;
      return reg.test(str);
      // \.\@\!\#\$\%\^\&\*\(\)
    },
    validPassword(rule, value, callback) {
      if (!value) {
        callback(new Error('请输入密码'));
      } else if (!this.isvalidPassword(value)) {
        callback(new Error('请输入6~20位长度的数字或字母密码'));
      } else {
        callback();
      }
    },
    // 密码确认验证
    isvalidPasswordToo(str) {
      if (str === this.user.onePassword) {
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
    // 获取验证码
    getCode() {
      let _self = this;
      if ((_self.sendcode_msg === '重新发送' || _self.sendcode_msg === '获取验证码') && _self.user.account) {
        let param = {
          account: _self.user.account
        };
        javaRequest.post('/mall_manage_seller/back/login/forgotPhoneCode', param).then(res => {
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
    // 去登录
    GoLogin() {
      this.$emit('GoLogin');
    },
    // 提交
    handleSubmit() {
      let _self = this;
      _self.$refs.ruleForm2.validate((valid) => {
        if (valid) {
          resetPassword(_self.user).then((res) => {
            if (res.status === 200 && res.data.resultCode === '0') {
              // let msg = res.data.msg;
              // _self.$message.success(msg);
              // _self.$emit('GoLogin');
              this.stepNum = 3;
            }
          });
        }
        else {
          return false;
        }
      });
    },
    // 返回上一步
    backPreviousStep() {
      this.stepNum = 1;
    },
    // 下一步
    nextStep() {
      if (this.user.account && this.user.phoneCode) {
        let param = {
          account: this.user.account,
          phoneCode: this.user.phoneCode,
        };
        javaRequest.post('/mall_manage_seller/back/login/phoneCodeTrue', param).then(res => {
          if (res.status === 200 && res.data.resultCode === '0') {
            this.stepNum = 2;
          }
        });
      }
    },
    // 完成
    success() {
      this.$emit('GoLogin');
    }
  }
};
</script>

<style lang="less" scoped>
@import url("../../layout/iconfont/iconfont.css");
@import url("../../../styles/common.less");
.title-wrap{
  font-size: 18px;
  color: @green-color;
  font-weight: normal;
  text-align: center;
  margin-bottom: 25px;
}
.resetPassword{
  width: 380px;
  padding-bottom: 35px;
  margin: 5px auto 0;
  .header{
    width: 100%;
    display: flex;
    .header_item{
      width: 170px;
      position: relative;
      .num{
        width: 30px;
        height: 30px;
        text-align: center;
        border: 1px solid #BABCCC;
        border-radius: 50%;
        line-height: 30px;
        margin-left: 13px;
        margin-bottom: 10px;
        background: #fff;
      }
      .stepLine{
        position: absolute;
        height: 2px;
        width: 133px;
        top: 14px;
        left: 44px;
        background: #DCDFE6;
      }
    }
    .header_item_over{
      width: 43px;
      .num{
        width: 30px;
        height: 30px;
        text-align: center;
        border: 1px solid #BABCCC;
        border-radius: 50%;
        line-height: 30px;
        margin-left: 13px;
        margin-bottom: 10px;
        background: #fff;
      }
      .step_text{
        text-align: right;
        margin-right: 3px;
      }
    }
    .header_acv{
      color: @green-color;
      .num{
        border-color: @green-color;
      }
    }
  }
  .login-container{
    padding-top: 20px;
    .text{
      height: 35px;
      &::-moz-placeholder{
        font-size: 16px;
        color: #cecece;
      }
      &::-webkit-placeholder{
        font-size: 16px;
        color: #cecece;
      }
    }
    .text-code{
      width: 270px;
    }
    .getCode{
      width: 92px;
      border: 1px solid @green-color;
      border-radius: 10px;
      background: @green-color;
      color: #fff;
      height: 40px;
      line-height: 40px;
      margin-left: 10px;
      cursor: pointer;
    }
    .success_icon{
      text-align: center;
      i{
        font-size: 80px;
        color: @green-color;
      }
    }
    .goLogin_wrap{
      margin-top: 10px;
      color: @green-color;
      .GoLogin{
        text-align: right;
        cursor: pointer;
        float: right;
      }
      .previous{
        cursor: pointer;
        float: left;
      }
    }
  }
  /deep/.is-success{
    .el-form-item__content{
      .el-input__inner{
        border-color: #babccc !important;
      }
    }
  }
  /deep/ .el-input__inner{
    background: transparent;
    border: 1px solid #BABCCC;
    border-left: none;
    padding-left: 0;
    &:focus{
      border-color: #BABCCC;
    }
  }
  /deep/.el-form-item__content{
    margin-left: 0 !important;
  }
  /deep/.el-input-group__prepend{
    background: transparent;
    border-right: none;
    border-color: #BABCCC;
  }
  /deep/.el-button{
    background: @green-color;
    border-color: @green-color;
  }
}
</style>
