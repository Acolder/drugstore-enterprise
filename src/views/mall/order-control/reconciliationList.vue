<template>
  <div class="billrecon">
    <div class="top">
      <h2 class="title">营业概况</h2>
      <div class="box">
        <div class="box-item">
          <p class="one">今日有效订单</p>
          <p class="tow">{{info.todayNum}}单</p>
          <p class="three">昨日{{info.yesterdayNum}}单</p>
        </div>
        <div class="box-item">
          <p class="one">今日营业额</p>
          <p class="tow">{{info.todayTurnover}}元</p>
          <p class="three">昨日{{info.yesterdayTurnover}}元</p>
        </div>
      </div>
    <h2 class="title">报表导出</h2>
    </div>
    <div class="search-wrapper">
      <el-form :inline="true" :model="search" size="small" ref="searchData">
        <el-form-item label="门店名称:" class="commonItem">
          <el-select v-model="search.sellerUserId" placeholder="请选择" clearable >
            <el-option label="全部" value="" ></el-option>
            <el-option :label="item.sellerName" :value="item.sellerUserId" v-for="(item,index) in info.sellerUserList" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期范围:" class="commonItem startTime">
          <el-date-picker
            v-model="timeRange"
            type="daterange"
            range-separator="至"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <!-- <el-button type="primary" @click="query" icon="el-icon-search">查 询</el-button> -->
          <!-- <el-button type="default" @click="cleanSearch" icon="el-icon-delete">重 置</el-button> -->
          <el-button type="default" @click="exportGiftList">导 出</el-button>
        </el-form-item>
      </el-form>
    </div>
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
import java from '@/utils/javaApiRequest';
import { formatDate } from '@/utils/date';
import { base64Encrypt } from '@/utils/auth';
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      // search: {
      //   // sellerUserId: '',
      //   // settlementId: '',
      //   start: '',
      //   end: '',
      //   pageIndex: 1,
      //   pageSize: 10
      // },
      search: {
        sellerUserId: '',
        sellerName: '',
        start: '',
        end: '',
      },
      tableData: [],
      columns: this.Columns(),
      total: 0,
      timeRange: [this.formatValueDate(new Date(new Date().getTime() - 24 * 60 * 60 * 1000)), this.formatValueDate(new Date(new Date().getTime() - 24 * 60 * 60 * 1000))],
      info: ''
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
    add0(m) { return m < 10 ? '0' + m : m },
    formatValueDate(time) {
      let year = time.getFullYear();
      let month = time.getMonth() + 1;
      let date = time.getDate();
      return year + '-' + this.add0(month) + '-' + this.add0(date);
    },
    exportGiftList() {
      // 导出
      if (this.timeRange) {
        this.search.start = this.timeRange[0];
        this.search.end = this.timeRange[1];
      } else {
        this.search.start = '';
        this.search.end = '';
      }
      if (this.search.sellerUserId) {
        let sellerName = this.info.sellerUserList.find(item => {
          return item.sellerUserId === this.search.sellerUserId;
        });
        this.search.sellerName = sellerName.sellerName;
        console.log(sellerName);
      } else {
        this.search.sellerName = '';
      }
      java.post('/mall_manage_seller/settlement/adddExportRecord', this.search).then(res => {
        console.log(res);
        if (res.status === 200 && res.data.resultCode === '0') {
          if (res.data.resultData === 'ok') {
            this.gettableData();
          } else {
            // console.log(1);
            this.$message.warning('没有可以导出的数据');
            this.tableData = [];
          }
        }
      });
      // 导出
      // let param = {
      //   start: '',
      //   end: ''
      // };
      // let token = getToken();
      // if (this.timeRange) {
      //   param.start = this.timeRange[0];
      //   param.end = this.timeRange[1];
      // } else {
      //   param.start = '';
      //   param.end = '';
      // }
      // param = JSON.stringify(param);
      // param = base64Encrypt(param);
      // window.open(`${process.env.MALL_BASE_HOST}/mall_manage_seller/settlement/exportSettlement?usertoken=` + token + '&param=' + param);
    },
    query() {
      //  查询
      if (this.timeRange) {
        this.search.start = this.timeRange[0];
        this.search.end = this.timeRange[1];
      } else {
        this.search.start = '';
        this.search.end = '';
      }
      this.search.pageIndex = 1;
      this.gettableData();
    },
    customCompFunc(params) {
      // 1
      console.log(params);
      if (params.type === 'down') {
        let param = {
          id: params.rowData.id
        };
        param = JSON.stringify(param);
        param = base64Encrypt(param);
        window.open(`${process.env.MALL_BASE_HOST}/mall_manage_seller/settlement/exportSettlement?param=` + param);
      }
    },
    Columns() {
      // let _self = this;
      let columns = [
        // { width: 60, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        // {
        //   field: 'custome',
        //   title: '序号',
        //   width: 50,
        //   titleAlign: 'center',
        //   columnAlign: 'center',
        //   formatter: function(rowData, rowIndex, pagingIndex, field) {
        //     // let index = (_self.search.pageIndex - _self.search.pageSize) * 10 + rowIndex + 1;
        //     let index = rowIndex + 1;
        //     return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
        //   },
        //   isFrozen: true,
        //   isResize: true
        // },
        { field: 'sellerName', title: '报表内容', width: 170, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'createData', title: '操作时间', width: 120, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'attributionDate', title: '账单归属日期', width: 180, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        // { field: 'abutmentFlagCy', title: '订单来源', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'orderPayment', title: '支付金额', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'orderPostage', title: '运费', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'orderSales', title: '销售金额', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'orderServices', title: '服务费', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'orderReceivable', title: '应收金额', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'minServices', title: '最低服务费', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'rate', title: '费率', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'orderRefund', title: '退款金额', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'marketing2Price', title: '满减金额', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'couponPrice', title: '优惠金额', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'matotalPrice', title: '促销金额', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'orderCreateDate', title: '下单时间', width: 120, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'option', title: '操作', width: 160, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operation-down', isResize: true },
      ];
      for (let i = 0; i < columns.length; i++) {
        let item = columns[i];
        // if (i <= 1) {
        //   continue;
        // }
        item.formatter = function(rowData, rowIndex, pagingIndex, field) {
          let value = rowData[field];
          if (value || value === 0) {
            return value;
          } else {
            return '-';
          }
        };
        if (item.field === 'sellerName') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = formatDate(rowData['startData']);
            let value2 = formatDate(rowData['endData']);
            let value3 = rowData[field] ? rowData[field] : '全部门店';
            return value3 + '   ' + value.slice(0, -8) + '~' + value2.slice(0, -8);
          };
        }
        if (item.field === 'createData') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = formatDate(rowData[field]);
            return value;
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
      // let param = {

      //   pageIndex: 1,
      //   pageSize: 10
      // };
      java.post('/mall_manage_seller/settlement/findExportSettlementRecordPage').then(res => {
        console.log(res);
        if (res.status === 200 && res.data.resultCode === '0') {
          this.tableData = res.data.resultData.list;
          // this.total = res.data.resultData.total;
        }
      });
    },
    getInfo() {
      java.post('/mall_manage_seller/settlement/initOrderSettlementPage', this.search).then(res => {
        console.log(res);
        if (res.status === 200 && res.data.resultCode === '0') {
          this.info = res.data.resultData;
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
    this.getInfo();
    this.gettableData();
  }
};
</script>

<style lang="less" scoped>
  .billrecon{
    box-shadow: 0 1px 1px rgba(0, 0, 0, .05);
    padding: 0 30px;
    background: #fff;
    .top{
      padding: 10px;
    }
    .title{
      line-height: 60px;
      box-shadow: 0 1px 1px rgba(0, 0, 0, .05);
    }
    .box{
      overflow: hidden;
      .box-item{
        float: left;
        padding: 25px;
        text-align: center;
        .one{
          font-size: 18px;
          margin-bottom: 20px;
        }
        .tow{
          font-size: 20px;
          font-weight: 600;
          color: red;
        }
        .three{
          margin-top: 15px;
        }
      }
    }
  }
  .commonItem{
    /deep/ .el-range-editor--small .el-range-separator{
      width: 32px;
    }
  }
</style>
