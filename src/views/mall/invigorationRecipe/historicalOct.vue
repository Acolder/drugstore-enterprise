<template>
  <div class="record">
    <headers></headers>
    <div class="record_content">
      <div class="record_header">
        <div class="left">
        </div>
        <div class="right">
          <div class="search">
            <!-- <i class="el-icon-arrow-down icon-year"></i></th> -->
            <el-date-picker
              v-model="date"
              type="month"
              placeholder="请选择日期"
              value-format="yyyy-M"
              @change="searchInfo"
              :editable="false">
            </el-date-picker>
            <!-- <el-date-picker  placeholder="选择年份" @change='selectYear' clearable format="yyyy 年" value-format="yyyy" name='xcc' :editable=false class="select-year" popper-class='xcc' prefix-icon='false' v-model="search.Year" type="year">
            </el-date-picker>
            <el-select v-model="search.Month" clearable name="xcc" placeholder="选择月份" class="select" @change="changeMonth" v-if="search.Year">
              <el-option v-for="(i,index) in monthList" :key="index" :label="i.label" :value="i.value">
              </el-option>
            </el-select> -->
            <el-input  placeholder="输入医生" v-model.trim="search.DoctorName"></el-input>
            <el-input  placeholder="输入就诊人" v-model.trim="search.MemberName"></el-input>
            <!-- <input type="text" v-model.trim="search.DoctorName" placeholder="输入医生">
            <input type="text" v-model.trim="search.MemberName" placeholder="输入就诊人"> -->
            <button @click="searchInfo">搜索</button>
          </div>
        </div>
      </div>
      <div class="main">
        <ul class="main-header">
          <li class="list-item">就诊人</li>
          <li class="list-item">附件</li>
          <li class="list-item">医生</li>
          <li class="list-item">金额</li>
          <li class="list-item">时间</li>
          <li class="list-item">处方单号</li>
          <li class="list-item">操作</li>
          <!-- <li class="list-item">
            <el-date-picker  placeholder="选择年份" @change='selectYear' clearable format="yyyy 年" value-format="yyyy" name='xcc' :editable=false class="select-year" popper-class='xcc' prefix-icon='false' v-model="search.Year" type="year">
            </el-date-picker>
            <el-select v-model="search.Month" clearable name="xcc" placeholder="选择月份" class="select" @change="changeMonth">
              <el-option v-for="(i,index) in monthList" :key="index" :label="i.label" :value="i.value">
              </el-option>
            </el-select>
            <i class="el-icon-arrow-down icon-year"></i>
          </li> -->
        </ul>
        <div class="table-wrap">
          <div class="table-right">
            <div class="loading" v-if="recordData.length === 0">
              <img src="./img/icon_nocontent.png" alt="">
              <p>暂无内容...</p>
            </div>
            <table class="table" v-if="recordData.length !== 0">
              <tr v-for="(item,index) in recordData" :key="index">
                <th class="name">{{item.membername}}</th>
                <th>
                  <img class="recipeImg" :src="defaultImg" alt="" @click="previewPdf(item.recipepicurl)">
                </th>
                <th>{{item.doctorname}}</th>
                <th>{{item.price}}</th>
                <th>{{item.createtime}}</th>
                <th>{{item.prescri_id}}</th>
                <th @click="print(index, item.recipepicurl)">打印</th>
                <th></th>
              </tr>
            </table>
          </div>
          <el-pagination class="page_wrap" v-if="recordData.length !== 0" @current-change="handleCurrentChange" :current-page="search.PageIndex" :page-size="search.PageSize" layout="total, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
        <!--  -->
      </div>
    </div>
    <el-dialog title="处方" custom-class="el-recipe-box" :visible.sync="pdfDialog" width="60%" :center="true" :modal-append-to-body="false" :close-on-click-modal="false" top="60px">

      <object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" :data="pdfUrl" type="application/pdf" width="100%" height="85%">
        <embed :src="pdfUrl" type="application/pdf" width="100%" height="100%">
      </object>
    </el-dialog>
  </div>
</template>

