<template>
  <div class="member_list">
    <headers></headers>
    <div class="content_list">
      <div class="header-top">
        <a href="javascript:void(0)" class="right search-btn" @click="searchMember">搜索</a>
        <input class="right search-input" placeholder="输入就诊人" v-model.trim="searchData.name" />
      </div>
      <div class="list-box">
        <div class="display-box tlt-box">
          <label class="inline-block name">就诊人姓名</label>
          <label class="inline-block sex">性别</label>
          <label class="inline-block age">年龄</label>
          <label class="inline-block phone">手机号</label>
          <label class="inline-block operate">操作</label>
        </div>
        <ul class="member-list" v-if="memberList && memberList.length > 0">
          <li v-for="(member, i) in memberList" :key="member[i]">
            <label class="inline-block name">{{member.name}}</label>
            <label class="inline-block sex" v-html="member.gender === 0 ? '女': '男'"></label>
            <label class="inline-block age">{{member.age}}岁</label>
            <label class="inline-block phone">{{member.mobile}}</label>
            <label class="inline-block operate" @click="deleteMember(member)">删除</label>
          </li>
        </ul>
        <div class="no-data" v-show="memberList && memberList.length === 0">
          <img src="./img/icon_nocontent.png" />
          <p>暂无就诊人信息</p>
        </div>
        <div class="page_wrap">
           <el-pagination @current-change="handleCurrentChange" :current-page.sync="searchData.pageIndex" :page-size="10" layout="total, prev, pager, next, jumper" :total="totalMember" v-if="totalMember"></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getMember } from '@/api/editMember';
import header from './compents/header';
import ajax from '@/utils/ajax';
export default {
  data() {
    return {
      searchData: {
        name: '',
        pageIndex: 1,
        pageSize: 10
      },
      totalMember: 0,
      memberList: null,
    };
  },
  components: {
    'headers': header
  },
  mounted() {
    this.getMemberList();
  },
  methods: {
    // 获取就诊人信息
    getMemberList() {
      getMember(this.searchData).then(res => {
        console.log(res);
        this.memberList = res.data;
        this.totalMember = res.recordscount;
      });
    },
    // 删除就诊人
    deleteMember(item) {
      this.$confirm('是否删除就诊人？', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'detailActive',
        showClose: false,
        cancelButtonClass: 'cancelBtn',
        confirmButtonClass: 'cinfirmBtn',
        iconClass: 'icon-deleta',
        type: 'warning'
      }).then(() => {
        ajax.get('/api/user/DeleteUserMember/' + item.memberid).then(res => {
          console.log(res);
          if (res.status === 200 && res.data.code === 0) {
            this.modifyShow = false;
            this.$message({
              message: res.data.message,
              type: 'success'
            });
            this.getMemberList();
          }
        });
      });
    },
    // 分页(当前页)
    handleCurrentChange(page) {
      this.searchData.pageIndex = page;
      this.getMemberList();
    },
    // 搜索就诊人
    searchMember() {
      this.searchData.pageIndex = 1;
      this.getMemberList();
    }
  }
};
</script>
<style lang="less" scoped>
// @import "../../styles/mixin.less";
@import "../../../styles/common.less";
.member_list{
  // width: 1400px;
  background: #fff;
  margin: 0 auto;
  .content_list{
    width: 80%;
    margin: 0 auto;
  }
}
  .header-top {
    height: 32px;
    margin-bottom: 10px;
    margin-top: 15px;
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
    .search-input {
      width: 135px;
      height: 32px;
      padding: 0 8px;
      border: solid 1px #0ccdd3;
      border-radius: 5px;
    }
    .add-member {
      height: 32px;
      margin-right: 40px;
      color: #0ccdd3;
      align-items: center;
      cursor: pointer;
      img {
        margin-right: 5px;
      }
      label {
        cursor: pointer;
      }
    }
  }
  .list-box {
    .pic {
      width: 150px;
    }
    .name {
      width: 190px;
      .hidden-vertical(1);
    }
    .sex {
      width: 146px;
    }
    .age {
      width: 144px;
    }
    .phone {
      width: 176px;
    }
    .operate {
      width: 146px;
    }
    .inline-block {
      text-align: center;
    }
    .tlt-box {
      height: 40px;
      padding: 0 22px;
      background: #0ccdd3;
      color: #fff;
      align-items: center;
      label {
        font-weight: bold;
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
  .page_wrap{
    text-align: right;
    padding: 15px 0;
  }
</style>

