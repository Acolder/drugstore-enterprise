<template>
  <div class="market-list">
    <div class="toolbar-wrapper">
      <!-- <h2 class="title">创建优惠券</h2> -->
      <el-button-group>
        <el-button type="default" size="medium" icon="el-icon-plus" @click="addShop">店铺优惠券</el-button>
        <el-button type="default" size="medium" icon="el-icon-plus" @click="addGoods">商品优惠券</el-button>
      </el-button-group>
     <div>
       <span class="conut">已创建{{countData.A}}</span>
       <span class="conut">已创建{{countData.B}}</span>
       <!-- <span class="conut">已创建10</span> -->
     </div>
    </div>
    <!-- 搜索区域 -->
    <div class="search-wrapper">
      <!-- <h2 class="title">数据统计</h2> -->
      <el-form :inline="true" :model="searchInfo" size="small" label-width="72px">
        <el-form-item label="名称:">
          <el-input v-model="searchInfo.couponName" placeholder="请输入优惠券名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="类型:">
          <el-select v-model="searchInfo.couponType" clearable>
            <el-option v-for="item in couponTypeList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态:">
          <el-select v-model="searchInfo.state" clearable>
            <el-option v-for="item in stateList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="query">查询</el-button>
            <!-- <el-button type="default" @click="clean">清空</el-button> -->
            <el-button @click="exportActive">导出</el-button>
          </el-form-item>
      </el-form>
    </div>
    <!-- 表格区域 -->
    <div class="table-wrapper">
      <v-table ref="data_table" :is-loading="isLoding" column-width-drag is-horizontal-resize style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff" @on-custom-comp="customCompFunc"></v-table>
    </div>
    <!-- 分页区域 -->
    <div class="pagin-wrapper">
      <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-size="searchInfo.pageSize" :page-index="searchInfo.pageNum" :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
      </v-pagination>
    </div>
  </div>
</template>

