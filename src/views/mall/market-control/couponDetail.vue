<template>
<div class="couponDetail">
  <h2 class="title item-header">优惠券详情</h2>
  <div class="detail">
    <el-row>
      <el-col :span="12">
        <span>名称：{{detail.couponName}}</span>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <span>可领用群体：{{detail.accessibleGroup === 1 ? '全部' : detail.accessibleGroup === 2 ? '优惠券创建后的新用户' : '时间段内的新用户'}}</span>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <span>规则：{{detail.ruleDescription}}</span>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <span v-if="detail.startDate">使用时间：{{detail.startDate}}至{{detail.endDate}}</span>
        <span v-else>有效时间：{{detail.effectiveDate}}天后</span>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <span>优惠金额：{{detail.preferentialAmount}}</span>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <span>使用门槛：{{detail.useTheThreshold}}</span>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <span>发行数量：{{detail.distributionQuantity}}</span>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <span>每人限领：{{detail.limitCollarPerPerson}}</span>
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
        couponId: this.$route.query.id,
        securitiesInformationId: this.$route.query.secuId
      }
    };
  },
  methods: {
    getDatail() {
      javaRequest.post('/mall_manage_seller/back/coupon/queryDetailsOfCoupons', this.ids).then(res => {
        // console.log(res);
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
.couponDetail{
  background: #fff;
}
.title{
  line-height: 50px;
  font-size: 18px;
  // box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
  // background: #fff;
  padding-left: 30px;
}
.detail{
  padding: 15px 30px;
  // background: ;
  background: #fff;
  // margin-top: 20px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
  /deep/ .el-row{
    margin: 15px 0;
  }
}
</style>
