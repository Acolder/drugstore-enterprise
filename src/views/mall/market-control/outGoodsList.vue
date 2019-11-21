<template>
  <div>
    <div class="search-wrapper">
      <el-form :inline="true" :model="requestData" size="small" ref="query_form">
        <el-form-item label="商品名称" prop="productName">
          <el-input v-model="requestData.productName" placeholder="商品名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="商品分类" prop="categoryCode">
          <el-select v-model="requestData.categoryCode" placeholder="请选择商品分类" clearable>
            <el-option v-for="item in category" :key="item.categoryCode" :label="item.categoryName" :value="item.categoryCode"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品SKU" prop="productSku">
          <el-input v-model="requestData.productSku" placeholder="商品SKU" clearable></el-input>
        </el-form-item>
        <el-form-item label="批准文号" prop="productApprovalNumber">
          <el-input v-model="requestData.productApprovalNumber" placeholder="批准文号" clearable></el-input>
        </el-form-item>
        <el-form-item label="生产厂商" prop="productProducingPlace">
          <el-input v-model="requestData.productProducingPlace" placeholder="生产厂商" clearable></el-input>
        </el-form-item>
        <el-form-item label="药品来源">
          <el-select v-model="durgfrom" placeholder="请选择药品来源">
            <el-option label="仓库商品" :value='"getCommon"'></el-option>
            <el-option label="外贸商品" :value='"transnational"'></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="是否上架" prop="productStatus">
          <el-select v-model="requestData.productStatus" placeholder="请选择是否上架">
            <el-option label="全部" value=""></el-option>
            <el-option label="上架" :value='1'></el-option>
            <el-option label="下架" :value='2'></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item>
          <el-button type="default" icon="el-icon-delete" @click="resetForm">清空</el-button>
          <el-button type="primary" @click="query" icon="el-icon-search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-wrapper">
      <v-table ref="data_table" is-horizontal-resize style="width:100%" column-width-drag :columns="columns" :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff" :select-all="selectALL" :select-change="selectChange" :select-group-change="selectGroupChange"></v-table>
    </div>
    <div class="pagin-wrapper">
      <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-size="pageSize" :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
      </v-pagination>
    </div>
    <div style="text-align:center">
      <el-button type="warning" @click="sure">确 定</el-button>
    </div>
  </div>
</template>
<style lang="less" scoped>

</style>

