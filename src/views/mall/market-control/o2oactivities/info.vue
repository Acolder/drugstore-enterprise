<template>
  <div class="couponInfo">
    <div class="info_box">
      <el-form :model="editData" :inline="true" :rules="rules" ref="editValidateForm" label-width="88px" size="small">
        <h2 class="item-header">基础信息</h2>
        <div class="info">
          <el-row v-if="role === '店主'">
            <el-col :span="24">
              <el-form-item label="参与门店:" prop="marketingParticipationInArray">
                <el-button type="default" size="medium" @click="slectStore">选择门店</el-button>
                <span>已选择（{{marketingParticipationInArray.length}}）个</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item prop="endDate" class="time" label="有效时间:">
                <el-form-item prop="startDate">
                  <el-date-picker class="tiem_data" v-model="editData.startDate" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss" placeholder="开始日期" :disabled="disabledAvtive"></el-date-picker>至
                </el-form-item>
                <el-form-item prop="endDate">
                <el-date-picker class="tiem_data" v-model="editData.endDate" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss" placeholder="结束日期" :disabled="disabledAvtive"></el-date-picker>
                </el-form-item>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="满减规则:" class="full" prop="ruleArray">
                <div class="full-item" v-for="(item,index) in editData.ruleArray" :key="index">
                  <span>满</span>
                  <el-input v-model.number="editData.ruleArray[index].full" placeholder="金额" :disabled="disabledAvtive"></el-input>
                  <span>减</span>
                  <el-input v-model.number="editData.ruleArray[index].reduce" placeholder="金额" :disabled="disabledAvtive"></el-input>
                  <i class="el-icon-circle-plus add" @click="addbus" v-if="index === 0"></i>
                  <i class="el-icon-minus mint" @click="mintbus(index)" v-else></i>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item prop="channel" label="发布渠道:">
                <el-checkbox-group v-model="editData.channel">
                  <el-checkbox label="1">美团</el-checkbox>
                  <!-- <el-checkbox label="3" >药葫芦</el-checkbox> -->
                  <el-checkbox label="4">京东</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="button-box">
          <el-button type="warning" @click="submit">确认创建</el-button>
          <!-- <el-button type="warning" @click="submit" v-else>确认修改</el-button> -->
        </div>
      </el-form>
    </div>
    <!-- 选择商品弹窗 -->
    <el-dialog title="选择门店" :visible.sync="storeShow" :center='true' :modal-append-to-body="false" width="600px">
      <!-- <goods @getGoods="getGoods" :goodsData="editData.commodityScope"></goods> -->
      <div style="display:flex;width:300px;">
        <el-input placeholder="输入关键字进行过滤" v-model="searchVale"></el-input>
        <el-button @click="search" type="primary">搜索</el-button>
      </div>
      <el-tree ref="permissionTree" :props="permissionTreeProps" :data="sellerData" show-checkbox node-key="sellerUserId" :expand-on-click-node="false">
        <span slot-scope="{ node, data }">
          <span>{{data.sellerName}}</span>
        </span>
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button icon="el-icon-close" @click="storeShow=false">取 消</el-button>
        <el-button icon="el-icon-check" type="primary" @click="saveStore">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import javaAjax from '@/utils/javaApiRequest';
