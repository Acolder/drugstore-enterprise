<template>
  <div class="refund">
    <p class="text" @click="submit">请选择退款商品</p>  <!-- :select-change="selectChange" -->
      <v-table ref="data_table" column-width-drag is-horizontal-resize style="width:100%" :columns="refundColumns" :table-data="orderDetail" row-hover-color="#eee" row-click-color="#edf7ff" :select-change="selectChange" :select-all="selectALL" :select-group-change="selectGroupChange" @on-custom-comp="customCompFunc"></v-table>
      <p class="sum-money">共{{num}}件商品，合计金额￥{{sumMoney ? Number(sumMoney).toFixed(2) : sumMoney}}元</p>
      <el-form ref="nightForm" class="wrap">
        <el-form-item label="退款原因：">
          <div>
            <el-radio v-model="radio" label="商品缺货">商品缺货</el-radio>
            <el-radio v-model="radio" label="管制药品限量买">管制药品限量买</el-radio>
            <el-radio v-model="radio" label="与买家协商一致">与买家协商一致</el-radio>
            <el-radio v-model="radio" label="不在配送范围">不在配送范围</el-radio>
          </div>
          <div class="input-box">
            <el-input placeholder="请输入其它原因" v-model="value"></el-input>
          </div>
        </el-form-item>
      </el-form>
      <p class="text"><span>退款金额：</span><span class="money">￥{{money}}元</span></p>
  </div>
</template>

