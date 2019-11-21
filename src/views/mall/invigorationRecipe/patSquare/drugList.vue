<template>
  <div class="drug_list" v-loading="loding">
    <div class="search-wrapper">
      <el-form :inline="true" :model="searchInfo" size="small" label-width="100px" ref="search_from">
        <el-row>
          <el-form-item label="商品名称" prop="product_name">
            <el-input v-model="searchInfo.product_name" placeholder="商品名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="商品编码" prop="product_num">
            <el-input v-model="searchInfo.product_num" placeholder="商品编码" clearable></el-input>
          </el-form-item>
          <el-form-item label="UPC码" prop="cpu_code">
            <el-input v-model="searchInfo.cpu_code" placeholder="UPC码" clearable></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="批准文号" prop="approvalnum">
            <el-input v-model="searchInfo.approvalnum" placeholder="批准文号" clearable></el-input>
          </el-form-item>
          <el-form-item label="生产厂商" prop="producing">
            <el-input v-model="searchInfo.producing" placeholder="生产厂商" clearable></el-input>
          </el-form-item>
          <el-form-item label=" " label-width="100px">
            <el-button type="button" @click="clean">清 除</el-button>
            <el-button type="primary" @click="query">查 询</el-button>
            <el-button type="button" @click="exportAll">导 出</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <div class="toolbar-wrapper">
      <el-button-group>
        <el-button type="default" size="medium" icon="el-icon-plus" @click="add">新增</el-button>
        <el-button type="default" size="medium" @click="updateImport">更新导入</el-button>
        <el-button type="default" size="medium" @click="addImport">新增导入</el-button>
        <el-button type="default" size="medium" @click="deleteAll">删除</el-button>
      </el-button-group>
    </div>
    <!-- 更新导入弹窗 -->
    <el-dialog title="更新导入商品" :visible.sync="updataShow" :modal-append-to-body="false" :append-to-body="true" width="500px" class="templateBox">
      <el-button-group class="btn-wrapper">
        <el-button type="default" plain icon="el-icon-upload2" @click="uploadUpdate">上传本地文件</el-button>
        <el-button type="default" plain icon="el-icon-download" @click="downUpload">导出商品</el-button>
      </el-button-group>
    </el-dialog>
    <!-- 新增导入弹窗 -->
    <el-dialog title="新增导入商品" :visible.sync="addUploadShow" :modal-append-to-body="false" :append-to-body="true" width="500px">
      <el-button-group class="btn-wrapper">
        <el-button type="default" plain icon="el-icon-upload2" @click="addUploadBarch">上传本地文件</el-button>
        <el-button type="default" plain icon="el-icon-download" @click="downAddBatch">下载模板</el-button>
      </el-button-group>
    </el-dialog>
    <!-- 表格区域 -->
    <div class="table-wrapper">
      <v-table ref="data_table" :is-loading="tableisLoding" column-width-drag is-horizontal-resize style="width:100%" :columns="columns"
       :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff" @on-custom-comp="customCompFunc" :select-all="selectALL" :select-change="selectChange"
        :select-group-change="selectGroupChange"></v-table>
    </div>
    <!-- 分页区域 -->
    <div class="pagin-wrapper">
      <v-pagination @page-change="pageChange" :total="total" :page-size="pageSize" :page-index="pageIndex" :layout="['total', 'prev', 'pager', 'next', 'jumper']">
      </v-pagination>
    </div>
    <!-- 新增弹窗 -->
    <el-dialog title="新增商品" :visible.sync="addDrugShow" :center='true' :modal-append-to-body="false" width="500px" @close="closeAfter" class="Drugdialog">
      <el-form :model="DrugData" :inline="true" label-width="100px" size="small" :rules="rules" ref="DrugFrom" class="DrugFrom">
        <el-form-item label="商品名称" prop="product_name">
          <el-input v-model.trim="DrugData.product_name" placeholder="商品名称" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="商品编码" prop="product_num">
          <el-input v-model.trim="DrugData.product_num" placeholder="商品编码" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="UPC码" prop="cpu_code">
          <el-input v-model.trim="DrugData.cpu_code" placeholder="UPC码(非必填)" maxlength="20"></el-input>
        </el-form-item>
        <!-- <el-form-item label="品牌" prop="brand">
          <el-input v-model.trim="DrugData.brand" placeholder="品牌" maxlength="20"></el-input>
        </el-form-item> -->
        <el-form-item label="规格" prop="norms">
          <el-input v-model.trim="DrugData.norms" placeholder="规格" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-input v-model.trim="DrugData.unit" placeholder="单位" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="生产厂商" prop="producing">
          <el-input v-model.trim="DrugData.producing" placeholder="生产厂商" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="单价" prop="price">
          <el-input v-model.trim="DrugData.price" placeholder="单价" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="批准文号" prop="approvalnum">
          <el-input v-model.trim="DrugData.approvalnum" placeholder="批准文号" maxlength="20"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="warning" @click="addDrugShow = false">取 消</el-button>
        <el-button type="success" @click="addQuery">确 定</el-button>
      </span>
    </el-dialog>
    <form enctype="multipart/form-data" style="display:none;">
      <el-input type="file" name="uploadInpu" @change="fileChanged" v-model="filePath" id="uploadInpu" class="selectfile" />
    </form>
  </div>