<script>
import javaRequest from '@/utils/javaApiRequest';
import { getToken, base64Encrypt } from '@/utils/auth';
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      isLoding: true,
      searchInfo: {
        couponName: '',
        couponType: '',
        state: '',
        orderBy: 'desc',
        pageNum: 1,
        pageSize: 10
      },
      couponTypeList: [
        { label: '全部', value: '' },
        { label: '店铺优惠券', value: '1' },
        { label: '商品优惠券', value: '2' },
      ],
      stateList: [
        { label: '全部', value: '' },
        { label: '已删除', value: '0' },
        { label: '领取中', value: '1' },
        { label: '已结束', value: '2' },
      ],
      tableData: [],
      columns: this.getColumns(),
      total: 0,
      exportData: '',
      countData: []
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
    getColumns() {
      let _self = this;
      let columns = [
        {
          field: 'custome', title: '序号', width: 50, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.searchInfo.pageNum - 1) * _self.searchInfo.pageSize + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'couponName', title: '名称', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'couponType', title: '类型', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'state', title: '状态', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'preferentialAmount', title: '面额', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'useTheThreshold', title: '门槛', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'startDate', title: '使用时间', width: 230, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'effectiveDate', title: '有效时间', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'limitCollarPerPerson', title: '限领', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'distributionQuantity', title: '发行量', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'alreadyReceived', title: '已领取', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'operation', title: '操作', width: 240, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operation-marke', isResize: true }
      ];
      for (let i = 0; i < columns.length; i++) {
        let item = columns[i];
        if (i < 1 || i === 10) {
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
        if (item.field === 'state') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let v = rowData[field];
            let typeList = {
              '0': '已删除',
              '1': '领取中',
              '2': '已结束'
            };
            let value = typeList[v];
            if (value === '已删除' || value === '已结束') {
              return `<span style="color:#f56c6c">${value}</span>`;
            } else if (value === '领取中') {
              return `<span style="color:#67c23a">${value}</span>`;
            } else {
              return '-';
            }
          };
        }
        if (item.field === 'preferentialAmount' || item.field === 'useTheThreshold') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field].toFixed(2);
            return `<span style="color:#f56c6c">￥${value}</span>`;
          };
        }
        if (item.field === 'couponType') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let v = rowData[field];
            let stateList = {
              '1': '店铺优惠券',
              '2': '商品优惠券'
            };
            let value = stateList[v];
            return value || '-';
          };
        }
        if (item.field === 'startDate') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let v = rowData[field];
            let a = rowData['endDate'];
            if (v) {
              return `<div><span>起：${v}</span><span>止：${a}</span></div>`;
            } else { return '-' }
          };
        }
        if (item.field === 'effectiveDate') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let v = rowData[field];
            if (v) {
              return `<span>领取后${v}天内</span>`;
            } else { return '-' }

          };
        }
      }
      return columns;
    },
    customCompFunc(param) {
      // 22
      if (param.type === 'seeMarke') {
        this.$router.push('/market-control/marketDetail?id=' + param.rowData.couponId + '&secuID=' + param.rowData.securitiesInformationId);
      }
      if (param.type === 'editMarke') {
        let url = param.rowData.couponType === 1 ? '/market-control/editShopCoupon' : '/market-control/editGoodsCoupon';
        this.$router.push(url + '?id=' + param.rowData.couponId + '&secuID=' + param.rowData.securitiesInformationId);
      }
      if (param.type === 'endMarke') {
        this.$confirm('此操作将执行结束优惠券, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let obj = {
            couponId: param.rowData.couponId,
            state: '2'
          };
          this.marketOption(obj);
        });
      }
      if (param.type === 'delateMarke') {
        this.$confirm('此操作将执行删除优惠券, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let obj = {
            couponId: param.rowData.couponId,
            state: '0'
          };
          this.marketOption(obj);
        });
      }
    },
    // 切换分页
    pageChange(pageIndex) {
      this.isLoding = true;
      this.searchInfo.pageNum = pageIndex;
      this.getTableData();
    },
    // 切换每页显示的数量
    pageSizeChange(pageSize) {
      this.isLoding = true;
      this.searchInfo.pageNum = 1;
      this.searchInfo.pageSize = pageSize;
      this.getTableData();
    },
    addGoods() {
      this.$router.push('/market-control/addGoodsCoupon');
    },
    addShop() {
      this.$router.push('/market-control/addShopCoupon');
    },
    // 查询
    query() {
      this.isLoding = true;
      this.searchInfo.pageNum = 1;
      this.getTableData();
    },
    // 导出
    exportActive() {
      // console.log('导出');
      let token = getToken();
      // let couponName = this.exportData.couponName;
      // let couponType = this.exportData.couponType;
      // let state = this.exportData.state;
      let param = {
        couponName: this.exportData.couponName,
        couponType: this.exportData.couponType,
        state: this.exportData.state,
        orderBy: 'asc',
      };
      param = JSON.stringify(param);
      param = base64Encrypt(param);
      window.open(`${process.env.MALL_BASE_HOST}/mall_manage_seller/back/coupon/exportExcleCoupon?usertoken=` + token + '&param=' + param);
    },
    getTableData() {
      this.exportData = this.searchInfo;
      javaRequest.post('/mall_manage_seller/back/coupon/queryCouponBasicInformation', this.searchInfo).then(res => {
        // console.log(res);
        this.isLoding = false;
        if (res.status === 200 && res.data.resultCode === '0') {
          this.tableData = res.data.resultData.data;
          this.total = res.data.resultData.total;
        }
      });
    },
    // 优惠券状态修改
    marketOption(param) {
      javaRequest.post('/mall_manage_seller/back/coupon/delCoupons', param).then(res => {
        // console.log(res);
        if (res.status === 200 && res.data.resultCode === '0') {
          this.$message.success(res.data.msg);
          this.getTableData();
        }
      });
    },
    // 获取优惠券数量
    getCount(param) {
      javaRequest.post('/mall_manage_seller/back/coupon/queryCouponTotal').then(res => {
        // console.log(res);
        if (res.status === 200 && res.data.resultCode === '0') {
          // this.$message.success(res.data.msg);
          // this.getTableData();
          this.countData = res.data.resultData;
        }
      });
    }
  },
  created() {
    this.getTableData();
    this.getCount();
  },
};
</script>

<style lang="less" scoped>
.market-list{
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
  background: #fff;
  .toolbar-wrapper{
    margin-bottom: 30px;
    // border-bottom: 1px solid #e4e7ed;
  }
}

.title{
  margin: 15px 0;
}
.conut{
  display: inline-block;
  width: 131px;
  text-align: center;
  padding-top: 10px;
}
</style>
