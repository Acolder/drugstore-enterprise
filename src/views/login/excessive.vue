<template>
  <div class="excessive">
    <div class="content">
      <div class="header">
        <p class="title" v-if="$route.query.rest">您的密码不符合安全规范，修改密码后才能进行下一步操作</p>
        <p class="title" v-else>修改密码</p>
        <!-- <span class="subTitle">（）</span> -->
      </div>
      <div class="pass">
        <el-form :model="pass" ref="ruleForm2" label-position="left" label-width="100px" class="login-container">
          <div class="password">
            <div class="laber">新密码</div>
            <el-input class="text" type="password" placeholder="请输入6~20位数字字母的密码" v-model="pass.password" @blur="passwordBlur"></el-input>
            <p class="error" v-if="passwordShow">密码格式不正确</p>
            <div class="strong">
              <span :class="colorNu>2 ? 'green' : ''">强</span>
              <span :class="colorNu>1 ? 'yellow' : ''">中</span>
              <span :class="colorNu>0 ? 'red' : ''">弱</span>
            </div>
          </div>
          <div class="password">
            <div class="laber">确认新密码</div>
            <el-input class="text" type="password" placeholder="请确认密码" v-model="pass.password1" @blur="password1Blur"></el-input>
            <p class="error" v-if="password1Show">两次密码不一致</p>
          </div>
          <el-button type="success" style="width:100%;margin-top:20px" @click="handleSubmit" :loading="logining">确认修改</el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import javaAjax from '@/utils/javaApiRequest';
import { getRole, getAccount } from '@/utils/auth';
export default {
  data() {
    return {
      pass: {
        password: '',
        password1: '',
      },
      logining: false,
      colorNu: 1,
      passwordShow: false,
      password1Show: false
    };
  },
  watch: {
    'pass.password': function() {
      // let reg1 = /^[0-9]{6,20}$/;
      let reg1 = /^(?:\d+|[a-zA-Z]+|[!@#$%^&*]+)$/;
      let reg2 = /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+$/;
      let reg3 = /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)(?![a-zA-z\d]+$)(?![a-zA-z!@#$%^&*]+$)(?![\d!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+$/;
      if (reg1.test(this.pass.password)) {
        this.colorNu = 1;
        console.log(this.colorNu);
      }
      if (reg2.test(this.pass.password)) {
        this.colorNu = 2;
      }
      if (reg3.test(this.pass.password)) {
        this.colorNu = 3;
      }
      if (this.pass.password === '') {
        this.colorNu = 1;
      }
    }
  },
  methods: {
    handleSubmit() {
      // if (!this.passwordShow) {
      //   this.$message.warning('您输入的密码格式不正确');
      //   return;
      // }
      this.passwordBlur();
      this.password1Blur();
      // if (!this.password1Show) {
      //   this.$message.warning('您两次输入的密码不一致');
      //   return;
      // }
      if (!this.password1Show && !this.passwordShow) {
        if (this.colorNu < 2) {
          this.$message.warning('您输入的密码强度过低');
          return;
        }
        // 11
        let param = {
          account: getAccount(),
          password: this.pass.password,
          role: getRole()
        };
        javaAjax.post('/mall_manage_seller/back/updateEmpPassword', param).then(res => {
          console.log(res);
          if (res.status === 200 && res.data.resultCode === '0') {
            this.$message.success('修改成功，请重新登录');
            this.$router.replace('/login');
          }
        });
      }
    },
    passwordBlur() {
      // let reg1 = /^.{6,20}$/;
      let reg1 = /^.{6,20}$/;
      if (reg1.test(this.pass.password)) {
        this.passwordShow = false;
      } else {
        this.passwordShow = true;
      }
    },
    password1Blur() {
      if (this.pass.password === this.pass.password1) {
        this.password1Show = false;
      } else {
        this.password1Show = true;
      }
    }
  }
};
</script>

<style lang="less" scoped>
  .excessive{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    background: url('./img/bg.png') no-repeat;
    .content{
      width: 600px;
      // height: 400px;
      background: #fff;
      box-shadow: 5px 3px 3px rgba(0, 0, 0, 0.05);
      // padding: 0 55px 55px;
      border: 1px solid #dee5e7;
      border-radius: 5px;
      .header{
        height: 100px;
        background: #f6f8f8;
        padding-left: 30px;
        .title{
          font-size: 20px;
          color: #7266ba;
          line-height: 100px;
        }
        .subTitle{
          font-size: 16px;
          color: #333;
        }
      }
      .pass{
        padding: 15px 30px 30px;
        .password{
          // height: 80px;
          .text{
            height: 40px;
          }
          .laber{
            padding-bottom: 8px;
            color: #58666e
          }
          .error{
            color: #f56c6c;
            margin-top: 3px;
          }
          .strong{
            margin-top: 4px;
            overflow: hidden;
            span{
              display: block;
              width: 40px;
              height: 20px;
              // border: 1px solid #cfdadd;
              text-align: center;
              float: right;
              color: #333;
              background: #f6f8f8;
            }
            .red{
              background: red;
            }
            .yellow{
              background: yellow;
            }
            .green{
              background: green;
            }
          }
        }
      }
    }
  }
</style>
