<template>
  <div class="seller_index">
    <el-container class="seller_container_wrapper">
      <el-header class="header_wrap" height="60px">
       <layoutHeader></layoutHeader>
      </el-header>
      <el-main class="main_wrap">
        <div class="main">
          <div class="main_header">
            <div class="title">
              <div class="title_text">开店流程</div>
            </div>
            <div class="step">
              <div class="step_item_wrap">
                <div class="step_item">提交申请</div>
                <div class="line"></div>
                <div class="row">></div>
              </div>
              <div class="step_item_wrap">
                <div class="step_item">审核签约</div>
                <div class="line"></div>
                <div class="row">></div>
              </div>
              <div class="step_item_wrap three">
                <div class="step_item">商品录入</div>
                <div class="line"></div>
                <div class="row">></div>
              </div>
              <div class="step_item_wrap four">
                <div class="step_item">门店上线</div>
              </div>
            </div>
          </div>
          <div class="main_content">
            <ul class="table_header">
              <li class="table_header_item">店铺名称</li>
              <li class="table_header_item">联系方式</li>
              <li class="table_header_item">申请时间</li>
              <li class="table_header_item">状态</li>
              <li class="table_header_item">操作</li>
            </ul>
            <div class="body_warp" v-loading="isLoding">
              <ul class="table_body" v-for="(item,index) in sellerList" :key="index" v-if="sellerList.length > 0">
                <li class="table_body_item">{{item.sellerName}}</li>
                <li class="table_body_item">{{item.mobile}}</li>
                <li class="table_body_item">{{item.createDate}}</li>
                <li class="table_body_item">
                  <span style="color:#E6A23C" v-if="item.auditStatus === '1'">待审核</span>
                  <span style="color:#67C23A" v-if="item.auditStatus === '2'">已通过</span>
                  <span style="color:#F56C6C" v-if="item.auditStatus === '3'">未通过</span>
                  <span style="color:#F56C6C" v-if="item.auditStatus === '4'">停用</span>
                  <span style="color:#E6A23C" v-if="item.auditStatus === '5'">待完善</span>
                </li>
                <li class="table_body_item see">
                  <div v-if="item.auditStatus === '5'">
                    <span class="btn perfect" @click="perfect(item.sellerUserId)">去完善</span>
                    <span class="btn detale" @click="detailSeller(item.sellerUserId)">删除</span>
                  </div>
                  <span class="btn detail" v-if="item.auditStatus === '2' || item.auditStatus === '1' || item.auditStatus === '4'" @click="see(item)">查看详情</span>
                  <span class="btn perfect" v-if="item.auditStatus === '3'" @click="perfect(item.sellerUserId)">重新编辑</span>
                </li>
              </ul>
              <div class="not" v-if="sellerList.length === 0">暂无数据~</div>
            </div>
          </div>
          <div class="page_wrap">
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="screenInfo.pageIndex" :page-size="10" layout="total, prev, pager, next, jumper" :total="totalMember" v-if="totalMember"></el-pagination>
          </div>
          <div class="main_foot">
            <el-button @click="add">新增店铺</el-button>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import javaAjax from '@/utils/javaApiRequest';
import layoutHeader from '@/components/header/header';
import { formatDate } from '@/utils/date';
export default {
  data() {
    return {
      sellerList: [],
      isLoding: false,
      screenInfo: {
        pageSize: 10,
        pageIndex: 1,
        sellerName: ''
      },
      totalMember: 0
    };
  },
  components: {
    'layoutHeader': layoutHeader
  },
  methods: {
    handleCurrentChange(page) {
      this.screenInfo.pageIndex = page;
      this.getSellerData();
    },
    add() {
      this.$router.push('/sellerTransition');
    },
    getSellerData() {
      this.isLoding = true;
      // let url = this.isExamine ? '/mall_manage_seller/authority/querySellerUserAudit' : '/mall_manage_seller/authority/queryPharmacies';
      let url = '/mall_manage_seller/authority/querySellerUserAudit';
      javaAjax.post(url, this.screenInfo).then((res) => {
        console.log(res);
        if (res.status === 200 && res.data.resultCode === '0') {
          this.isLoding = false;
          this.sellerList = res.data.resultData.data;
          this.totalMember = res.data.resultData.total;
          this.sellerList.map(item => {
            item.createDate = formatDate(item.createDate);
            return item;
          });
        }
      });
    },
    perfect(sellerUserId) {
      this.$router.push('/sellerInfo?id=' + sellerUserId);
    },
    detailSeller(sellerUserId) {
      this.$confirm('此操作将删除该药店, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let url = 'mall_manage_seller/authority/delete';
        let info = {
          sellerUserId: sellerUserId
        };
        javaAjax.post(url, info).then((res) => {
          console.log(res);
          if (res.status === 200 && res.data.resultCode === '0') {
            this.$message({
              message: res.data.msg,
              type: 'success'
            });
            this.getSellerData();
          }
        });
      });
    },
    see(item) {
      if (item.auditStatus === '1') {
        this.$alert('该药店还未通过审核,暂时无法操作', '提示', {
          showClose: false,
          type: 'warning',
          center: true,
          showCancelButton: false
        });
      } else {
        this.$router.push('/seller-control/sellerDetail?id=' + item.sellerUserId);
        localStorage.setItem('sellerid', item.sellerUserId);
      }
      // this.$router.push('/seller-control/sellerDetail?id=' + sellerUserId);
      // localStorage.setItem('sellerid', sellerUserId);
    }
  },
  created() {
    this.getSellerData();
  }
};
</script>