<script>
import javaRequest from '@/utils/javaApiRequest';
export default {
  data() {
    return {
      goods: [], // 选中商品
      radio: '', // 原因
      value: '', // 原因
      orderDetail: null,
      // isDisab: 'table-operation-refundGoods',
      money: 0.00, // 选中商品金额合计
      sumMoney: 0, // 商品金额合计
      num: 0 // 商品件数合计
    };
  },
  watch: {
    value: function () {
      this.radio = '';
    }
  },
  computed: {
    refundColumns() {
      // let _self = this;
      let columns = [
        { width: 60, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        { field: 'food_name', title: '药品名称', width: 140, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'url', title: '药品图片', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'origin_food_price', title: '药品金额', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'count', title: '药品数量', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true, componentName: 'table-operation-refundGoods' },
        // { field: 'productSpecification', title: '药品规格', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'productDosageForm', title: '药品剂型', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'productProducingPlace', title: '生产厂商', width: 120, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
      ];
      for (let i = 0; i < columns.length; i++) {
        let item = columns[i];
        if (i === 0) {
          continue;
        }
        item.formatter = function (rowData, rowIndex, pagingIndex, field) {
          let value = rowData[field];
          if (value) {
            return value;
          } else {
            return '-';
          }
        };
        if (item.field === 'url') {
          let defaultImg = 'https://uploads.kangmei.com.cn/Files/20180627/fwkomaog.xzb.jpg';
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              return `<img src="${value}" alt="" width="40px" height="35px" style="margin-top:5px;" />`;
            } else {
              return `<img src="${defaultImg}" alt="" width="40px" height="35px" style="margin-top:5px;" />`;
            }
          };
        }
        if (item.field === 'oldPrice') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (rowData['productType'] === 6) {
              return '0.00';
            } else {
              return value;
            }
          };
        }
        // if (item.field === 'quantity') {
        //   item.formatter = function (rowData, rowIndex, pagingIndex, field) {
        //     let value = rowData[field];
        //     return `<div>2<el-input-number size="mini" v-model="${value}"></el-input-number></div>`;
        //   };
        // }
      }
      return columns;
    },
  },
  props: {
    // sumMoney: Number,
    orderId: String
  },
  methods: {
    customCompFunc(param) {
      if (param.type === 'countChange') {
        let obj = {
          app_food_code: param.rowData.app_food_code,
          count: param.rowData.count,
          food_name: param.rowData.food_name,
          refund_price: param.rowData.refund_price * param.rowData.count
        };
        if (this.goods.length) {
          for (let i = 0; i < this.goods.length; i++) {
            if (this.goods[i].app_food_code === obj.app_food_code) {
              this.goods[i] = obj;
            }
          }
        }

        // 判断是否剩一件
        let a = this.goods.map(res => {
          return res.count;
        });
        console.log(a);
        let b = this.orderDetail.map(res => {
          return res.count;
        });
        if (this.goods.length === this.orderDetail.length && (a.toString() === b.toString())) {
          this.$message.warning('部分退款请最少留一件商品');
          return;
        }
        let s = this.goods.map(res => {
          return res.refund_price;
        });
        this.money = this.getSum(s);
      }
    },
    getSum(ar) {
      let arr = ar;
      let s = 0;
      arr.forEach(function(val, idx, arr) {
        s += val; }, 0);

      return s;

    },
    selectALL(selection) {

      this.goods = selection.map(res => {
        return {
          app_food_code: res.app_food_code,
          count: res.count,
          food_name: res.food_name,
          refund_price: res.refund_price * res.count
        };
      });
      let s = this.goods.map(res => {
        return res.refund_price;
      });
      this.money = this.getSum(s);

      // 判断是否剩一件
      let a = this.goods.map(res => {
        return res.count;
      });
      console.log(a);
      let b = this.orderDetail.map(res => {
        return res.count;
      });
      if (this.goods.length === this.orderDetail.length && (a.toString() === b.toString())) {
        this.$message.warning('部分退款请最少留一件商品');
        return;
      }
    },
    selectChange(selection, rowData) {
      this.goods = selection.map(res => {
        return {
          app_food_code: res.app_food_code,
          count: res.count,
          food_name: res.food_name,
          refund_price: res.refund_price * res.count
        };
      });
      let s = this.goods.map(res => {
        return res.refund_price;
      });
      this.money = this.getSum(s);
      // 判断是否剩一件
      let a = this.goods.map(res => {
        return res.count;
      });
      console.log(a);
      let b = this.orderDetail.map(res => {
        return res.count;
      });
      if (this.goods.length === this.orderDetail.length && (a.toString() === b.toString())) {
        this.$message.warning('部分退款请最少留一件商品');
        return;
      }
    },
    selectGroupChange(selection) {
      this.goods = selection.map(res => {
        return {
          app_food_code: res.app_food_code,
          count: res.count,
          food_name: res.food_name,
          refund_price: res.refund_price * res.count
        };
      });
      console.log(this.goods);
      let s = this.goods.map(res => {
        return res.refund_price;
      });
      this.money = this.getSum(s);
    },
    submit() {
      console.log(this.goods);
      let param = {
        orderId: this.orderId,
        reason: this.value ? this.value : this.radio,
        foodData: this.goods
      };
      if (param.foodData.length === 0) {
        this.$message.warning('请选择退款商品');
        return;
      }
      if (param.reason === '') {
        this.$message.warning('请选择退款原因');
        return;
      }
      let a = param.foodData.map(res => {
        return res.count;
      });
      let b = this.orderDetail.map(res => {
        return res.count;
      });
      if (param.foodData.length === this.orderDetail.length && (a.toString() === b.toString())) {
        this.$message.warning('部分退款请最少留一件商品');
        return;
      }

      // this.$emit('Updatarefund');
      javaRequest.post('/mall_manage_seller/back/order/applyPartRefund', param).then(res => {
        console.log(res);
        if (res.status === 200 && res.data.resultCode === '0') {
          let msg = res.data.msg;
          this.$message.success(msg);
          this.$emit('Updatarefund');
        }
      });
    },
    getData() {
      let param = {
        orderId: this.orderId
      };
      javaRequest.post('/mall_manage_seller/back/order/getPartRefundFoods', param).then(res => {
        console.log(res);
        if (res.status === 200 && res.data.resultCode === '0') {
          this.orderDetail = res.data.resultData.data;
          // this.orderDetail.map(relust => {
          //   this.$set(relust, 'disabled', false);
          //   return relust;
          // });
          let sum = this.orderDetail.map(relust => {
            return relust.count * relust.origin_food_price;
          });
          let num = this.orderDetail.map(relust => {
            return relust.count;
          });
          this.sumMoney = this.getSum(sum);
          this.num = this.getSum(num);
          // this.$set(this.orderDetail[0], '_disabled', true);
        }
      });
    }
  },
  created() {
    console.log('aaa');
    this.getData();
  }
};
</script>

<style scoped lang="less">
  .text{
    padding: 12px 0;
    .money{
      color: #f00;
      font-size: 18px;
    }
  }
  .sum-money{
    text-align: right;
    padding: 6px 0;
  }
  .input-box{
    width: 500px;
    padding-left: 80px;
    padding-top: 10px;
  }
</style>
