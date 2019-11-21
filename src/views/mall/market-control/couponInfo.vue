<template>
  <div class="couponInfo">
    <div class="info_box">
      <el-form :model="editData" :inline="true" :rules="rules" ref="editValidateForm" label-width="88px" size="small">
        <h2 class="item-header">基础信息</h2>
        <div class="info">
          <el-row>
            <el-col :span="12">
              <el-form-item label="名称:" prop="couponName">
                <el-input v-model="editData.couponName" placeholder="请输入优惠券名称（10个字以内）" maxlength="10" :disabled="disabledAvtive"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="规则描述:" prop="ruleDescription">
                <el-input v-model="editData.ruleDescription" placeholder="请输入优惠券规则描述" :disabled="disabledAvtive"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="使用时间:" prop="useTimeType">
                <el-select class="el-width1" v-model="editData.useTimeType" size='small' :disabled="disabledAvtive">
                  <el-option label="起止时间" :value="1"></el-option>
                  <el-option label="有效时间" :value="2"></el-option>
                </el-select>
              </el-form-item>
              <div v-if="editData.useTimeType === 2" style="width:370px;text-align:right">
                <el-form-item prop="effectiveDate" class="time">
                  <el-input v-model="editData.effectiveDate" placeholder="请输入有效时间" :disabled="disabledAvtive"></el-input>
                  <span>天</span>
                </el-form-item>
              </div>
              <div v-else style="width:370px;text-align:right">
              <el-form-item prop="endDate" class="time">
                <el-date-picker class="tiem_data" v-model="editData.startDate" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="开始日期" :disabled="disabledAvtive"></el-date-picker>至
                <el-date-picker class="tiem_data" v-model="editData.endDate" format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="date" placeholder="结束日期" :disabled="disabledAvtive"></el-date-picker>
              </el-form-item>
              </div>
            </el-col>
            <el-col :span="12">
              <el-form-item label="可用群体:" prop="accessibleGroup">
                <el-select class="el-width1" v-model="editData.accessibleGroup" size='small' :disabled="disabledAvtive">
                  <el-option label="全部" :value="1"></el-option>
                  <el-option label="优惠券创建后的新用户" :value="2"></el-option>
                  <el-option label="时间段内的新用户" :value="3"></el-option>
                </el-select>
              </el-form-item>
              <div style="width:370px;text-align:right">
              <el-form-item prop="newUsersEndDate" v-if="editData.accessibleGroup === 3" class="time">
                <el-date-picker class="tiem_data" v-model="editData.newUsersStartDate" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="开始日期" :disabled="disabledAvtive"></el-date-picker>至
                <el-date-picker class="tiem_data" v-model="editData.newUsersEndDate" format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="date" placeholder="结束日期" :disabled="disabledAvtive"></el-date-picker>
              </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-row v-if="!isShop">
            <el-col :span="12">
              <el-form-item label="商品范围:" prop="useTimeType">
                <div class="goods" v-for="(item, index) in editData.commodityScope" :key="index">
                  <i class="el-icon-close goods-close" @click="goodsClose(index)" v-if="!disabledAvtive"></i>
                  <span>{{item.productName}}</span>
                </div>
                <el-button class="el-icon-plus" type="success" @click="AddGoods" v-if="!disabledAvtive">选择商品</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="商品详情页是否可以直接领取:" prop="isReceive" label-width="220px">
                <el-select class="el-width1" v-model="editData.isReceive" size='small' :disabled="disabledAvtive">
                  <el-option label="是" :value="1"></el-option>
                  <el-option label="否" :value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <h2 class="item-header">券面信息</h2>
        <div class="btn item-header" v-if="!isEdit">
          <el-button type="success" @click="add" class="el-icon-plus">新增券面</el-button>
        </div>
        <div class="info" v-for="(item,index) in editData.securitiesInformationJson" :key="index">
          <i class="el-icon-close close" @click="closeDelate(index)" v-if="!isEdit"></i>
          <el-row>
            <el-col :span="24">
              <el-form-item label="优惠金额:" :prop="'securitiesInformationJson.' + index + '.preferentialAmount'" :rules="{ required: true, validator: validMoney, trigger: 'blur'}">
                <el-input v-model="item.preferentialAmount" placeholder="请输入优惠金额" :disabled="disabledAvtive"></el-input>
                <span>元</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="使用门槛:" :prop="'securitiesInformationJson.' + index + '.useTheThreshold'" :rules="{ required: true, validator: validMoney, trigger: 'blur'}">
                <span>满</span>
                <el-input v-model="item.useTheThreshold" placeholder="门槛需高于金额" :disabled="disabledAvtive"></el-input>
                <span>元</span>
              </el-form-item>
            </el-col>
          </el-row>
           <el-row>
            <el-col :span="24">
              <el-form-item label="发行数量:" :prop="'securitiesInformationJson.' + index + '.distributionQuantity'" :rules="{ required: true, validator: validNumber, trigger: 'blur'}">
                <el-input v-model="item.distributionQuantity" placeholder="请输入发型数量"></el-input>
                <span>张</span>
                <span style="color:#ccc">(优惠券创建后，发行量只能增加不能减少，请谨慎设置)</span>
              </el-form-item>
            </el-col>
          </el-row>
           <el-row>
            <el-col :span="24">
              <el-form-item label="每人限领:" :prop="'securitiesInformationJson.' + index + '.limitCollarPerPerson'" :rules="{ required: true,  validator: validNumber, trigger: 'blur'}">
                <el-input v-model="item.limitCollarPerPerson" placeholder="请输入限领数量" :disabled="disabledAvtive"></el-input>
                <span>张</span>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="button-box">
          <el-button type="warning" @click="submit" v-if="!isEdit">确认创建</el-button>
          <el-button type="warning" @click="submit" v-else>确认修改</el-button>
        </div>
      </el-form>
    </div>
    <!-- 选择商品弹窗 -->
    <el-dialog title="选择商品" :visible.sync="goodsShow" :center='true' :modal-append-to-body="false" width="1600px">
      <goods @getGoods="getGoods" :goodsData="editData.commodityScope"></goods>
    </el-dialog>
  </div>
