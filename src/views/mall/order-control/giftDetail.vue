<template>
  <div class="detail">
    <div class="header list">
      <p class="subtitle">
        <span>当前礼包状态：</span>
        <span>{{orderDetailData.orderStatus}}</span>
      </p>
    </div>
    <div class="mall-list list">
      <p class="subtitle">礼品列表</p>
      <v-table ref="detail_table" column-width-drag is-horizontal-resize style="width:100%" :columns="detailColumns"
      :table-data="orderDetailData.orderDetail" row-hover-color="#eee" row-click-color="#edf7ff"></v-table>
      <!-- <p style="text-align:right;padding-top:15px;font-size:18px;">
        商品总金额：￥{{orderDetailData.prdouctSumMoney ? orderDetailData.prdouctSumMoney.toFixed(2) : orderDetailData.prdouctSumMoney}}
      </p> -->
    </div>
    <div class="list">
      <div class="pay con">
        <p class="subtitle">礼包信息</p>
        <p>礼品数量：<span>{{orderDetailData.productSum}}</span></p>
        <p>礼包编号：{{orderDetailData.orderId}}</p>
        <p>订单编号：{{orderDetailData.parentOrderId}}</p>
        <p>创建时间：{{orderDetailData.createDate}}</p>
      </div>
      <div class="white con"></div>
      <div class="invo con">
        <p class="subtitle">提货信息</p>
        <div>
          <p>手机号：{{orderDetailData.addressPo ? orderDetailData.addressPo.addressPhone ? orderDetailData.addressPo.addressPhone : '---' : '---'}}</p>
          <p>提货码：{{orderDetailData.orderStatus === '已提货' ? orderDetailData.extractCode : '---'}}</p>
          <p>提货门店：{{orderDetailData.seller ? orderDetailData.seller.sellerName : '---'}}</p>
          <p>提货时间：{{orderDetailData.extractDate ? orderDetailData.extractDate: '---'}}</p>
        </div>
      </div>
    </div>
    <div class="mall-list list" v-show="orderDetailData.orderStatus === '待提货'">
      <p class="subtitle">操作</p>
      <div class="btn">
        <el-button  type="warning" @click="query">确认兑换</el-button>
      </div>
    </div>
    <el-dialog
      title="确认兑换"
      :visible.sync="dialogVisible"
      width="500px"
      @close="handleClose"
      :center='true'
      :modal-append-to-body="false" >
      <div>
        <el-input v-model="cood" placeholder="请输入提货码"></el-input>
        <p v-show="coodError" class="error">提货码错误，不可兑换礼品!</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="success" @click="queryCood">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import javaRequest from '@/utils/javaApiRequest';
import { formatDate } from '@/utils/date';
export default {
  data() {
    return {
      orderDetailData: {},
      dialogVisible: false,
      cood: '',
      coodError: false
    };
  },
  computed: {
    //  礼品列表
    detailColumns() {
      // let _self = this;
      let columns = [
        {
          field: 'custome', title: '序号', width: 10, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = rowIndex + 1;
            return index;
          }, isFrozen: true, isResize: true
        },
        { field: 'productName', title: '商品名称', width: 140, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'productMainImage', title: '商品图片', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'price', title: '商品金额', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'quantity', title: '商品数量', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'productSpecification', title: '商品规格', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'productDosageForm', title: '药品剂型', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'productProducingPlace', title: '生产厂商', width: 120, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
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
        if (item.field === 'productMainImage') {
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
      }
      return columns;
    },
  },
  methods: {
    // 获取订单详情数据
    getDetailData() {
      let param = {
        orderId: this.$route.query.id
      };
      // console.log(param);
      javaRequest.post('/mall_manage_seller/back/queryPresentDetail', param).then(res => {
        console.log(res.data.resultData);
        if (res.status === 200 && res.data.resultCode === '0') {
          this.orderDetailData = res.data.resultData;
          this.orderDetailData.orderStatus = this.HandleOrder(this.orderDetailData);
          this.orderDetailData.createDate = formatDate(this.orderDetailData.createDate);
          this.orderDetailData.extractDate = this.orderDetailData.extractDate ? formatDate(this.orderDetailData.extractDate) : '';
        }
      });
    },
    // 处理状态
    HandleOrder(detail) {
      if (detail.orderStatus === '50') {
        return '已过期';
      } else if (detail.orderStatus === '10') {
        return '待付款';
      } else if (detail.orderStatus === '20') {
        return '待领取';
      } else if (detail.orderStatus === '30') {
        return '待提货';
      } else if (detail.orderStatus === '40') {
        return '已提货';
      } else if (detail.orderStatus === '0') {
        return '已取消';
      }
    },
    query() {
      this.dialogVisible = true;
    },
    handleClose() {
      this.cood = '';
      this.coodError = false;
    },
    queryCood() {
      let param = {
        orderId: this.$route.query.id,
        extractCode: this.cood
      };
      console.log(param);
      javaRequest.post('/mall_manage_seller/back/pickUpPresent', param).then(res => {
        console.log(res.data);
        if (res.status === 200 && res.data.resultCode === '0') {
          this.dialogVisible = false;
          let msg = res.data.msg;
          this.$message.success(msg);
          this.getDetailData();
        } else {
          this.coodError = true;
        }
      });
    }
  },
  created() {
    this.getDetailData();
  }
};
</script>

<style lang="less" scoped>
.btn{
  text-align: center;
  padding-bottom: 20px;
}
.error{
  color: #f00;
}
.detail{
  padding-right: 20px;
  padding-bottom: 100px;
  .list{
    background: #fff;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .05);
    padding: 0 20px 0 30px;
    margin-bottom: 30px;
    overflow: hidden;
    .subtitle{
      font-size:18px;
      font-weight: 900;
      line-height: 42px;
    }
    p{
      line-height: 35px;
    }
    img{
      width: 100px;
      height: 120px;
      margin-right: 10px;
    }
    .con{
      float: left;
    }
    .pay{
      margin-right: 500px;
    }
    .white{
      width: 15px;
      background-color: #f6f8f8;
      height: 185px;
    }
    .invo{
      margin-left: 30px;
    }
  }
  .header{
    height: 62px;
    width: 100%;
    .subtitle{
      line-height: 62px;
    }
  }
  .button-list{
    width: 800px;
    margin: 0 auto;
    display: flex;
    justify-content: space-around;
    margin-top: 30px;
  }
  // .info{
    // background: #f3f3f3;
    // padding-left: 30px;
    // margin-bottom: 10px;
  // }
  // .mall-list{
  //   // background: #f3f3f3;
  //   margin-bottom: 10px;
  //   padding-bottom: 15px;
  // }
  .order-operation {
    padding: 0 20px 20px 30px;
  }
}
</style>

