<template>
  <div>
    <div class="search-wrapper">
      <el-form :inline="true" :model="requestData" size="small" ref="query_form">
        <el-row>
          <!-- <el-col :span="8"> -->
            <el-form-item label="商品名称" prop="productName">
              <el-input v-model="requestData.productName" placeholder="商品名称" clearable></el-input>
            </el-form-item>
            <!-- <el-form-item label="产品类型" prop="isOtc">
              <el-select multiple v-model="requestData.isOtc" placeholder="请选择商品分类" clearable>
                <el-option v-for="item in productTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item> -->
          <!-- </el-col> -->
          <!-- <el-col :span="8">
            <el-form-item label="生产厂商" prop="productProducingPlace">
              <el-input v-model="requestData.productProducingPlace" placeholder="生产厂商" clearable></el-input>
            </el-form-item>
          </el-col> -->
          <!-- <el-col :span="8"> -->
            <!-- <el-form-item label="商品SKU" prop="productSku">
              <el-input v-model="requestData.productSku" placeholder="商品SKU" clearable></el-input>
            </el-form-item> -->
          <!-- </el-col> -->
          <!-- <el-col :span="8">
            <el-form-item label="批准文号" prop="productApprovalNumber">
              <el-input v-model="requestData.productApprovalNumber" placeholder="批准文号" clearable></el-input>
            </el-form-item>
          </el-col> -->
          <!-- <el-col :span="8">
            <el-form-item label="审核状态">
              <el-select v-model="requestData.isChecked" placeholder="请选择审核状态" clearable>
                <el-option label="全部" :value=0></el-option>
                <el-option label="已审核" :value=1></el-option>
                <el-option label="未审核" :value=2></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
          <!-- <el-col :span="8">
            <el-form-item label="商品分类" prop="categoryCode">
              <el-select v-model="requestData.categoryCode" placeholder="请选择商品分类" clearable>
                <el-option v-for="item in category" :key="item.categoryCode" :label="item.categoryName" :value="item.categoryCode"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="药品来源">
              <el-select v-model="durgfrom" placeholder="请选择药品来源">
                <el-option label="仓库商品" :value='"getCommon"'></el-option>
                <el-option label="快送商品" :value='"getFast"'></el-option>
                <el-option label="药柜商品" :value='"getByself"'></el-option>
                <el-option label="外贸商品" :value='"transnational"'></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
          <!-- <el-col :span="8">
            <el-form-item label="药品来源">
              <el-select v-model="sellerFrom" placeholder="请选择药品来源" clearable>
                <div v-for="(sellerUser,i) in sellerUserList" :key="sellerUser[i]">
                  <el-option :label="sellerUser.sellerName" :value='sellerUser.sellerUserId'></el-option>
                </div>

              </el-select>
            </el-form-item>
          </el-col> -->
          <!-- <el-col :span="8"> -->
            <el-button type="default" icon="el-icon-delete" @click="resetForm" size="small">清空</el-button>
            <el-button type="primary" @click="seach" icon="el-icon-search" size="small">查询</el-button>
          <!-- </el-col> -->
        </el-row>
        <!-- <el-form-item>

        </el-form-item> -->
      </el-form>
    </div>
    <div class="table-wrapper">
      <v-table ref="data_table" column-width-drag :row-height=50 :is-horizontal-resize="true" style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff" @on-custom-comp="customCompFunc"></v-table>
    </div>
    <div class="pagin-wrapper">
      <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-size="pageSize" :page-index="pageIndex" :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
      </v-pagination>
    </div>
    <!-- <div class="search-wrapper" style="text-align:center">
      <el-button type="default" @click="cancel">取消</el-button>
      <el-button type="primary" @click="Determine">确定</el-button>
    </div> -->
  </div>
</template>
<style lang="less" scoped>
</style>

