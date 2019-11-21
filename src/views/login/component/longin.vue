<template>
  <div>
    <h1 class="title-wrap">
      <div class="user_login login_text" :class="login_type === 1 ? 'login_act' : ''" @click="swith(1)">账户密码登录</div>
      <div class="phone_login login_text" :class="login_type === 2 ? 'login_act' : ''" @click="swith(2)">手机号登录</div>
    </h1>
    <div class="login">
      <el-form :model="user" ref="ruleForm2" label-position="left" label-width="100px" class="login-container">
        <div class="login_user" v-if="login_type === 1">
          <div class="userName input_wrap">
            <i class="iconfont icon-touxiang"></i>
            <input class="text" type="text" placeholder="请输入用户名" v-model="user.account" @keydown="keySubmit($event)">
          </div>
          <div class="password input_wrap">
            <i class="iconfont icon-mima"></i>
            <input class="text" type="password" placeholder="请输入密码" v-model="user.checkPass" @keydown="keySubmit($event)">
          </div>
          <div class="code input_wrap">
            <i class="iconfont icon-yanzhengma"></i>
            <input class="code_text" type="text" placeholder="请输入图形验证码" v-model="imgcode" @keydown="keySubmit($event)">
            <img :src="imgUrL" alt="" class="img-imgCode" ref="img" @click.stop="refresh">
          </div>
          <p class="ForgetPassword" @click="ForgetPassword">忘记密码?</p>
        </div>
        <div class="login_phone" v-else>
          <div class="userName input_wrap">
            <i class="iconfont icon-touxiang"></i>
            <input class="text" type="text" placeholder="请输入手机号" v-model="user.phone">
          </div>
          <div class="code input_wrap">
            <i class="iconfont icon-yanzhengma"></i>
            <input class="code_text" type="text" placeholder="请输入验证码" v-model="user.code">
            <div class="getCodeBtn" @click.stop="getCode">{{sendcode_msg}}</div>
          </div>
        </div>
        <el-button type="primary" style="width:100%;" @click.native.prevent="submit">登录</el-button>
        <div class="ImmediateRegister" @click="ReginsterAccount">
          <span>还没账号？</span>
          <span class="immediately">注册账号</span>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { login, getNetInfo } from '@/api/user';
