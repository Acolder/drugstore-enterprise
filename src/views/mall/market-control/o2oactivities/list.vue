<template>
  <div class="list">
    <div class="toolbar-wrapper">
      <el-button-group>
        <el-button type="default" size="medium" icon="el-icon-plus" @click="addAllFull">全店满减</el-button>
      </el-button-group>
      <div class="conut-wrap">
        <!-- <span class="conut">已创建{{totalInfo.A}}</span> -->
      </div>
    </div>
    <!-- 搜索区域 -->
    <!-- <div class="search-wrapper" v-if="role === '店主'">
      <el-form :inline="true" :model="searchInfo" size="small" label-width="72px">
        <el-form-item label="状态:">
          <el-select v-model="searchInfo.activityState" clearable>
            <el-option v-for="item in stateList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
            <el-button type="default" @click="clean">清空</el-button>
            <el-button type="primary" @click="query">查询</el-button>
            <el-button @click="exportActive">导出</el-button>
          </el-form-item>
      </el-form>
    </div> -->
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
import { getToken, base64Encrypt } from '@/utils/auth';
import javaRequest from '@/utils/javaApiRequest';
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      searchInfo: {
        orderBy: 'desc',
        pageNum: 1,
        pageSize: 10
      },
      isLoding: true,
      columns: this.Columns(),
      tableData: [],
      total: 0,
      stateList: [
        { label: '已删除', value: '0' },
        { label: '进行中', value: '1' },
        { label: '未开始', value: '2' },
        { label: '已结束', value: '3' },
      ],
      // totalInfo: '',
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
    addAllFull() {
      // 新增全店满减
      this.$router.push('/marketo2o-control/add');
    },
    Columns() {
      // 自定义表格
      let _self = this;
      let columns = [
        {
          field: 'custome', title: '序号', width: 50, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.searchInfo.pageNum - 1) * _self.searchInfo.pageSize + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'activityType', title: '类型', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'activityState', title: '状态', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'startDate', title: '起止时间', width: 230, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'quantityOfActiveCommodities', title: '参与门店数量', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'limitCollarPerPerson', title: '限领', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'distributionQuantity', title: '发行量', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'alreadyReceived', title: '已领取', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'operation', title: '操作', width: 240, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operation-activito2o', isResize: true }
      ];
      for (let i = 0; i < columns.length; i++) {
        let item = columns[i];
        if (i < 1 || i === 10) {
          continue;
        }
        item.formatter = function (rowData, rowIndex, pagingIndex, field) {
          let value = rowData[field];
          if (value || value === 0) {
            return value;
          } else {
            return '-';
          }
        };
        if (item.field === 'activityState') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let v = rowData[field];
            let stateList = {
              '0': '已删除',
              '1': '进行中',
              '2': '未开始',
              '3': '已结束',
            };
            let value = stateList[v];
            return value || '-';
          };
        }
        if (item.field === 'activityType') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let v = rowData[field];
            if (v === 6) {
              return '全店满减';
            } else { return v }
          };
        }
        if (item.field === 'startDate') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let v = rowData[field];
            let a = rowData['endDate'];
            if (v) {
              return `<div><span>起:${v}</span>  <span>止:${a}</span></div>`;
            } else { return '-' }
          };
        }
      }
      return columns;
    },
    customCompFunc(param) {
    // 自定义操作按钮
      if (param.type === 'seeMarke') {
        this.$router.push('/marketo2o-control/detail?id=' + param.rowData.marketingActivitiesId);
      }
      if (param.type === 'endMarke') {
        this.$confirm('此操作将执行结束该活动, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let obj = {
            appPoiCode: param.rowData.participationInList[0].appPoiCode,
            marketingActivitiesId: param.rowData.marketingActivitiesId,
            actIds: param.rowData.actFullList[0].actIds,
            publishingChannels: param.rowData.publishingChannels
          };
          this.marketOption(obj);
        });
      }
    },
    marketOption(param) {
      javaRequest.post('/mall_manage_seller/back/marketing/activities/actFullDiscountDelete', param).then(res => {
        // console.log(res);
        if (res.status === 200 && res.data.resultCode === '0') {
          this.$message.success(res.data.msg);
          this.getTableData();
        }
      });
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
    getTableData() {
      // 获取表格数据
      this.exportData = this.searchInfo;
      javaRequest.post('/mall_manage_seller/back/marketing/activities/actFullDiscountList', this.searchInfo).then(res => {
        console.log(res);
        this.isLoding = false;
        if (res.status === 200 && res.data.resultCode === '0') {
          this.tableData = res.data.resultData.data;
          this.total = res.data.resultData.total;
        }
      });
    },
    // getTotal() {
    //   javaRequest.post('/mall_manage_seller/back/marketing/activities/queryMarketingActivitiesTotal').then(res => {
    //     console.log(res);
    //     if (res.status === 200 && res.data.resultCode === '0') {
    //       this.totalInfo = res.data.resultData;
    //     }
    //   });
    // },
    exportActive() {
      // 导出
      let token = getToken();
      let param = {
        activityName: this.exportData.activityName,
        activityType: this.exportData.activityType,
        activityState: this.exportData.activityState,
        orderBy: 'desc',
      };
      param = base64Encrypt(JSON.stringify(param));
      window.open(`${process.env.MALL_BASE_HOST}/mall_manage_seller/back/marketing/activities/exportExcleMarketingActivities?usertoken=` + token + '&param=' + param);
    },
    // 重置查询
    clean() {
      this.searchInfo = {
        activityState: '',
        orderBy: 'desc',
        pageNum: 1,
        pageSize: 10
      };
      this.query();
    },
    // 查询
    query() {
      this.isLoding = true;
      this.searchInfo.pageNum = 1;
      this.getTableData();
    }
  },
  created() {
    this.getTableData();
    // this.getTotal();
  }
};
</script>

<style lang="less" scoped>
.list{
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
  background: #fff;
}

.conut-wrap{
  overflow: hidden;
}
.conut{
  display: block;
  width: 117px;
  text-align: center;
  padding-top: 10px;
  float: left;
}
</style>
