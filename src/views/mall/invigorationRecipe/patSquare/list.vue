<template>
  <div class="record">
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
            <el-input  placeholder="输入医生" v-model.trim="search.docname"></el-input>
            <el-input  placeholder="输入就诊人" v-model.trim="search.username"></el-input>
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
          <li class="list-item">状态</li>
          <li class="list-item">处方单号</li>
          <li class="list-item">操作</li>
        </ul>
        <div class="table-wrap">
          <div class="table-right">
            <div class="loading" v-if="recordData.length === 0">
              <img src="../img/icon_nocontent.png" alt="">
              <p>暂无内容...</p>
            </div>
            <table class="table" v-if="recordData.length !== 0">
              <tr v-for="(item,index) in recordData" :key="index">
                <th class="name">{{item.username}}</th>
                <th>
                  <img class="recipeImg" :src="defaultImg" alt="" @click="previewPdf(item.recipe_pic_url)" v-if="item.recipe_pic_url">
                  <span class="none" v-else></span>
                </th>
                <th>
                  <span v-if="item.doc_name">{{item.doc_name}}</span>
                  <span class="none" v-else></span>
                </th>
                <th>{{item.unit_price.toFixed(2)}}</th>
                <th>{{item.create_time}}</th>
                <th>
                  <span v-if="item.status === 0 || item.status === 1 || item.status === 2" class="yellow">处理中</span>
                  <span v-if="item.status === 3" class="statu_wrap">
                    <span class="red">已驳回</span>
                    <el-tooltip placement="top" effect="light">
                      <div slot="content" style="max-width:300px;">
                        {{item.reason}}
                      </div>
                    <span class="reson">(驳回原因：{{item.reason}})</span>
                    </el-tooltip>
                  </span>
                  <span v-if="item.status === 4">已完成</span>
                </th>
                <th>{{item.prescri_id}}</th>
                <th>
                  <span v-if="item.status === 4" @click="print(index, item.recipe_pic_url)" class="option_btn el-icon-printer">打印</span>
                  <span v-if="item.status === 3" @click="edit(item)" class="option_btn el-icon-edit">编辑</span>
                </th>
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
import ajax from '@/utils/doctorApiRequest';
import { getLoginID } from '@/utils/auth';
export default {
  data() {
    return {
      pdfDialog: false,
      pdfUrl: '',
      defaultImg: 'https://uploads.kangmei.com.cn/Files/20190118/kgcosnwx.1wh.png',
      search: {
        // MemberID: '',
        Year: '',
        Month: '',
        PageIndex: 1,
        PageSize: 10,
        store_id: getLoginID(),
        // SourceId: '10059',
        docname: '', // 医生
        username: '' // 就诊人
      },
      date: '',
      recordData: [],
      total: 0,
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
  methods: {
    edit(item) {
      let store_id = getLoginID();
      let order_id = item.order_id;
      ajax.get(`/api/ydsf/getprescription/${store_id}/${order_id}`).then(res => {
        console.log(res.data.data);
        if (res.status === 200 && res.data.code === 0) {
          // this.total = res.data.data.total;
          // this.recordData = res.data.data.list;
          this.$emit('edit', res.data.data);
        }
      });
    },
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
      console.log(pdfUrl);
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
      ajax.post('/api/ydsf/gethistoricalprescription', this.search).then(res => {
        console.log(res.data.data);
        if (res.status === 200 && res.data.code === 0) {
          this.total = res.data.data.total;
          this.recordData = res.data.data.list;
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
    this.$emit('clenEdit');
  },
};
</script>

<style lang="less" scoped>
@import '../../../../styles/common.less';
.record {
  // width: 1400px;
  background: #fff;
  margin: 0 auto;
  font-size: 14px;
  /deep/ .el-dialog__body {
    height: 85%;
  }
  .record_content{
    width: 92%;
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
          padding: 1px 8px;
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
          width: 120px;
        }
        &:nth-child(3) {
          width: 135px;
        }
        &:nth-child(4) {
          width: 135px;
        }
        &:nth-child(5) {
          width: 145px;
        }
        &:nth-child(6) {
          width: 200px;
        }
        &:nth-child(7) {
          width: 145px;
        }
        &:nth-child(8) {
          width: 145px;
        }
      }
    }
    .table-wrap {
      .table-right {
        min-height: 610px;
        .loading {
          height: 100%;
          min-height: 610px;
          padding-top: 184px;
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
              .none{
                width: 40px;
                height: 2px;
                background-color: #dadada;
                display: inline-block;
              }
              // width: 145px;
              &:nth-child(1) {
                width: 135px;
              }
              &:nth-child(2) {
                width: 120px;
                cursor: pointer;
              }
              &:nth-child(3) {
                width: 135px;
              }
              &:nth-child(4) {
                width: 135px;
              }
              &:nth-child(5) {
                width: 145px;
              }
              &:nth-child(6) {
                width: 200px;
                .yellow{
                  color: #ffae00;
                }
                .red{
                  color: #f00;
                }
                .statu_wrap{
                  display: flex;
                  align-items: center;
                  width: 145px;
                  margin: 0 auto;
                }
                .reson{
                  display: inline-block;
                  width: 100px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }
              }
              &:nth-child(7) {
                width: 145px;
              }
              &:nth-child(8) {
                cursor: pointer;
                width: 145px;
                .option_btn{
                  display: inline-block;
                  width: 70px;
                  height: 24px;
                  background-color: @green-color;
                  border-radius: 4px;
                  line-height: 24px;
                  color: #fff;
                }
              }
            }
            .name{
              // .hidden-vertical(1);
            }
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
</style>