import { setToken, setAccount, setTransport, setRole, setType, setGive, setnetToken, setLoginID, setSupplement, setRongcloudtoken, setUserID } from '@/utils/auth';
import javaRequest from '@/utils/javaApiRequest';
export default {
  data() {
    return {
      imgUrL: '',
      imgcode: '', // 图形验证码
      // codeShow: false,
      login_type: 1, // 1 账户密码登录 2 手机号登录
      user: {
        account: '', // 账户
        checkPass: '', // 密码
        phone: '', // 手机验证码
        code: '' // 手机验证码
      },
      sendcode_msg: '获取验证码',
    };
  },
  methods: {
    refresh() {
      let random = this.getRandom(8);
      this.$refs.img.src = `${process.env.MALL_BASE_HOST}/mall_manage_seller/back/login/authCode?v=${random}`;
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
    submit() {
      let _self = this;
      if (this.login_type === 1) {
        login(_self.user.account, _self.user.checkPass, _self.imgcode).then((res) => {
          console.log(res);
          if (res.status === 200) {
            if (res.data.resultCode === '0') {
              let userToken = res.data.resultData.usertoken; // userToken
              // let userPower = JSON.stringify(res.data.resultData.menuList); // 用户权限
              let accountPower = res.data.resultData.role === '店主' ? res.data.resultData.account.userName : res.data.resultData.account.employeeName; // 保存用户账号
              let orderTransport = res.data.resultData.orderTransport; // 保存默认配送方式
              let role = res.data.resultData.role; // 用户身份
              let type = res.data.resultData.businessType; // 药店类型
              let give = res.data.resultData.isGive; // 康美人生
              let ID = res.data.resultData.account.userId; // 店主登录ID
              let loginId = res.data.resultData.supplementUserId; // 。net登录id
              let supplement = res.data.resultData.isSupplement; // 是否已开通补方  1开通 其他.未开通
              setAccount(accountPower);
              // setUserPower(userPower);
              setTransport(orderTransport);
              setRole(role);
              setType(type);
              setGive(give);
              setUserID(ID);
              setLoginID(loginId);
              setSupplement(supplement);
              // setPass(_self.user.checkPass);
              // if (loginId) {
              //   let data = {
              //     login_id: loginId
              //   };
              //   getNetInfo(data).then(result => {
              //     console.log(result);
              //     if (result) {
              //       setnetToken(result.user_token);
              //       setRongcloudtoken(result.rongcloud_token);
              //     } else {
              //       return;
              //     }
              //   });
              // }
              if (userToken) {
                setToken(userToken);
                if (loginId) {
                  let data = {
                    login_id: loginId
                  };
                  getNetInfo(data).then(result => {
                    console.log(result);
                    if (result) {
                      setnetToken(result.user_token);
                      setRongcloudtoken(result.rongcloud_token);
                      let reg = /^(?:\d+|[a-zA-Z]+|[!@#$%^&*]+)$/;
                      if (!reg.test(_self.user.checkPass)) {
                        this.getSellerList().then((resseller) => { // 防止登陆后跳回登录页
                          let msg = res.data.msg;
                          this.$message.success(msg);
                          if (role === '店员') {
                            _self.$router.replace('/order-control/monitorOrder?rest=1');
                          } else {
                            if (resseller.data.resultData.total > 0) {
                              _self.$router.replace('/order-control/monitorOrder?rest=1');
                            } else {
                              _self.$router.replace('/sellerAdd');
                            }
                          }
                        });
                      } else {
                        _self.$router.replace('/excessive?rest=1');
                      }
                    } else {
                      return;
                    }
                  });
                } else {
                  let reg = /^(?:\d+|[a-zA-Z]+|[!@#$%^&*]+)$/;
                  if (!reg.test(_self.user.checkPass)) {
                    this.getSellerList().then((resseller) => { // 防止登陆后跳回登录页
                      let msg = res.data.msg;
                      this.$message.success(msg);
                      if (role === '店员') {
                        _self.$router.replace('/order-control/monitorOrder?rest=1');
                      } else {
                        if (resseller.data.resultData.total > 0) {
                          _self.$router.replace('/order-control/monitorOrder?rest=1');
                        } else {
                          _self.$router.replace('/sellerAdd');
                        }
                      }
                    });
                  } else {
                    _self.$router.replace('/excessive?rest=1');
                  }
                }
                // window.location.reload();
              }
            } else {
              this.refresh();
            }
          }
        });
      } else {
        let param = {
          phone: this.user.phone,
          phoneCode: this.user.code
        };
        javaRequest.post('/mall_manage_seller/back/login/phoneLogin', param).then(res => {
          if (res.status === 200 && res.data.resultCode === '0') {
            let userToken = res.data.resultData.usertoken; // userToken
            // let userPower = JSON.stringify(res.data.resultData.menuList); // 用户权限
            let accountPower = res.data.resultData.role === '店主' ? res.data.resultData.account.userName : res.data.resultData.account.employeeName; // 保存用户账号
            let orderTransport = res.data.resultData.orderTransport; // 保存默认配送方式 // 美团 自行 普通物流
            let role = res.data.resultData.role; // 用户身份 店员or店主
            let type = res.data.resultData.businessType; // 药店类型 1,商城2.药店3.药柜
            let give = res.data.resultData.isGive; // 康美人生 1.是 其他.否
            let ID = res.data.resultData.account.userId; // 店主登录ID
            let loginId = res.data.resultData.supplementUserId; // .net登录id
            let supplement = res.data.resultData.isSupplement; // 是否已开通补方  1.开通 其他.未开通
            setAccount(accountPower);
            // setUserPower(userPower);
            setTransport(orderTransport);
            setRole(role);
            setType(type);
            setGive(give);
            setUserID(ID);
            setLoginID(loginId);
            setSupplement(supplement);
            // if (loginId) {
            //   let data = {
            //     login_id: loginId
            //   };
            //   getNetInfo(data).then(result => {
            //     if (result) {
            //       setnetToken(result.user_token);
            //       setRongcloudtoken(result.rongcloud_token);
            //     } else {
            //       return;
            //     }
            //   });
            // }
            if (userToken) {
              setToken(userToken);
              let msg = res.data.msg;
              if (loginId) {
                let data = {
                  login_id: loginId
                };
                getNetInfo(data).then(result => {
                  if (result) {
                    setnetToken(result.user_token);
                    setRongcloudtoken(result.rongcloud_token);
                    this.getSellerList().then((res) => {
                      this.$message.success(msg);
                      if (role === '店员') {
                        _self.$router.replace('/order-control/monitorOrder?rest=1');
                      } else {
                        if (res.data.resultData.total > 0) { // 防止登陆后跳回登录页
                          _self.$router.replace('/order-control/monitorOrder?rest=1');
                        } else {
                          _self.$router.replace('/sellerAdd');
                        }
                      }
                    });
                  } else {
                    return;
                  }
                });
              } else {
                this.getSellerList().then((res) => {
                  this.$message.success(msg);
                  if (role === '店员') {
                    _self.$router.replace('/order-control/monitorOrder?rest=1');
                  } else {
                    if (res.data.resultData.total > 0) { // 防止登陆后跳回登录页
                      _self.$router.replace('/order-control/monitorOrder?rest=1');
                    } else {
                      _self.$router.replace('/sellerAdd');
                    }
                  }
                });
              }
              // window.location.reload();
            }
          } else {
            this.refresh();
          }
        });
      }
    },
    getSellerList() {
      let screenInfo = {
        pageSize: 10,
        pageIndex: 1,
        sellerName: ''
      };
      return javaRequest.post('/mall_manage_seller/authority/queryPharmacies', screenInfo);
      // .then((res) => {
      //   // console.log(res);
      //   if (res.status === 200 && res.data.resultCode === '0') {
      //     this.isSeller = true;
      //   }
      // });
    },
    keySubmit(e) {
      if (e.keyCode === 13) {
        this.submit();
      }
    },
    // 忘记密码
    ForgetPassword() {
      this.$emit('ForgetPassword');
    },
    // 注册账户
    ReginsterAccount() {
      this.$emit('ReginsterAccount');
    },
    // 切换登录方式
    swith(nu) {
      this.login_type = nu;
    },
    // 获取验证码
    getCode() {
      let _self = this;
      if ((_self.sendcode_msg === '重新发送' || _self.sendcode_msg === '获取验证码') && this.user.phone) {
        let param = {
          phone: _self.user.phone,
          isTrue: 2
        };
        javaRequest.post('/mall_manage_seller/back/login/phoneTrue', param).then(res => {
          if (res.status === 200 && res.data.resultCode === '0') {
            if (res.data.resultData === 'true') {
              this.$message.success('发送成功');
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
              this.$message.warning('该手机号还未注册！');
            }
          }
        });
      }
    },
  },
  created() {
    this.imgUrL = `${process.env.MALL_BASE_HOST}/mall_manage_seller/back/login/authCode`;
  }
};
</script>

<style lang="less" scoped>
@import url("../../layout/iconfont/iconfont.css");
@import url("../../../styles/common.less");
.title-wrap{
  font-size: 18px;
  // color: #0ccdd3;
  font-weight: normal;
  // text-align: center;
  // margin-bottom: 25px;
  display: flex;
  width: 380px;
  margin: 0 auto 30px;
  justify-content: space-around;
  .login_text {
    height: 50px;
    line-height: 50px;
    padding: 0 8px;
    cursor: pointer;
  }
  .login_act{
    color: @green-color;
    border-bottom: 2px solid @green-color;
  }
}
.login{
  width: 380px;
  padding-bottom: 35px;
  margin: 5px auto 0;
  .login-container{
    // padding: 20px 50px 20px 40px;
    .login_phone{
      padding-bottom: 30px;
    }
    .input_wrap{
      position: relative;
      width: 100%;
      .iconfont{
        position: absolute;
        top: 6px;
        left: 0;
      }
    }
    .text{
      width: 100%;
      height: 35px;
      border: none;
      border-bottom: 1px solid #DCDFE6;
      background: transparent;
      padding-left: 28px;
      // padding: 10px 0 8px 10px;
      &::-moz-placeholder{
        font-size: 16px;
        color: #cecece;
      }
      &::-webkit-placeholder{
        font-size: 16px;
        color: #cecece;
      }
    }
    .code_text{
      width: 300px;
      height: 35px;
      padding-left: 28px;
      border: none;
      border-bottom: 1px solid #DCDFE6;
      background: transparent;
    }
    .img-imgCode{
      width: 80px;
      height: 35px;
      float: right;
      cursor: pointer;
    }
    .getCodeBtn{
      width: 80px;
      height: 35px;
      float: right;
      cursor: pointer;
      background: #0ccdd3;
      color: #fff;
      border-radius: 6px;
      // border-bottom: 1px solid #DCDFE6;
      // color: #fff;
      text-align: center;
      line-height: 35px;
    }
    .userName{
      margin-bottom: 28px;
    }
    .password{
      margin-bottom: 28px;
    }
    .ForgetPassword {
      text-align: right;
      color: @green-color;
      margin-bottom: 15px;
      margin-top: 15px;
      cursor: pointer;
    }
    .ImmediateRegister{
      margin-top: 15px;
      text-align: right;
      .immediately{
        color: @green-color;
        cursor: pointer;
      }
    }
    /deep/.el-button--primary{
      background: @green-color;
      border-color: @green-color;
    }
  }
}
</style>