// import goods from './outGoodsList';
import { formatDate } from '@/utils/date';
import { mapGetters } from 'vuex';
import { getRole } from '@/utils/auth';
export default {
  data() {
    return {
      storeShow: false,
      // outGoodsListUrl: '',
      disabledAvtive: false,
      editData: {
        marketingParticipationInArray: [], // 参与门店
        ruleArray: [
          { full: '', reduce: '' }
        ], // 满减规则
        channel: [3], // 活动渠道1.美团2.饿了么 3.药葫芦
        startDate: '', // 有效起时间
        endDate: '', // 有效止时间
      },
      marketingParticipationInArray: [],
      searchVale: '',
      rules: {
        marketingParticipationInArray: [{ required: true, message: '请选择参与门店', trigger: 'blur' }],
        ruleArray: [{ required: true, validator: this.validruleArray, trigger: 'blur' }],
        // channel: [{ required: true, message: '请选择活动渠道', trigger: 'change' }],
        endDate: [{ required: true, validator: this.validEnd, trigger: 'change' }],
        startDate: [{ required: true, validator: this.validStart, trigger: 'change' }],
      },
      role: getRole(), // 身份（店员/店主）
      sellerData: [], // 药店
      permissionTreeProps: {
        label: 'sellerName',
        children: 'marketingParticipationInArray',
      },
    };
  },
  computed: {
    ...mapGetters([
      'visitedViews',
    ]),
  },
  // components: {
  //   'goods': goods
  // },
  watch: {
    'editData.startDate': function() {
      this.editData.effectiveDate = '';
    },
  },
  methods: {
    // 添加规则
    addbus() {
      if (this.editData.ruleArray.length < 5) {
        if (this.editData.ruleArray[this.editData.ruleArray.length - 1].full && this.editData.ruleArray[this.editData.ruleArray.length - 1].reduce) {
          this.editData.ruleArray.push({
            full: '',
            reduce: '',
          });
        } else {
          this.$message.warning('请完成当前规则在添加！');
        }
      } else {
        this.$message.warning('最多只能添加五个规则');
      }

    },
    mintbus(index) {
    // 删除
      this.editData.ruleArray.splice(index, 1);
    },
    // 起止时间
    isvalidEnd(str) {
      if (str > this.editData.startDate && str > formatDate(new Date().getTime())) {
        return true;
      } else {
        return false;
      }
    },
    isvalidStart(str) {
      if (str > formatDate(new Date().getTime())) {
        return true;
      } else {
        return false;
      }
    },
    validStart(rule, value, callback) {
      if (!value) {
        callback(new Error('请选择完整的起止时间'));
      } else if (!this.isvalidStart(value)) {
        callback(new Error('开始时间必须大于当前时间'));
      } else {
        callback();
      }
    },
    validEnd(rule, value, callback) {
      if (!value) {
        callback(new Error('请选择完整的起止时间'));
      } else if (!this.isvalidEnd(value)) {
        callback(new Error('结束时间必须大于开始时间且大于当前时间'));
      } else {
        callback();
      }
    },
    // 满减规则验证
    isvalidruleArray(array) {
      let a = false;
      for (let i = 0; i < array.length; i++) {
        console.log(array[i]);
        if (array[i].full && array[i].reduce) {
          a = true;
        } else {
          a = false;
          return;
        }
      }
      return a;
    },
    tryvalidruleArray(array) {
      let a = false;
      for (let i = 0; i < array.length; i++) {
        console.log(array[i]);
        if (array[i].full > array[i].reduce) {
          a = true;
        } else {
          a = false;
          return;
        }
      }
      return a;
    },
    moneyvalidruleArray(array) {
      const reg = /^[1-9]\d*$/;
      let a = false;
      for (let i = 0; i < array.length; i++) {
        console.log(array[i]);
        if (reg.test(array[i].full) && reg.test(array[i].reduce)) {
          a = true;
        } else {
          a = false;
          return;
        }
      }
      return a;
    },
    // smallvalidruleArray(array) {
    //   let a = false;
    //   for (let i = 0; i < array.length; i++) {
    //     for (let j = 0; j < array.length - 1 - i; j++) {
    //       if (array[j].reduce < array[j + 1].reduce) {
    //         a = true;
    //       } else {
    //         a = false;
    //         return;
    //       }
    //     }
    //   }
    //   return a;
    // },
    validruleArray(rule, value, callback) {
      if (!this.isvalidruleArray(value)) {
        callback(new Error('请输入满减规则'));
      } else if (!this.tryvalidruleArray(value)) {
        callback(new Error('满额必须大于减额'));
      } else if (!this.moneyvalidruleArray(value)) {
        callback(new Error('请输入正确的满减金额(只能为正整数)'));
      }
      //  else if (!this.smallvalidruleArray(value)) {
      //   callback(new Error('立减金额必须随满减门槛的增加而增加'));
      // }
      else {
        callback();
      }
    },
    search() {
      console.log(this.searchVale);
      this.getStoreData(this.searchVale);
    },
    // 获取门店数据
    getStoreData(value) {
      let param = {
        sellerName: value,
        businessType: 2, // 类型写死2
      };
      javaAjax.post('/mall_manage_seller/back/marketing/activities/querySellerName', param).then((res) => {
        console.log(res);
        if (res.status === 200 && res.data.resultCode === '0') {
          this.sellerData = res.data.resultData;
          for (let i = 0; i < this.sellerData.length; i++) {
            this.sellerData[i].sellerName = this.sellerData[i].addressCity;
            this.$set(this.sellerData[i], 'sellerUserId', i);
          }
        }
      });
    },
    // 选择门店
    slectStore() {
      this.storeShow = true;
      setTimeout(() => {
        this.$refs.permissionTree.setCheckedKeys(this.editData.marketingParticipationInArray);
      }, 500);
    },
    saveStore() {
      console.log(this.$refs.permissionTree.getCheckedNodes(false, true));
      this.editData.marketingParticipationInArray = this.$refs.permissionTree.getCheckedNodes(false, true).map((item) => {
        return item.sellerUserId;
      });
      this.marketingParticipationInArray = this.$refs.permissionTree.getCheckedNodes(false, true).map((item) => {
        return {
          sellerUserId: item.sellerUserId,
          sellerName: item.sellerName
        };
      });
      console.log(this.marketingParticipationInArray.filter((item, index) => typeof item.sellerUserId !== 'number'));
      this.marketingParticipationInArray = this.marketingParticipationInArray.filter((item, index) => typeof item.sellerUserId !== 'number');
      this.storeShow = false;
    },
    // handleCheckChange(data, checked, indeterminate) {
    //   console.log(data, checked, indeterminate);
    // },
    submit() {
      let param = {
        startDate: this.editData.startDate, // 开始时间
        endDate: this.editData.endDate, // 结束时间
        activityType: 6, // 活动类型 （固定6）
        quantityOfActiveCommodities: this.marketingParticipationInArray.length, // 参与门店的数量
        publishingChannels: this.editData.channel.join(','), // 发布渠道
        marketingParticipationInArray: this.role === '店主' ? this.marketingParticipationInArray : null, // 参与门店
        actAetailsArray: this.editData.ruleArray.map(item => {
          return {
            origin_price: item.full,
            act_price: item.reduce
          };
        }), // 满减规则
      };
      this.$refs['editValidateForm'].validate((valid) => {
        if (valid) {
          let url = '/mall_manage_seller/back/marketing/activities/batchsave';
          javaAjax.post(url, param).then((res) => {
            console.log(res);
            if (res.status === 200 && res.data.resultCode === '0') {
              this.$message.success(res.data.msg);
              let currentName = this.$route.name;
              let currentTab = this.visitedViews.find((x) => x.name === currentName);
              this.$store.dispatch('delVisitedViews', currentTab).then((res) => {
                this.$router.push('/marketo2o-control/list');
              });
            }
          });
        }
      });
    },
    // 获取修改数据
    getDetail(ids) {
      javaAjax.post('/mall_manage_seller/back/coupon/queryDetailsOfCoupons', ids).then(res => {
        // console.log(res.data.resultData.newUsersStartDate);
        if (res.status === 200 && res.data.resultCode === '0') {
          this.editData = {
            couponId: res.data.resultData.couponId,
            couponName: res.data.resultData.couponName, // 优惠券名称
            ruleDescription: res.data.resultData.ruleDescription, // 规则描述
            useTimeType: res.data.resultData.useTimeType, // 使用时间类型1.起止时间 2.有效时间
            effectiveDate: res.data.resultData.effectiveDate, // 有效时间
            startDate: res.data.resultData.startDate, // 起时间
            endDate: res.data.resultData.endDate, // 止时间
            accessibleGroup: res.data.resultData.accessibleGroup, // 可用群体1.全部 2.优惠券创建后的新用户 3.时间段内的新用户
            newUsersStartDate: res.data.resultData.newUsersStartDate,
            newUsersEndDate: res.data.resultData.newUsersEndDate,
            couponType: res.data.resultData.couponType, // 优惠券类型1.商铺 2.商品
            // sellerUserId: '', // 商户ID
            commodityScope: res.data.resultData.productIdList.map(item => {
              return {
                productName: item.productName,
                productId: item.productId
              };
            }), // 商品
            // commodityScope: [],
            isReceive: res.data.resultData.isReceive, // 商品详情页是否直接领取1.是 2.否
            securitiesInformationJson: [
              {
                securitiesInformationId: res.data.resultData.securitiesInformationId, // id
                preferentialAmount: res.data.resultData.preferentialAmount, // 券面金额
                useTheThreshold: res.data.resultData.useTheThreshold, // 使用门槛
                distributionQuantity: res.data.resultData.distributionQuantity, // 发行数量
                usedDistributionQuantity: res.data.resultData.distributionQuantity,
                limitCollarPerPerson: res.data.resultData.limitCollarPerPerson, // 限领数量
              }
            ], // 券面信息列表
            // res.data.resultData
          };
          // console.log(this.editData);
        }
      });
    }
  },
  mounted() {
    // 22
  },
  created() {
    // if (this.isEdit) {
    //   this.disabledAvtive = true;
    //   let ids = {
    //     couponId: this.$route.query.id,
    //     securitiesInformationId: this.$route.query.secuId
    //   };
    //   this.getDetail(ids);
    // }
    this.getStoreData();
  }
};
</script>

<style lang="less" scoped>
.info_box{
  background: #fff;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
  h2{
    height: 50px;
    line-height: 50px;
    font-size: 18px;
    padding-left: 20px;
    // padding-left: 30px;
    // border: 1px solid #edf1f2;
  }
  .info{
    padding-left: 30px;
    position: relative;
    margin-bottom: 30px;
    /deep/ .el-input{
      display: inline;
    }
    .time{
      // width: 280px;
      /deep/ .el-input__inner{
        width: 180px;
      }
    }
    .full{
      /deep/ .el-input__inner{
        width: 80px;
      }
    }
    .full-item{
      margin-bottom: 10px;
    }
    .add{
      font-size: 24px;
      color: #67c23a;
      cursor: pointer;
      margin-left: 15px;
    }
    .mint{
      font-size: 24px;
      color: #fff;
      cursor: pointer;
      margin-left: 15px;
      background: #67c23a;
      border-radius: 50%;
    }
    /deep/ .el-row{
      margin-top: 15px;
    }
  }
  .button-box{
    padding-top: 20px;
    text-align: center;
    padding-bottom: 30px;
  }
}
</style>
