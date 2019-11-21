<template>
  <div class="userList">
    <!-- <div class="search-werap">
      <el-form :inline="true" :model="searchData" :rules="rules" size="small" ref="searchData">
        <el-form-item label="员工姓名:" prop="realName" class="roleNumber">
          <el-input v-model="searchData.employeeName" placeholder="请输入员工名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="员工账号:" prop="employeeName" class="roleNumber">
          <el-input v-model.number="searchData.employeeId" placeholder="请输入员工编号" clearable></el-input>
        </el-form-item>
        <el-form-item label="手机:" prop="mobile" class="roleNumber phone">
          <el-input v-model.number="searchData.mobile" placeholder="请输入手机号" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="default" @click="clean" icon="el-icon-delete">清 除</el-button>
          <el-button type="primary" @click="queryByNews" icon="el-icon-search">查 询</el-button>
        </el-form-item>
      </el-form>
    </div> -->
    <div class="toolbar-wrapper">
      <el-button-group>
        <el-button type="default" size="small" icon="el-icon-plus" @click="addUser">新增店员</el-button>
        <el-button type="default" size="small" icon="el-icon-delete" @click="batchDelete">批量删除</el-button>
        <el-button type="default" size="small" icon="el-icon-refresh" @click="query">刷新</el-button>
      </el-button-group>
    </div>
    <div class="table-wrapper">
      <v-table ref="data_table" column-width-drag :is-horizontal-resize="true" style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff"
      @on-custom-comp="customCompFunc" :select-all="selectALL" :select-change="selectChange" :select-group-change="selectGroupChange"></v-table>
    </div>
    <div class="pagin-wrapper">
      <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-size="searchData.pageSize" :page-index="searchData.pageIndex"
        :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
      </v-pagination>
    </div>
      <!-- 新增编辑对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="editShow"
      width="480px"
      center
      top="35vh"
      :modal-append-to-body="false"
      @close="clsoeActive"
      :close-on-click-modal="false">
      <el-form :model="formData" ref="FormRules" size="small"  label-width="130px" :rules="rules">
        <el-form-item label="店员姓名：" prop="realName">
          <el-input v-model="formData.realName" placeholder="请输入店员姓名"></el-input>
        </el-form-item>
        <el-form-item label="手机号：" prop="mobile">
          <el-input v-model="formData.mobile" placeholder="请输入手机号" :disabled="!isAdd"></el-input>
        </el-form-item>
        <el-form-item label="账号：" prop="employeeName">
          <el-input v-model="formData.employeeName" placeholder="请输入字母或数字组合的账号" :disabled="!isAdd"></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="password" v-if="isAdd">
          <el-input type="password" v-model="formData.password" placeholder="请输入6~20位长度的数字或字母密码"></el-input>
        </el-form-item>
        <el-form-item label="备注：" prop="remark">
          <el-input v-model="formData.remark" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="success" @click="save">完成</el-button>
      </span>
    </el-dialog>
          <!-- 修改密码对话框 -->
    <el-dialog
      title="修改密码"
      :visible.sync="passWordShow"
      width="480px"
      center
      top="35vh"
      :modal-append-to-body="false"
      @close="clsoeActive">
      <el-form :model="pass" ref="FormRules" size="small"  label-width="130px" :rules="passRules">
        <el-form-item label="密码：" prop="password">
          <el-input type="password" v-model="pass.password" placeholder="请输入6~20位长度的数字或字母密码"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="success" @click="savePassword">完成</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import java from '@/utils/javaApiRequest';
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      total: 0,
      tableData: [],
      selection: [],
      columns: this.getColumns(),
      searchData: {
        pageIndex: 1,
        pageSize: 10,
        // employeeName: '', //  账户
        // mobile: '', // 手机
        // realName: '', // 姓名
      },
      formData: {
        realName: '', // 姓名
        mobile: '', // 手机号
        employeeName: '', // 账号
        password: '', // 密码
        remark: '', // 备注
      },
      editShow: false,
      title: '',
      isAdd: '',
      rules: {
        employeeName: [
          { required: true, validator: this.validAccount, trigger: 'blur' }
        ],
        password: [
          { required: true, validator: this.validPassword, trigger: 'blur' },
        ],
        realName: [
          { required: true, validator: this.validName, trigger: 'blur' },
        ],
        mobile: [
          { required: true, validator: this.validatePhone, trigger: 'blur' },
        ],
      },
      passRules: {
        password: [
          { required: true, validator: this.validPassword, trigger: 'blur' },
        ],
      },
      passWordShow: false,
      pass: {
        password: '',
        account: '',
        role: '店员'
      }
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
    // 密码验证
    isvalidPassword(str) {
      const reg = /^([a-zA-Z0-9\.\@\!\#\$\%\^\&\*\(\)]){6,20}$/i;
      return reg.test(str);
    },
    validPassword(rule, value, callback) {
      if (!value) {
        callback(new Error('请输入密码'));
      } else if (!this.isvalidPassword(value)) {
        callback(new Error('请输入6~20位长度的数字或字母密码'));
      } else {
        callback();
      }
    },
    // 账号验证
    isvalidAccount(str) {
      const reg = /^[a-zA-Z0-9]/;
      return reg.test(str);
    },
    validAccount(rule, value, callback) {
      if (!value) {
        callback(new Error('请输入账号'));
      } else if (!this.isvalidAccount(value)) {
        callback(new Error('请输入字母或数字组合的账号'));
      } else {
        callback();
        this.phoneTrue = true;
      }
    },
    // 手机号验证
    validatePhone(rule, value, callback) {
      if (!value) {
        return callback(new Error('手机号不能为空'));
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error('请输入正确的手机号'));
        }
      }
    },
    // 姓名验证
    isvalidName(str) {
      const reg = /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/;
      return reg.test(str);
    },
    validName(rule, value, callback) {
      if (!value) {
        callback(new Error('请输入联系人'));
      } else if (!this.isvalidName(value)) {
        callback(new Error('请输入正确的联系人'));
      } else {
        callback();
      }
    },
    queryByNews() {  // 查询
      let _self = this;
      let param = {};
      param = _self.searchData;
      // console.log(param);
      java.post(`/mall_manage_seller/back/queryClerk`, param).then(res => {
        // console.log(res);
        if (res.status === 200 && res.data.resultCode === '0') {
          _self.tableData = res.data.resultData.data;
          _self.total = res.data.resultData.total;
        }
      });
    },
    clean() {  // 清除查询
      this.searchData.employeeId = '';
      this.searchData.employeeName = '';
      this.searchData.sex = '';
      this.searchData.mobile = '';
      this.searchData.email = '';
      this.searchData.remark = '';
      this.queryByNews();
    },
    addUser() {  // 新增用户
      this.editShow = true;
      this.isAdd = true;
      this.title = '新增店员';
      // this.$router.push('/employee/addEmployee');
    },
    remove(id) {  // 删除员工
      // console.log(id);
      let _self = this;
      let param = { employeeId: id };
      // console.log(param);
      java.post('/mall_manage_seller/back/deleteEmployee', param).then(res => {
        // console.log(res);
        if (res.status === 200 && res.data.resultCode === '0') {
          _self.$message({
            message: res.data.msg,
            type: 'success'
          });
          _self.queryByNews();
        } else {
          _self.$message({
            message: res.data.msg,
            type: 'error'
          });
        }
      });
    },
    batchDelete() {  // 批量删除
      if (this.selection.length > 0) {
        this.$confirm('此操作将永久删除该员工, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let idList = [];
          for (let item of this.selection) {
            idList.push(item.employeeId);
          }
          let idListStr = idList.join(',');
          // console.log(idListStr);
          this.remove(idListStr);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      } else {
        this.$alert('请选择删除的内容', '提示', {
          confirmButtonText: '确定',
        });
      }
    },
    query() {  // 更新
      this.queryByNews();
    },
    getColumns() {
      let _self = this;
      let columns = [
        { width: 60, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        {
          field: 'custome', title: '序号', width: 50, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.searchData.pageIndex - 1) * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'realName', title: '姓名', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'mobile', title: '手机号', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'employeeName', title: '账号', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'password', title: '密码', width: 120, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'remark', title: '备注', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'isDisable', title: '状态', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'email', title: '邮箱', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'modifyDate', title: '修改时间', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'operation', title: '操作', width: 150, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operation-employeeManage', isResize: true }
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
        if (item.field === 'isDisable') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === 0) {
              return '<span style="color:green">启用</span>';
            } else if (value === -1) {
              return '<span style="color:red">停用</span>';
            }
          };
        }
      }
      return columns;
    },
    // table operaion
    customCompFunc(params) {
      if (params.type === 'delete') { // do delete operation
        this.$confirm('此操作将永久删除该员工, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.remove(params.rowData.employeeId);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      } else if (params.type === 'modifyEmployee') {
        // this.$router.push('/employee/modifyEmployee?rowData=' + JSON.stringify(params.rowData));
        this.isAdd = false;
        this.editShow = true;
        this.formData = {
          employeeId: params.rowData.employeeId, // id
          realName: params.rowData.realName, // 姓名
          mobile: params.rowData.mobile, // 手机号
          employeeName: params.rowData.employeeName, // 账号
          // password: params.rowData.password, // 密码
          remark: params.rowData.remark, // 备注
        };
        this.title = '编辑店员';
      }
      if (params.type === 'start') {
        this.$confirm('此操作将启用该员工, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let obj = {
            isDisable: 0,
            employeeId: params.rowData.employeeId
          };
          this.employeeOption(obj);
        });
      }
      if (params.type === 'stop') {
        this.$confirm('此操作将停用该员工, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let obj = {
            isDisable: -1,
            employeeId: params.rowData.employeeId
          };
          this.employeeOption(obj);
        });
      }
      if (params.type === 'modifyPassword') {
        this.passWordShow = true;
        this.pass.account = params.rowData.employeeName;
      }
    },
    employeeOption(param) {
      java.post('/mall_manage_seller/back/updateDisable', param).then(res => {
        // console.log(res);
        if (res.status === 200 && res.data.resultCode === '0') {
          this.$message({
            showClose: true,
            message: '成功',
            type: 'success'
          });
          this.query();
        }
      });
    },
    savePassword() {
      let param = this.pass;
      java.post('/mall_manage_seller/back/updateEmpPassword', param).then(res => {
        console.log(res);
        if (res.status === 200 && res.data.resultCode === '0') {
          this.passWordShow = false;
          this.$message({
            showClose: true,
            message: '操作成功',
            type: 'success'
          });
          this.query();
        }
      });
    },
    save() {
      let _self = this;
      _self.$refs['FormRules'].validate((valid) => {
        if (valid) {
          if (_self.isAdd) {
            let params = {
              phone: _self.formData.mobile,
              isTrue: 3,
            };
            java.post('/mall_manage_seller/back/login/phoneTrue', params).then(res => {
              if (res.status === 200 && res.data.resultCode === '0') {
                if (res.data.resultData === 'false') {
                  _self.$message.warning('该手机号已经被注册过了！');
                } else {
                  console.log(res.data);
                  _self.savecom();
                }
              }
            });
          } else {
            _self.savecom();
          }
          // _self.savecom();
        } else {
          return false;
        }
      });
    },
    savecom() {
      let _self = this;
      let param = _self.formData;
      let msg = '操作成功';
      let url = _self.isAdd ? '/mall_manage_seller/back/saveEmployee' : '/mall_manage_seller/back/updateEmployee';
      java.post(url, param).then(res => {
        // console.log(res);
        if (res.status === 200 && res.data.resultCode === '0') {
          _self.editShow = false;
          _self.$message({
            showClose: true,
            message: msg,
            type: 'success'
          });
          _self.query();
        }
      });
    },
    // 关闭弹窗
    clsoeActive() {
      this.formData = {};
      this.$refs['FormRules'].resetFields();
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
    // 分页
    pageChange(pageIndex) {
      this.searchData.pageIndex = pageIndex;
      this.queryByNews();
    },
    pageSizeChange(pageSize) {
      this.searchData.pageIndex = 1;
      this.searchData.pageSize = pageSize;
      this.queryByNews();
    },
  },
  created() {
    this.queryByNews();
  }
};
</script>
<style lang="less" scoped>
.userList{
  background: #fff;
  .search-werap{
    .roleNumber{
      width: 350px;
      margin-left: 10px;
    }
    .phone{
      margin-left: 39px;
    }
    .remark{
      margin-left: -19px;
    }
  }
}
</style>

