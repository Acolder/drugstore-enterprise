<template>
  <div class="transition">
    <el-container class="seller_container_wrapper">
      <el-header class="header_wrap" height="60px">
       <layoutHeader></layoutHeader>
      </el-header>
      <el-main class="main_wrap">
        <div class="main">
          <div class="title">开店所需准备材料</div>
          <div class="img_box">
            <div class="img_item">
              <img src="./img/ml.png" alt="">
              <p class="img_title">门脸图片</p>
              <div class="img_con">
                <h3>门脸图片</h3>
                <p>1、需拍出完整门匾、门框（建议正对门店2米处拍摄）</p>
              </div>
            </div>
            <div class="img_item">
              <img src="./img/md.png" alt="">
              <p class="img_title">店内环境图片</p>
              <div class="img_con">
                <h3>店内环境图片</h3>
                <p>1、需真实反映店内环境（收银台、货架）</p>
              </div>
            </div>
            <div class="img_item">
              <img src="./img/logo.png" alt="">
              <p class="img_title">门店logo</p>
              <div class="img_con">
                <h3>门店logo</h3>
                <p>1、需与店铺气质吻合的logo，能提高用户进店的概率</p>
              </div>
            </div>
            <div class="img_item">
              <img src="./img/yxzz.png" alt="">
              <p class="img_title">营业执照</p>
              <div class="img_con">
                <h3>营业执照</h3>
                <p>1、 需文字清晰、边框完整、露出国徽</p>
                <p>2、复印件需加盖印章，可用有效特许证件代替</p>
              </div>
            </div>
            <div class="img_item">
              <img src="./img/ypjyxk.png" alt="">
              <p class="img_title">药品营业许可证</p>
              <div class="img_con">
                <h3>药品营业许可证</h3>
                <p>1、 需文字清晰、边框完整</p>
              </div>
            </div>
            <div class="img_item">
              <img src="./img/sfzz.png" alt="">
              <p class="img_title">法定代表人身份证照</p>
              <div class="img_con">
                <h3>法定代表人身份证照</h3>
                <p>1、需清晰展示身份证文字信息</p>
              </div>
            </div>
          </div>
          <div class="foot_btn">
            <el-button @click="add">已准备好</el-button>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import layoutHeader from '@/components/header/header';
export default {
  data() {
    return {
      sellerList: []
    };
  },
  components: {
    'layoutHeader': layoutHeader
  },
  methods: {
    add() {
      this.$router.push('/sellerInfo');
    }
  }
};
</script>

<style lang="less" scoped>
.transition{
  width: 100%;
  // height: 100%;
  background: #F7F8FA;
  .header_wrap{
    box-shadow: 0 2px 6px 0 #F1F1F6;
    background: #FFF;
  }
  .main_wrap{
    .main{
      width: 1400px;
      margin: 0 auto;
      background: #FFF;
      padding: 30px 0;
      .title{
        margin-bottom: 60px;
        text-align: center;
        font-size: 22px;
      }
      .img_box{
        width: 1200px;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        margin: 0 auto;
        .img_item{
          width:360px;
          height: 270px;
          margin-bottom: 20px;
          position: relative;
          // border: 1px solid #e9eaf2;
          border-radius: 2px;
          &:hover{
            .img_con{
              display: block;
            }
          }
          img{
            width: 100%;
            height: 100%;
          }
          .img_title{
            color: #FFF;
            text-align: center;
            position: absolute;
            text-align: center;
            left: 0;
            bottom: 0;
            right: 0;
            height: 60px;
            opacity: .6;
            background: linear-gradient(-180deg,rgba(63,65,86,0),#3f4156);
            padding-top: 30px;
            border-radius: 0 0 13px 13px;
          }
          .img_con{
            display: none;
            position: absolute;
            width: 100%;
            height: 100%;
            bottom: 0;
            left: 0;
            border-radius: 2px;
            opacity: .8;
            background: #3f4156;
            color: #fff;
            border-radius: 13px;
            h3{
              margin: 30px 0 20px;
              text-align: center;
              font-size: 16px;
            }
            p{
              margin: 0 20px;
            }
          }
        }
      }
      .foot_btn{
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

</style>
