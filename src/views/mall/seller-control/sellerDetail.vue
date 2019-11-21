<template>
  <div class="detail">
    <div class="box-list">
      <h2 class="item-header">商户信息</h2>
      <div class="info">
        <el-row>
          <el-col :span="8">
            <span>药店名称：{{detailData.sellerName}}</span>
          </el-col>
          <el-col :span="8">
            <span>所属商户：{{detailData.a}}</span>
          </el-col>
          <el-col :span="8">
            <span>商户类型：{{typeList[detailData.businessType]}}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <span>所属品牌：{{detailData.brand}}</span>
          </el-col>
          <el-col :span="8">
            <span>手机号：{{detailData.mobile}}</span>
          </el-col>
          <el-col :span="8">
            <span>所在区域：<span v-if="detailData.addressProvince">{{detailData.addressProvince}}/{{detailData.addressCity}}/{{detailData.addressDistrict}}</span></span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <span>详细地址：{{detailData.detailAddress}}</span>
          </el-col>
          <el-col :span="8">
            <span>所在地图位置：</span>
            <i class="el-icon-location" @click="seeMap" style="cursor: pointer;"></i>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="box-list">
      <h2 class="item-header">账户信息</h2>
      <div class="info">
        <el-row>
          <el-col :span="8">
            <span>开户人：{{detailData.accountHolder}}</span>
          </el-col>
          <el-col :span="8">
            <span>银行卡号：{{detailData.bankCardNumber}}</span>
          </el-col>
          <el-col :span="8">
            <span>开户行：{{detailData.openingBank}}</span>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="box-list">
      <h2 class="item-header">其他信息</h2>
      <div class="info">
        <el-row>
          <el-col :span="8">
            <span>商户法人：{{detailData.legalPerson}}</span>
          </el-col>
          <el-col :span="8">
            <span>身份证号：{{detailData.idCard}}</span>
          </el-col>
          <el-col :span="8">
            <span>法人联系方式：{{detailData.contact}}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <span>营业执照</span>
            <img :src="detailData.businessLicense" alt="" width="80px" height="80px">
          </el-col>
          <el-col :span="8">
            <span>经营许可证：</span>
            <img :src="detailData.drugLicenses" alt="" width="80px" height="80px">
          </el-col>
          <el-col :span="8">
            <span>法人身份证照片：</span>
            <img :src="detailData.idcardPhoto" alt="" width="80px" height="80px">
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="info" style="text-align:center">
      <el-button type="warning" @click="setting" v-if="detailData.auditStatus === '2'">设置店员</el-button>
      <el-button type="warning" @click="edit"  v-if="detailData.auditStatus === '2' || detailData.auditStatus === '3'">编辑</el-button>
    </div>
    <div :class="dialogVisible ? 'map_box' : 'none'">
      <div class="box_wrap">
        <div id="allmap" class="allmap"></div>
        <i class="el-icon-close close" @click="close"></i>
      </div>
    </div>
  </div>
</template>

<script>
import BMap from 'BMap';
import javaAjax from '@/utils/javaApiRequest';
export default {
  data() {
    return {
      id: this.$route.query.id ? this.$route.query.id : localStorage.getItem('sellerid'),
      detailData: '',
      typeList: {
        '1': '仓库',
        '2': '药店',
        '3': '药柜',
        '4': '跨境电商'
      },
      map: '',
      dialogVisible: false
    };
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
          let new_point = new BMap.Point(this.detailData.longitude, this.detailData.latitude);
          this.map.centerAndZoom(new_point, 16);
          let marker = new BMap.Marker(new_point);  // 创建标注
          this.map.addOverlay(marker);              // 将标注添加到地图中
        }
      });
    },
    setting() {
      this.$router.push('/employee/employeeList');
    },
    edit() {
      this.$router.push('/seller-control/editSeller?id=' + this.detailData.sellerUserId);
    },
    seeMap() {
      this.dialogVisible = true;
      // if (this.detailData.longitude && this.detailData.latitude) {
      //   this.dialogVisible = true;
      //   this.map.clearOverlays();
      //   let new_point = new BMap.Point(this.detailData.longitude, this.detailData.latitude);
      //   let marker = new BMap.Marker(new_point);  // 创建标注
      //   this.map.addOverlay(marker);              // 将标注添加到地图中
      //   this.map.panTo(new_point);
      // }
    },
    close() {
      this.dialogVisible = false;
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
    }
  },
  mounted() {
    this.map = new BMap.Map('allmap');
    this.map.enableScrollWheelZoom(true);
    // console.log('moutend');
    // this.map = new BMap.Map('allmap');
    // let new_point = new BMap.Point(this.detailData.longitude, this.detailData.latitude);
    // this.map.centerAndZoom(new_point, 11);
    // let marker = new BMap.Marker(new_point);  // 创建标注
    // this.map.addOverlay(marker);              // 将标注添加到地图中
    // this.map.enableScrollWheelZoom(true);
  },
  created() {
    // console.log('created');
    this.switchSeller();
  }
};
</script>

<style lang="less" scoped>
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
    // box-shadow: 0 1px 1px rgba(0, 0, 0, .05);
    /deep/ .el-row{
      margin-top: 15px;
    }
    /deep/ .el-button{
    width: 100px;
    }
  }
}
.detail{
  padding-bottom: 40px;
  // background: #fff;
  // box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
}
.detail .none{
  // display: none;
  z-index: -10;
  opacity: 0;
  width: 0;
  height: 0;
  position: fixed;
}
.allmap{
  width: 1250px;
  height: 500px
}
.map_box{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:rgba(0,0,0,0.5);
  z-index: 10;
  .box_wrap{
     width: 1300px;
    height: 550px;
    padding: 30px;
    background: #fff;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    z-index: 11;
    .close{
      position: absolute;
      top: 8px;
      right: 10px;
      cursor: pointer;
    }
  }
}
</style>
