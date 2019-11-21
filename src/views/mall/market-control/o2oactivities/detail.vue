<template>
<div class="activitiesDetail">
  <h2 class="title item-header">全店满减详情</h2>
  <div class="detail">
    <el-row>
      <el-col :span="12">
        <span>参与门店：<span class="store" v-for="(item, index) in detail.participationInList" :key="index">{{item.sellerName}}</span></span>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <span>活动日期：{{detail.startDate + '~' + detail.endDate}}</span>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <span>规则：<div class="store" v-for="(item, index) in detail.actFullList" :key="index">{{'满' + item.reduce + '减' + item.full}}</div></span>
      </el-col>
    </el-row>
  </div>
</div>
</template>

<script>
import javaRequest from '@/utils/javaApiRequest';
export default {
  data() {
    return {
      detail: {},
      ids: {
        marketingActivitiesId: this.$route.query.id,
      }
    };
  },
  methods: {
    getDatail() {
      javaRequest.post('/mall_manage_seller/back/marketing/activities/queryActFullDetails', this.ids).then(res => {
        console.log(res);
        if (res.status === 200 && res.data.resultCode === '0') {
          this.detail = res.data.resultData;
        }
      });
    }
  },
  created() {
    this.getDatail();
  }
};
</script>

<style lang="less" scoped>
.activitiesDetail{
  background: #fff;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
}
.title{
  line-height: 60px;
  padding-left: 30px;
  font-size: 18px;
}
.detail{
  padding: 15px 30px;
  // background: ;
  // background: #fff;
  // margin-top: 20px;
  // box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
  /deep/ .el-row{
    margin: 15px 0;
  }
}
.store{
  display: inline-block;
  padding: 0 15px;
  height: 30px;
  border-radius: 6px;
  border: 1px solid #ccc;
  line-height: 30px;
  text-align: center;
  margin-left: 10px;
}
</style>
