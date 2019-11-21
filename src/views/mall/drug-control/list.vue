<template>
  <div>
    <div class="search-wrapper">
      <el-form :inline="true" :model="requestData">
        <el-form-item label="商品名称">
          <el-input v-model="requestData.productName" placeholder="商品名称"></el-input>
        </el-form-item>
        <el-form-item label="商品SKU">
          <el-input v-model="requestData.productSku" placeholder="商品SKU"></el-input>
        </el-form-item>
        <el-form-item label="商品分类">
          <el-select v-model="requestData.categoryCode" placeholder="商品分类">
            <el-option label="分类一" value="1"></el-option>
            <el-option label="分类二" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="query">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="toolbar-wrapper">
      <el-button-group>
        <el-button type="default" size="medium" icon="el-icon-plus" @click="add">新增</el-button>
        <el-button type="default" size="medium" icon="el-icon-delete" @click="batchDelete">批量删除</el-button>
        <el-button type="default" size="medium" icon="el-icon-refresh" @click="query">刷新</el-button>
      </el-button-group>
    </div>
    <div class="table-wrapper">
      <v-table ref="data_table" is-horizontal-resize style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff" @on-custom-comp="customCompFunc" :select-all="selectALL" :select-change="selectChange" :select-group-change="selectGroupChange"></v-table>
    </div>
    <div class="pagin-wrapper">
      <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-size="pageSize" :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
      </v-pagination>
    </div>
  </div>
</template>
<style lang="less" scoped>

</style>

<script>
import Vue from 'vue';
import { mapGetters } from 'vuex';
import javaRequest from '@/utils/javaApiRequest';
export default {
  data() {
    return {
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      columns: this.getColumns(),
      // 选择的记录
      selection: [],
      requestData: {
        // 药品名称
        productName: '',
        // 商品SKU
        productSku: '',
        // 分类ID
        categoryCode: ''

      }
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
  components: {
  },
  methods: {
    getColumns() {
      let _self = this;
      let columns = [
        { width: 60, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome', title: '序号', width: 50, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.pageIndex - 1) * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'productSku', title: '商品sku', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'productName', title: '商品名称', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'categoryCode', title: '分类', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'productDosageForm', title: '剂型', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'productOriginPlace', title: '生产产地', width: 200, titleAlign: 'center', columnAlign: 'left', isResize: true },
        { field: 'productSpecification', title: '标准规格', width: 80, titleAlign: 'center', columnAlign: 'left', isResize: true },
        { field: 'productMarkprice', title: '商品市场价', width: 60, titleAlign: 'center', columnAlign: 'left', isResize: true },
        { field: 'productSalesVolume', title: '销量', width: 80, titleAlign: 'center', columnAlign: 'left', isResize: true },
        { field: 'productApprovalNumber', title: '批注文号', width: 100, titleAlign: 'center', columnAlign: 'left', isResize: true },
        { field: 'operation', title: '操作', width: 200, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operation', isResize: true }
      ];
      for (let i = 0; i < columns.length; i++) {
        let item = columns[i];
        if (i === 0 || i === 1) {
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
      }
      return columns;
    },
    getTableData() {
      let _self = this;
      _self.requestData.pageNum = _self.pageIndex;
      _self.requestData.pageSize = _self.pageSize;
      javaRequest.post(`/mall/back/product/query`, _self.requestData).then((res) => {
        if (res.status === 200 && res.data.resultCode === '0') {
          _self.total = res.data.resultData.total;
          _self.tableData = res.data.resultData.data;
        }
      });
    },
    query() {
      this.pageIndex = 1;
      this.getTableData();
    },
    pageChange(pageIndex) {
      this.pageIndex = pageIndex;
      this.getTableData();
    },
    pageSizeChange(pageSize) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
      this.getTableData();
    },
    sortChange(params) {

      if (params.height.length > 0) {

        this.tableConfig.tableData.sort(function (a, b) {

          if (params.height === 'asc') {

            return a.height - b.height;
          } else if (params.height === 'desc') {

            return b.height - a.height;
          } else {
            return 0;
          }
        });
      }
    },
    // table operaion
    customCompFunc(params) {
      if (params.type === 'delete') { // do delete operation
        alert(`删除商品：${params.rowData.productName}`);
      } else if (params.type === 'edit') { // do edit operation
        alert(`编辑商品：${params.rowData.productName}`);
      }

    },
    selectALL(selection) {
      this.selection = selection;
    },
    selectChange(selection, rowData) {
      this.selection = selection;
    },
    selectGroupChange(selection) {
      this.selection = selection;
    },
    // 新增
    add() {
      let data = {
        name: 'add',
        path: '/drug-control/add',
        meta: {
          title: '新增商品'
        }
      };
      this.$store.dispatch('addVisitedViews', data);
      this.tabValue = data.name;
      this.$router.push({ path: data.path });
    },
    // 批量删除
    batchDelete() {
      if (this.selection.length > 0) {
        let idList = [];
        for (let item of this.selection) {
          idList.push(item.productId);
        }
        alert('delete:' + idList.join(','));
      }
    }
  },
  created() {
    this.getTableData();
  }
};
// 自定义列组件
Vue.component('table-operation', {
  template: `<span>
        <a href="" @click.stop.prevent="update(rowData,index)">编辑</a>&nbsp;
        <a href="" @click.stop.prevent="deleteRow(rowData,index)">删除</a>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    update() {

      // 参数根据业务场景随意构造
      let params = { type: 'edit', index: this.index, rowData: this.rowData };
      this.$emit('on-custom-comp', params);
    },

    deleteRow() {

      // 参数根据业务场景随意构造
      let params = { type: 'delete', index: this.index, rowData: this.rowData };
      this.$emit('on-custom-comp', params);

    }
  }
});
</script>