<script>
import ajax from '@/utils/ajax';
import header from './compents/header';
import { getLoginID } from '@/utils/auth';
export default {
  data() {
    return {
      pdfDialog: false,
      pdfUrl: '',
      defaultImg: 'https://uploads.kangmei.com.cn/Files/20190118/kgcosnwx.1wh.png',
      search: {
        MemberID: '',
        Year: '',
        Month: '',
        PageIndex: 1,
        PageSize: 10,
        PatientId: getLoginID(),
        SourceId: '10059',
        DoctorName: '', // 医生
        MemberName: '' // 就诊人
      },
      date: '',
      recordData: [],
      total: 1,
      top: 0,
      monthList: [
        { label: '1月', value: '1' },
        { label: '2月', value: '2' },
        { label: '3月', value: '3' },
        { label: '4月', value: '4' },
        { label: '5月', value: '5' },
        { label: '6月', value: '6' },
        { label: '7月', value: '7' },
        { label: '8月', value: '8' },
        { label: '9月', value: '9' },
        { label: '10月', value: '10' },
        { label: '11月', value: '11' },
        { label: '12月', value: '12' },
      ]
    };
  },
  components: {
    'headers': header
  },
  methods: {
    // 打印
    print(index, url) {
      if (url) {
        window.open(url);
      } else {
        this.$alert('还没生成建议单哦~', '', {
          showClose: false,
          confirmButtonText: '确定',
          confirmButtonClass: 'cinfirmBtn',
          customClass: 'prompt'
        });
      }
    },
    // 检测是否是谷歌内核(可排除360及谷歌以外的浏览器)
    isChrome() {
      let ua = navigator.userAgent.toLowerCase(); return ua.indexOf('chrome') > 1;
    },
    // 测试mime
    _mime(option, value) {
      let mimeTypes = navigator.mimeTypes;
      for (let mt in mimeTypes) {
        if (mimeTypes[mt][option] === value) {
          return true;
        }
      }
      return false;
    },
    previewPdf(pdfUrl) {
      console.log(1);
      if (pdfUrl) {
        let is360 = this._mime('type', 'application/vnd.chromium.remoting-viewer');
        if (this.isChrome() && is360) {
          this.$alert(`此浏览器不支持在线查看。请下载查看`, '', {
            showClose: true,
            confirmButtonText: '下载',
            confirmButtonClass: 'cinfirmBtn',
            customClass: 'prompt',
          }).then(() => {
            window.open(pdfUrl);
          });
          return;
        }
        this.pdfUrl = pdfUrl;
        this.pdfDialog = true;
      } else {
        this.$alert('还没生成建议单哦~', '', {
          showClose: false,
          confirmButtonText: '确定',
          confirmButtonClass: 'cinfirmBtn',
          customClass: 'prompt'
        });
      }
    },
    // 获取问诊记录
    getRecordData() {
      ajax.post('/api/user/getConsultRecipeList', this.search).then(res => {
        console.log(res);
        if (res.status === 200 && res.data.code === 0) {
          this.total = res.data.recordscount;
          this.recordData = res.data.data;
        }
      });
    },
    // 分页
    handleCurrentChange(PageIndex) {
      this.search.PageIndex = PageIndex;
      this.getRecordData();
    },
    // 搜索
    searchInfo() {
      this.search.PageIndex = 1;
      if (this.date) {
        this.search.Year = this.date.split('-')[0];
        this.search.Month = this.date.split('-')[1];
      } else {
        this.search.Year = '';
        this.search.Month = '';
      }
      this.getRecordData();
    },
    // changeMonth() {
    //   this.getRecordData();
    // },
    // selectYear() {
    //   this.getRecordData();
    // }
  },
  created() {
    this.getRecordData();
  },
};
</script>

