<template>
  <header class="header_layout">
    <div class="header_left">
      <img src="../../views/layout/img/pic_icon@2x.png" alt="">
      <span class="title">药葫芦</span>
      <span class="row_line">|</span>
      <span class="subtitle">商户中心</span>
    </div>
    <div class="header_right">
      <el-dropdown>
        <span class="el-dropdown-link">
          <i class="iconfont icon-touxiang"></i>
          <span class="user-name">{{role === '店主' ? account : name}}</span>
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="c" divided @click.native="editPassword">修改密码</el-dropdown-item>
          <el-dropdown-item command="e" divided @click.native="logout()">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </header>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { getAccount, getRole } from '@/utils/auth';
export default {
  data() {
    return {
      account: getAccount(),
      role: getRole(),
    };
  },
  computed: {
    ...mapGetters([
      'name',
    ]),
  },
  methods: {
    ...mapActions([
      'userLogOut',
    ]),
    // 退出登录
    logout() {
      let _self = this;
      sessionStorage.removeItem('orderTransport');
      sessionStorage.removeItem('openIndex');
      sessionStorage.removeItem('selectIndex');
      _self.userLogOut().then(() => {
        _self.$router.push('/login');
      });
    },
    // 修改密码
    editPassword() {
      this.$router.push('/excessive');
    },
  }
};
</script>

<style lang="less" scoped>
@import url("../../views/layout/iconfont/iconfont.css");
@import './../../styles/common.less';
.header_layout{
  // padding: 0 15px 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  .header_left{
    display: flex;
    align-items: center;
    img{
      width: 40px;
      height: 40px;
      margin-right: 10px;
    }
    .title{
      font-size: 20px;
      // font-weight: 600;
      margin-right: 5px;
      color: @green-color;
      font-family: "Hiragino Sans GB"
    }
    .row_line{
      margin-right: 5px;
      color: @green-color;
    }
    .subtitle{
      font-size: 16px;
      color: @green-color
    }
  }
}
</style>
