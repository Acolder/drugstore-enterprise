<template>
  <div class="detail">
    <div class="header list">
      <p class="subtitle">
        <span>当前订单状态：</span>
        <!-- <span>{{(orderDetailData.orderStatus === '配送中' && orderDetailData.orderTransport === '3') ? '待取货' : orderDetailData.orderStatus}}</span> -->
        <span>{{orderDetailData.orderStatus}}</span>
      </p>
    </div>
    <div class="mall-list list">
      <p class="subtitle">礼品列表</p>
      <v-table ref="detail_table" column-width-drag is-horizontal-resize style="width:100%" :columns="detailColumns"
      :table-data="orderDetailData.orderDetail" row-hover-color="#eee" row-click-color="#edf7ff"></v-table>
      <p class="sum-money">
        商品总金额：￥{{orderDetailData.prdouctSumMoney ? orderDetailData.prdouctSumMoney.toFixed(2) : orderDetailData.prdouctSumMoney}}
      </p>
    </div>
    <div class="list">
      <div class="pay con">
        <p class="subtitle">付款信息</p>
        <p>付款方式：<span v-if="orderDetailData.payinfoPlatorm">{{orderDetailData.payinfoPlatorm === 'alipay' ? '支付宝' : '微信'}}</span></p>
        <p>付款时间：{{orderDetailData.payTime}}</p>
        <p>商品总金额：￥{{orderDetailData.prdouctSumMoney ? orderDetailData.prdouctSumMoney.toFixed(2) : orderDetailData.prdouctSumMoney}}</p>
        <p>优惠券：{{orderDetailData.couponBasicInformation}}</p>
        <p>实付金额：{{orderDetailData.realPayment ? orderDetailData.realPayment.toFixed(2) : orderDetailData.realPayment}}</p>
      </div>
      <div class="white con"></div>
      <div class="invo con">
        <p class="subtitle">发票信息</p>
        <div v-if="orderDetailData.invoiceInfo">
          <p>发票类型：电子普通发票</p>
          <p>发票抬头：{{orderDetailData.invoiceInfo.invoiceType}}</p>
          <p v-if="orderDetailData.invoiceInfo.invoiceType === '个人'">个人姓名：{{orderDetailData.invoiceInfo.invoiceTitle}}</p>
          <div v-else>
            <p>公司名称：{{orderDetailData.invoiceInfo.invoiceTitle}}</p>
            <p>纳税号：{{orderDetailData.invoiceInfo.taxNum}}</p>
          </div>
          <p>收票邮箱：{{orderDetailData.invoiceInfo.email}}</p>
        </div>
        <div v-else>
          该订单无需开具发票
        </div>
      </div>
    </div>
    <div class="order-info list">
      <p class="subtitle">订单信息</p>
      <p>礼品数量：<span>{{orderDetailData.productSum}}</span></p>
      <p>礼包数量：<span>{{orderDetailData.presentSum}}</span></p>
      <p>订单编号：{{orderDetailData.orderId}}</p>
      <p>创建时间：{{orderDetailData.createDate}}</p>
    </div>

  </div>
</template>

<script>
import javaRequest from '@/utils/javaApiRequest';
import { formatDate } from '@/utils/date';
export default {
  data() {
    return {
      // searchDetail: {
      //   orderId: this.$route.query.id
      // },
      orderDetailData: '',
    };
  },
  computed: {
    //  商品信息
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
      // this.orderDetailData = '';
      let param = {
        orderId: this.$route.query.id,
      };
      javaRequest.post('/mall_manage_seller/back/queryOrderDetail', param).then(res => {
        console.log(res.data.resultData);
        if (res.status === 200 && res.data.resultCode === '0') {
          this.orderDetailData = res.data.resultData;
          this.orderDetailData.orderStatus = this.HandleOrder(this.orderDetailData);
          this.orderDetailData.createDate = formatDate(this.orderDetailData.createDate);
          this.orderDetailData.payTime = this.orderDetailData.payTime ? formatDate(this.orderDetailData.payTime) : '';
        }
      });
    },
    // 处理药店订单状态
    HandleOrder(detail) {
      if (detail.orderStatus === '0') {
        return '已取消';
      } else if (detail.orderStatus === '10') {
        return '待付款';
      } else if (detail.orderStatus === '20') {
        return '待领取';
      } else if (detail.orderStatus === '30') {
        return '待提货';
      } else if (detail.orderStatus === '40') {
        return '已提货';
      } else if (detail.orderStatus === '50') {
        return '已过期';
      }
    },
  },
  created() {
    this.getDetailData();
  }
};
</script>

<style lang="less" scoped>
.detail{
  padding-right: 20px;
  padding-bottom: 100px;
  .list{
    background: #fff;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .05);
    padding: 0px 20px 0 30px;
    margin-bottom: 30px;
    overflow: hidden;
    .sum-money{
      line-height: 42px;
      text-align:right;
      font-size:18px;
    }
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
      height: 216px;
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
    // background: #f3f3f3;
    // padding-left: 30px;
    // margin-bottom: 10px;
  // }
  .order-operation {
    padding: 0 20px 20px 30px;
  }
}
</style>