</template>

<script>
import javaAjax from '@/utils/javaApiRequest';
import goods from './outGoodsList';
import { formatDate } from '@/utils/date';
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      goodsShow: false,
      // outGoodsListUrl: '',
      disabledAvtive: false,
      editData: {
        couponName: '', // 优惠券名称
        ruleDescription: '', // 规则描述
        useTimeType: 1, // 使用时间类型1.起止时间 2.有效时间
        effectiveDate: '', // 有效时间
        startDate: '', // 起时间
        endDate: '', // 止时间
        accessibleGroup: 1, // 可用群体1.全部 2.优惠券创建后的新用户 3.时间段内的新用户
        newUsersStartDate: '',
        newUsersEndDate: '',
        couponType: this.isShop ? 1 : 2, // 优惠券类型1.商铺 2.商品
        // sellerUserId: '', // 商户ID
        commodityScope: [], // 商品
        isReceive: this.isShop ? '' : 2, // 商品详情页是否直接领取1.是 2.否
        securitiesInformationJson: [
          {
            preferentialAmount: '', // 券面金额
            useTheThreshold: '', // 使用门槛
            distributionQuantity: '', // 发行数量
            limitCollarPerPerson: '', // 限领数量
          }
        ], // 券面信息列表
      },
      rules: {
        couponName: [{ required: true, message: '请输入优惠券名称', trigger: 'blur' }],
        effectiveDate: [{ required: true, validator: this.validNumber, trigger: 'blur' }],
        useTimeType: [{ required: true, message: '请选择起止时间', trigger: 'change' }],
        endDate: [{ required: true, validator: this.validEnd, trigger: 'change' }],
        newUsersEndDate: [{ required: true, validator: this.validNew, trigger: 'change' }],
        accessibleGroup: [{ required: true, message: '请选择可用群体', trigger: 'change' }],
        product: [{ required: true, message: '请选择商品', trigger: 'blur' }],
        isReceive: [{ required: true, message: '请选择是否在详情页领取', trigger: 'change' }],
        // accountHolder: [{ required: true, message: '请输入开户人', trigger: 'blur' }],
        // openingBank: [{ required: true, message: '请选择开户行', trigger: 'blur' }],
        // bankCardNumber: [{ required: true, message: '请输入银行卡号', trigger: 'blur' }],
        // legalPerson: [{ required: true, message: '请输入商户法人', trigger: 'blur' }],
        // idCard: [{ required: true, message: '请输入法人身份证号', trigger: 'blur' }],
        // contact: [{ required: true, message: '请输入法人联系方式', trigger: 'blur' }],
        // businessLicense: [{ required: true, message: '请选择营业执照', trigger: 'blur' }],
        // drugLicenses: [{ required: true, message: '请选择经营许可证', trigger: 'blur' }],
        // idCardPhoto: [{ required: true, message: '请选择法人身份证照', trigger: 'blur' }],
      }
    };
  },
  props: {
    isShop: Boolean,
    isEdit: Boolean
  },
  computed: {
    ...mapGetters([
      'visitedViews',
    ]),
  },
  components: {
    'goods': goods
  },
  watch: {
    'editData.effectiveDate': function() {
      this.editData.startDate = '';
      this.editData.endDate = '';
    },
    'editData.startDate': function() {
      this.editData.effectiveDate = '';
    },
    'editData.accessibleGroup': function() {
      if (this.editData.accessibleGroup !== 3) {
        this.editData.newUsersStartDate = '';
        this.editData.newUsersEndDate = '';
      }
    }
  },
  methods: {
    // 新用户时间
    isvalidNew(str) {
      if (str > this.editData.newUsersStartDate) {
        return true;
      } else {
        return false;
      }
    },
    validNew(rule, value, callback) {
      if (!value) {
        callback(new Error('请选择完整的起止时间'));
      } else if (!this.isvalidNew(value)) {
        callback(new Error('结束时间必须大于开始时间'));
      } else {
        callback();
      }
    },
    // 起止时间
    isvalidEnd(str) {
      if (str > this.editData.startDate && str > formatDate(new Date().getTime())) {
        return true;
      } else {
        return false;
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
    // 正整数正则
    isvalidNumber(str) {
      const reg = /^[1-9]\d*$/;
      return reg.test(str);
    },
    validNumber(rule, value, callback) {
      if (!value) {
        callback(new Error('请输入正整数'));
      } else if (!this.isvalidNumber(value)) {
        callback(new Error('请输入正整数'));
      } else {
        callback();
      }
    },
    // 金额正则
    isvalidmoney(str) {
      const reg = /^[0-9]+([.]{1}[0-9]{1,2})?$/;
      return reg.test(str);
    },
    validMoney(rule, value, callback) {
      if (!value) {
        callback(new Error('请输入金额'));
      } else if (!this.isvalidmoney(value)) {
        callback(new Error('请输入正确的最多两位小数的金额'));
      } else {
        callback();
      }
    },
    submit() {
      this.$refs['editValidateForm'].validate((valid) => {
        if (valid) {
          let url = this.isEdit ? '/mall_manage_seller/back/coupon/updateCoupon' : '/mall_manage_seller/back/coupon/addCouponBasicInformation';
          javaAjax.post(url, this.editData).then((res) => {
            // console.log(res);
            if (res.status === 200 && res.data.resultCode === '0') {
              this.$message.success(res.data.msg);
              let currentName = this.$route.name;
              let currentTab = this.visitedViews.find((x) => x.name === currentName);
              this.$store.dispatch('delVisitedViews', currentTab).then((res) => {
                this.$router.push('/market-control/list');
              });
            }
          });
        }
      });
    },
    // 新增券面
    add() {
      this.editData.securitiesInformationJson.push({
        preferentialAmount: '', // 券面金额
        useTheThreshold: '', // 使用门槛
        distributionQuantity: '', // 发行数量
        limitCollarPerPerson: '', // 限领数量
      });
    },
    // 删除券面
    closeDelate(index) {
      this.$confirm('此操作将执行删除操作, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.editData.securitiesInformationJson.length > 1) {
          this.editData.securitiesInformationJson.splice(index, 1);
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        } else {
          this.$message({
            type: 'warning',
            message: '已经是最后一个了!'
          });
        }
      });
    },
    // 添加商品按钮
    AddGoods() {
      this.goodsShow = true;
    },
    // 获取优惠商品
    getGoods(data) {
      // console.log(data);
      this.goodsShow = false;
      let a = [];
      a = data.map(item => {
        return {
          productId: item.po.productId.toString(),
          productName: item.po.productName
        };
      });
      this.editData.commodityScope = this.editData.commodityScope.concat(a);
    },
    // 删除商品
    goodsClose(index) {
      this.editData.commodityScope.splice(index, 1);
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
    if (this.isEdit) {
      this.disabledAvtive = true;
      let ids = {
        couponId: this.$route.query.id,
        securitiesInformationId: this.$route.query.secuId
      };
      this.getDetail(ids);
    }
  }
};
</script>

