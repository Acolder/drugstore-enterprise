<template>
  <div class="list">
    <div class="table-wrapper">
      <v-table ref="data_table" column-width-drag :row-height=50 :is-horizontal-resize="true" style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff" @on-custom-comp="customCompFunc"></v-table>
    </div>
    <div class="pagin-wrapper">
      <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-size="searchInfo.pageSize" :page-index="searchInfo.pageNum" :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
      </v-pagination>
    </div>
  </div>
</template>

<script>
import javaRequest from '@/utils/javaApiRequest';
import { formatDate } from '@/utils/date';
import { base64Encrypt } from '@/utils/auth';
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      searchInfo: {
        pageSize: 10,
        pageNum: 1
      },
      tableData: [],
      total: 0,
      columns: this.getColumns(),
    };
  },
  watch: {
    'sidebarStatus': function(value, oldValue) {
      this.$refs['data_table'].resize();
    }
  },
  computed: {
    ...mapGetters([
      'sidebarStatus'
    ])
  },
  methods: {
    add0(m) { return m < 10 ? '0' + m : m },
    // 时间戳转化成时间格式
    formatDatems(timestamp) {
      let time = new Date(timestamp);
      let year = time.getFullYear();
      let month = time.getMonth() + 1;
      let date = time.getDate();
      let hours = time.getHours();
      let minutes = time.getMinutes();
      let seconds = time.getSeconds();
      let mixins = time.getMilliseconds();
      return year + '-' + this.add0(month) + '-' + this.add0(date) + ' ' + this.add0(hours) + ':' + this.add0(minutes) + ':' + this.add0(seconds) + '.' + mixins;
    },
    query() {
      this.getListData();
    },
    // 自定义事件
    customCompFunc(params) {
      if (params.type === 'exports') { // 导出
        // console.log(this.formatDatems(1548293508000));
        let param = {
          sellerUserId: params.rowData.sellerUserId,
          createDate: this.formatDatems(params.rowData.createDate)
        };
        param = JSON.stringify(param);
        param = base64Encrypt(param);
        console.log(param);
        window.open(`${process.env.MALL_BASE_HOST}/mall_manage_seller/back/product/exportFailData?param=` + param);
      }
    },
    getColumns() {
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
            let index = (_self.searchInfo.pageNum - 1) * _self.searchInfo.pageSize + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          },
          isFrozen: true,
          isResize: true
        },
        { field: 'type', title: '导入类型', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'createDate', title: '失败时间', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'option', title: '操作', width: 160, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operation-fail', isResize: true },
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
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = formatDate(rowData[field]);
            if (value) {
              return value;
            } else {
              return '-';
            }
          };
        }
        if (item.field === 'type') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            console.log(value);
            if (value === 1) {
              return '新增商品';
            } else {
              return '更新库存';
            }
          };
        }
      }
      return columns;
    },
    pageChange(pageIndex) {
      this.searchInfo.pageNum = pageIndex;
      this.getListData();
    },
    pageSizeChange(pageSize) {
      this.searchInfo.pageNum = 1;
      this.searchInfo.pageSize = pageSize;
      this.getListData();
    },
    getListData() {
      javaRequest.post('/mall_manage_seller/back/product/queryExportFail', this.searchInfo).then(res => {
        console.log(res);
        if (res.status === 200 && res.data.resultCode === '0') {
          this.tableData = res.data.resultData.data;
          this.total = res.data.resultData.total;
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
