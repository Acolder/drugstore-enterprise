<template>
  <div class="layout">
    <el-container class="container-wrapper">
      <el-header class="header-wrapper">
        <div class="logo-wrapper">
          <router-link :to="{ path:'/home/index'}">
            <span>药葫芦-商户管理平台</span>
          </router-link>
        </div>
        <div class="nav-wrapper">
          <div class="toggle-menu">
            <a href="javascript:void(0);" @click="toggleSidebar">
              <span class="el-icon-menu"></span>
            </a>
          </div>
          <el-menu @select="selectNav" :unique-opened="true" :default-active="navValue" class='menu-list' mode="horizontal" background-color="#20a0ff" text-color="#fff" active-text-color="#ffd04b">
            <el-menu-item v-for="(item,index) in navs" :key="item.name" :index="item.name" :tabindex="index"> {{item.title}}</el-menu-item>
          </el-menu>
        </div>
        <div class="user-wrapper">
          <span class="el-icon-message xinxi"></span>
          <!-- <span class="el-icon-setting shezhi" @click="setting"></span> -->
          <el-dropdown>
            <span class="el-dropdown-link">
              <img class="user-icon" :src="avatar ? avatar : defaultAvatar" />
              <span class="user-name">
                <!--<span v-if="sellerInfo">{{sellerInfo.sellerName}}</span>-->{{role === '店主' ? account : name}}</span>
              <!--<i class="el-icon-arrow-down el-icon--right"></i>-->
            </span>
            <el-dropdown-menu slot="dropdown">
              <!-- <el-dropdown-item command="c">修改密码</el-dropdown-item>
              <el-dropdown-item command="d">注销</el-dropdown-item> -->
              <el-dropdown-item command="e" divided @click.native="logout()">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-container class="content-wrapper">
        <el-aside class="sidebar-wrapper" width="200px">
          <transition name="el-fade-in">
            <el-menu :collapse="!sidebarStatus" default-active="0-0" :default-openeds="menu_default_opens" background-color="#f7f7f7">
              <template v-for="(one, one_index) in routers">
                <template v-if="one.children&&one.children.length>0&&one.meta&&one.meta.show!==false">
                  <!--一级菜单 有子菜单-->
                  <el-submenu :key="one_index" :index="one_index.toString()" class="orderList">
                    <template slot="title">
                      <i class="el-icon-setting"></i>
                      <span slot="title">{{one.meta.title}}</span>
                      <span class="sum" v-if="one.meta.title === '订单管理' && treatedNum">{{treatedNum>99 ? '99+' : treatedNum}}</span>
                    </template>
                    <template v-for="(two, two_index) in one.children">
                      <!--二级菜单 有子菜单-->
                      <template v-if="two.children&&two.children.length>0&&two.meta&&two.meta.show!==false">
                        <el-submenu :key="two_index" :index="one_index.toString()+'-'+two_index.toString()">
                          <template>
                            <span slot="title">{{two.meta.title}}</span>
                          </template>
                          <!--三级菜单-->
                          <el-menu-item @click="menuClick(three,two.path+'/'+three.path)" v-for="(three,three_index) in two.children" :key="three_index" :index="three_index.toString()" :tabindex="three_index.toString()" v-if="three.meta&&three.meta.show !== false">{{three.meta.title}}</el-menu-item>
                        </el-submenu>
                      </template>
                      <template v-else>
                        <!--二级菜单 没有子菜单-->
                        <el-menu-item @click="menuClick(two,two.path)" :key="two_index" :index="two.meta.title === '订单列表' ? '0-0' : two_index.toString()" v-if="two.meta&&two.meta.show!==false">
                          <span slot="title">{{two.meta.title}}</span>
                          <span class="num sum" v-if="two.meta.title === '订单列表' && treatedNum">{{treatedNum>99 ? '99+' : treatedNum}}</span>
                          <!-- <span class="num sum" v-if="two.meta.title === '非处方订单'">{{sum.orderNoOtcCount>99 ? '99+' : sum.orderNoOtcCount}}</span> -->
                        </el-menu-item>
                      </template>
                    </template>
                  </el-submenu>
                </template>
                <template v-else>
                  <!--一级菜单 无子菜单-->
                  <el-menu-item :key="one_index" v-if="one.meta&&one.meta.show!==false" :index="one_index.toString()" @click="menuClick(one,one.path)">
                    <i class="el-icon-setting"></i>
                    <span slot="title">{{one.meta.title}}</span>
                  </el-menu-item>
                </template>
              </template>
            </el-menu>
          </transition>
        </el-aside>
        <el-container class="main-wrapper">
          <el-header height="45px">
            <section v-if="visitedViews&&visitedViews.length>0">
              <el-tabs v-model="tabValue" type="card" @tab-click="tabClick" @tab-remove="tabRemove" closable>
                <el-tab-pane v-for="(item) in visitedViews" :key="item.name" :label="item.title" :name="item.name">
                </el-tab-pane>
              </el-tabs>
            </section>
          </el-header>
          <el-main>
            <section class="app-main">
              <transition name="fade" mode="out-in">
                <keep-alive :include="cachedViews">
                  <router-view></router-view>
                </keep-alive>
              </transition>
            </section>
          </el-main>
        </el-container>
      </el-container>
    </el-container>
    <audio src="/static/audio/newOrder.mp3" controls="controls" id="order-remind" style="display:none">
      Your browser does not support the audio element.
    </audio>
    <!-- <div class="foot">
      <p>互联网药品信息服务资格证书编号（粤ICP备15012374）-经营性-2018-0180</p>
      <p>Copyright ©2018 康美药业股份有限公司. All rights reserved. 粤ICP证 10204402号-6</p>
    </div> -->
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import Cookies from 'js-cookie';
import javaRequest from '@/utils/javaApiRequest';
import { getToken, getUserPower, getAccount, getRole } from '@/utils/auth';
// import observer from '@/utils/observer';
export default {
  inject: ['reload'],
  data() {
    return {
      defaultAvatar: 'https://uploads.kangmei.com.cn/Files/20180610/bm1d1zgd.ehq.jpg',
      routers: [],
      // userInfo: {},
      menu_default_opens: ['0'],
      // sum: '', // 订单条数
      treatedNum: '',
      power: '', // 权限信息
      newOrderTimer: null,
      waitOrderTimer: null,
      account: getAccount(),
      role: getRole()
    };
  },
  computed: {
    ...mapGetters([
      'sidebarStatus',
      'navs',
      'name',
      'mobile',
      'avatar',
      'permissions',
      'visitedViews',
      'cachedViews',
      'sellerInfo'
    ]),
    tabValue: {
      get: function () {
        return this.$store.state.app.tabValue;
      },
      set: function (tabValue) {
        this.$store.state.app.tabValue = tabValue;
      }
    },
    navValue: {
      get: function () {
        let activeNavName = this.$store.getters.navValue;
        let navValue = Cookies.get('storeNavValue');
        navValue = navValue || activeNavName;
        return navValue;
      },
      set: function (value) {
        this.$store.state.app.navValue = value;
        Cookies.set('storeNavValue', value);
      }
    }
  },
  methods: {
    ...mapActions([
      'userLogOut',
      'getUserInfo',
      'getSellerInfo'
    ]),
    // 退出登录
    logout() {
      let _self = this;
      sessionStorage.removeItem('orderTransport');
      _self.userLogOut().then(() => {
        _self.$router.push('/login');
      });
    },
    toggleSidebar() {
      this.$store.dispatch('toggleSidebar');
    },
    // 顶部tab选择
    selectNav(key, keyPath) {
      this.loadRouters(key);
      this.navValue = key;
    },
    // load routers by nav name
    loadRouters(navName) {
      let promission = this.permissions.find((n) => n.name === navName);
      if (promission) {
        this.routers = promission.routers;
      }
    },
    // 点击菜单
    menuClick(menu, link) {
      this.getOrderSum();
      let data = {
        name: menu.name,
        path: menu.path,
        meta: {
          title: menu.meta.title
        }
      };
      this.$store.dispatch('addVisitedViews', data);
      this.tabValue = data.name;
      if (this.$route.path === '/order-control/list' && link === '/order-control/list') {
        // window.location.reload();
        this.$router.go(0);
        // observer.$emit('ab');
      } else {
        this.$router.push(link);
      }
    },
    // tab点击
    tabClick(tab) {
      let tabname = tab.name;
      let view = this.visitedViews.find((x) => x.name === tabname);
      if (view) {
        this.$router.push({ path: view.path });
      }
    },
    // tab 关闭
    tabRemove(name) {
      let _self = this;
      if (_self.visitedViews.length > 1) {
        let tab = _self.visitedViews.find((x) => x.name === name);
        _self.$store.dispatch('delVisitedViews', tab).then((res) => {
          let current = res.pop();
          _self.$router.push({ path: current.path });
        });
      } else {
        _self.$message({
          message: '最后一个标签不能删除',
          center: true
        });
      }
    },
    // 刷新页面时添加当前页面tab信息
    appendCurrentTab() {
      let data = {
        name: this.$route.name,
        path: this.$route.path,
        meta: {
          title: this.$route.meta.title
        }
      };
      this.$store.dispatch('addVisitedViews', data);
      this.tabValue = data.name;
    },
    // 去设置配送方式
    // setting() {
    //   this.$router.push('/order-control/selectDistribution');
    // },
    // 总订单条数
    // getOrderSum() {
    //   javaRequest.post('/mall_manage/back/order/queryOrderCount'
    //   ).then(res => {
    //     if (res.status === 200 && res.data.resultCode === '0') {
    //       this.sum = res.data.resultData;
    //     }
    //   });
    // },
    // 待处理订单条数
    getOrderSum() {
      javaRequest.post('/mall_manage_seller/back/order/queryRedOrderCount'
      ).then(res => {
        if (res.status === 200 && res.data.resultCode === '0') {
          this.treatedNum = res.data.resultData.RedOrderCount;
        }
      });
    },
    // 用户权限
    getPower() {
      this.power = getUserPower();
    },
    // 获取新订单推送
    getNewOrder() {
      let url = '/mall_manage_seller/back/order/updatePush';
      let data = {
        usertoken: getToken()
      };
      this.newOrderTimer = setInterval(() => {
        javaRequest.post(url, data).then(res => {
          if (res.status === 200) {
            let resData = res.data;
            if (resData.resultCode === '0') {
              if (resData.resultData && resData.resultData.length > 0) {
                let orderRemind = document.getElementById('order-remind');
                orderRemind.play();
                this.showMsgNotification('消息提醒', '您有新的订单，请及时处理', resData.resultData[0]);
              }
            }
          }
        });
      }, 5000);
      // setTimeout(() => {
      //   this.showMsgNotification('消息提醒', '您有新的订单，请及时处理', '180906203548605019');
      // }, 5000);
    },
    // 获取待收货订单
    getWaitOrder() {
      let url = '/mall_manage_seller/back/order/queryBySeller';
      let data = {
        status: '20',
        pageNum: 1,
        pageSize: 10
      };
      this.waitOrderTimer = setInterval(() => {
        javaRequest.post(url, data).then(res => {
          if (res.status === 200) {
            let resData = res.data;
            if (resData.resultCode === '0') {
              if (resData.resultData && resData.resultData.data.length > 0) {
                let orderRemind = document.getElementById('order-remind');
                orderRemind.play();
                this.showMsgNotification('消息提醒', '您有新的订单，请及时处理');
              }
            }
          }
        });
      }, 300000);
      // setTimeout(() => {
      //   this.showMsgNotification('消息提醒', '您有新的订单，请及时处理', '180906203548605019');
      // }, 5000);
    },
    showMsgNotification(title, msg, orderId) {
      let _this = this;
      let options = {
        body: msg
      };
      let Notification = window.Notification || window.mozNotification || window.webkitNotification;
      if (Notification && Notification.permission === 'granted') {
        let instance = new Notification(title, options);
        // instance.onclick = function () {
        //   _this.$router.push('/order-control/orderDetail');
        //   sessionStorage.setItem('orderId', orderId);
        // };
        instance.onerror = function () {
          // Something to do
        };
        instance.onshow = function () {
          let thisPath = _this.$route.path;
          if (thisPath === '/order-control/list') {
            _this.reload();
          }
          instance.addEventListener('click', function () {
            if (orderId) {
              _this.$router.push('/order-control/orderDetail');
              sessionStorage.setItem('orderId', orderId);
            }
            else {
              _this.$router.push('/order-control/list');
            }
            instance.close();
          });
          // setTimeout(function () {
          //   instance.close();
          // }, 5000);
        };
        instance.onclose = function () {
          // Something to do
          instance.close();
        };
      } else if (Notification && Notification.permission !== 'denied') {
        Notification.requestPermission(function (status) {
          if (Notification.permission !== status) {
            Notification.permission = status;
          }
          if (status === 'granted') {
            let instance = new Notification(title, options);
            instance.onclick = function () {
              // Something to do
            };
            instance.onerror = function () {
              // Something to do
            };
            instance.onshow = function () {
              // Something to do
              setTimeout(instance.close, 5000);
            };
            instance.onclose = function () {
              // Something to do
            };
          } else {
            return false;
          }
        });
      } else {
        return false;
      }
    }
  },
  mounted() {
    this.loadRouters(this.navValue);
    this.getNewOrder();
    this.getWaitOrder();
  },
  created() {
    this.appendCurrentTab();
    this.getUserInfo();
    this.getSellerInfo();
    this.getOrderSum();
    this.getPower();
    // window.location.reload();
  },
  watch: {
    '$route': 'appendCurrentTab'
  },
  destroyed() {
    clearInterval(this.newOrderTimer);
    clearInterval(this.waitOrderTimer);
  }
};
</script>
<style lang="less" scoped>
@header-height: 60px;
.foot{
  // position: relative;
  // bottom: 0;
  // left: 0;
  // right: 0;
  // margin-top: 60px;
  padding: 10px 0;
  text-align: center;
  border-top: 1px solid #ccc;
  p{
    margin-top: 20px;
  }
}
.layout{
  height: 100%;
}
.app-wrapper {
  clear: both;
  position: relative;
  height: 100%;
  width: 100%;
}
.container-wrapper {
  height: 100%;
  width: 100%;
}
.header-wrapper {
  height: @header-height;
  padding: 0;
  overflow: hidden;
  background-color: #20a0ff;
  .logo-wrapper {
    height: @header-height;
    min-width: 200px;
    float: left;
    padding: 10px 20px;
    line-height: 40px;
    vertical-align: middle;
    a {
      color: #ffffff;
      font-size: 18px;
      font-weight: bold;
    }
  }
  .nav-wrapper {
    height: @header-height;
    float: left;
    .toggle-menu {
      width: 50px;
      float: left;
      padding: 20px 0px 15px 15px;
      a {
        font-size: 20px;
        color: #ffffff;
      }
    }
    .menu-list {
      height: @header-height;
      float: left;
    }
  }
  .user-wrapper {
    height: @header-height;
    padding: 8px 20px 7px 20px;
    float: right;
    text-align: right;
    .xinxi{
        float: left;
        width: 60px;
        height: 60px;
        line-height: 48px;
        font-size: 30px;
        color: #fff;
        cursor: pointer;
      }
      .shezhi{
        float: left;
        width: 60px;
        height: 60px;
        line-height: 48px;
        font-size: 30px;
        color: #fff;
        cursor: pointer;
      }
    .el-dropdown {
      min-width: 180px;
      line-height: 45px;
      color: #ffffff;
      .user-name {
        float: right;
        min-width: 120px;
        padding-right: 8px;
        padding-left: 8px;
        text-align: right;
        overflow: hidden;
      }
      .user-icon {
        float: right;
        width: 45px;
        height: 45px;
        border-radius: 50%;
        cursor: pointer;
      }
    }
  }
}
.content-wrapper {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  margin-top: 60px;
  height: 100%;
  width: 100%;
}
@sidebar-bgcolor: #f7f7f7;
.sidebar-wrapper {
  width: auto !important;
  transition: width 0.28s;
  border-right: solid 1px #e6e6e6;
  background-color: @sidebar-bgcolor;
  .el-menu {
    width: 200px;
    border: none;
  }
  .el-menu--collapse {
    width: auto !important;
  }
}
.main-wrapper {
  padding: 0;
  @tabs-height: 40px;
  .el-header {
    padding: 0;
    height: @tabs-height;
    overflow: hidden;
    .el-tabs {
      height: @tabs-height;
      /deep/ .el-tabs__header {
        padding-left: 5px;
        padding-right: 5px;
        margin-top: 3px;
      }
    }
  }
  .el-main {
    .app-main {
      height: 100%;
    }
  }
}
.orderList{
  .sum{
    position: absolute;
    top: 17px;
    right: 38px;
    display: inline-block;
    padding: 2px 2px;
    background: red;
    height: 26px;
    width: 26px;
    border-radius: 50%;
    line-height: 25px;
    color: #fff;
    margin-left: 12px;
    min-width: 25px;
    text-align: center;
  }
  .num{
    right: 20px;
  }
}
</style>

