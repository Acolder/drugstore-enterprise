<template>
  <div class="list">
    <!-- <div class="search-wrapper">
      <el-form :inline="true" :model="searchInfo" size="small" >
        <el-form-item label="订单号">
          <el-input v-model="searchInfo.orderId" placeholder="请输入商户名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="query" icon="el-icon-search">查 询</el-button>
          <el-button type="default" @click="exportList" icon="el-icon-share">导 出</el-button>
        </el-form-item>
      </el-form>
    </div> -->
    <div class="table-wrapper">
      <v-table ref="data_table" column-width-drag :row-height=50 :is-horizontal-resize="true" style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff" @on-custom-comp="customCompFunc"></v-table>
    </div>
    <!-- <div class="table-wrapper">
      <p class="title">操作信息</p>
      <p class="item">账单生成时间：2018-12-6 14:25</p>
      <p class="item">账单确认时间：2018-12-6 14:25</p>
      <p class="item">账单审核时间：2018-12-6 14:25</p>
      <p class="item">账单打款时间：2018-12-6 14:25</p>
      <p class="item">账单完成时间：2018-12-6 14:25</p>
      <p class="item">审核人：王某某</p>
      <p class="item">打款人：张某某</p>
    </div> -->
    <!-- <div class="pagin-wrapper">
      <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-size="searchInfo.pageSize" :page-index="searchInfo.pageIndex" :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
      </v-pagination>
    </div> -->
  </div>
</template>

<script>
import javaRequest from '@/utils/javaApiRequest';
import { formatDate } from '@/utils/date';
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      searchInfo: {
        // sellerName: '',
        // withdrawId: '',
        // mobile: '',
        // withdrawStatus: '',
        // pageNum: 1,
        // pageSize: 10,
        // orderBy: 'desc'
        // pageIndex: 1,
        // pageSize: 10,
        settlementId: this.$route.query.id, // id
        // orderId: ''
      },
      tableData: [],
      columns: this.getColumns(),
      // total: 0,
      auditoShow: false,
      pic: '',
      id: '',
      sellerUserId: ''
    };
  },
  watch: {
    'sidebarStatus': function (value, oldValue) {
      this.$refs['data_table'].resize();
    },
  },
  computed: {
    ...mapGetters([
      'sidebarStatus'
    ])
  },
  methods: {
    query() {
      this.getListData();
    },
    exportList() {
      // 22
    },
    // 自定义事件
    customCompFunc(params) {
      if (params.type === 'seeDetail') { // 查看详情
        this.$router.push('/order-control/orderDetail');
        sessionStorage.setItem('orderId', params.rowData.orderId);
      }
    },
    getColumns() {
      // let _self = this;
      let columns = [
        // { width: 60, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome',
          title: '序号',
          width: 20,
          titleAlign: 'center',
          columnAlign: 'center',
          formatter: function(rowData, rowIndex, pagingIndex, field) {
            let index = rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          },
          isFrozen: true,
          isResize: true
        },
        { field: 'orderId', title: '订单编号', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'orderPayment', title: '订单金额', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'foodShareFee', title: '平台费', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'orderPostage', title: '运费', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'createDate', title: '订单时间', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'option', title: '操作', width: 220, titleAlign: 'center', columnAlign: 'center', componentName: 'operation', isResize: true },
      ];
      for (let i = 0; i < columns.length; i++) {
        let item = columns[i];
        if (i < 1) {
          continue;
        }
        item.formatter = function(rowData, rowIndex, pagingIndex, field) {
          let value = rowData[field];
          if (value || value === 0) {
            return value;
          } else {
            return '-';
          }
        };
        if (item.field === 'createDate') {
          item.formatter = function(rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              return formatDate(value);
            } else {
              return '-';
            }
          };
        } else if (item.field === 'orderPayment' || item.field === 'foodShareFee' || item.field === 'orderPostage') {
          item.formatter = function(rowData, rowIndex, pageIndex, field) {
            let v = '￥' + rowData[field].toFixed(2);
            return `<span style='color:#f00'>${v}</span>` || '-';
          };
        }
        // else if (item.field === 'isOtc') {
        //   item.formatter = function (rowData, rowIndex, pagingIndex, field) { // 订单类型
        //     // let value = rowData[field];
        //     let value = rowData[field];
        //     // console.log(value);
        //     if (value === 1) {
        //       return '非处方';
        //     } else if (value === 2) {
        //       return `<span style='color:#f00'>处方</span>`;
        //     } else {
        //       return '-';
        //     }
        //   };
        // }
        // else if (item.field === 'logisticsType') {
        //   item.formatter = function (rowData, rowIndex, pagingIndex, field) { // 订单类型
        //     // let value = rowData[field];
        //     let value = rowData[field];
        //     let a = '';
        //     if (value) {
        //       switch (value) {
        //         case 'yunda':
        //           a = '韵达';
        //           break;
        //         case 'shunfeng':
        //           a = '顺丰';
        //           break;
        //         case 'huitongkuaidi':
        //           a = '百世汇通';
        //           break;
        //         case 'zhongtong':
        //           a = '中通';
        //           break;
        //         case 'yuantong':
        //           a = '圆通';
        //           break;
        //         case 'guotongkuaidi':
        //           a = '国通';
        //           break;
        //         case 'tianitan':
        //           a = '天天';
        //           break;
        //         case 'youshuwuliu':
        //           a = '优速';
        //           break;
        //         case 'kuaijiesudi':
        //           a = '快捷';
        //           break;
        //         case 'quanfengkuaidi':
        //           a = '全峰';
        //           break;
        //         case 'youzhengguonei':
        //           a = '邮政包裹';
        //           break;
        //         default:
        //           a = value;
        //       }
        //     } else {
        //       a = '-';
        //     }
        //     return a;
        //   };
        // } else
        // // 平台费
        // if (item.field === 'foodShareFee') {
        //   item.formatter = function (rowData, rowIndex, pagingIndex, field) {
        //     // let value = rowData[field];
        //     let value = rowData[field];
        //     if (value || value === 0) {
        //       return '￥' + value.toFixed(2);
        //     }
        //   };
        // }
      }
      return columns;
    },
    pageChange(pageIndex) {
      this.searchInfo.pageIndex = pageIndex;
      this.getListData();
    },
    pageSizeChange(pageSize) {
      this.searchInfo.pageIndex = 1;
      this.searchInfo.pageSize = pageSize;
      this.getListData();
    },
    getListData() {
      javaRequest.post('/mall_manage_seller/settlement/findSettlementDetail', this.searchInfo).then(res => {
        console.log(res);
        if (res.status === 200 && res.data.resultCode === '0') {
          console.log(1);
          this.tableData = res.data.resultData.orderDetail;
        }
      });
    }
  },
  created() {
    this.getListData();
  }
};
</script>

<style lang="less" scoped>
.title{
  font-size: 26px;
  padding: 10px 0;
}
.item{
  margin-top: 10px;
}
// .list{
//   width: 100%;
//   height: 100%;
//   background-color: #f6f8f8;
//   padding: 20px;
// }
</style>
