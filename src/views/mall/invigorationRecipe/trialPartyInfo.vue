<template>
  <div class="info">
    <el-form :model="patientForm" :rules="rules" ref="infoForm" label-width="80px" class="info_form_rule">
      <el-form-item label="处方图片" prop="recipe_pic_url">
        <uploadSingleImg :imgUrl="patientForm.recipe_pic_url" :fileName="'recipe_pic_url'" @uploadSuccess="uploaddrugLicenses" @removeImg="removerugLicenses"></uploadSingleImg>
      </el-form-item>
      <el-form-item label="患者姓名" prop="consignee">
        <el-input v-model.trim="patientForm.consignee" placeholder="请输入患者姓名" maxlength="20"></el-input>
        <!-- <el-button type="success" @click="startRogation">列表中选择</el-button> -->
      </el-form-item>
      <el-form-item label="是否孕妇" prop="remark">
        <el-radio-group v-model="patientForm.is_pregnant" class="sexRadio">
          <el-radio-button :label="0">否</el-radio-button>
          <el-radio-button :label="1">是</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="剂数" prop="suffering_num">
        <el-input v-model.trim="patientForm.suffering_num" placeholder="请输入剂数" maxlength="3"></el-input>
      </el-form-item>
      <!-- <el-form-item label="手机号" prop="mobile">
        <el-input v-model.trim="patientForm.mobile" placeholder="请输入就诊人手机号" maxlength="20"></el-input>
      </el-form-item> -->
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" maxlength="60" autosize resize="none" placeholder="请输入备注" v-model.trim="patientForm.remark"></el-input>
      </el-form-item>
    </el-form>
    <div class="btn">
      <el-button type="success" @click="startRogation">提交审核</el-button>
    </div>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex';
import uploadImg from '@/components/upload/uploadImg';
import ajax from '@/utils/ajax';
import { getLoginID } from '@/utils/auth';
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      patientForm: {
        recipe_pic_url: '',
        suffering_num: '',
        consignee: '',
        is_pregnant: 0,
        source: '10059', // id
        remark: '',
        mobile: '',
        userid: getLoginID(),
        StoreId: getLoginID(),
        StoreName: '',
      },
      rules: {
        recipe_pic_url: [{ required: true, message: '请选择处方图片', trigger: 'blur' }],
        consignee: [{ required: true, message: '请输入患者姓名', trigger: 'blur' }],
        suffering_num: [{ required: true, validator: this.validnum, trigger: 'blur' }],
        // mobile: [{ required: false, validator: this.validMobile, trigger: 'blur' }]
      }
    };
  },
  components: {
    'uploadSingleImg': uploadImg
  },
  computed: {
    ...mapGetters([
      'name',
    ]),
  },
  methods: {
    validnum(rule, value, callback) {
      const reg = /^[1-9]\d*$/;
      if (value === '') {
        callback(new Error('请输入剂数'));
      } else if (!reg.test(value)) {
        callback(new Error('剂数只能为正整数'));
      } else {
        callback();
      }
    },
    // 验证手机号
    // validMobile(rule, value, callback) {
    //   let mobileReg = /^1[3-9][0-9]\d{8}$/;
    //   if (value && !mobileReg.test(value)) {
    //     callback(new Error('请输入有效的11位手机号码'));
    //   }
    //   else {
    //     callback();
    //   }
    // },
    uploaddrugLicenses(data) {
      this.patientForm.recipe_pic_url = data.url;
    },
    removerugLicenses() {
      this.patientForm.recipe_pic_url = '';
    },
    startRogation() {
      this.patientForm.StoreName = this.name;
      console.log(JSON.stringify(this.patientForm));
      this.$refs['infoForm'].validate((valid) => {
        if (valid) {
          ajax.post('api/prescription/upload', this.patientForm).then(res => {
            console.log(res);
            if (res.status === 200 && res.data.code === 0 && res.data.data) {
              this.$message.success('提交成功');
              this.$refs['infoForm'].resetFields();
            }
          });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.info{
  padding-left: 100px;
  .info_form_rule{
    /deep/.el-input{
      width: 320px;
    }
    /deep/.el-radio-button{
      width: 100px;
      margin-right: 20px;
      .el-radio-button__inner{
        width: 100%;
        border-radius: 4px;
        border-left: 1px solid #dcdfe6;
      }
    }
    /deep/.is-active{
      .el-radio-button__inner{
        background: #32d6e6;
        border: #32d6e6;
        box-shadow: 0 0 0 0;
      }
    }
    /deep/.el-textarea{
      width: 650px;
      height: 112px;
      textarea{
        height: 100% !important;
      }
    }
  }
  .btn{
    padding-inline-start: 80px;
    padding-bottom: 100px;
    /deep/.el-button{
      background: #32d6e6;
      border-color: #32d6e6;
      width: 140px;
    }
  }
}

</style>
