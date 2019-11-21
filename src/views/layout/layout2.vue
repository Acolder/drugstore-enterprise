<template>
  <div class="layout">
    <el-container class="container-wrapper">
      <el-header class="header_wrap" height="60px">
       <layoutHeader></layoutHeader>
      </el-header>
      <el-container class="layout_mian_wrap">
        <el-aside class="sidebar-wrapper" width="180px">
          <transition name="el-fade-in">
            <el-menu :collapse="!sidebarStatus" :default-openeds="menu_default_opens" :unique-opened="true" text-color="#585A6E" active-text-color="#0ccdd3" :default-active="menu_default_active" @select= "menuSelect" @open="menuOpen">
              <el-menu-item index="'home'" class="home-menu" @click="homePage">
                <i class="iconfont icon-home"></i>
                <span slot="title">系统首页</span>
              </el-menu-item>
              <template v-for="(one, one_index) in routers">
                <template v-if="one.children&&one.children.length>0&&one.meta&&one.meta.show!==false">
                  <!--一级菜单 有子菜单-->
                  <el-submenu :key="one_index" :index="one_index.toString()" :class="'menuListItem'">
                    <template slot="title">
                      <i class="iconfont" :class="[one.meta.icon,indexActive == one_index ? 'active' :'']"></i>
                      <span slot="title" :class="indexActive == one_index ? 'active' :''">{{one.meta.title}}</span>
                      <em class="sum" v-if="one.meta.title === '订单管理' && sum">{{sum>99 ? '99+' : sum}}</em>
                      <em class="new" v-if="one.meta.title === '处方服务'">新</em>
                    </template>
                    <template v-for="(two, two_index) in one.children">
                      <!--二级菜单 有子菜单-->
                      <template v-if="two.children&&two.children.length>0&&two.meta&&two.meta.show!==false">
                        <el-submenu :key="two_index" :index="one_index.toString()+'-'+two_index.toString()">
                          <template>
                            <span slot="title">{{two.meta.title}}</span>
                          </template>
                          <!--三级菜单-->
                          <el-menu-item @click="menuClick(three,two.path+'/'+three.path)" v-for="(three,three_index) in two.children" :key="three_index" :index="three_index.toString()" :tabindex="three_index.toString()" v-if="three.meta&&three.meta.show!==false">{{three.meta.title}}</el-menu-item>
                        </el-submenu>
                      </template>
                      <template v-else>
                        <!--二级菜单 没有子菜单-->
                        <el-menu-item @click="menuClick(two,two.path)" :key="two_index" :index="two.meta.title === '待处理订单' ? '0-0' : one_index.toString()+'-'+two_index.toString()" v-if="two.meta&&two.meta.show!==false">
                          <!-- <i class="iconfont icon-file"></i> -->
                          <span slot="title">{{two.meta.title}}</span>
                          <em class="num sum" v-if="two.meta.title === '待处理订单' && sum">{{sum>99 ? '99+' : sum}}</em>
                        </el-menu-item>
                      </template>
                    </template>
                  </el-submenu>
                </template>
                <template v-else>
                  <!--一级菜单 无子菜单-->
                  <el-menu-item :key="one_index" v-if="one.meta&&one.meta.show!==false" :index="one_index.toString()" @click="menuClick(one,one.path)">
                    <i class="iconfont icon-sitting"></i>
                    <span slot="title">{{one.meta.title}}</span>
                  </el-menu-item>
                </template>
              </template>
            </el-menu>
          </transition>
          <div class="aside_foot" :class="sidebarStatus ? 'shouqi' : 'zhankai'" @click="toggleSidebar">
            <span v-if="sidebarStatus">
              <i class="iconfont icon-xiangzuoshouqi" style="font-size:12px;"></i>
              <em>收起</em>
            </span>
            <span v-else>
              <i class="iconfont icon-xiangyouzhankai" style="font-size:12px;"></i>
              <em>展开</em>
            </span>
          </div>
        </el-aside>
        <el-main class="layout_mian">
          <div separator-class="el-icon-arrow-right" class="layout_bread">
            <span>
              <em>首页</em>
              <i class="el-icon-arrow-right"></i>
            </span>
            <span v-for="(item, index) in visitedViews" :key="index" @click="breadClick(item)">
              <em>{{item.title}}</em>
              <i class="el-icon-arrow-right" v-if="index !== visitedViews.length -1"></i>
            </span>
          </div>
          <div class="app-content-main">
            <transition name="fade" mode="out-in">
              <keep-alive :include="cachedViews">
                <router-view></router-view>
              </keep-alive>
            </transition>
          </div>
        </el-main>
      </el-container>
    </el-container>
    <audio src="/static/audio/newOrder.mp3" controls="controls" id="order-remind" style="display:none">
      Your browser does not support the audio element.
    </audio>
    <audio src="/static/audio/refundOrder.mp3" controls="controls" id="order-refund" style="display:none">
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
import { getToken, getAccount, getRole } from '@/utils/auth';
import redirectConfirmList from './redirectConfirm.js';
import layoutHeader from '@/components/header/header';
// import Stomp from 'stompjs';
// import header from '@components/header/header';
// import header from '@/components/header/header';
// import observer from '@/utils/observer';
export default {
  inject: ['reload'],
  data() {
    return {
      defaultAvatar: 'https://uploads.kangmei.com.cn/Files/20180610/bm1d1zgd.ehq.jpg',
      routers: [],
      // userInfo: {},
      menu_default_opens: '',
      // sum: '', // 订单条数
      treatedNum: '',
      // power: '', // 权限信息
      newOrderTimer: null,
      // waitOrderTimer: null,
      account: getAccount(),
      role: getRole(),
      indexActive: '',
      menu_default_active: ''
    };
  },
  components: {
    'layoutHeader': layoutHeader
  },
  computed: {
    ...mapGetters([
      'sidebarStatus',
      // 'navs',
      // 'name',
      // 'mobile',
      // 'avatar',
      'permissions',
      'visitedViews',
      'cachedViews',
      // 'sellerInfo',
      'sum', // 新订单条数
    ]),
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
      // 'getUserInfo',
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
    // 修改密码
    editPassword() {
      console.log(1);
      this.$router.push('/excessive');
    },
    homePage() {
      // this.$router.push('/home/index');
    },
    // 展开收起
    toggleSidebar() {
      this.$store.dispatch('toggleSidebar');
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
      this.$store.dispatch('getOrderSum');
      let currentRouteName = this.$route.name;
      let rc = redirectConfirmList.find((x) => x.routeName === currentRouteName);
      if (link !== this.$route.path) {
        if (rc) {
          this.$confirm(rc.message, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$router.push({
              path: link
            });
            this.$store.dispatch('delAllViews');
          });
        } else {
          this.$store.dispatch('delAllViews');
          this.$router.push(link);
        }
      }
    },
    breadClick(item) {
      this.$store.dispatch('getOrderSum');

      let data = {
        name: item.name,
        path: item.path,
        meta: {
          title: item.title
        }
      };
      let currentRouteName = this.$route.name;
      let rc = redirectConfirmList.find((x) => x.routeName === currentRouteName);
      if (item.path !== this.$route.path) {
        if (rc) {
          this.$confirm(rc.message, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$router.push({
              path: item.path
            });

            this.$store.dispatch('delAfterViews', data);
          });
        } else {
          this.$router.push(item.path);

          this.$store.dispatch('delAfterViews', data);
        }
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
      // this.tabValue = data.name;
    },
    // 用户权限
    // getPower() {
    //   this.power = getUserPower();
    // },
    // 获取新订单推送
    getNewOrder() {
      let url = '/mall_manage_seller/back/order/updatePush';
      let data = {
        usertoken: getToken()
      };
      this.newOrderTimer = setInterval(() => {
        javaRequest.post(url, data).then(res => {
          // if (res.status === 200) {
          let resData = res.data;
          if (resData.resultCode === '0') {
            // console.log(resData);
            if (resData.resultData.newPush) {
              let orderRemind = document.getElementById('order-remind');
              orderRemind.play();
              this.showMsgNotification('消息提醒', '您有新的订单，请及时处理');
            }
            if (resData.resultData.refundPush) {
              let orderRemind = document.getElementById('order-refund');
              orderRemind.play();
              this.showMsgNotification('消息提醒', '有用户申请退款，请您及时处理');
            }
          }
          // }
        });
      }, 7000);
    },
    showMsgNotification(title, msg, orderId) {
      let _this = this;
      let options = {
        body: msg
      };
      let Notification = window.Notification || window.mozNotification || window.webkitNotification;
      if (Notification && Notification.permission === 'granted') {
        let instance = new Notification(title, options);
        instance.onerror = function () {
        };
        instance.onshow = function () {
          instance.addEventListener('click', function () {
            _this.$router.push('/order-control/monitorOrder');
            instance.close();
          });
        };
        instance.onclose = function () {
          // Something to do
          instance.close();
        };
        setTimeout(() => {
          instance.close();
        }, 6000);
        // setTimeout(instance.close, 6000);
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
    },
    menuOpen(index, indexpath) {
      console.log(index);
      this.indexActive = index;
      localStorage.setItem('openIndex', index);
    },
    menuSelect(index, indexpath) {
      console.log(index);
      sessionStorage.setItem('selectIndex', index);
    },
    scoed() {
      // 打开一个 web socket
      // let ws = new WebSocket('ws://10.6.12.65:61613');
      // console.log(ws);
      // ws.onopen = function() {
      //   console.log('连接开始了');
      // };
      // ws.onmessage = function (evt)
      // {
      //   let received_msg = evt.data;
      //   console.log('数据已接收...', received_msg);
      // };
      // ws.onerror = function (evt)
      // {
      //   console.log(evt);
      // };
      // let client = Stomp.client('ws://10.6.12.65:61613');
      // console.log(client);
      // let on_connect = function(connected) {
      //   console.log('链接成功:', connected);
      // };
      // let on_error =  function(error) {
      //   console.log('链接失败,原因:', error);
      // };
      // let headers = {
      //   login: 'testadmin',
      //   passcode: 'km123456',
      //   // additional header
      //   // 'client-id': 'my-client-id'
      // };
      // // 参数依次为：用户名，密码，连接后，出错，虚拟主机名
      // client.connect(headers, on_connect, on_error);

    }
  },
  mounted() {
    this.loadRouters(this.navValue);
    this.getNewOrder();
    console.log(this.routers, this.$route.path);
    // this.getWaitOrder();
  },
  created() {
    this.appendCurrentTab();
    // this.getUserInfo();
    this.getSellerInfo();
    // this.getOrderSum();
    this.$store.dispatch('getOrderSum');
    this.menu_default_opens = sessionStorage.getItem('openIndex') ? [sessionStorage.getItem('openIndex')] : ['1'];
    // console.log(this.menu_default_opens);
    // localStorage.removeItem('openIndex');
    this.menu_default_active = sessionStorage.getItem('selectIndex') ? sessionStorage.getItem('selectIndex') : '0-0';
    // localStorage.removeItem('selectIndex');
    // this.getPower();
    // window.location.reload();
    // this.scoed();
  },
  watch: {
    '$route': 'appendCurrentTab'
  },
  destroyed() {
    clearInterval(this.newOrderTimer);
    // clearInterval(this.waitOrderTimer);
  }
};
</script>
<style lang="less" scoped>
@import url("./iconfont/iconfont.css");
@import '../../styles/common.less';
@background-color: #F7F8FA;
.layout{
  background: @background-color;
  height: 100%;
  min-width: 1600px;
}


