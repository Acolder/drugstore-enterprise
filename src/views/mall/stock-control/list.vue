<template>
  <div class="stock-list">
    <div class="toolbar-wrapper">
      <el-button-group>
        <el-button type="default" size="medium" icon="el-icon-plus" @click="add">新增</el-button>
        <el-button type="default" size="medium" icon="el-icon-upload2" @click="batchdialog" v-if="durgfrom === 'getCommon'">更新导入</el-button>
        <el-button type="default" size="medium" icon="el-icon-upload2" @click="addbatchdialog" v-if="durgfrom === 'getCommon'">新增导入</el-button>
        <!-- <el-button type="default" size="medium" icon="el-icon-refresh" @click="shelf(1)">一键上架</el-button>
        <el-button type="default" size="medium" icon="el-icon-refresh" @click="shelf(2)">一键下架</el-button> -->
        <!-- <el-button type="default" size="medium" icon="el-icon-refresh" @click="resetForm">刷新</el-button> -->
      </el-button-group>
    </div>
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
        <el-form-item label="是否上架" prop="productStatus">
          <el-select v-model="requestData.productStatus" placeholder="请选择是否上架">
            <el-option label="全部" value=""></el-option>
            <el-option label="上架" :value='1'></el-option>
            <el-option label="下架" :value='2'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品类型">
          <el-select multiple v-model="isOtcs" placeholder="请选择商品分类" clearable>
            <el-option v-for="item in productTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="default" @click="resetForm">清空</el-button>
          <el-button type="primary" @click="query">查询</el-button>
          <el-button type="primary" @click="Exports">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-wrapper">
      <v-table sort-always @sort-change="sortChange" :is-loading="isLoding" :multiple-sort="false" ref="data_table" is-horizontal-resize style="width:100%" column-width-drag :columns="columns" :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff" @on-custom-comp="customCompFunc" :select-all="selectALL" :select-change="selectChange" :select-group-change="selectGroupChange"></v-table>
    </div>
    <div class="pagin-wrapper">
      <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-size="pageSize" :page-index="pageIndex" :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
      </v-pagination>
    </div>
    <!-- 商品弹窗 -->
    <el-dialog title="选择商品" :visible.sync="mallShow" :center='true' :modal-append-to-body="false" width="1600px">
      <iframe ref="rightiframe" id="rightiframe" :src="outMallListUrl" frameborder="0" style="width:100%;height:600px;"></iframe>
    </el-dialog>
    <!-- 新增弹窗 -->
    <el-dialog :title="stockTitle" :visible.sync="stockShow" :center='true' :modal-append-to-body="false" width="500px" @close="claseActive">
      <el-form :model="stockData" size="small" :rules="rules" ref="stockForm">
        <el-form-item label="商品价格" prop="productPrice">
          <el-input v-model.number="stockData.productPrice" placeholder="请输入商品价格"></el-input>
        </el-form-item>
        <el-form-item label="商品库存" prop="productStock">
          <el-input v-model.number="stockData.productStock" placeholder="请输入商品库存"></el-input>
        </el-form-item>
        <el-form-item label="商品sku" prop="productSku">
          <el-input v-model="stockData.productSku" placeholder="请输入商品sku"></el-input>
        </el-form-item>
        <el-form-item label="商品是否上架" prop="productStatus">
          <el-select v-model="stockData.productStatus" placeholder="请选择" style="width:450px;">
            <el-option label="上架" value="1"></el-option>
            <el-option label="下架" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="warning" @click="stockShow = false">取 消</el-button>
        <el-button type="success" @click="stockQuery">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="更新导入库存" :visible.sync="updataShow" :modal-append-to-body="false" :append-to-body="true" width="500px" class="templateBox">
      <el-button-group class="btn-wrapper">
        <el-button type="default" plain icon="el-icon-upload2" @click="batch" v-loading="uploadLoading">上传本地文件</el-button>
        <el-button type="default" plain icon="el-icon-download" @click="downBatch">下载模板</el-button>
      </el-button-group>
    </el-dialog>
    <el-dialog title="新增导入库存" :visible.sync="addShow" :modal-append-to-body="false" :append-to-body="true" width="500px">
      <el-button-group class="btn-wrapper">
        <el-button type="default" plain icon="el-icon-upload2" @click="addbatch" v-loading="addLoading">上传本地文件</el-button>
        <el-button type="default" plain icon="el-icon-download" @click="downAddBatch">下载模板</el-button>
      </el-button-group>
    </el-dialog>
    <form :id="fileName+'Form'" enctype="multipart/form-data" style="display:none;">
      <el-input type="file" :name="fileName" @change="fileChanged" v-model="filePath" class="selectfile" />
    </form>
  </div>