<script>
import { mapGetters } from 'vuex';
import ajax from '@/utils/javaApiRequest';
import { getToken } from '@/utils/auth';
export default {
  data() {
    return {
      category: [],
      sidebarValue: this.sidebarStatus,
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      columns: this.getColumns(),
      // 选择的记录
      selection: [],
      // 药品来源
      durgfrom: 'getCommon',
      sellerFrom: '',
      requestData: {
        // 药品名称
        productName: '',
        // 商品SKU
        productSku: '',
        // 分类ID
        categoryCode: null,
        /* 商品来源 */
        getByself: '',
        getFast: '',
        getCommon: '',
        transnational: '',
        orderByDate: 'desc',
        // 审核状态 1已审核 2未审核
        isChecked: '1',
        // 生产厂商
        productProducingPlace: '',
        // isOtc: [], // 产品类型
        // 是否屏蔽已添加过库存的商品
        // isShieldStock: '1',
        // isMyself: '1',
        productApprovalNumber: ''
      },
      // 药品类型
      productTypeList: [{
        label: '甲类OTC',
        value: 1
      },
      {
        label: '乙类OTC',
        value: 3
      },
      {
        label: '处方',
        value: 2
      },
      {
        label: '医疗器械类',
        value: 4
      },
      {
        label: '保健食品',
        value: 5
      },
      {
        label: '食品',
        value: 6
      },
      {
        label: '消字号',
        value: 7
      },
      {
        label: '妆字号',
        value: 8
      },
      {
        label: '其他',
        value: 0
      },
      ],
      // limit: '',
      // proudctNum: '',
      // index: '',
      // information: true,
      sellerUserList: null,
      isFirst: 1
    };
  },
  watch: {
    'sidebarStatus': function (value, oldValue) {
      this.$refs['data_table'].resize();
    },
    'requestData.productName': function () {
      if (this.requestData.productName) {
        this.isFirst = '';
      } else {
        this.isFirst = 1;
      }
    },
    'requestData.productSku': function () {
      if (this.requestData.productName) {
        this.isFirst = '';
      } else {
        this.isFirst = 1;
      }
    }
  },
  computed: {
    ...mapGetters([
      'sidebarStatus',
      'visitedViews'
    ])
  },
  methods: {
    getSellUser() {
      let data = {
        userToken: getToken(),
        pageIndex: 1,
        pageSize: 50
      };
      ajax.post('/mall_manage_seller/authority/queryLikeSellUser', data).then((res) => {
        if (res.status === 200 && res.data.resultCode === '0') {
          // console.log(res);
          this.sellerUserList = res.data.resultData.sellerUserList.data;
          // this.sellerFrom = this.sellerUserList[0].sellerUserId;
          // console.log(this.sellerUserList);
          // this.getDataList();
        }
      });
    },
    customCompFunc(params) {
      if (params.type === 'querySelect') {
        parent.window.setSelectedList(params.rowData);
      }
    },
    getColumns() {
      let _self = this;
      let columns = [
        // { width: 60, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome', title: '序号', width: 50, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.pageIndex - 1) * 10 + rowIndex + 1;
            return '<span>' + index + '</span>';
          }, isFrozen: true, isResize: true
        },
        { field: 'productName', title: '商品名称', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'productMainImage', title: '商品图片', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'categoryCode', title: '分类', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'productSku', title: '商品sku', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'isChecked', title: '审批状态', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'productDosageForm', title: '剂型', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'productProducingPlace', title: '生产厂商', width: 200, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'isOtc', title: '产品类型', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'productSpecification', title: '标准规格', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'productMarkprice', title: '市场价', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'productSalesVolume', title: '销量', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'getFast', title: '速达', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'getByself', title: '自提', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'getCommon', title: '商城', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'transnational', title: '跨境', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'productApprovalNumber', title: '批准文号', width: 100, titleAlign: 'center', columnAlign: 'left', isResize: true },
        { field: 'operation', title: '操作', width: 80, titleAlign: 'center', columnAlign: 'center', componentName: 'outNewList', isResize: true }
      ];
      for (let i = 0; i < columns.length; i++) {
        let item = columns[i];
        if (i < 2) {
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
        if (item.field === 'productMainImage') {
          let defaultImg = 'https://uploads.kangmei.com.cn/Files/20180627/fwkomaog.xzb.jpg';
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              return `<a href="javascript:previewImg('${value}');"><img src="${value}" alt="" width="40px" height="40px" style="margin-top:5px;" /></a>`;
            } else {
              return `<a href="javascript:previewImg('${defaultImg}');"><img src="${defaultImg}" alt="" width="40px" height="40px" style="margin-top:5px;" /></a>`;
            }
          };
        }
        if (item.field === 'categoryCode') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
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
        if (item.field === 'isOtc') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            for (let j = 0; j < _self.productTypeList.length; j++) {
              if (value === _self.productTypeList[j].value) {
                return _self.productTypeList[j].label;
              }
            }
          };
        }
        if (item.field === 'isChecked') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === 1) {
              return '<span style="color:green;">已审核</span>';
            } else if (value === 2) {
              return '<span style="color:red;">未审核</span>';
            } else {
              return '-';
            }
          };
        }
      }
      return columns;
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
      this.requestData.isChecked = '1';
      this.requestData.isShieldStock = '1';
      this.requestData.isFirst = this.isFirst;
      // this.requestData.isMyself = this.sellerFrom;
      // console.log(this.requestData);
      return this.requestData;
    },
    setDrugFrom() {
      // let query = this.$route.query;
      // this.limit = query.limit;
      // this.index = query.index;
      // if (query.getByself) {
      //   this.durgfrom = 'getByself';
      // }
      // else if (query.getFast) {
      //   this.durgfrom = 'getFast';
      // }
      // else if (query.transnational) {
      //   this.durgfrom = 'transnational';
      // }
      // else {
      //   this.durgfrom = 'getCommon';
      // }
    },
    getDataList() {
      let _self = this;
      let query = _self.getQueryParams();
      // query.isOtc = query.isOtc.join(',');
      console.log(query);
      ajax.post(`/mall_manage_seller/back/product/query`, query).then((res) => {
        // console.log(res);
        if (res.status === 200 && res.data.resultCode === '0') {
          _self.total = res.data.resultData.total;
          _self.tableData = res.data.resultData.data;
        }
      });
    },
    seach() {
      this.pageIndex = 1;
      this.getDataList();
    },
    getCategory() {
      let _self = this;
      ajax.get(`/mall_manage_seller/back/category/getAsTree`).then((res) => {
        if (res.status === 200 && res.data.resultCode === '0') {
          _self.category = res.data.resultData;
        }
      });
    },
    resetForm() {
      this.$refs['query_form'].resetFields();
      // this.requestData.categoryCode = '';
      // this.requestData.isChecked = 0;
      this.durgfrom = 'getCommon';
      this.sellerFrom = '';
      this.seach();
      // 因返URL中可能带搜索条件，故采用调整方式清空
      // let link = location.href;
      // location.href = link.substring(0, link.indexOf('?'));
    },
    pageChange(pageIndex) {
      this.pageIndex = pageIndex;
      this.getDataList();
    },
    pageSizeChange(pageSize) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
      this.getDataList();
    },
    previewImg(url) {
      this.$alert(`<img src="${url}" alt=''/>`, '', {
        dangerouslyUseHTMLString: true,
        customClass: 'reviewImg'
      });
    },
    // selectALL(selection) {
    //   if (selection.length > this.limit) {
    //     this.$message({
    //       message: '只能选' + this.limit + '个',
    //       type: 'error'
    //     });
    //     this.proudctNum = false;
    //   } else {
    //     this.selection = selection;
    //     this.proudctNum = true;
    //   }
    // },
    // selectChange(selection, rowData) {
    //   if (selection.length > this.limit) {
    //     this.$message({
    //       message: '只能选' + this.limit + '个',
    //       type: 'error'
    //     });
    //     this.proudctNum = false;
    //   } else {
    //     this.selection = selection;
    //     this.proudctNum = true;
    //   }
    // },
    // selectGroupChange(selection) {
    //   if (selection.length > this.limit) {
    //     this.$message({
    //       message: '只能选' + this.limit + '个',
    //       type: 'error'
    //     });
    //     this.proudctNum = false;
    //   } else {
    //     this.selection = selection;
    //     this.proudctNum = true;
    //   }
    // },
    // cancel() {
    //   parent.window.setSelectedList(false);
    // },
    // Determine() {
    //   parent.window.setSelectedList(this.selection, this.proudctNum, this.index, this.information, this.durgfrom);
    // }
  },
  created() {
    this.getSellUser();
    this.getCategory();
    window.previewImg = this.previewImg;
    this.setDrugFrom();
    let query = this.$route.query;
    if (query.productId) {
      delete query.productId;
    }
    if (query.from) {
      this.pageIndex = parseInt(query.pageNum, 10);
      this.pageSize = parseInt(query.pageSize, 10);
    }
    this.requestData = query;
    this.getDataList();
  }
};
</script>
