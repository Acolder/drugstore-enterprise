<template>
  <div class="register_warp">
    <h1 class="title-wrap">商户注册</h1>
    <div class="register">
      <el-form :model="user" :rules="rules2" ref="ruleForm2" label-position="left" label-width="85px" class="register-container">
        <!-- <el-form-item label="药店名称:">
          <el-input type="text" placeholder="请输入药店名称" maxlength="10" v-model.trim="user.realName"></el-input>
        </el-form-item> -->
        <el-form-item prop="phone">
          <el-input type="text" placeholder="手机号" v-model.trim="user.phone">
            <template slot="prepend">
              <i class="iconfont icon-shouji"></i>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item  prop="phoneCode">
          <el-input class="text-code" type="text" placeholder="手机验证码" v-model.trim="user.phoneCode">
            <template slot="prepend">
              <i class="iconfont icon-yanzhengma"></i>
            </template>
          </el-input>
          <button type="button" @click.prevent="getCodeImg" :class="phoneTrue ? 'getCode' : 'getCodenone'">{{sendcode_msg}}</button>
        </el-form-item>
        <el-form-item prop="userName">
          <el-input type="text" placeholder="用户名，5-20位字母或者数字" v-model.trim="user.userName">
            <template slot="prepend">
              <i class="iconfont icon-touxiang"></i>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" placeholder="密码，6-20个字母或数字密码" v-model.trim="user.password">
            <template slot="prepend">
              <i class="iconfont icon-mima"></i>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="passwordToo">
          <el-input type="password" placeholder="确认密码" v-model.trim="user.passwordToo">
            <template slot="prepend">
              <i class="iconfont icon-mima"></i>
            </template>
          </el-input>
        </el-form-item>
        <!-- <el-form-item prop="email">
          <el-input type="text" placeholder="邮箱" v-model.trim="user.email">
            <template slot="prepend">
              <i class="iconfont icon-youxiang"></i>
            </template>
          </el-input>
        </el-form-item> -->
        <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit" :loading="logining">立即注册</el-button>
        <div class="GoLogin_wrap">
          <span>已有账号?</span>
          <span class="GoLogin" @click="GoLogin">去登录</span>
        </div>
      </el-form>
    </div>
    <el-dialog title="图片验证码" :visible.sync="imgCodevisible" width="500px" center @close="codeImgClose">
      <el-form :model="codeForm" ref="codeFormRule" :rules="rules">
        <el-form-item label="" prop="code" class="code_img">
          <el-input v-model.trim="codeForm.code" maxlength="70" placeholder="请输入图片验证码"></el-input>
          <img :src="imgCodeUrl" alt="" @click="getCodeRefresh">
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button @click="dialogFormVisible = false">取 消</el-button> -->
        <el-button type="primary" @click.native.prevent="getCode">确 定</el-button>
      </div>
    </el-dialog>
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
        realName: '',
        userName: '',
        password: '',
        passwordToo: '',
        phone: '',
        phoneCode: '',
        email: ''
      },
      phoneTrue: false,
      rules2: {
        realName: [
          { required: true, message: '请输入商户名称', trigger: 'blur' },
        ],
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
          { required: true, validator: this.validPhone, trigger: 'change' },
        ],
        phoneCode: [
          { required: true, message: '验证码不能为空', trigger: 'blur' },
        ],
        email: [
          { required: true, validator: this.validEmail, trigger: 'blur' },
        ],
      },
      sendcode_msg: '获取验证码',
      imgCodevisible: false,
      codeForm: {
        code: ''
      },
      imgCodeUrl: '',
      rules: { code: [{ required: true, message: '请输入图片验证码', trigger: 'blur' }] },
    };
  },
  methods: {
    // 账号验证
    isvalidAccount(str) {
      const reg = /^([a-zA-Z0-9]){5,20}$/;
      return reg.test(str);
    },
    validAccount(rule, value, callback) {
      if (!value) {
        callback(new Error('用户名不能为空'));
      } else if (!this.isvalidAccount(value)) {
        callback(new Error('用户名应该由5-20位字母或者数字组成'));
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
        callback(new Error('手机号不能为空'));
        this.phoneTrue = false;
      } else if (!this.isvalidPhone(value)) {
        callback(new Error('手机号格式不正确'));
        this.phoneTrue = false;
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
        callback(new Error('密码不能为空'));
      } else if (!this.isvalidPassword(value)) {
        callback(new Error('密码应该由6-20个字母或数字密码组成'));
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
        callback(new Error('确认密码不能为空'));
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
        callback(new Error('邮箱不能为空'));
      } else if (!this.isvalidEmail(value)) {
        callback(new Error('邮箱格式不正确'));
      } else {
        callback();
      }
    },
    // 关闭弹窗
    codeImgClose() {
      this.$refs['codeFormRule'].resetFields();
    },
    getCodeRefresh() {
      let random = this.getRandom(8);
      this.imgCodeUrl = `${process.env.MALL_BASE_HOST}/mall_manage_seller/back/login/authCode?v=${random}`;
    },
    getRandom(n) {
      let chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
      let res = '';
      for (let i = 0; i < n; i++) {
        let id = Math.ceil(Math.random() * 35);
        res += chars[id];
      }
      return res;
    },
    // 获取图片验证码
    getCodeImg() {
      if ((this.sendcode_msg === '重新发送' || this.sendcode_msg === '获取验证码') && this.user.phone && this.phoneTrue) {
        this.imgCodevisible = true;
        let random = this.getRandom(8);
        this.imgCodeUrl = `${process.env.MALL_BASE_HOST}/mall_manage_seller/back/login/authCode?v=${random}`;
      }
    },
    // 获取验证码
    getCode() {
      let _self = this;
      this.$refs['codeFormRule'].validate((valid) => {
        if (valid) {
          this.imgCodevisible = false;
          let param = {
            phone: _self.user.phone,
            isTrue: 1,
            code: _self.codeForm.code
          };
          javaRequest.post('/mall_manage_seller/back/login/phoneTrue', param).then(res => {
            if (res.status === 200 && res.data.resultCode === '0') {
              console.log(res.data);
              if (res.data.resultData === 'false') {
                _self.$message.success('发送成功');
                let duration = 60;
                let timer = setInterval(() => {
                  duration--;
                  _self.sendcode_msg = duration + 's';
                  if (duration === 0) {
                    _self.sendcode_msg = '重新发送';
                    clearInterval(timer);
                  }
                }, 1000);
              } else {
                _self.$message.warning('该手机号已经被注册过了！');
              }
            }
          });
        } else { return false } });
    },
    // 去登录
    GoLogin() {
      this.$emit('GoLogin');
    },
    handleSubmit() {
      let _self = this;
      _self.$refs.ruleForm2.validate((valid) => {
        if (valid) {
          register(_self.user).then((res) => {
            if (res.status === 200 && res.data.resultCode === '0') {
              let msg = res.data.msg;
              _self.$message.success(msg);
              _self.$emit('GoLogin');
            }
          });
        }
        else {
          return false;
        }
      });
    },
  }
};
</script>