</template>
<style lang="less" scoped>
.stock-list{
  box-shadow: 0 1px 1px rgba(0, 0, 0, .05);
  // background: #fff;
  }
.templateBox{
  /deep/ .el-dialog__bod{
    display: flex;
    justify-content: space-around;
  }
}

</style>

<script>
// import upLoad from './upLoad';
import $ from 'jquery';
import { mapGetters } from 'vuex';
import javaRequest from '@/utils/javaApiRequest';
import axios from 'axios';
import { formatDate } from '@/utils/date';
import { getAccount, getToken, base64Encrypt, base64Decrypt } from '@/utils/auth';
import { MessageBox } from 'element-ui';
export default {
  data() {
    return {
      isLoding: true,
      addShow: false,
      updataShow: false,
      // isdiale: '',
      url: '',
      fileName: 'uploadGoods',
      uploadLoading: false,
      filePath: '',
      addLoading: false,
      // vlidNumber: validNumber(),
      category: [],
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      columns: this.getColumns(),
      // 选择的记录
      selection: [],
      // sellerFrom: '',
      durgfrom: 'getCommon', // 药品来源
      isOtcs: [],
      requestData: {
        // productId: '',
        productName: '', // 药品名称
        productSku: '',  // 商品SKU
        categoryCode: null, // 商品分类ID
        // orderBy: 'desc',
        productProducingPlace: '', // 生产厂商
        productApprovalNumber: '', // 批注文号
        productStatus: '', // 是否上下架 上架1 下架2
        orderByDate: '',
        orderByPrice: '',
        orderByStock: '',
        isOtc: '', // 产品类型
        orderBySku: 'desc'
      },
      exportInfo: '',
      stockData: {
        productId: '',
        productPrice: '',
        productStatus: '',
        productStock: '',
        productAttName: '',
        sellerUserId: getAccount(),
        salesVolume: '',
        productSku: ''
      },
      outMallListUrl: `${process.env.WEB_HOST}/outMallList`,
      mallShow: false,
      stockShow: false,
      stockTitle: '',
      isAdd: '',
      rules: {
        productPrice: [{ required: true, validator: this.validMoney, trigger: 'blur' }],
        productStock: [{ required: true, validator: this.validNumber, trigger: 'blur' }],
        productSku: [{ required: true, message: '请输入商品sku', trigger: 'blur' }],
        productStatus: [{ required: true, message: '请选择是否上架', trigger: 'change' }],
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
    // 'upload': upLoad
  },
  methods: {
    // 上下架
    shelf(state) {
      let query = {
        productStatus: state
      };
      javaRequest.post(`/mall_manage_seller/back/product/onekeyShelf`, query).then((res) => {
        console.log(res);
        if (res.status === 200 && res.data.resultCode === '0') {
          this.getTableData();
          this.$message({
            message: res.data.msg,
            type: 'success'
          });
          // console.log(res.data.resultData);
        }
      });
    },
    Exports() {
      let param = this.exportInfo;
      //   usertoken: getToken(),
      //   productName: this.exportInfo.productName,
      //   productSku: this.exportInfo.productSku,
      //   categoryCode: this.exportInfo.categoryCode,
      //   productApprovalNumber: this.exportInfo.productApprovalNumber,
      //   productProducingPlace: this.exportInfo.productProducingPlace,
      //   getByself: this.exportInfo.getByself,
      //   getFast: this.exportInfo.getFast,
      //   getCommon: this.exportInfo.getCommon,
      //   transnational: this.exportInfo.transnational,
      //   pageNum: this.exportInfo.pageNum,
      //   pageSize: this.exportInfo.pageSize,
      // };
      param.usertoken = getToken();
      console.log(param);
      param = base64Encrypt(JSON.stringify(param));
      window.open(`${process.env.MALL_BASE_HOST}/mall_manage_seller/back/product/exportExcleProductStocks?param=` + param);
    },
    sortChange(e) {
      console.log(e);
      this.requestData.orderBySku = e.po1;
      this.requestData.orderByDate = e.createDate;
      this.requestData.orderByPrice = e.productPrice;
      this.requestData.orderByStock = e.productStock;
      this.pageIndex = 1;
      this.pageSize = 10;
      this.getTableData();
    },
    batchdialog() {
      this.updataShow = true;
    },
    addbatchdialog() {
      this.addShow = true;
    },
    downBatch() {
      //  下载更新模板
      window.open(`${process.env.MALL_BASE_HOST}/mall_manage_seller/back/product/stockUpdateTemplate`);
    },
    downAddBatch() {
      // 下载新增模板
      window.open(`${process.env.MALL_BASE_HOST}/mall_manage_seller/back/product/stockAddTemplate`);
    },
    addbatch() {
      // 新增导入
      $(`input[type='file'][name='${this.fileName}']`).click();
      this.url = '/mall_manage_seller/back/product/insertExeclStock';
    },
    batch() {
      // 更新导入
      $(`input[type='file'][name='${this.fileName}']`).click();
      this.url = '/mall_manage_seller/back/product/uploadStock';
    },
    // 上传文件
    fileChanged() {
      let _self = this;
      let fileElement = $(`input[type='file'][name='${_self.fileName}']`);
      let filename = fileElement.val();
      let ext = filename.substring(filename.lastIndexOf('.')).toLowerCase();
      if (ext !== '.xlsx') {
        _self.$alert('仅支持.xlsx格式', '提示');
        return;
      }
      let file = fileElement[0].files[0];
      let formdata1 = new FormData();
      formdata1.append('files', file, file.name);
      let token = getToken();
      let config = {
        headers: { 'Content-Type': 'multipart/form-data', 'usertoken': token },
      };
      if (this.url === '/mall_manage_seller/back/product/uploadStock') {
        this.$confirm('您没有更新的商品，库存会变成0, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.url === '/mall_manage_seller/back/product/uploadStock' ? _self.uploadLoading = true : _self.addLoading = true;
          _self.fromloaData(formdata1, config);
        });
      } else {
        this.url === '/mall_manage_seller/back/product/uploadStock' ? _self.uploadLoading = true : _self.addLoading = true;
        _self.fromloaData(formdata1, config);
      }
    },
    fromloaData(formdata1, config) {
      let _self = this;
      axios.post(`${process.env.MALL_BASE_HOST}${this.url}`, formdata1, config).then((response) => {
        let data = JSON.parse(base64Decrypt(response.data));
        // _self.$emit('closeAction');
        _self.filePath = '';
        console.log(data);
        if (data.resultCode === '0') {
          _self.url === '/mall_manage_seller/back/product/uploadStock' ? _self.uploadLoading = false : _self.addLoading = false;
          _self.url === '/mall_manage_seller/back/product/uploadStock' ? _self.updataShow = false : _self.addShow = false;
          MessageBox.confirm(data.msg, '提示', {
            confirmButtonText: '确定',
            showClose: false,
            type: 'success',
            center: true,
            showCancelButton: false
          });
          _self.getTableData();
        } else {
          _self.url === '/mall_manage_seller/back/product/uploadStock' ? _self.uploadLoading = false : _self.addLoading = false;
          _self.url === '/mall_manage_seller/back/product/uploadStock' ? _self.updataShow = false : _self.addShow = false;
          MessageBox.confirm('导入失败，请稍后重试', '提示', {
            confirmButtonText: '确定',
            showClose: false,
            type: 'success',
            center: true,
            showCancelButton: false
          });
        }
      });
    },
    // 正整数正则
    isvalidNumber(str) {
      const reg = /^[1-9]\d*$/;
      return reg.test(str);
    },
    validNumber(rule, value, callback) {
      if (!value === '') {
        callback(new Error('请输入数量'));
      } else if (!this.isvalidNumber(value) && this.stockData.productStatus === '1') {
        callback(new Error('请输入正确的数量'));
      } else {
        callback();
      }
    },
    // 金额正则
    isvalidmoney(str) {
      const reg = /^[0-9]+([.]{1}[0-9]{1,2})?$/;
      return reg.test(str);
    },
    validMoney(rule, value, callback) {
      if (!value) {
        callback(new Error('请输入金额'));
      } else if (!this.isvalidmoney(value)) {
        callback(new Error('请输入最多两位小数的金额'));
      } else {
        callback();
      }
    },
    claseActive() {
      this.stockData = {
        productId: '',
        productPrice: '',
        productStatus: '',
        productStock: '',
        productAttName: '',
        sellerUserId: getAccount(),
        salesVolume: ''
      };
      this.$refs['stockForm'].resetFields();
    },
    previewImg(url) {
      this.$alert(`<img src="${url}" alt='' width="360px" heigth="360px"/>`, '', {
        dangerouslyUseHTMLString: true,
        customClass: 'reviewImg'
      });
    },
    getColumns() {
      let _self = this;
      let columns = [
        // { width: 60, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome', title: '序号', width: 50, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.pageIndex - 1) * _self.pageSize + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        // { field: 'productId', title: '商品ID', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'productSku', title: '商品sku', width: 130, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'po2', title: '商品名称', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'po3', title: '商品图片', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'po4', title: '商品分类', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'po5', title: '生产厂商', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'po6', title: '批准文号', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'categoryCode', title: '分类', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'productDosageForm', title: '剂型', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'po7', title: '产品类型', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'po8', title: '标准规格', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'productPrice', title: '商品价格', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true, orderBy: 'asc' },
        { field: 'salesVolume', title: '销量', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'productStock', title: '库存', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true, orderBy: 'asc' },
        { field: 'productStatus', title: '是否上架', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'createDate', title: '创建时间', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true, orderBy: 'asc' },
        // { field: 'productApprovalNumber', title: '批注文号', width: 100, titleAlign: 'center', columnAlign: 'left', isResize: true },
        { field: 'operation', title: '操作', width: 200, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operation-mall', isResize: true }
      ];
      for (let i = 0; i < columns.length; i++) {
        let item = columns[i];
        if (i <= 1) {
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
            return value;
          };
        }
        if (item.field === 'productPrice') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = '￥' + rowData[field].toFixed(2);
            return '<span style="color:#f56c6c">' + value + '</span>';
          };
        }
        if (item.field === 'productStatus') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === '1') {
              return '<span style="color:#67c23a">上架</span>';
            } else {
              return '<span style="color:#f56c6c">下架</span>';
            }
          };
        }
        // if (item.field === 'po1' && item.title === '商品sku') {
        //   item.formatter = function (rowData, rowIndex, pagingIndex, field) {
        //     let value = rowData['po'].productSku;
        //     return value;
        //   };
        // }
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
        if (item.field === 'po7' && item.title === '产品类型') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData['po'].isOtc;
            for (let j = 0; j < _self.productTypeList.length; j++) {
              if (value === _self.productTypeList[j].value) {
                return _self.productTypeList[j].label;
              }
            }
          };
        }
        if (item.field === 'po8' && item.title === '标准规格') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData['po'].productSpecification;
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
      this.requestData.isOtc = '';
      this.isOtcs = [];
      // this.sellerFrom = '';
      this.query();
    },
    getTableData() {
      let _self = this;
      let query = _self.getQueryParams();
      this.exportInfo = query;
      javaRequest.post(`/mall_manage_seller/back/product/queryProductStocks`, query).then((res) => {
        console.log(res);
        this.isLoding = false;
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
      this.requestData.isOtc = this.isOtcs.join(',');
      // this.requestData.sellerUserId = this.sellerFrom;
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
    query() {
      this.isLoding = true;
      this.pageIndex = 1;
      this.getTableData();
    },
    pageChange(pageIndex) {
      this.isLoding = true;
      this.pageIndex = pageIndex;
      this.getTableData();
    },
    pageSizeChange(pageSize) {
      this.isLoding = true;
      this.pageIndex = 1;
      this.pageSize = pageSize;
      this.getTableData();
    },
    setSelectedList(data) {
      // console.log(data);
      this.stockData.productId = data.productId;
      this.mallShow = false;
      this.stockShow = true;
      this.stockTitle = '新增库存';
      this.isAdd = true;
    },
    // table operaion
    customCompFunc(params) {
      if (params.type === 'delete') { // do delete operation
        this.$confirm('此操作将永久删除该库存, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param = {
            productId: params.rowData.productId
          };
          javaRequest.post('/mall_manage_seller/back/product/delProductStock', param).then((res) => {
            // console.log(res);
            if (res.status === 200 && res.data.resultCode === '0') {
              this.getTableData();
              this.$message({
                message: res.data.msg,
                type: 'success'
              });
            }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      } else if (params.type === 'edit') { // do edit operation
        // console.log(params.rowData);
        // this.isdiale = params.rowData.productSku ? true : false;
        this.stockData = {
          productId: params.rowData.productId,
          productPrice: params.rowData.productPrice,
          productStatus: params.rowData.productStatus,
          productStock: params.rowData.productStock,
          productAttName: params.rowData.productAttName,
          sellerUserId: params.rowData.sellerUserId,
          salesVolume: params.rowData.salesVolume,
          productSku: params.rowData.productSku,
        };
        this.stockData.productId = params.rowData.productId;
        this.stockShow = true;
        this.stockTitle = '更新库存';
        this.isAdd = false;
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
    stockQuery() {
      let _self = this;
      this.$refs['stockForm'].validate((valid) => {
        if (valid) {
          this.stockShow = false;
          let url = '';
          if (this.isAdd) {
            url = '/mall_manage_seller/back/product/addProductStock';
          } else {
            url = '/mall_manage_seller/back/product/updateProductStock';
          }
          javaRequest.post(url, _self.stockData).then((res) => {
            // console.log(res);
            if (res.status === 200 && res.data.resultCode === '0') {
              this.getTableData();
              this.$message({
                message: res.data.msg,
                type: 'success'
              });
            }
          })
            .catch(rul => {
              // console.log(rul);
              let str = String(rul);
              if (str.search('timeout') !== -1) {
                // console.log(1);
              }
            });
        } else {
          return false;
        }
      });
    },
    // 新增
    add() {
      this.mallShow = true;
      let iframe = this.$refs.rightiframe;
      if (iframe) {
        iframe.contentWindow.location.reload(true);
      }
    },
    // 批量删除
    // batchDelete() {
    //   if (this.selection.length > 0) {
    //     let idList = [];
    //     for (let item of this.selection) {
    //       idList.push(item.productId);
    //     }
    //     alert('delete:' + idList.join(','));
    //   }
    // }
  },
  created() {
    window.previewImg = this.previewImg;
    window.setSelectedList = this.setSelectedList;
    this.getTableData();
    this.getCategory();
  }
};

</script>