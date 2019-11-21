<template>
  <div class="invigorationRecipeList" v-loading="loading" element-loading-text="正在为您匹配医生，请稍等" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
    <headers></headers>
    <div class="invigorationRecipeList_main">
      <div class="nvigtitle">
        <!-- <span class="nvigtitletitle_left">就诊人信息</span> -->
        <span class="nvigtitle_right" @click="selectList">
          <i class="right_icon"></i>
          列表中选择
        </span>
      </div>
      <el-form :model="patientForm" :rules="rulesPatient" ref="infoForm" label-width="80px" class="info_form_rule">
        <el-form-item label="姓名" prop="name">
          <el-input v-model.trim="patientForm.name" placeholder="请输入就诊人姓名" maxlength="20"></el-input>
          <!-- <el-button type="success" @click="startRogation">列表中选择</el-button> -->
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="patientForm.gender" class="sexRadio">
            <el-radio-button label="1">男</el-radio-button>
            <el-radio-button label="0">女</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model.trim="patientForm.age" placeholder="请输入就诊人年龄" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model.trim="patientForm.mobile" placeholder="请输入就诊人手机号" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="病情描述">
          <el-input type="textarea" maxlength="200" autosize resize="none" placeholder="请输入病情描述" v-model.trim="patientForm.Description"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" maxlength="200" autosize resize="none" placeholder="请输入备注" v-model.trim="patientForm.remarks"></el-input>
        </el-form-item>
      </el-form>
      <div class="btn">
        <el-button type="success" @click="startRogation">开始问诊</el-button>
      </div>
      <div class="protocol con">
        <i class="icon-protocol" :class="{'icon-have':readShow}" @click="read"></i>
        <span class="read">我已认真阅读并接受</span>
        <span class="ser" @click="UserProtocolShow">《问诊服务协议》</span>
      </div>
    </div>
    <el-dialog title="康美药葫芦用户问诊服务协议" :visible.sync="protocolShow" :modal-append-to-body="false" width="700px">
      <div class="protocol_wrap">
        <p><span>1、</span>本协议是在线问诊用户使用者（以下简称“您”）与康美药葫芦之间关于您使用本网站在线问诊服务所订立的协议。请您务必仔细阅读，充分理解条约各项内容，特别是有关责任限制或免责条款。</p>
        <p><span>2、</span>您在使用网站在线问诊就诊前应确定在签署此《康美药葫芦用户问诊服务协议》。您在康美药葫芦平台搜索、咨询、享受医疗健康信息、在线问诊、与其它用户交流及享受其他健康类服务，即代表您已经同意本条约，且完全认可、接受康美药葫芦的在线问诊统一管理。</p>
        <p><span>3、</span>康美药葫芦在线问诊向您提供的远程医疗服务，包括咨询、在线问诊等。</p>
        <p><span>4、</span>您在康美药葫芦在线问诊咨询、就诊前，应按要求提供您本人真实身份信息，提交真实病情等资料，并有责任按照要求填写预约申请单（包括用户/患者的基本资料、疾病资料等信息），所有信息必须准确、真实、有效，因您所提交的信息本身有误或资料填写不完整、不准确所导致的后果及法律风险由您自行负责。</p>
        <p><span>5、</span>康美药葫芦的在线问诊主要以咨询、复诊为主，对于急危重症患者建议到就近医疗机构就诊，医生在线问诊有权拒绝接诊；婴幼儿、孕产妇等因疾病的特殊性、病情变化快、病史难采集。</p>
        <!-- <p><span>6、</span>康美药葫芦的在线问诊电子处方开具的药品配送只有在康美药葫芦指定的药房配送才具有处方效力，康美药葫芦不承担患者下载处方购药所导致的所有法律责任。</p>
        <p><span>7、</span>药葫芦的在线问诊电子处方开具的药品配送只有在药葫芦指定的药房配送才具有处方效力，药葫芦不承担患者下载处方购药所导致的所有法律责任。</p> -->
        <p><span>6、</span>您应妥善保管好自己的注册用户名和密码，您的注册用户名和密码一旦登录康美药葫芦进行诊疗活动，即认为由您本人操作使用，所产生的法律效果和风险由您承担。</p>
        <p><span>7、</span>发生医疗投诉、医疗纠纷、医疗事故时依据《医疗事故处理条例》执行。</p>
        <p><span>8、</span>本协议中免责条款任何约定条款如与中华人民共和国法律相抵触，则该条款将按照法律规定予以解释，而其它条款仍然具有法律效力。康美药葫芦保留必要时随时修改上述免责及其他条款的权利，您可以在免责条款中查阅最新修改条款，如您继续以任何方式登录康美药葫芦的在线问诊或直接、间接使用本网站资料的，视为自愿接受康美药葫芦的在线问诊免责条款的约束。</p>
      </div>
    </el-dialog>
    <el-dialog title="选择就诊人" :visible.sync="memberShow" center="" :modal-append-to-body="false" width="500px" class="member_list" @close="memberClose">
      <div class="seach">
        <el-input v-model.trim="name" placeholder="就诊人姓名" maxlength="20"></el-input>
        <el-button type="success" @click="seach">搜索</el-button>
        <ul class="list_header">
          <li class="list_item">姓名</li>
          <li class="list_item">性别</li>
          <li class="list_item">年龄</li>
          <li class="list_item">手机号</li>
        </ul>
        <div class="list_wrap">
          <ul class="list" v-if="memberList.length > 0">
            <li class="list_item" v-for="(item,index) in memberList" :key="index" @click="selectMember(item)">
              <div class="item_box name">{{item.name}}</div>
              <div class="item_box" v-html="item.gender === 0 ? '女': '男'"></div>
              <div class="item_box">{{item.age}}岁</div>
              <div class="item_box">{{item.mobile}}</div>
            </li>
          </ul>
          <div class="no_data" v-if="memberList.length === 0">暂无就诊人~</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ajax from '@/utils/ajax';