<style lang="less" scoped>
.seller_index{
  width: 100%;
  min-height: 100%;
  background: #F7F8FA;
  .header_wrap{
    box-shadow: 0 2px 6px 0 #F1F1F6;
    background: #FFF;
  }
  .seller_container_wrapper{
    .main_wrap{
      .main{
        width: 1400px;
        margin: 0 auto;
        .main_header{
          .title{
            font-size: 22px;
            display: flex;
            justify-content: space-around;
            margin: 30px auto;
            .title_text{
              width: 260px;
              padding-left: 75px;
            }
          }
          .step{
            width: 830px;
            display: flex;
            justify-content: space-around;
            margin: 15px auto;
            font-size: 16px;
            .step_item_wrap{
              display: flex;
              align-items: center;
              width: 250px;
              // justify-content: space-between
              padding-right: 8px;
              &:nth-last-child(1) {
                width: 80px;
                padding-right: 0;
              }
            }
            .step_item{
              width: 80px;
              height: 80px;
              border-radius: 50%;
              border: 1px solid #00cdd3;
              text-align: center;
              line-height: 80px;
              font-size: 14px;
              color: #00cdd3;
            }
            .line{
              flex: 1;
              height: 2px;
              background: #00cdd3;
              margin-left: 8px;
            }
            .row{
              color: #00cdd3;
              height: 80px;
              display: flex;
              align-items: center;
              margin-left: -2px;
              margin-top: -2.5px;
            }
          }
        }
        .main_content{
          background: #FFF;
          margin-top: 50PX;
          // border: 1px solid #BABCCC;
          padding-bottom: 0px;
          padding-top: 15px;
          .table_header{
            width: 1200px;
            margin: 0 auto;
            height: 50px;
            display: flex;
            justify-content: space-between;
            border: 1px solid #BABCCC;
            background: #F7F8FA;
            .table_header_item{
              width: 220px;
              height: 100%;
              text-align: center;
              line-height: 50px;
              &:nth-child(1) {
                width: 350px;
                padding: 0 8px;
              }
            }
          }
          .table_body{
            width: 1200px;
            margin: 0 auto;
            height: 90px;
            display: flex;
            justify-content: space-between;
            border: 1px solid #BABCCC;
            border-top: none;
            .table_body_item{
              width: 220px;
              height: 100%;
              text-align: center;
              line-height: 90px;
              &:nth-last-child(1) {
                .btn{
                  cursor: pointer;
                }
                .detale{
                  color: #f00;
                  margin-left: 8px;
                }
                .perfect{
                  color: #E6A23C;
                }
                .detail{
                  color: #409EFF;
                }
              }
              &:nth-child(1) {
                width: 350px;
                padding: 0 8px;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
              }
            }
          }
          .not{
            height: 200px;
            text-align: center;
            line-height: 200px;
            font-size: 18px;
            color: #606266;
          }
        }
        .page_wrap{
          text-align: right;
          padding: 15px 0;
          background: #fff;
          padding-right: 100px;
        }
        .main_foot{
          margin-top: 60px;
          text-align: center;
          /deep/.el-button{
            background: #0ccdd3;
            border-color: #0ccdd3;
            span{
              color: #fff;
            }
          }
        }
      }
    }
  }
}

</style>
