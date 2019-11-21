<template>
  <div class="bill">
    <div class="search-wrapper">
      <el-form :inline="true" :model="search" size="small" ref="searchData">
        <!-- <el-form-item label="结算单号:">
          <el-input v-model="search.settlementId" placeholder="请输入结算单号" clearable></el-input>
        </el-form-item>
        <el-form-item label="日期范围:" class="commonItem startTime">
          <el-date-picker v-model="search.start" align="right" type="date" placeholder="选择开始日期" :picker-options="pickerOptions"
            format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss" style="width:180px">
          </el-date-picker>
          至
          <el-date-picker v-model="search.end" align="right" type="date" placeholder="选择结束日期" :picker-options="pickerOptions2"
            format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width:180px">
          </el-date-picker>
          <p style="color:red" v-if="errorShow">结束时间必须大于开始时间</p>
            <el-date-picker v-model="orderSearch.createStart" type="datetime" placeholder="选择日期时间"></el-date-picker>
        </el-form-item> -->
        <el-form-item label="状态:" class="commonItem">
          <el-select v-model="search.status" placeholder="请选择" clearable >
            <!-- <el-option label="全部" :value='0'></el-option> -->
            <el-option label="已结算" :value='1'></el-option>
            <el-option label="未结算" :value='0'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="query" icon="el-icon-search">查 询</el-button>
          <el-button type="default" @click="cleanSearch">重 置</el-button>
          <!-- <el-button type="default" @click="exportGiftList" icon="el-icon-upload">导 出</el-button> -->
        </el-form-item>
      </el-form>
    </div>
    <div class="table-wrapper">
      <v-table ref="data_table" column-width-drag :is-horizontal-resize="true" style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee"
      row-click-color="#edf7ff" @on-custom-comp="customCompFunc"></v-table>
    </div>
    <div class="pagin-wrapper">
      <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-size="search.pageSize" :page-index="search.pageIndex" :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
      </v-pagination>
    </div>
  </div>
</template>

<script>
import java from '@/utils/javaApiRequest';
import { formatDate } from '@/utils/date';
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      search: {
        // sellerUserId: '',
        // settlementId: '',
        start: '',
        end: '',
        status: 0,
        pageIndex: 1,
        pageSize: 10
      },
      tableData: [],
      columns: this.Columns(),
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      pickerOptions2: {
        disabledDate(time) {
          // console.log(time.getTime, Date.now());
          return time.getTime() > Date.now();
        },
      },
      errorShow: false,
      total: 0
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
      //  查询
      this.search.pageIndex = 1;
      this.gettableData();
    },
    customCompFunc(params) {
      // 1
      if (params.type === 'seeOrderDetail') {
        this.$router.push('/order-control/billDetail?billSettlement=' + JSON.stringify(params.rowData.billSettlement));
      }
    },
    Columns() {
      let _self = this;
      let columns = [
        // { width: 60, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome',
          title: '序号',
          width: 10,
          titleAlign: 'center',
          columnAlign: 'center',
          formatter: function(rowData, rowIndex, pagingIndex, field) {
            let index = (_self.search.pageIndex - 1) * _self.search.pageSize + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          },
          isFrozen: true,
          isResize: true
        },
        { field: 'sellerName', title: '药店名称', width: 130, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'intoAccount', title: '打款账户', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'intoCard', title: '打款卡号', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'openingBank', title: '打款银行', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'receivableAmount', title: '应收金额', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'salesAmount', title: '销售金额', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'postageAmount', title: '运费', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'servicesAmount', title: '服务费', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'payAmount', title: '支付金额', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'preferentialAmount', title: '优惠金额', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'incomeAmount', title: '药店收益', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'status', title: '当前状态', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'createTime', title: '账单生成时间', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'startDate', title: '账单周期', width: 180, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'option', title: '操作', width: 100, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operation-detail', isResize: true },
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
        if (item.field === 'startDate') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = formatDate(rowData[field]);
            let value2 = formatDate(rowData['endDate']);
            if (value && value2) {
              return value.slice(0, -8) + '~' + value2.slice(0, -8);
            } else {
              return '-';
            }
          };
        }
        if (item.field === 'createTime') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = formatDate(rowData[field]);
            if (value) {
              return value;
            } else {
              return '-';
            }
          };
        }
        if (item.field === 'status') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === 4) {
              return '<span style="color:red">已结算</span>';
            } else if (value === 1 || value === 2) {
              return '<span style="color:red">未结算</span>';
            } else {
              return '-';
            }
          };
        }
        if (item.field === 'incomeAmount' || item.field === 'salesAmount' || item.field === 'postageAmount' || item.field === 'servicesAmount' || item.field === 'payAmount' || item.field === 'preferentialAmount') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = '￥' + Number(rowData[field]).toFixed(2);
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
    pageChange(pageIndex) {
      this.search.pageIndex = pageIndex;
      this.gettableData();
    },
    pageSizeChange(pageSize) {
      this.search.pageIndex = 1;
      this.search.pageSize = pageSize;
      this.gettableData();
    },
    gettableData() {
      java.post('/mall_manage_seller/settlement/findBillSettledPage', this.search).then(res => {
        console.log(res);
        if (res.status === 200 && res.data.resultCode === '0') {
          this.tableData = res.data.resultData.list;
          this.total = res.data.resultData.total;
        }
      });
    },
    cleanSearch() {
      this.search = {
        settlementId: '',
        start: '',
        end: '',
        status: '',
        pageIndex: 1,
        pageSize: 10
      };
    }
  },
  created() {
    this.gettableData();
  }
};
</script>

<style lang="less" scoped>
  .bill{
    box-shadow: 0 1px 1px rgba(0, 0, 0, .05);
  }
</style>
