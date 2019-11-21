<template>
  <div class="member_list">
    <div class="header-top">
      <a href="javascript:void(0)" class="right search-btn" @click="searchMember">搜索</a>
      <!-- <input class="right search-input" placeholder="输入患者姓名" v-model="searchData.name" /> -->
      <div class="right">
        <el-input  placeholder="输入患者姓名" v-model.trim="searchData.MemberName"></el-input>
      </div>
      <div class="right month">
         <el-date-picker
          v-model="date"
          type="month"
          placeholder="请选择日期"
          value-format="yyyy-M"
          @change="searchMember"
          :editable="false">
        </el-date-picker>
      </div>
      <!-- <div class="right month">
        <el-select v-model="searchData.Month" clearable name="xcc" placeholder="选择月份" class="select" @change="searchMember" v-if="searchData.Year">
          <el-option v-for="(i,index) in monthList" :key="index" :label="i.label" :value="i.value">
          </el-option>
        </el-select>
      </div>
      <div class="right year">
        <el-date-picker :editable="false" @change="searchMember"  placeholder="选择年份" clearable format="yyyy 年" value-format="yyyy" name='xcc' class="select-year" popper-class='xcc' prefix-icon='false' v-model="searchData.Year" type="year">
        </el-date-picker>
      </div> -->
    </div>
    <div class="list-box">
      <div class="display-box tlt-box">
        <label class="inline-block">患者姓名</label>
        <label class="inline-block">是否怀孕</label>
        <label class="inline-block">剂数</label>
        <label class="inline-block">处方图片</label>
        <label class="inline-block">审核结论</label>
        <label class="inline-block time">提交时间</label>
        <label class="inline-block">备注</label>
      </div>
      <ul class="member-list" v-if="recordData && recordData.length > 0">
        <li v-for="(member, i) in recordData" :key="member[i]">
          <label class="inline-block">{{member.membername}}</label>
          <label class="inline-block" v-html="member.is_pregnant === 0 ? '否': '是'"></label>
          <label class="inline-block">{{member.suffering_num}}</label>
          <label class="inline-block img">
            <img :src="member.recipepicurl" alt="">
          </label>
          <label class="inline-block">
            <label class="wait" v-if="member.prescri_status === 0">待处理</label>
            <label class="adopt" v-if="member.prescri_status === 102">审核通过</label>
            <label class="noadopt" v-if="member.prescri_status === 5">审核未通过</label>
          </label>
          <label class="inline-block time">{{member.createtime}}</label>
          <el-tooltip placement="top"  effect="light">
            <div slot="content">
              {{member.remark}}
            </div>
          <label class="inline-block remark" v-html="member.remark"></label>
          </el-tooltip>
        </li>
      </ul>
      <div class="no-data" v-show="recordData && recordData.length === 0">
        <img src="./img/icon_nocontent.png" />
        <p>暂无历史审方信息</p>
      </div>
      <div class="page_warp">
        <el-pagination @current-change="handleCurrentChange" :current-page.sync="searchData.pageIndex" :page-size="10" layout="total, prev, pager, next, jumper" :total="totalMember" v-if="totalMember"></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
// import { getMember } from '@/api/editMember';
import ajax from '@/utils/ajax';
import { getLoginID } from '@/utils/auth';
// import addVisit from '@/components/member/addVisit';
// import modifyVisit from '@/components/member/modifyVisit';
// import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      searchData: {
        MemberID: '',
        Year: '',
        Month: '',
        PageIndex: 1,
        PageSize: 10,
        DoctorName: '',
        MemberName: '',
        PatientId: getLoginID(),
        SourceId: '10059', // 来源 药店补方必传10059
        order_type: 1, // 0:医生下单 1：拍照下单
      },
      date: '',
      recordData: null,
      totalMember: 0,
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
  mounted() {
    this.getRecordData();
  },
  methods: {
    // 获取问诊记录
    getRecordData() {
      console.log(JSON.stringify(this.searchData));
      ajax.post('/api/user/getConsultRecipeList', this.searchData).then(res => {
        console.log(res);
        if (res.status === 200 && res.data.code === 0) {
          this.totalMember = res.data.recordscount;
          this.recordData = res.data.data;
        }
      });
    },
    // 分页(当前页)
    handleCurrentChange(page) {
      this.searchData.pageIndex = page;
      this.getRecordData();
    },
    // 搜索就诊人
    searchMember() {
      this.searchData.pageIndex = 1;
      if (this.date) {
        this.searchData.Year = this.date.split('-')[0];
        this.searchData.Month = this.date.split('-')[1];
      } else {
        this.searchData.Year = '';
        this.searchData.Month = '';
      }
      this.getRecordData();
    }
  }
};
</script>
<style lang="less" scoped>
// @import "../../../styles/common.less";
.member_list{
  width: 80%;
  margin: 0 auto;
}
  .header-top {
    height: 32px;
    margin-bottom: 10px;
    .search-btn {
      display: inline-block;
      width: 58px;
      height: 32px;
      background: #0ccdd3;
      color: #fff;
      border-radius: 4px;
      font-size: 14px;
      text-align: center;
      line-height: 32px;
      cursor: pointer;
      margin-left: 15px;
    }
    .month{
      margin-right:15px;
    }
    .year{
      margin-right:15px;
    }
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
  }
  .page_warp{
    text-align: right;
    padding-bottom: 10px;
  }
  .list-box {
    // .pic {
    //   width: 150px;
    // }
    // .sex {
    //   width: 146px;
    // }
    // .age {
    //   width: 144px;
    // }
    // .phone {
    //   width: 176px;
    // }
    // .operate {
    //   width: 146px;
    // }
    .inline-block {
      text-align: center;
      display: inline-block;
      width: 130px;
      img{
        width: 100px;
        height: 60px;
      }
      .wait{
        color: #ffae00;
      }
      .adopt{
        color: #333;
      }
      .noadopt{
        color: #f00;
      }
    }
    .remark{
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .time {
      width: 190px;
    }
    .tlt-box {
      height: 40px;
      padding: 0 22px;
      background: #0ccdd3;
      color: #fff;
      align-items: center;
      label {
        font-weight: bold;
        // width: 130px;
      }
    }
    .member-list {
      min-height: 610px;
      padding: 0 22px;
      background: #fff;;
      // box-shadow: 0px 3px 7px 0px rgba(12, 205, 211, 0.19);
      li {
        display: flex;
        height: 92px;
        border-bottom: 1px solid #ccc;
        align-items: center;
        .pic {
          img {
            width: 58px;
            height: 58px;
            border-radius: 50%;
          }
        }
        .operate {
          color: #0ccdd3;
          cursor: pointer;
        }
      }
      li:last-child {
        border: none;
      }
    }
    .no-data {
      height: 610px;
      padding-top: 190px;
      background: #fff;
      font-size: 16px;
      text-align: center;
      // box-shadow: 0px 3px 7px 0px rgba(12, 205, 211, 0.19);
      img {
        // margin-right: 6px;
        vertical-align: middle;
        margin-bottom: 15px;
      }
    }
  }
</style>