.container-wrapper {
  height: 100%;
  width: 100%;
  .header_wrap{
    background-color: @white-color;
    box-shadow: 0 2px 6px 0 #F1F1F6;
    border-bottom: @line-border;
    margin-bottom: 10px;
  }
  .layout_mian_wrap{
    height: 100%;
    background: @background-color;
    position: relative;
    .sidebar-wrapper{
      background-color: @white-color;
      /deep/.el-menu{
        border: none;
      }
    }
    .layout_mian{
      padding-top: 0;
      // min-width: 1200px;
      .layout_bread{
        height: 40px;
        line-height: 40px;
        background: #fff;
        border-bottom: @line-border;
        padding-left: 5px;
        margin-bottom: 15px;
        span{
          color: #606266;
          cursor: pointer;
          &:nth-last-child(1) {
            color: @green-color;
          }
        }
      }
    }
  }
}


.sidebar-wrapper {
  width: auto !important;
  transition: width 0.28s;
  // border-right: solid 1px #e6e6e6;
  padding-top: 10px;
  border-radius: 2px;
  box-shadow: 0 0 6px 0 #E9EAF2;
  margin-left: 10px;
  margin-bottom: 15px;
  max-height: 100%;
  padding-bottom: 50px;
  &::-webkit-scrollbar {
    /*隐藏滚轮*/
    display: none;
    }
  .aside_foot{
    position: absolute;;
    bottom: 15px;
    left: 10px;
    // right: 0;
    z-index: 10;
    display: flex;
    height: 50px;
    justify-content: space-around;
    align-items: center;
    border-top: @line-border;
    cursor: pointer;
    background: #fff;
  }
  .shouqi{
    width: 200px;
  }
  .zhankai{
    width: 91.31px;
  }
  /deep/.el-menu {
    width: 200px;
    border: none;
    .home-menu {
      background: @white-color;
      &:hover {
        background: @background-color;
        i,
        span {
          color: @green-color;
        }
      }
    }
    .iconfont {
      margin-right: 5px;
    }
    .el-submenu {
      /deep/.el-menu--inline{
        padding-left: 30px;
        padding-top: 10px;
        padding-bottom: 10px;
        .el-menu-item{
          padding: 0;
          padding-left: 20px !important;
          min-width: 150px !important;
          border-left: @line-border;
        }
      }
      /deep/.el-menu {
        .el-menu-item {
          &:hover {
            background-color: @white-color !important;
            i,
            span {
              color: @green-color !important;
            }
          }
          &:focus{
            background: @white-color;
          }
        }
        .el-menu-item.is-active {
          i,
          span {
            color: @green-color !important;
          }
        }
      }
    }
    .el-submenu:hover {
      /deep/.el-submenu__title {
        &:hover{
          background: @background-color;
        }
        i,
        span {
          color: @green-color !important;
        }
      }
    }
    .el-submenu.is-opened {
      /deep/.el-submenu__title {
        i,
        span {
          color: @green-color !important;
        }
      }
    }
    .el-submenu.is-active {
      /deep/.el-submenu__title {
        i,
        span {
          color: @green-color !important;
        }
      }
    }
  }
  .el-menu--collapse {
    width: auto !important;
  }
}



// section{
//   max-height: 100%;
// }
.menuListItem {
  .sum {
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
  .new{
    display: inline-block;
    height: 16px;
    padding: 0 4px;
    border-radius: 1px;
    color: #F76C6C;
    background: #FFF3F3;
    line-height: 16px;
    vertical-align: 1px;
  }
  .num {
    right: 20px;
    color: #fff;
    top: 12px;
  }
  .active{
    color: @green-color;
  }
}
</style>