<style lang="less" scoped>
@import url("../../layout/iconfont/iconfont.css");
@import url("../../../styles/common.less");
.register_warp{
  // /deep/.el-dialog__header{
  //   background: #0ccdd3;
  //   padding: 10px;
  //   .el-dialog__title{
  //     color: #fff;
  //   }
  //   .el-dialog__close{
  //     color: #fff;
  //   }
  // }
  /deep/.el-dialog__body{
    padding-bottom: 0;
  }
  /deep/.el-dialog__footer{
    .el-button{
      background-color: @green-color;
      border-color: @green-color;
    }
  }
  .code_img{
    /deep/.el-form-item__content{
      display: flex;
      align-items: center;
    }
    /deep/.el-input{
      width: 260px;
    }
    img{
      width: 160px;
      height: 40px;
      display: inline-block;
    }
  }
}
.title-wrap{
  font-size: 18px;
  color: green-color;
  font-weight: normal;
  text-align: center;
  margin-bottom: 25px;
}
.register{
  width: 380px;
  padding-bottom: 35px;
  margin: 5px auto 0;
  .register-container{
    // padding: 20px 50px;
    .text-code{
      width: 270px;
    }
    .getCodenone{
      width: 95px;
      border: 1px solid #cecccc;
      border-radius: 10px;
      height: 40px;
      line-height: 40px;
      margin-left: 10px;
      // cursor: pointer;
      background: #cecccc;
      color: #fff;
    }
    .getCode{
      width: 95px;
      border: 1px solid @green-color;
      border-radius: 10px;
      height: 40px;
      line-height: 40px;
      margin-left: 10px;
      cursor: pointer;
      background: @green-color;
      color: #fff;
    }
    .GoLogin_wrap{
      text-align: right;
      margin-top: 10px;
      .GoLogin{
        color: @green-color;
        cursor: pointer;
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
  /deep/.el-form-item__content{
    margin-left: 0 !important;
  }
  /deep/.el-input__inner{
    // background: url('../img/login_user.png') no-repeat;
    background: transparent;
    border: 1px solid #BABCCC;
    border-left: none;
    padding-left: 0;
    &:focus{
      border-color: #BABCCC;
    }
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
