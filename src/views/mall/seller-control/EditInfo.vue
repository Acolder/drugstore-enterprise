<template>
  <div class="infoEdit">
    <div class="info_box">
      <el-form :model="editData" :rules="rules" ref="editValidateForm" label-width="130px" size="small">
        <h2 class="item-header">结算信息</h2>
        <div class="info">
          <el-row>
            <el-col :span="12">
              <el-form-item label="商户名称:" prop="generalName">
                <el-input v-model="editData.generalName" placeholder="请输入商户名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="开户人:" prop="accountHolder">
                <el-input v-model="editData.accountHolder" placeholder="请输入开户人"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="开户行:" prop="openingBank">
                <el-select v-model="editData.openingBank" size='small'>
                  <el-option
                    v-for="item in bankList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.label">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="银行卡号:" prop="bankCardNumber">
                <el-input v-model="editData.bankCardNumber" placeholder="请输入银行卡号"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="button-box">
          <el-button type="primary" @click="submit">确认修改</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import javaAjax from '@/utils/javaApiRequest';
import { getUserID } from '@/utils/auth';
// import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      editData: {
        generalName: '',
        accountHolder: '',
        bankCardNumber: '',
        openingBank: '',
        userId: getUserID()
      },
      bankList: [
        { value: '1', label: '中国工商银行' },
        { value: '2', label: '中国农业银行' },
        { value: '3', label: '中国建设银行' },
        { value: '4', label: '中国银行' },
        { value: '5', label: '交通银行' },
        { value: '6', label: '中信银行' },
        { value: '7', label: '中国光大银行' },
        { value: '8', label: '华夏银行' },
        { value: '9', label: '中国明生银行' },
        { value: '10', label: '兴业银行' },
        { value: '11', label: '招商银行' },
        { value: '12', label: '平安银行' },
        { value: '13', label: '上海浦东发展银行' },
        { value: '14', label: '恒丰银行' },
        { value: '15', label: '浙商银行' },
        { value: '16', label: '渤海银行' },
        { value: '17', label: '中国邮政储蓄银行' },
      ],
      rules: {
        generalName: [{ required: true, message: '请输入商户名称', trigger: 'blur' }],
        accountHolder: [{ required: true, message: '请输入开户人名称', trigger: 'blur' }],
        openingBank: [{ required: true, message: '请选择开户行', trigger: 'change' }],
        bankCardNumber: [{ required: true, validator: this.validBanck, trigger: 'blur' }],
      }
    };
  },
  // computed: {
  //   ...mapGetters([
  //     'sellerID',
  //   ]),
  // },
  methods: {
    // 银行卡验证
    isvalidBanck(str) {
      const reg = /^\d{16,19}$/;
      return reg.test(str);
    },
    validBanck(rule, value, callback) {
      if (value !== '') {
        if (!this.isvalidBanck(value)) {
          callback(new Error('请输入16-19位数字正确的银行卡号'));
        } else {
          callback();
        }
      } else {
        callback();
      }
    },
    submit() {
      // 提交
      // this.editData.userId = this.sellerID;
      this.$refs['editValidateForm'].validate((valid) => {
        if (valid) {
          javaAjax.post('/mall_manage_seller/back/updateUserBalance', this.editData).then((res) => {
            // console.log(res);
            if (res.status === 200 && res.data.resultCode === '0') {
              this.$message.success(res.data.msg);
            }
          });
        }
      });
    },
    getInfo() {
      // console.log(this.sellerID);
      let param = {
        userId: getUserID(),
        pageIndex: 1,
        pageSize: 10,
        userName: '',
        realName: '',
        phone: '',
        email: '',
        headPortrait: ''
      };
      javaAjax.post('/mall_manage_seller/back/queryUserList', param).then((res) => {
        console.log(res);
        if (res.status === 200 && res.data.resultCode === '0') {
          // this.$message.success(res.data.msg);
          this.editData.generalName = res.data.resultData.data[0].generalName;
          this.editData.accountHolder = res.data.resultData.data[0].accountHolder;
          this.editData.openingBank = res.data.resultData.data[0].openingBank;
          this.editData.bankCardNumber = res.data.resultData.data[0].bankCardNumber;
        }
      });
    }
  },
  created() {
    this.getInfo();
  }
};
</script>

<style lang="less" scoped>
.infoEdit{
  background: #fff;
}
.info_box{
  h2{
    height: 50px;
    line-height: 50px;
    padding-left: 20px;
    font-size: 18px;
  }
  .info{
    padding: 20px 0px;
    // background: #cacaca;
    // border: 1px solid #dcdfe6;
    /deep/ .el-row{
      margin-top: 15px;
    }
    /deep/ .el-input__inner{
      width: 320px;
    }
  }
  .button-box{
    padding-top: 20px;
    text-align: center;
    padding-bottom: 30px;
  }
}
</style>