</template>

<script>
import ajax from '@/utils/doctorApiRequest';
import axios from 'axios';
import { getnetToken, getDocAccesstoken, getTimestamp, getNoncestr, getSign, getLoginID, aesEncrypt, setDoAccesstoken } from '@/utils/auth';
import $ from 'jquery';
export default {
  data() {
    return {
      searchInfo: { // 查询数据
        product_name: '',
        product_num: '',
        cpu_code: '',
        approvalnum: '',
        producing: '',
        creator: getLoginID()
      },
      tableisLoding: false,
      loding: false,
      pageSize: 10,
      pageIndex: 1,
      total: 0,
      tableData: [], // 表格数据源
      DrugData: {
        product_name: '',
        product_num: '',
        cpu_code: '',
        brand: '',
        norms: '',
        unit: '',
        producing: '',
        price: '',
        approvalnum: '',
        creator: getLoginID()
      },
      addDrugShow: false,
      showTitle: '',
      requestUrl: '',
      rules: {
        product_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        product_num: [{ required: true, message: '请输入商品编码', trigger: 'blur' }],
        // cpu_code: [{ required: true, message: '请输入商品UPC码', trigger: 'blur' }],
        // brand: [{ required: true, message: '请输入商品品牌', trigger: 'blur' }],
        norms: [{ required: true, message: '请输入商品规格', trigger: 'blur' }],
        unit: [{ required: true, message: '请输入商品单位', trigger: 'blur' }],
        producing: [{ required: true, message: '请输入商品生产厂商', trigger: 'blur' }],
        price: [{ required: true, validator: this.validMoney, trigger: 'blur' }],
        approvalnum: [{ required: true, message: '请输入批准文号', trigger: 'blur' }],
      },
      selection: [],
      filePath: '',
      updataShow: false,
      addUploadShow: false,
    };
  },
  computed: {
    columns: function() {
      // 自定义表格
      let _self = this;
      let columns = [
        { width: 60, title: '全选本页', titleAlign: 'center', columnAlign: 'center', type: 'selection' },
        { field: 'custome', title: '序号', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'product_name', title: '商品名称', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'product_num', title: '商品编码', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'cpu_code', title: 'UPC码', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'brand', title: '品牌', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'norms', title: '规格', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'unit', title: '单位', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'producing', title: '生产厂商', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'price', title: '商品价格', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'approvalnum', title: '批准文号', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'operation', title: '操作', width: 150, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operation-drugDetele', isResize: true }
      ];
      for (let i = 0; i < columns.length; i++) {
        let item = columns[i];
        if (i < 1) {
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
        if (item.field === 'custome') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.pageIndex - 1) * _self.pageSize + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          };
        }
        if (item.field === 'price') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let price = rowData[field].toFixed(2);
            return price;
          };
        }
      }
      return columns;
    }
  },
  methods: {
    // 金额正则
    isvalidmoney(str) {
      const reg = /^[0-9]+([.]{1}[0-9]{1,2})?$/;
      return reg.test(str);
    },
    validMoney(rule, value, callback) {
      if (!value) {
        callback(new Error('请输入商品单价'));
      } else if (!this.isvalidmoney(value)) {
        callback(new Error('单价只能是大于0的数字且最多两位小数'));
      } else if (value <= 0) {
        callback(new Error('请输入正确的商品单价'));
      } else if (value > 99999) {
        callback(new Error('商品单价不能大于99999'));
      }
      else {
        callback();
      }
    },
    clean() {
      console.log(this.$refs.search_from);
      this.$refs.search_from.resetFields();
      this.query();
    },
    query() {
      this.pageIndex = 1;
      this.pageSize = 10;
      this.getList();
    },
    // 条件导出
    exportAll() {
      let expotInfo = this.searchInfo;
      expotInfo.pageIndex = 1;
      expotInfo.pageSize = this.total;
      // window.open(`${process.env.DOCTOR_BASE_HOST}/api/ydsf/ExportStoreProductList?product_name=${expotInfo.product_name}&product_id=${expotInfo.product_id}&cpu_code=${expotInfo.cpu_code}
      // &approvalnum=${expotInfo.approvalnum}&producing=${expotInfo.producing}&pageIndex=${expotInfo.pageIndex}&pageSize=${expotInfo.pageSize}`);
      // let accessToken = getDocAccesstoken();
      // let token = getnetToken();
      // let timestamp = getTimestamp();
      // let noncestr = getNoncestr();
      // let appid = '8145955969';
      // let appSecret = 'l8y70yhm8vonwc904i6ugjs3s1zfqo77';
      // let sign = getSign(accessToken, appid, appSecret, noncestr, timestamp);
      let _self = this;
      console.log(expotInfo);
      axios.get(`${process.env.DOCTOR_BASE_HOST}/api/ydsf/ExportStoreProductList?creator=${getLoginID()}`, {
        params: expotInfo,
        responseType: 'blob',
        headers: _self.getConfig()
      }).then(res => {
        console.log(res);
        const content = res.data;
        const blob = new Blob([content]);
        const fileName = '商品列表.xlsx';
        if ('download' in document.createElement('a')) { // 非IE下载
          const elink = document.createElement('a');
          elink.download = fileName;
          elink.style.display = 'none';
          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          URL.revokeObjectURL(elink.href); // 释放URL 对象
          document.body.removeChild(elink);
        } else { // IE10+下载
          navigator.msSaveBlob(blob, fileName);
        }
      });
    },
    add() {
      this.showTitle = '新增商品';
      this.addDrugShow = true;
      this.requestUrl = '/api/ydsf/CreateStoreProduct';
    },
    // 更新导入
    uploadUpdate() {
      // updateImport
      $(`input[type='file'][name='uploadInpu']`).click();
      this.url = `/api/ydsf/UpdateImportStoreProduct?creator=${getLoginID()}`;
      this.updataShow = false;
    },
    updateImport() {
      this.updataShow = true;
    },
    // 下载更新导入模板
    downUpload() {
      let _self = this;
      axios.get(`${process.env.DOCTOR_BASE_HOST}/api/ydsf/ExportStoreProductInfoList?creator=${getLoginID()}`, {
        responseType: 'blob',
        headers: _self.getConfig()
      }).then(res => {
        console.log(res);
        const content = res.data;
        const blob = new Blob([content]);
        const fileName = '商品列表.xlsx';
        if ('download' in document.createElement('a')) { // 非IE下载
          const elink = document.createElement('a');
          elink.download = fileName;
          elink.style.display = 'none';
          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          URL.revokeObjectURL(elink.href); // 释放URL 对象
          document.body.removeChild(elink);
        } else { // IE10+下载
          navigator.msSaveBlob(blob, fileName);
        }
      });
    },
    // 新增导入
    addUploadBarch() {
      $(`input[type='file'][name='uploadInpu']`).click();
      this.url = `/api/ydsf/CreateImportStoreProduct?creator=${getLoginID()}`;
      this.addUploadShow = false;
      // console.log(this.$refs.uploadInpu);
      // this.$refs.uploadInpu.click();
      // document.getElementById('uploadInpu').click();
    },
    addImport() {
      this.addUploadShow = true;
    },
    // 下载新增模板
    downAddBatch() {
      let _self = this;
      axios.get(`${process.env.DOCTOR_BASE_HOST}/api/ydsf/GetImportStoreProductTemplate`, {
        responseType: 'blob',
        headers: _self.getConfig()
      }).then(res => {
        console.log(res);
        const content = res.data;
        const blob = new Blob([content]);
        const fileName = '处方商品新增模板.xlsx';
        if ('download' in document.createElement('a')) { // 非IE下载
          const elink = document.createElement('a');
          elink.download = fileName;
          elink.style.display = 'none';
          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          URL.revokeObjectURL(elink.href); // 释放URL 对象
          document.body.removeChild(elink);
        } else { // IE10+下载
          navigator.msSaveBlob(blob, fileName);
        }
      });
    },
    fileChanged() {
      let _self = this;
      let fileElement = $(`input[type='file'][name='uploadInpu']`);
      let filename = fileElement.val();
      let ext = filename.substring(filename.lastIndexOf('.')).toLowerCase();
      if (ext !== '.xlsx') {
        _self.$alert('仅支持.xlsx格式', '提示');
        return;
      }
      let file = fileElement[0].files[0];
      let formdata1 = new FormData();
      formdata1.append('files', file, file.name);
      let config = _self.getConfig();
      config['Content-Type'] = 'multipart/form-data';
      _self.fromloaData(formdata1, config);
      // if (this.url === '/mall_manage_seller/back/product/uploadStock') {
      //   this.$confirm('您没有更新的商品，库存会变成0, 是否继续?', '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     this.url === '/mall_manage_seller/back/product/uploadStock' ? _self.uploadLoading = true : _self.addLoading = true;
      //     _self.fromloaData(formdata1, config);
      //   });
      // } else {
      //   this.url === '/mall_manage_seller/back/product/uploadStock' ? _self.uploadLoading = true : _self.addLoading = true;
      //   _self.fromloaData(formdata1, config);
      // }
    },
    getAccessToken() {
      let appid = '8145955969';
      let appSecret = 'l8y70yhm8vonwc904i6ugjs3s1zfqo77';
      let accessToken = '';
      accessToken = getDocAccesstoken();
      if (accessToken) {
        return accessToken;
      }
      let requestObj;
      if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
        requestObj = new XMLHttpRequest();
      } else { // code for IE6, IE5
        /* eslint-disable */
        requestObj = new ActiveXObject('Microsoft.XMLHTTP');
      }
      let url = `${process.env.DOCTOR_BASE_HOST}/api/system/Token?appid=${aesEncrypt(appid)}&appSecret=${aesEncrypt(appSecret)}`;
      requestObj.open('get', url, false);
      requestObj.send('');
      let obj = requestObj.response;
      if (typeof obj !== 'object') {
        obj = JSON.parse(obj);
      }
      if (obj.code === 0) {
        accessToken = obj.data.accesstoken;
      }
      if (accessToken) {
        setDoAccesstoken(accessToken);
      }
      return accessToken;
    },
    getConfig() {
      let accessToken = this.getAccessToken();
      let token = getnetToken();
      let timestamp = getTimestamp();
      let noncestr = getNoncestr();
      let appid = '8145955969';
      let appSecret = 'l8y70yhm8vonwc904i6ugjs3s1zfqo77';
      let sign = getSign(accessToken, appid, appSecret, noncestr, timestamp);
      return {
        'token': token,
        'accessToken': accessToken,
        'timestamp': timestamp,
        'noncestr': noncestr,
        'sign': sign
      };
    },
    fromloaData(formdata1, config) {
      let _self = this;
      _self.loding = true;
      axios.post(`${process.env.DOCTOR_BASE_HOST}${_self.url}`, formdata1, { headers: config }).then((response) => {
        // let data = JSON.parse(base64Decrypt(response.data));
        let data = response.data;
        // _self.$emit('closeAction');
        _self.filePath = '';
        console.log(data);
        _self.loding = false;
        if (data.code === 0) {
          _self.$message.success('操作成功');
          _self.getList();
        } else {
          _self.$message.warning(data.message);
        }
      });
    },
    deleteAll() {
      if (this.selection.length > 0) {
        let id = this.selection.map(item => {
          return item.product_id;
        }).join(',');
        this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deteleDrug(id);
        });
      } else {
        this.$message.warning('请选择需要删除的数据');
      }
    },
    pageChange(index) {
      this.pageIndex = index;
      this.getList();
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
    customCompFunc(param) {
      if (param.type === 'deletes') {
        this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deteleDrug(param.rowData.product_id);
        });
      } else if (param.type === 'edit') {
        this.addDrugShow = true;
        this.showTitle = '编辑商品';
        // this.DrugData = param.rowData;
        // this.requestUrl = '/api/ydsf/UpdateStoreProduct';
        this.getDrugDetail(param.rowData.product_id)
      }
    },
    getDrugDetail(id) {
      ajax.get('/api/ydsf/GetStoreProductById?id=' + id).then(res => {
        console.log(res);
        if (res.status === 200 && res.data.code === 0) {
          this.DrugData = res.data.data;
          // this.DrugData.creator = getLoginID();
          this.requestUrl = '/api/ydsf/UpdateStoreProduct';
        }
      });
    },
    deteleDrug(id) {
      ajax.get('/api/ydsf/DelStoreProductById?id=' + id).then(res => {
        console.log(res);
        if (res.status === 200 && res.data.code === 0) {
          this.$message.success('删除成功');
          this.getList();
        }
      });
    },
    closeAfter() {
      // closeAfter
      this.$refs.DrugFrom.resetFields();
    },
    addQuery() {
      this.$refs.DrugFrom.validate(valid => {
        if (valid) {
          this.addDrugShow = false;
          ajax.post(this.requestUrl, this.DrugData).then(res => {
            console.log(res);
            if (res.status === 200 && res.data.code === 0) {
              this.$message.success('操作成功');
              this.getList();
            }
          });
        } else {
          return false;
        }
      });
    },
    getList() {
      this.searchInfo.pageIndex = this.pageIndex;
      this.searchInfo.pageSize = this.pageSize;
      ajax.post('/api/ydsf/GetStoreProductList', this.searchInfo).then(res => {
        console.log(res);
        if (res.status === 200 && res.data.code === 0) {
          this.total = res.data.recordscount;
          this.tableData = res.data.data;
        }
      });
    }
  },
  created() {
    this.getList();
  }
};
</script>

<style lang="less" scoped>
@import '../../../../styles/common.less';
.drug_list{
  .search-wrapper{
    /deep/.el-form-item{
      .el-button--primary{
        background-color: @green-color;
        border-color: @green-color;
      }
    }
  }
  .toolbar-wrapper{
    margin-top: 20px;
    margin-bottom: 0;
    border: none;
    padding: 40px 10px;
  }
  .table-wrapper{
    /deep/.el-button{
      background-color: @green-color;
      border-color: @green-color;
    }
  }
  .Drugdialog{
    .DrugFrom{
      /deep/.el-input{
        width: 320px;
      }
    }
  }
}
</style>
