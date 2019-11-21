<template>
  <div class="info">
    <div v-if="ispartRefund === 2">
      <p class="subtitle">退款信息</p>
      <p>{{refundDetail.createDate}} &nbsp;&nbsp;用户申请{{refundDetail.refundType === '0' ? '全部' : '部分'}}商品退款，退款金额{{refundDetail.money}} <span class="see" @click="seeGoods">查看退款商品</span></p>
      <p class="reason">理由：{{refundDetail.reason}}</p>
      <p v-if="refundDetail.notifyType !== 'apply' && refundDetail.notifyType !== 'part'">{{refundDetail.modifyDate}} &nbsp;&nbsp;{{refundDetail.notifyType === 'agree' ? '商户同意退款' : refundDetail.notifyType === 'reject' ? '商户拒绝退款' : refundDetail.notifyType === 'cancelRefund' ? '用户取消退款申请': ''}}</p>
    </div>
    <div v-else>
      <p class="subtitle">退款信息</p>
      <!-- <p>退款状态：退款中</p> -->
      <p>退款金额：￥{{refundDetail.money}}</p>
      <p>退款原因：{{refundDetail.reason}}</p>
      <p>创建时间：{{refundDetail.createDate}}</p>
      <p class="see" @click="seeGoods">查看退款商品</p>
    </div>
    <el-dialog title="退款商品" custom-class="delivered" :visible.sync="goodsShow" :center='true' :modal-append-to-body="false" width="650px">
      <v-table ref="data_table" column-width-drag is-horizontal-resize style="width:100%" :columns="columns" :table-data="goodsDetail" row-hover-color="#eee" row-click-color="#edf7ff"></v-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="warning" @click="goodsShow = false">确 定</el-button>
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
      refundDetail: '',
      goodsDetail: '',
      goodsShow: false,
    };
  },
  props: {
    orderId: String,
    ispartRefund: Number
  },
  computed: {
    columns() {
      let columns = [
        // { width: 60, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        { field: 'foodName', title: '药品名称', width: 140, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'url', title: '药品图片', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'refundPrice', title: '药品金额', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'count', title: '药品数量', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'productSpecification', title: '药品规格', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
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
      }
      return columns;
    }
  },
  methods: {
    getData() {
      let param = {
        orderId: this.orderId
      };
      console.log(param, '执行了');
      javaRequest.post('/mall_manage_seller/back/order/getPartRefundFoodsLocal', param).then(res => {
        console.log('bbb');
        console.log(res);
        if (res.status === 200 && res.data.resultCode === '0') {
          this.refundDetail = res.data.resultData ? res.data.resultData.mtRefundPo : '';
          this.goodsDetail = res.data.resultData ? res.data.resultData.mtRefundDetail : '';
          if (this.refundDetail) {
            this.refundDetail.modifyDate = this.refundDetail.modifyDate ? formatDate(this.refundDetail.modifyDate) : this.refundDetail.modifyDate;
            this.refundDetail.createDate = this.refundDetail.createDate ? formatDate(this.refundDetail.createDate) : this.refundDetail.createDate;
          }
          // this.refundDetail.notifyType = this.refundDetail.notifyType === 'apply' ? '全部' : '部分';
          // console.log(this.refundDetail);
        }
      });
    },
    seeGoods() {
      this.goodsShow = true;
    }
  },
  created() {
    if (this.orderId) {
      this.getData();
    }
    setTimeout(() => {
      console.log(this.ispartRefund, 11);
    }, 1000);
  }
};
</script>

<style scoped lang="less">
.info{
  .subtitle{
      font-size:18px;
      font-weight: 900;
      line-height: 45px;
    }
  p{
      line-height: 30px;
    }
  .see{
    color: #0099FF;
    font-weight: 900;
    cursor: pointer;
  }
  .reason{
    padding-left: 150px;
  }
}
</style>
