<template>
  <div class="detail">
    <div class="table-wrapper">
      <v-table ref="data_table" column-width-drag :is-horizontal-resize="true" style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee"
      row-click-color="#edf7ff" @on-custom-comp="customCompFunc"></v-table>
    </div>
    <!-- <div class="pagin-wrapper">
      <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-size="search.PageSize" :page-index="search.PageIndex" :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
      </v-pagination>
    </div> -->
  </div>
</template>

<script>
// import java from '@/utils/javaApiRequest';
import { formatDate } from '@/utils/date';
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      // billId: this.$route.query.id,
      tableData: JSON.parse(this.$route.query.billSettlement),
      columns: this.Columns(),
      // total: 0,
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
    customCompFunc(params) {
      if (params.type === 'seeOrderDetail') { // 查看详情
        this.$router.push('/order-control/settlement?id=' + params.rowData.settlementId);
      }
    },
    Columns() {
      // let _self = this;
      let columns = [
        // { width: 60, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome',
          title: '序号',
          width: 10,
          titleAlign: 'center',
          columnAlign: 'center',
          formatter: function(rowData, rowIndex, pagingIndex, field) {
            let index = rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          },
          isFrozen: true,
          isResize: true
        },
        { field: 'salesAmount', title: '销售金额', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'postageAmount', title: '运费', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'servicesAmount', title: '服务费', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'payAmount', title: '支付金额', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'preferentialAmount', title: '优惠金额', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'receivableAmount', title: '应收金额', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'startTime', title: '日结算账单', width: 200, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'option', title: '操作', width: 160, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operation-detail', isResize: true },
      ];
      for (let i = 0; i < columns.length; i++) {
        let item = columns[i];
        if (i <= 1) {
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
        if (item.field === 'startTime') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = formatDate(rowData[field]);
            if (value) {
              return value.slice(0, -8);
            } else {
              return '-';
            }
          };
        }
        // if (item.field === 'status') {
        //   item.formatter = function (rowData, rowIndex, pagingIndex, field) {
        //     let value = rowData[field];
        //     if (value === 2) {
        //       return '<span style="color:red">未结算</span>';
        //     } else if (value === 4) {
        //       return '<span style="color:red">已结算</span>';
        //     } else {
        //       return '-';
        //     }
        //   };
        // }
        if (item.field === 'receivableAmount' || item.field === 'salesAmount' || item.field === 'postageAmount' || item.field === 'servicesAmount' || item.field === 'payAmount' || item.field === 'preferentialAmount') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = '￥' + rowData[field].toFixed(2);
            if (value) {
              return '<span style="color:red">' + value + '</span>';
            } else {
              return '-';
            }
          };
        }
      }
      return columns;
    },
    // pageChange(pageIndex) {
    //   this.search.pageIndex = pageIndex;
    //   this.gettableData();
    // },
    // pageSizeChange(pageSize) {
    //   this.search.pageIndex = 1;
    //   this.search.pageSize = pageSize;
    //   this.gettableData();
    // },
    // gettableData() {
    //   java.get('/mall_manage_seller/settlement/findBillDetail?billId=' + this.billId).then(res => {
    //     console.log(res);
    //     if (res.status === 200 && res.data.resultCode === '0') {
    //       this.tableData = res.data.resultData;
    //     }
    //   });
    // },
  },
  created() {
    console.log(JSON.parse(this.$route.query.billSettlement));
    // this.gettableData();
  }
};
</script>

<style>

</style>