<style lang="less" scoped>
.couponInfo{
  // background: #fff;
}
.info_box{
  .goods{
    display: inline-block;
    position: relative;
    padding: 5px 8px;
    border: 1px solid #edf1f2;
    border-radius: 10px;
    margin-right: 15px;
    background: #f6f8f8;
    &:hover{
      color: #409EFF;
      cursor: pointer;
      .goods-close{
        display: block
      }
    }
    .goods-close{
      position: absolute;
      top: 2px;
      right: 2px;
      display: none;
      &:hover{
        color: #409EFF;
        cursor: pointer;
      }
    }
  }
  h2{
    height: 50px;
    line-height: 50px;
    font-size: 18px;
    // box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
    // background: #f0f3f4;
    padding-left: 30px;
    // border: 1px solid #edf1f2;
    background: #fff;
  }
  .btn{
    background: #fff;
    padding: 15px 30px;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
    // border: 1px solid #dee5e7;
    text-align: right;
    border-top: none;
  }
  .info{
    padding: 20px 60px;
    // background: #cacaca;
    // box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
    background: #fff;
    position: relative;
    // margin-top: 15px;
    margin-bottom: 30px;
    /deep/ .el-input{
      display: inline;
    }
    .time{
      width: 280px;
      .tiem_data{
        width: 130px;
      }
      /deep/ .el-input__inner{
        width: 130px;
      }
    }
    .close{
      position: absolute;
      right: 20px;
      top: 20px;
      &:hover{
        color: #409EFF;
        cursor: pointer;
      }
    }
    /deep/ .el-row{
      margin-top: 15px;
    }
    /deep/ .el-input__inner{
      width: 270px;
    }
    .position{
      width: 320px;
      height: 32px;
      background: #fff;
      line-height: 32px;
      cursor: pointer;
      padding-left: 15px;
      border-radius: 4px;
      border: 1px solid #dcdfe6;
      color: #606266;
      .ple{
        color: #ccc;
      }
      i{
        float: right;
        margin-right: 10px;
        margin-top: 8px;
      }
    }
  }
  .region{
    /deep/ .el-input__inner{
      width: 104px;
    }
  }
  .button-box{
    padding-top: 20px;
    text-align: center;
    padding-bottom: 100px;
  }
}
</style>
