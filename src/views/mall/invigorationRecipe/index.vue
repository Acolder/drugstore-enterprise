<template>
  <div class="client">
    <div class="opening">
      <div class="title">
        开通在线补方功能
      </div>
      <div class="describe">
        <ul>
          <li>在线补方可以帮助客户在线开具处方单，获取合规的电子处方单后进行购药服务。</li>
          <li>在线补方功能还能查询历史开具的处方信息、就诊人信息，让处方有据可寻。</li>
          <li>该功能目前为免费试用阶段，如需试用请点击“申请开通”</li>
        </ul>
      </div>
      <div class="btn">
        <el-button type="primary" @click="open">申请开通</el-button>
      </div>
    </div>
    <!-- <div class="invigorationRecipe" v-else>
      <div class="header">
        <div class="nav" :class="status === 1 ? 'nav-active' : ''" @click="goOnline">在线处方</div>
        <div class="nav" :class="status === 2 ? 'nav-active' : ''" @click="goHistorical">历史处方</div>
        <div class="nav" :class="status === 3 ? 'nav-active' : ''" @click="goPerson">就诊人管理</div>
      </div>
      <div class="main">
        <invigorationRecipes v-if="status === 1"></invigorationRecipes>
        <historicalOcts v-if="status === 2"></historicalOcts>
        <members  v-if="status === 3"></members>
      </div>
    </div> -->
  </div>
</template>

<script>
import invigorationRecipe from './invigorationRecipe';
import historicalOct from './historicalOct';
import member from './member';
import javaAjax from '@/utils/javaApiRequest';
import { setnetToken, setLoginID, setSupplement, setRongcloudtoken } from '@/utils/auth';
import { getNetInfo } from '@/api/user';
export default {
  data() {
    return {
      // isOpen: true,
      // status: 1
    };
  },
  components: {
    'invigorationRecipes': invigorationRecipe,
    'historicalOcts': historicalOct,
    'members': member
  },
  methods: {
    // goOnline() {
    //   this.status = 1;
    //   // this.$router.push('/invigorationRecipe/list');
    // },
    // goHistorical() {
    //   this.status = 2;
    //   // this.$router.push('/invigorationRecipe/historicalOct');
    // },
    // goPerson() {
    //   this.status = 3;
    //   // this.$router.push('/memberList/index');
    // },
    open() {
      let url = '/mall_manage_seller/back/onlineSupplement';
      javaAjax.post(url).then((res) => {
        console.log(res);
        if (res.status === 200 && res.data.resultCode === '0' && res.data.resultData) {
          // localStorage.setItem('login_id', res.data.resultData);
          setLoginID(res.data.resultData);
          setSupplement('1');
          let data = {
            login_id: res.data.resultData
          };
          getNetInfo(data).then(result => {
            console.log(result);
            if (result.user_token && result.rongcloud_token) {
              setnetToken(result.user_token);
              setRongcloudtoken(result.rongcloud_token);
              this.$message.success('开通成功');
              this.$store.dispatch('delAllViews');
              this.$router.push('/invigorationRecipe/invigorationRecipe?rest=1');
              window.location.href = `${process.env.WEB_HOST}/invigorationRecipe/invigorationRecipe?rest=1`;
            } else {
              this.$message.warning('开通失败，请稍后重试');
            }
          });
          // javaAjax.post('/mall_manage_seller/back/getLoginId', data).then((resl) => {
          //   console.log(resl);
          //   setnetToken(resl.data.resultData.data.user_token);
          // });
          // this.isLoding = false;
          // this.sellerList = res.data.resultData.data;
          // this.sellerList.map(item => {
          //   item.createDate = formatDate(item.createDate);
          //   return item;
          // });
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.client{
  width: 1400px;
  height: 100%;
  background: #fff;
  margin: 0 auto;
  .opening{
    .title{
      height: 100px;
      text-align: center;
      font-size: 22px;
      line-height: 100px;
    }
    .describe{
      padding-left: 200px;
      margin-top: 40px;
      li{
        line-height: 40px;
        list-style: inside;
      }
    }
    .btn{
      margin-top: 120px;
      text-align: center;
      padding-bottom: 100px;
    }
  }
  // .invigorationRecipe{
  //   // padding-left: 100px;
  //   .header{
  //     // width: 400px;
  //     display: flex;
  //     // justify-content: space-between;
  //     border-bottom: 1px solid #e9eaf2;
  //     .nav{
  //       width: 100px;
  //       line-height: 46px;
  //       text-align: center;
  //       font-size: 16px;
  //       cursor: pointer;
  //     }
  //     .nav-active{
  //       border-bottom: 2px solid #32d6e6;
  //       color: #32d6e6
  //     }
  //   }
  //   .main{
  //     margin-top: 15px;
  //     padding-left: 80px;
  //   }
  // }
}
</style>