<style lang="less" scoped>
@import '../../../styles/common.less';
.record {
  // width: 1400px;
  background: #fff;
  margin: 0 auto;
  /deep/ .el-dialog__body {
    height: 85%;
  }
  .record_content{
    width: 85%;
    margin: 0 auto;
  }
  #previewIframe{
    width: 100%;
    height: 100%;
  }
  .record_header {
    line-height: 32px;
    font-size: 14px;
    overflow: hidden;
    // width: 1200px;
    margin-top: 15px;
    .left {
      float: left;
    }
    .right {
      float: right;
      .search {
        // width: 182px;
        margin: 0 0 10px 0;
        /deep/.el-input{
          width: 135px;
          padding: 0 8px;
          border: solid 1px #0ccdd3;
          border-radius: 5px;
          .el-input__inner{
            height: 32px;
            border: none;
            padding-right: 0;
          }
          .el-input__icon{
            line-height: 32px;
          }
        }
        input {
          border: solid 1px #0ccdd3;
          width: 135px;
          height: 32px;
          border-radius: 4px;
          font-size: 12px;
          padding: 10px;
          margin-right: 20px;
          // background: #eafbfb;
          &::placeholder {
            color: #cacaca;
          }
        }
        button {
          // float: left;
          width: 58px;
          height: 32px;
          background: #0ccdd3;
          color: #fff;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;
        }
      }
      .btn {
        cursor: pointer;
        width: 99px;
        color: #0ccdd3;
        line-height: 34px;
        text-align: center;
        margin-right: 10px;
        span {
          font-size: 14px;
        }
      }
    }
  }
  .main {
    // margin-top: 10px;
    .main-header {
      height: 40px;
      line-height: 40px;
      background: #32d6e6;
      font-size: 14px;
      width: 100%;
      // width: 1200px;
      .list-item {
        // float: left;
        color: #fff;
        // width: 145px;
        text-align: center;
        display: table-cell;
        vertical-align: inherit;
        text-align: -internal-center;
        &:nth-child(1) {
          width: 135px;
        }
        &:nth-child(2) {
          width: 190px;
        }
        &:nth-child(3) {
          width: 145px;
        }
        &:nth-child(4) {
          width: 145px;
        }
        &:nth-child(5) {
          width: 145px;
        }
        &:nth-child(6) {
          width: 185px;
        }
        &:nth-child(7) {
          width: 145px;
        }
        // &:last-child {
        //   width: 270px;
        //   position: relative;
        //   .select-year {
        //     width: 98px;
        //     height: 34px;
        //     cursor: pointer;
        //     // border: solid 1px #ffffff;
        //   }
        //   .icon-year{
        //     position: absolute;
        //     top: 13px;
        //     left: 100px;
        //   }
        //   .select {
        //     width: 100px;
        //     height: 34px;
        //     margin-left: 14px;
        //   }
        // }
      }
    }
    .table-wrap {
      .table-right {
        // width: 1200px;
        min-height: 610px;
        // background: #fff;
        // box-shadow: 0px 2px 5px 0px rgba(12, 205, 211, 0.23);
        .triangle {
          width: 0;
          height: 0;
          border-width: 10px 12px 10px 0;
          border-style: solid;
          border-color: transparent #fff transparent transparent; /*透明 灰 透明 透明 */
          margin: 40px auto;
          position: absolute;
          left: -12px;
          top: 0;
          // box-shadow: 0px 0px 0px 0px rgba(12, 205, 211, 0.3);
        }
        .loading {
          height: 100%;
          min-height: 610px;
          // background: #eafbfb;
          padding-top: 184px;
          // box-shadow: 0px 2px 5px 0px rgba(12, 205, 211, 0.23);
          img {
            margin: 0 auto;
            display: block;
          }
          p {
            margin: 34px auto 0;
            text-align: center;
            font-size: 18px;
            color: #333333;
          }
        }
        .table {
          width: 100%;
          tr {
            height: 91px;
            border-bottom: 1px solid #dadada;
            th {
              font-size: 14px;
              color: #333333;
              font-weight: normal;
              // width: 145px;
              &:nth-child(1) {
                width: 135px;
              }
              &:nth-child(2) {
                width: 190px;
                cursor: pointer;
              }
              &:nth-child(3) {
                width: 145px;
              }
              &:nth-child(4) {
                width: 145px;
              }
              &:nth-child(5) {
                width: 145px;
              }
              &:nth-child(6) {
                width: 185px;
              }
              &:nth-child(7) {
                color: #0ccdd3;
                cursor: pointer;
                width: 145px;
              }
            }
            .name{
              // .hidden-vertical(1);
            }
          }
        }
      }
      .page_wrap{
        text-align: right;
        padding: 10px 0;
      }
    }
  }
}
</style>