import { editMember, getMember } from '@/api/editMember';
import header from './compents/header';
export default {
  data() {
    return {
      patientForm: {
        name: '',
        gender: '1',
        age: '',
        description: '',
        mobile: '',
        memberid: '',
        is_default: 0,
        Description: '',
        remarks: ''
      },
      rulesPatient: {
        name: [{ required: true, message: '请输入就诊人姓名', trigger: 'change' }],
        age: [{ required: true, validator: this.validAge, trigger: 'change' }],
        mobile: [{ required: true, validator: this.validMobile, trigger: 'change' }]
      },
      readShow: true,
      protocolShow: false,
      memberShow: false,
      name: '',
      memberList: [],
      loading: false
    };
  },
  components: {
    'headers': header
  },
  methods: {
    validAge(rule, value, callback) {
      const reg = /^((1[0-9])|[1-9])?\d$/;
      if (value === '') {
        callback(new Error('请输入就诊人年龄'));
      } else if (!reg.test(value)) {
        callback(new Error('年龄只能为0-199的数字'));
      } else {
        callback();
      }
    },
    // 验证手机号
    validMobile(rule, value, callback) {
      let mobileReg = /^1[3-9][0-9]\d{8}$/;
      if (value === '') {
        callback(new Error('请输入手机号码'));
      } else if (!mobileReg.test(value)) {
        callback(new Error('请输入有效的11位手机号码'));
      }
      else {
        callback();
      }
    },
    read() {
      if (this.readShow) {
        this.readShow = false;
      } else {
        this.readShow = true;
      }
    },
    UserProtocolShow() {
      this.protocolShow = true;
    },
    // 选择就诊人
    selectMember(item) {
      this.patientForm.name = item.name;
      this.patientForm.gender = item.gender;
      this.patientForm.age = item.age;
      this.patientForm.description = item.description;
      this.patientForm.mobile = item.mobile;
      this.patientForm.memberid = item.memberid;
      this.patientForm.is_default = item.is_default;
      this.memberShow = false;
    },
    startRogation() {
      if (this.readShow) {
        this.$refs['infoForm'].validate((valid) => {
          if (valid) {
            let data = {
              name: this.patientForm.name,
              gender: this.patientForm.gender,
              age: this.patientForm.age,
              description: this.patientForm.description,
              mobile: this.patientForm.mobile,
              memberid: this.patientForm.memberid,
              is_default: this.patientForm.is_default,
            };
            localStorage.setItem('memberInfo', JSON.stringify(data));
            editMember(data).then(res => {
              if (res) {
                console.log(res);
                let submit = {
                  ConsultType: 1,
                  MemberID: res.data.memberid,
                  Description: this.patientForm.Description,
                  source: '来自药店系统',
                  ConsultSource: 6 // ConsultSource状态码: 1药葫芦 2问诊室 3药柜 4药箱 5电商 6 药店
                };
                localStorage.setItem('description', this.patientForm.Description);
                localStorage.setItem('remarks', this.patientForm.remarks);
                this.sumbit(submit);
              }
            });
          } else {
            return false;
          }
        });
      } else {
        this.$alert('您还未同意问诊服务协议', '', {
          showClose: false,
          confirmButtonText: '确定',
          confirmButtonClass: 'cinfirmBtn',
          customClass: 'prompt'
        });
      }
    },
    sumbit(info) {
      this.loading = true;
      ajax.post('/api/user/consulted', info).then(res => {
        console.log(res);
        if (res.status === 200 && res.data.code === 0 && res.data.data) {
          console.log(res.data.data);
          sessionStorage.setItem('doctorInfo', JSON.stringify(res.data.data));
          // window.location.href = `${process.env.WEB_HOST}/consultChat/index?r=${Math.random()}`;
          setTimeout(() => {
            this.$store.dispatch('delAllViews');
            this.loading = false;
            // window.location.href = `${process.env.WEB_HOST}/invigorationRecipe/consultChat?r=${Math.random()}`;
            this.$router.push(`/invigorationRecipe/consultChat?r=${Math.random()}`);
          }, 2000);
        }
      });
    },
    seach() {
      this.getList();
    },
    selectList() {
      this.memberShow = true;
      this.getList();
    },
    memberClose() {
      this.name = '';
    },
    getList() {
      let data = {
        name: this.name,
        pageIndex: 1,
        pageSize: 550
      };
      getMember(data).then(res => {
        console.log(res);
        this.memberList = res.data;
      });
    },
  },
  created() {
    if (this.$route.query.rest) {
      this.$router.push('/invigorationRecipe/invigorationRecipe');
      setTimeout(() => {
        window.location.reload();
      }, 300);
    }
  }
};
</script>

