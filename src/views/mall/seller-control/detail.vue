<template>
  <div class="detail">
    <div class="box-list">
      <h2 class="item-header">店铺信息</h2>
      <div class="info" v-if="!editvalid">
        <el-row>
          <el-col :span="8">
            <span>
              <span class="label">药店名称：</span>
              <span class="content">{{detailData.sellerName}}</span>
            </span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <span>
              <span class="label">门店电话：</span>
              <span class="content">{{detailData.mobile}}</span>
            </span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <span>
              <span class="label label_img">门脸照：</span>
              <span class="content">
                <img :src="detailData.frontPhotos" alt="">
              </span>
            </span>
          </el-col>
        </el-row>
      </div>
      <div class="info" v-else>
        <el-form :model="detailData" :rules="rules" ref="infoForm" label-width="80px" class="info_form_rule">
          <el-form-item label="门店名称" prop="sellerName">
            <el-input v-model.trim="detailData.sellerName" placeholder="请输入门店名称" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="门店电话" prop="mobile">
            <el-input v-model.trim="detailData.mobile" placeholder="请输入门店电话" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="门脸照" prop="frontPhotos">
            <div class="upload">
              <uploadSingleImg :imgUrl="detailData.frontPhotos" :fileName="'frontPhotos'" @uploadSuccess="uploadfrontPhotos" @removeImg="removefrontPhotos"></uploadSingleImg>
            </div>
          </el-form-item>
        </el-form>
        <i class="close el-icon-close" @click="close"></i>
        <el-button class="save_btn" type="success" @click="save">保存</el-button>
      </div>
    </div>
    <div class="button_info"  v-if="!editvalid">
      <el-button type="warning" @click="edit">修改</el-button>
      <el-button type="warning" @click="setting">设置店员</el-button>
    </div>
  </div>
</template>

<script>
import javaAjax from '@/utils/javaApiRequest';
import uploadImg from '@/components/upload/uploadImg';
export default {
  data() {
    return {
      id: this.$route.query.id ? this.$route.query.id : localStorage.getItem('sellerid'),
      detailData: {},
      rules: {
        sellerName: [{ required: true, message: '请输入门名称', trigger: 'blur' }],
        mobile: [{ required: true, validator: this.validmobile, trigger: 'blur' }],
        frontPhotos: [{ required: true, message: '请选择门脸照片', trigger: 'blur' }],
      },
      editvalid: false
    };
  },
  components: {
    'uploadSingleImg': uploadImg
  },
  methods: {
    getDetail() {
      let param = {
        sellerUserId: this.id
      };
      javaAjax.post('/mall_manage_seller/authority/queryBusinessDetails', param).then(res => {
        console.log(res);
        if (res.status === 200 && res.data.resultCode === '0') {
          this.detailData = res.data.resultData.sellerUser;
        }
      });
    },
    setting() {
      this.$router.push('/employee/employeeList');
    },
    edit() {
      // this.$router.push('/seller-control/editSeller?id=' + this.detailData.sellerUserId);
      this.editvalid = true;
    },
    // 门店电话
    isvalidmobile(str) {
      let reg = /^([\d\-\/]){1,20}$/;
      return reg.test(str);
    },
    validmobile(rule, value, callback) {
      if (!value) {
        callback(new Error('请输入门店号码'));
      } else if (!this.isvalidmobile(value)) {
        callback(new Error('门店号码只能是数字或者-'));
      } else {
        callback();
      }
    },
    // 切换药店
    switchSeller() {
      let param = {
        sellerUserId: this.id
      };
      javaAjax.post('/mall_manage_seller/authority/updateSellerId', param).then(res => {
        console.log(res);
        if (res.status === 200 && res.data.resultCode === '0') {
          this.getDetail();
        }
      });
    },
    uploadfrontPhotos(data) {
      this.detailData.frontPhotos = data.url;
    },
    removefrontPhotos() {
      this.detailData.frontPhotos = '';
      console.log(this.detailData.frontPhotos);
    },
    close() {
      // 11
      this.editvalid = false;
    },
    save() {
      this.$refs['infoForm'].validate((valid, param) => {
        if (valid) {
          this.editvalid = false;
          // this.detailData.auditStatus = 1;
          let obj = {
            sellerName: this.detailData.sellerName,
            mobile: this.detailData.mobile,
            frontPhotos: this.detailData.frontPhotos,
          };
          let url = '/mall_manage_seller/authority/updateMessage';
          javaAjax.post(url, obj).then((res) => {
            // console.log(res);
            if (res.status === 200 && res.data.resultCode === '0') {
              this.$message.success(res.data.msg);
            }
          });
        } else {
          return;
        }
      });
    }
  },
  created() {
    this.switchSeller();
  }
};
</script>

<style lang="less" scoped>
.detail{
  padding-bottom: 40px;
  // background: #fff;
  // box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
}
.button_info{
  text-align: center;
}
.box-list{
  border: 1px solid #E4E7ED;
  border-left: none;
  border-right: none;
  // border-top: none;
  margin-bottom: 15px;
  h2{
    height: 50px;
    line-height: 50px;
    background: #fff;
    // background: #f6f8f8;
    // color: #fff;
    padding-left: 25px;
    font-size: 18px;
  }
  .info{
    padding: 20px 60px;
    background: #fff;
    position: relative;
    /deep/ .el-row{
      margin-top: 25px;
    }
    /deep/ .el-button{
      width: 100px;
    }
    .label{
      display: inline-block;
      width: 80px;
      text-align: right;
    }
    .content{
      img{
        width: 100px;
        height: 60px;
      }
    }
    /deep/.el-input{
      width: 420px;
    }
    .close{
      position: absolute;
      top: 10px;
      right: 20px;
      cursor: pointer;
      &:hover{
        background: #f00;
        color: #fff;
        border-radius: 50%;
      }
    }
  }
}
</style>