<script>
// import Vue from 'vue';
import { mapGetters } from 'vuex';
import javaRequest from '@/utils/javaApiRequest';
import { formatDate } from '@/utils/date';
// import { getAccount } from '@/utils/auth';
export default {
  data() {
    return {
      category: [],
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      columns: this.getColumns(),
      // 选择的记录
      selection: [],
      sellerFrom: '',
      durgfrom: 'getCommon', // 药品来源
      requestData: {
        // productId: '',
        productName: '', // 药品名称
        productSku: '',  // 商品SKU
        categoryCode: null, // 商品分类ID
        orderBy: 'desc',
        productProducingPlace: '', // 生产厂商
        productApprovalNumber: '', // 批注文号
        productStatus: 1 // 1 上架商品 2 下架商品
      },
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
  props: {
    goodsData: Array,
    limit: Number
  },
  methods: {
    previewImg(url) {
      this.$alert(`<img src="${url}" alt='' width="360px" heigth="360px"/>`, '', {
        dangerouslyUseHTMLString: true,
        customClass: 'reviewImg'
      });
    },
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
        { field: 'po1', title: '商品sku', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'po2', title: '商品名称', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'po3', title: '商品图片', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'po4', title: '商品分类', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'po5', title: '生产厂商', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'po6', title: '批准文号', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'categoryCode', title: '分类', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'productDosageForm', title: '剂型', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'productOriginPlace', title: '生产产地', width: 200, titleAlign: 'center', columnAlign: 'left', isResize: true },
        // { field: 'productSpecification', title: '标准规格', width: 80, titleAlign: 'center', columnAlign: 'left', isResize: true },
        { field: 'productPrice', title: '商品价格', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'salesVolume', title: '销量', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'productStock', title: '库存', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'productStatus', title: '是否上架', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'createDate', title: '创建时间', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'productApprovalNumber', title: '批注文号', width: 100, titleAlign: 'center', columnAlign: 'left', isResize: true },
        // { field: 'operation', title: '操作', width: 200, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operation-mall', isResize: true }
      ];
      for (let i = 0; i < columns.length; i++) {
        let item = columns[i];
        if (i === 0 || i === 1) {
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
        if (item.field === 'createDate') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = formatDate(rowData[field]);
            // return formatDate(value);
            return value;
          };
        }
        if (item.field === 'productPrice') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = '￥' + rowData[field];
            // return formatDate(value);
            return '<span style="color:red">' + value + '</span>';
          };
        }
        if (item.field === 'productStatus') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === '1') {
              return '<span style="color:green">上架</span>';
            } else {
              return '<span style="color:red">下架</span>';
            }
            // return formatDate(value);
          };
        }
        if (item.field === 'po1' && item.title === '商品sku') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData['po'].productSku;
            return value;
          };
        }
        if (item.field === 'po2' && item.title === '商品名称') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData['po'].productName;
            return value;
          };
        }
        if (item.field === 'po3' && item.title === '商品图片') {
          let defaultImg = 'https://uploads.kangmei.com.cn/Files/20180627/fwkomaog.xzb.jpg';
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData['po'].productMainImage;
            if (value) {
              return `<a href="javascript:previewImg('${value}');"><img src="${value}" alt="" width="40px" height="40px" style="margin-top:5px;" /></a>`;
            } else {
              return `<a href="javascript:previewImg('${defaultImg}');"><img src="${defaultImg}" alt="" width="40px" height="40px" style="margin-top:5px;" /></a>`;
            }
          };
        }
        if (item.field === 'po4' && item.title === '商品分类') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData['po'].categoryCode;
            if (value) {
              let c = _self.category.find((x) => x.categoryCode === value.toString());
              if (c) {
                return c.categoryName;
              } else {
                return value;
              }
            } else {
              return '-';
            }
          };
        }
        if (item.field === 'po5' && item.title === '生产厂商') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData['po'].productProducingPlace;
            return value;
          };
        }
        if (item.field === 'po6' && item.title === '批准文号') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData['po'].productApprovalNumber;
            return value;
          };
        }
      }
      return columns;
    },
    resetForm() {
      this.$refs['query_form'].resetFields();
      // this.requestData.categoryCode = '';
      // this.requestData.isChecked = 0;
      this.durgfrom = 'getCommon';
      this.sellerFrom = '';
      this.getTableData();
      // 因返URL中可能带搜索条件，故采用调整方式清空
      // let link = location.href;
      // location.href = link.substring(0, link.indexOf('?'));
    },
    getTableData() {
      let _self = this;
      let query = _self.getQueryParams();
      javaRequest.post(`/mall_manage_seller/back/product/queryProductStocks`, query).then((res) => {
        // console.log(res);
        if (res.status === 200 && res.data.resultCode === '0') {
          _self.total = res.data.resultData.total;
          _self.tableData = res.data.resultData.data;
          // console.log(res.data.resultData);
        }
      });
    },
    getQueryParams: function () {
      this.requestData.pageNum = this.pageIndex;
      this.requestData.pageSize = this.pageSize;
      this.requestData.getByself = '';
      this.requestData.getFast = '';
      this.requestData.getCommon = '';
      this.requestData.transnational = '';
      this.requestData[this.durgfrom] = 'all';
      this.requestData.sellerUserId = this.sellerFrom;
      // this.requestData.isShieldStock = '1';
      // this.requestData.isMyself = this.sellerFrom;
      // console.log(this.requestData);
      return this.requestData;
    },
    getCategory() {
      let _self = this;
      javaRequest.get(`/mall_manage_seller/back/category/getAsTree`).then((res) => {
        if (res.status === 200 && res.data.resultCode === '0') {
          _self.category = res.data.resultData;
        }
      });
    },
    // 返回选中数据
    sure() {
      if (this.limit === 1 && this.selection.length > 1) {
        this.$message.warning('赠品只能选择一个');
      } else {
        this.$emit('getGoods', this.selection);
      }
    },
    query() {
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
    selectALL(selection) {
      this.selection = selection;
    },
    selectChange(selection, rowData) {
      this.selection = selection;
    },
    selectGroupChange(selection) {
      this.selection = selection;
    },
  },
  created() {
    window.previewImg = this.previewImg;
    this.selection = this.goodsData;
    this.getTableData();
    this.getCategory();
  }
};

</script>