<style lang="less" scoped>
@import '../../../styles/common.less';
.invigorationRecipeList{
  // width: 1400px;
  background: #fff;
  margin: 0 auto;
  .invigorationRecipeList_main{
    padding-left: 100px;
  }
  .nvigtitle{
    height: 40px;
    width: 400px;
    line-height: 40px;
    .nvigtitle_right{
      float: right;
      color: #32d6e6;
      cursor: pointer;
      display: flex;
      align-items: center;
      .right_icon{
        display: inline-block;
        width: 18px;
        height: 15px;
        background: url('./img/icon_list.png') no-repeat;
        background-size: 100% 100%;
      }
    }
  }
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
    /deep/.el-radio-button__orig-radio:checked+.el-radio-button__inner{
      background: #32d6e6;
      border: #32d6e6;
      box-shadow: 0 0 0 0;
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
    /deep/.el-button{
      background: #32d6e6;
      border-color: #32d6e6;
      width: 140px;
    }
  }
  .protocol{
    font-size: 14px;
    line-height: 26px;
    padding-top: 10px;
    padding-left: 80px;
    padding-bottom: 50px;
    .icon-protocol{
      width: 18px;
      height: 18px;
      display: inline-block;
      border-radius: 50%;
      border: 1px solid #999;
      float: left;
      margin-top: 4px;
      cursor: pointer;
    }
    .icon-have{
      background: url('./img/icon-choose_wzfw.png') no-repeat;
      border: none;
    }
    .read{
      color: #666;
      margin-left: 5px;
      float: left;
    }
    .ser{
      color: #32d6e6;
      float: left;
      cursor: pointer;
    }
  }
  /deep/.el-dialog__wrapper{
    .protocol_wrap{
      p{
        text-indent: 2em; /*em是相对单位，2em即现在一个字大小的两倍*/
        padding-right: 10px;
        // text-align: right;
        line-height: 25px;
        margin-top: 5px;
        letter-spacing: 2px;
        span{
          // font-size: 18px;
          font-weight: 900;
        }
      }
    }
  }
  .member_list{
    /deep/.el-input{
      width: 360px;
    }
    /deep/.el-button{
      background: #32d6e6;
      border-color: #32d6e6;
    }
    .list_header{
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #dcdfe6;
      .list_item{
        width: 90px;
        height: 50px;
        text-align: center;
        line-height: 50px;
        &:nth-last-child(1){
          width: 140px;
        }
      }
    }
    .list_wrap{
      width: 430px;
      overflow: hidden;
      .list{
        max-height: 560px;
        min-height: 300px;
        width: 450px;
        overflow-y: scroll;
        &::-webkit-scrollbar{
          display: none
        }
        .list_item{
          height: 50px;
          line-height: 50px;
          display: flex;
          justify-content: space-between;
          cursor: pointer;
          .item_box{
            width: 90px;
            text-align: center;
            &:nth-last-child(1){
              width: 140px;
            }
          }
          .name{
            .hidden-vertical(1);
          }
        }
      }
      .no_data{
        height: 300px;
        text-align: center;
        padding-top: 130px;
      }
    }
  }
}
</style>
