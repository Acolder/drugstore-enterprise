<template>
  <div class="seller-List">
    <div class="toolbar-wrapper" v-if="!isExamine">
      <el-button-group>
        <el-button type="default" size="medium" icon="el-icon-plus" @click="add">新增药店</el-button>
        <el-button type="default" size="medium" @click="seeIsExamine">审核列表</el-button>
        <el-button type="default" size="medium" @click="binding">绑定药柜</el-button>
      </el-button-group>
    </div>
    <!-- 搜索 -->
    <div class="search-wrapper">
      <el-form :inline="true" :model="screenInfo" size="small" ref="query_form">
        <el-form-item label="药店名称" prop="productName">
          <el-input v-model="screenInfo.sellerName" placeholder="药店名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <!-- <el-button type="default" @click="resetForm">清空</el-button> -->
          <el-button type="primary" @click="querySeller">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 表格区域 -->
    <div class="table-wrapper">
      <v-table ref="data_table" :is-loading="isLoding" column-width-drag is-horizontal-resize style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff" @on-custom-comp="customCompFunc"></v-table>
    </div>
    <!-- 分页区域 -->
    <div class="pagin-wrapper">
      <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-size="screenInfo.pageSize" :page-index="screenInfo.pageIndex" :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
      </v-pagination>
    </div>
    <!-- 弹窗 -->
    <el-dialog title="绑定已有药柜" :visible.sync="dialogVisible" width="500px" @close="handleClose" :center='true' :modal-append-to-body="false" >
      <el-form :inline="true" size="small" :rules="rules" ref="deliveredDataRules" :model="cabinetInfo">
        <el-form-item label="药柜编号" :style="'padding-left:60px;'" prop="systemCode">
          <el-input v-model="cabinetInfo.systemCode" placeholder="请输入药柜编号" style="width:211px;"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="success" @click="queryCabinetCood">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import javaAjax from '@/utils/javaApiRequest';
import { getAccount } from '@/utils/auth';
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      rules: {
        systemCode: [{ required: true, message: '请输入药柜编号', trigger: 'blur' }]
      },
      dialogVisible: false,
      cabinetInfo: {
        systemCode: '',
        userId: getAccount()
      },
      screenInfo: {
        pageSize: 10,
        pageIndex: 1,
        sellerName: ''
      },
      tableData: [],
      columns: this.getColumns(),
      isLoding: true,
      total: 0,
      typeList: {
        '1': '商城',
        '2': '药店',
        '3': '药柜',
        // '4': '跨境电商'
      },
      // addressProvinceArray: [],
      // addressCityArray: []
    };
  },
  props: {
    isExamine: Boolean
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
    handleClose() {
      this.cabinetInfo.systemCode = '';
    },
    queryCabinetCood() {
      this.$refs['deliveredDataRules'].validate((valid) => {
        console.log(valid);
        if (valid) {
          // 确定绑定
          let param = this.cabinetInfo;
          javaAjax.post('/mall_manage_seller/back/seller/sellerBindAccount', param).then(res => {
            console.log(res);
            this.$message.success(res.data.msg);
            this.dialogVisible = false;
          });
        } else {
          return false;
        }
      });
    },
    getColumns() {
      let _self = this;
      let columns = [
        {
          field: 'custome', title: '序号', width: 50, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.screenInfo.pageIndex - 1) * _self.screenInfo.pageSize + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'sellerName', title: '商户名称', width: 200, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'businessType', title: '商户类型', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'brand', title: '所属品牌', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'addressProvince', title: '省份', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'addressCity', title: '城市', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'detailAddress', title: '药店地址', width: 230, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'mobile', title: '手机号', width: 130, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'auditStatus', title: '当前状态', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'operation', title: '操作', width: 200, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operation-business', isResize: true }
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
        if (item.field === 'businessType') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let v = rowData[field];
            let value = _self.typeList[v];
            return value || '-';
          };
        }
        if (item.field === 'auditStatus') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === '1') {
              return '<span style="color:#f56c6c">待审核<span>';
            } else if (value === '2' && _self.isExamine) {
              return '<span style="color:#67c23a">审核通过</span>';
            } else if (value === '2' && !_self.isExamine) {
              return '<span style="color:#67c23a">正常</span>';
            } else if (value === '3') {
              return '<span style="color:#f56c6c">审核未通过</span>';
            } else if (value === '4') {
              return '<span style="color:#f56c6c">停用</span>';
            } else if (value === '5') {
              return '<span style="color:#f56c6c">待完善<span>';
            } else {
              return '-';
            }
          };
        }
      }
      return columns;
    },
    customCompFunc(param) {
      if (param.type === 'seeInformation') { // do delete operation
        this.$router.push('/seller-control/sellerDetail?id=' + param.rowData.sellerUserId);
        localStorage.setItem('sellerid', param.rowData.sellerUserId);
      }
    },
    binding() {
      // 绑定药柜
      this.dialogVisible = true;
    },
    // 切换分页
    pageChange(pageIndex) {
      this.isLoding = true;
      this.screenInfo.pageIndex = pageIndex;
      this.getSellerData();
    },
    // 切换每页显示的数量
    pageSizeChange(pageSize) {
      this.isLoding = true;
      this.screenInfo.pageIndex = 1;
      this.screenInfo.pageSize = pageSize;
      this.getSellerData();
    },
    // x新增
    add() {
      this.$router.push('/sellerAdd');
    },
    seeIsExamine() {
      this.$router.push('/seller-control/toExamine');
    },
    querySeller() {
      // 查询
      this.screenInfo.pageIndex = 1;
      this.screenInfo.pageSize = 10;
      this.getSellerData();
    },
    getSellerData() {
      let url = this.isExamine ? '/mall_manage_seller/authority/querySellerUserAudit' : '/mall_manage_seller/authority/queryPharmacies';
      javaAjax.post(url, this.screenInfo).then((res) => {
        // console.log(res);
        if (res.status === 200 && res.data.resultCode === '0') {
          this.isLoding = false;
          this.tableData = res.data.resultData.data;
          this.total = res.data.resultData.total;
        }
      });
    }
  },
  created() {
    this.getSellerData();
    // this.getProvincials();
  }
};
</script>

<style lang="less" scoped>
  .seller-List{
    background: #fff;
  }
</style>
