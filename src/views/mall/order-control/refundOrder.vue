<template>
  <div class="monitor">
    <div class="table-wrapper monitor_table_wrap" v-loading="loading" element-loading-text="拼命加载中">
      <div v-if="tabData.length > 0">
        <div class="order-item" v-for="(item,index) in tabData" :key="index">
          <div class="header item-header">
            <div class="header-left">
              <span class="serial">{{(orderSearchData.pageNum - 1) * orderSearchData.pageSize + index + 1}}.</span>
              <span>订单状态：<span class="status">待退款</span></span>
            </div>
            <div class="header-right">
              <span class="appointment" v-if="item.deliveryTime">预</span>
              <span class="appointment refund" v-if="item.mtRefund === '退'">退</span>
              创建订单时间：{{item.createDate}}
            </div>
          </div>
          <div class="content">
            <div class="channel-position">{{item.abutmentFlag === 1 ? '美团' : item.abutmentFlag === 2 ? '饿了么' : item.abutmentFlag === 4 ? '京东到家' : item.abutmentFlag === 0 ? '药葫芦' : ''}}</div>
            <div class="content-time">
              <div class="time">{{item.timeConsuming}}</div>
            </div>
            <div class="content-left">
              <p class="info-item"><span>收货人：</span><i v-if="item.addressPo">{{item.addressPo.addressName}}</i><i v-if="item.abutmentFlag !== 1">【{{item.addressPo.gender === '男' ? '先生' : '女士'}}】</i></p>
              <p class="info-item"><span>收货人电话：</span><i v-if="item.addressPo">{{item.addressPo.addressPhone}}</i></p>
              <p class="info-item"><span>收货人地址：</span><i v-if="item.addressPo">{{item.addressPo.totalAddress}}</i></p>
              <p class="info-item"><span>订单号：</span>{{item.orderId}}</p>
              <p class="info-item"><span>商户名称：</span><i v-if="item.sellerUser">{{item.sellerUser.sellerName}}</i></p>
              <p class="info-item code" v-if="item.deliveryTime"><span>预订单时间</span><i>{{item.deliveryTime}}</i></p>
              <p class="info-item code" v-if="item.abutmentFlag"><span>取货码</span><i>{{item.poiSeq}}</i></p>
              <!-- <p class="info-item" v-if="item.isTest === 1"><span>是否测试单：</span>是</p> -->
              <p class="info-item"><span>备注：</span>{{item.caution}}</p>
            </div>
            <div class="content-right">
              <p class="right-item"><span>客户实付：</span>{{Number(item.orderPayment).toFixed(2)}}元</p>
              <p class="right-item"><span>商家活动支出：</span>{{Number(item.couponPrice).toFixed(2)}}元</p>
              <p class="right-item"><span>平台活动支出：</span>{{Number(item.actOrderChargeByThird).toFixed(2)}}元</p>
              <p class="right-item"><span>配送费：</span>{{Number(item.orderPostage).toFixed(2)}}元</p>
              <p class="right-item"><span>平台费用：</span>{{Number(item.foodShareFee).toFixed(2)}}元</p>
              <p class="right-item"><span>药店收益：</span>{{Number(item.wmPoiReceiveCent).toFixed(2)}}元</p>
            </div>
          </div>
          <div class="foot">
            <div class="foot-left">
              <el-button type="success" size="small" @click="seeDetail(item.orderId)">查看订单</el-button>
              <el-button class="button" size="small" type="warning" v-if="item.logisticsType !== '自行配送' && item.logisticsType !== '自行'" @click="seeLogistics(item)">查看物流</el-button>
             <!-- 来自美团外第三方订单操作 -->
            <el-button class="button" type="danger" size="small" @click.stop="queryrefund('query',item)">确认退款</el-button>
            <el-button class="button" type="danger" size="small" @click.stop="queryrefund('cancel',item)">驳回退款</el-button>
            </div>
            <div class="foot-right">
              <el-button type="success" size="small" @click="searchNumberPhone(item)" v-if="item.abutmentFlag === 2">查询号码</el-button>
              <!-- <el-button type="success" size="small" @click="prints(item)">打印订单小票</el-button>
              <el-button type="success" size="small" @click="printsDetail(item)">打印商品明细</el-button> -->
            </div>
          </div>
        </div>
      </div>
      <div v-else class="no_data">
        <i class="el-icon-document icon"></i>
        <p class="no_data_title">暂无订单~</p>
        <p class="no_data_submitTitle">暂时没有该筛选条件的订单，稍后再来看看吧!</p>
      </div>
    </div>
    <!-- 分页区域 -->
    <div class="pagin-wrapper" v-if="total">
      <v-pagination :pageSizeOption="[5]" @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-size="orderSearchData.pageSize" :page-index="orderSearchData.pageNum" :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
      </v-pagination>
    </div>
     <!-- 小票 -->
    <ticket :print="print"></ticket>
    <!-- 确认配送提示 -->
    <el-dialog title="提示" custom-class="TipsInfo" :visible.sync="TipsInfo" :center='true' :modal-append-to-body="false" width="450px">
      <h2 class="title">订单已确认配送</h2>
      <!-- <p class="text" v-if="Transport == 0"><span class="red">美团</span>的骑手正在快马加鞭向您赶来</p> -->
      <span slot="footer" class="dialog-footer">
        <el-button type="warning" @click="prints(print)">打印订单小票</el-button>
      </span>
    </el-dialog>
    <!-- 查看来自第三方平台物流信息 -->
    <el-dialog title="配送信息" :visible.sync="MeituanLogisShow" :center='true' :modal-append-to-body="false" width="700px">
      <div class="none" v-if="MeituanLogisData.length < 1">
        <p style="text-align:center;font-weight:900"><i class="el-icon-info">&nbsp;</i>暂无配送信息</p>
      </div>
      <div class="Meituanlogistics-wrap" v-else>
        <ul class="Meituanlogistics">
          <li class="logistitle-item">配送员</li>
          <li class="logistitle-item">联系电话</li>
          <li class="logistitle-item">时间</li>
          <li class="logistitle-item">状态</li>
        </ul>
        <ul v-for="(item,index) in MeituanLogisData" :key="index" class="Meituanlogistics">
          <li class="logistitle-item">{{item.dispatcherName}}</li>
          <li class="logistitle-item">{{item.dispatcherMobile}}</li>
          <li class="logistitle-item">{{item.createDate}}</li>
          <li class="logistitle-item">{{item.logisticsStatus}}</li>
        </ul>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="success" @click="MeituanLogisShow = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 查看药葫芦物流信息 -->
    <el-dialog title="物流信息" :visible.sync="dialogStepVisible" :center='true' :modal-append-to-body="false" width="800px">
      <div v-if="logisticsItem.orderTransport === '2'">
        <div class="none" v-if="logisticsData.status == '400'">
          <p style="text-align:center;font-weight:900"><i class="el-icon-info">&nbsp;</i>暂无物流信息</p>
        </div>
        <div class="logistics-detail" style="position:relative" v-else>
          <div class="num" :style="'margin-bottom:15px;'">
            <el-row>
              <el-col :span="12">
                <el-col :span="8" :style="'text-align:right;font-size:18px;font-weight:900;'">订单号：</el-col>
                <el-col :span="16" :style="'font-size:18px;font-weight:900;'">
                  {{logisticsItem.orderId}}
                </el-col>
              </el-col>
              <el-col :span="12">
                <el-col :span="8" :style="'text-align:right;font-size:18px;font-weight:900;'">配送单号：</el-col>
                <el-col :span="16" :style="'font-size:18px;font-weight:900;'">
                  {{logisticsData.mt_peisong_id}}
                </el-col>
              </el-col>
            </el-row>
          </div>
          <p class="status"  style="position:absolute;top:-25px;right:-10px;font-size:20px;color:#f00">{{logisticsData.status}}</p>
          <div>
          <el-row>
            <el-col :span="12" style="margin-bottom:10px;">
              <el-col :span="8" :style="'text-align:right'">配送方式：</el-col>
              <el-col :span="16">
                <span>{{logisticsData.com}}</span>
              </el-col>
            </el-col>
            <el-col :span="12" style="margin-bottom:10px;">
              <el-col :span="8" :style="'text-align:right'">订单确认时间：</el-col>
              <el-col :span="16">
                <span>{{logisticsData.operate_time}}</span>
              </el-col>
            </el-col>
            <div v-if="(logisticsData.status !== '待接单' && logisticsData.status !== '已取消') && logisticsData.com === '美团'" style="margin-bottom:10px;">
              <el-col :span="12">
                <el-col :span="8" :style="'text-align:right'">配送员：</el-col>
                <el-col :span="16">
                  <span>{{logisticsData.courier_name}}</span>
                </el-col>
              </el-col>
              <el-col :span="12">
                <el-col :span="8" :style="'text-align:right'">配送员电话：</el-col>
                <el-col :span="16">
                  <span>{{logisticsData.courier_phone}}</span>
                </el-col>
              </el-col>
            </div>
            <div v-if="logisticsData.status === '已取消'" style="margin-bottom:10px;">
              <el-col :span="12">
                <el-col :span="8" :style="'text-align:right'">取消原因：</el-col>
                <el-col :span="16">
                  <span>{{logisticsData.cancel_reason ? logisticsData.cancel_reason : '其他原因'}}</span>
                </el-col>
              </el-col>
            </div>
          </el-row>
          </div>
          <div v-if="logisticsData.status === '待接单'">
            <h2 :style="'text-align:center;font-size:24px;margin-top:50px;color:#ccc;'">暂无骑手接单~</h2>
          </div>
        </div>
      </div>
      <div v-if="logisticsItem.orderTransport === '1' || logisticsItem.orderTransport === '5'">
        <el-row :gutter="20">
          <el-col :span="10">物流类型：{{logisticsData.ShipperCode}}</el-col>
          <el-col :span="10">物流单号：{{logisticsData.LogisticCode}}</el-col>
        </el-row>
        <div class="logistics-node" v-if="logisticsData">
          <div v-for="(item,index) in logisticsData.Traces" :key="index" class="item" v-if="logisticsData.Traces.length > 0">
            <div class="item-left">{{item.AcceptTime}}</div>
            <div class="item-right">{{item.AcceptStation}}</div>
          </div>
          <div v-else>
            <p style="text-align:center;font-weight:900"><i class="el-icon-info">&nbsp;</i>暂无物流信息</p>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="success" @click="dialogStepVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 处理来自美团第三方的退款操作 -->
    <el-dialog :title="refundTitle" :visible.sync="cancelrefundShow" :center='true' :modal-append-to-body="false" width="450px"  @close="closeActive('refundMeituanOrderFrom')">
      <el-form  ref="refundMeituanOrderFrom" :inline="true" :model="refundMeituanInfo" size="small"  :rules="rulesMeituanrefund">
        <el-form-item :label="refundLebel" prop="reason" :style="'padding-left:60px;'">
          <el-input v-model="refundMeituanInfo.reason" placeholder="请输入原因" style="width:211px;"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="warning" @click="cancelrefundShow = false">取 消</el-button>
        <el-button type="success" @click="refundMeituanQuery">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getTransport } from '@/utils/auth';
import javaRequest from '@/utils/javaApiRequest';
import { formatDate } from '@/utils/date';
import jQuery from 'jquery';
import jqp from '@static/jquery.jqprint-0.3.js';
import { getLodop } from '@static/LodopFuncs.js';
import ticket from './compoent/ticket';
import { getLogisticsData, getMeituanLogisticsData, getOrdLogisticsData } from './api/operation.js';
export default {
  data() {
    return {
      loading: true,
      orderSearchData: {
        pageNum: 1,
        pageSize: 5
      },
      TipsInfo: false, // 打印小票提示弹窗
      print: {}, // 小票内容
      MeituanLogisShow: false, // 美团第三方订单查看物流
      MeituanLogisData: '',
      dialogStepVisible: false, // 普通物流
      logisticsData: '',
      logisticsItem: '',
      refundTitle: '', // 退款弹窗标题
      refundType: '', // 标识退款或者驳回
      cancelrefundShow: false, // 退款弹窗标识
      refundLebel: '', // 退款弹窗lebel
      refundMeituanInfo: { // 退款接口入参
        reason: ''
      },
      rulesMeituanrefund: { // 退款表单验证
        reason: [
          { required: true, message: '请输入原因', trigger: 'blur' },
        ]
      },
      refundItem: '',
      tabData: [],
      total: 0,
    };
  },
  components: {
    'ticket': ticket
  },
  methods: {
    searchNumberPhone(item) {
      let info = {
        orderId: item.channelOrderId
      };
      javaRequest.post('/mall_manage_seller/eleme/order/privateinfo', info).then(res => {
        if (res.status === 200 && res.data.resultCode === '0') {
          let data = res.data.resultData;
          this.$alert(`<p>过期时间：${data.expire_date}</p><p>手机号码：${data.short_number}</p>`, '提示', {
            dangerouslyUseHTMLString: true,
            center: true
          });
        }
      });
    },
    add0(m) { return m < 10 ? '0' + m : m },
    // 耗时计算
    consumingTime(val1, val2) {
      let tem = val1 - val2;
      let hours = Math.floor(tem / (1000 * 60 * 60));
      let minutes = Math.floor((tem % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((tem % (1000 * 60)) / 1000);
      // console.log('总秒数为:' + tem, hours + ' 小时 ' + minutes + ' 分钟 ' + seconds + ' 秒 ');
      if (hours === 0) {
        return '00:' + this.add0(minutes) + ':' + this.add0(seconds);
      } else if (hours === 0 && minutes === 0) {
        return '00:00' + this.add0(seconds);
      } else {
        return this.add0(hours) + ':' + this.add0(minutes) + ':' + this.add0(seconds);
      }
    },
    getTimeData() {
      for (let i = 0; i < this.tabData.length; i++) {
        this.$set(this.tabData[i], 'temSystemTime', this.tabData[i].temSystemTime + 1000);
        this.$set(this.tabData[i], 'timeConsuming', this.consumingTime(this.tabData[i].temSystemTime, this.tabData[i].temCreateDate));
      }
    },
    // 动态刷新时间
    refreshTime() {
      let _this = this;
      clearInterval(_this.timer);
      _this.timer = setInterval(function () {
        _this.getTimeData();
      }, 1000);
    },
    // 获取监控订单
    getOrderData() {
      let _this = this;
      javaRequest.post(`/mall_manage_seller/back/order/refundOrder`, this.orderSearchData).then((res) => {
        // console.log(res);
        this.loading = false;
        if (res.status === 200 && res.data.resultCode === '0') {
          this.$store.dispatch('getOrderSum');
          let orderTransport = sessionStorage.getItem('orderTransport') ? sessionStorage.getItem('orderTransport') : getTransport();
          // console.log(orderTransport);
          for (let i = 0; i < res.data.resultData.data.length; i++) {
            if (orderTransport === '美团配送') {
              res.data.resultData.data[i].Transport = '0';
            } else if (orderTransport === '自行配送') {
              res.data.resultData.data[i].Transport = '1';
            } else if (orderTransport === '普通物流') {
              res.data.resultData.data[i].Transport = '2';
            }
            // else {
            //   res.data.resultData.data[i].Transport = '0';
            // }
            this.$set(res.data.resultData.data[i], 'temSystemTime', res.data.resultData.data[i].systemTime);
            this.$set(res.data.resultData.data[i], 'temCreateDate', res.data.resultData.data[i].createDate);
            this.$set(res.data.resultData.data[i], 'timeConsuming', this.consumingTime(res.data.resultData.data[i].systemTime, res.data.resultData.data[i].temCreateDate));
            res.data.resultData.data[i].createDate = formatDate(res.data.resultData.data[i].createDate);
            res.data.resultData.data[i].deliveryTime = Number(res.data.resultData.data[i].deliveryTime);
            if (res.data.resultData.data[i].deliveryTime) {
              res.data.resultData.data[i].deliveryTime = formatDate(res.data.resultData.data[i].deliveryTime);
            }
          }
          this.tabData = res.data.resultData.data;
          this.total = res.data.resultData.total;
          if (res.data.resultData.total > 0) {
            // console.log('列表有数据的时候需要开启动态刷新时间');
            clearInterval(_this.timer);
            this.refreshTime();
          } else {
            // console.log('列表无数据的时候无需动态刷新时间');
            clearInterval(_this.timer);
          }
        }
      });
    },
    pageSizeChange(pageSize) {
      this.loading = true;
      this.orderSearchData.pageNum = 1;
      this.orderSearchData.pageSize = pageSize;
      this.getOrderData();
      // 1
    },
    pageChange(pageIndex) {
      // 2
      this.loading = true;
      this.orderSearchData.pageNum = pageIndex;
      this.getOrderData();
    },
    // 查看订单
    seeDetail(id) {
      this.$router.push('/order-control/orderDetail');
      sessionStorage.setItem('orderId', id);
    },
    // 关闭弹窗事件
    closeActive(from) {
      this.$refs[from].resetFields();
    },
    printsDetail(item) {
      // 打印明细小票
      if (item) {
        this.print = item;
      }
      // console.log(this.print);
      setTimeout(() => {
        let LODOP = getLodop();
        if (LODOP) {
          LODOP.PRINT_INIT('');
          LODOP.ADD_PRINT_HTM(0, 0, '100%', '100%', document.getElementById('print-box2').innerHTML);
          LODOP.PREVIEW();
        } else {
          setTimeout(() => {
            jQuery('font:first').attr('style', 'position: absolute;top: 50%;left: 50%;z-index: 1000;background: beige;padding: 10px;margin-top: -30px;margin-left: -227px;');
          }, 500);
        }
      });
    },
    prints(item) {
      // 打印小票
      if (item) {
        this.print = item;
      }
      // console.log(this.print);
      setTimeout(() => {
        this.prints3();
      });
    },
    // 打印小票-使用插件jqprint
    prints2() {
      if (this.orderDetailData.orderTransport === '1' || this.orderDetailData.orderTransport === '5') {
        jqp('#print-box2').jqprint();
      } else {
        jqp('#print-box').jqprint();
      }
    },
    // 打印小票-使用Lodop
    prints3() {
      let LODOP = getLodop();
      if (LODOP) {
        LODOP.PRINT_INIT('');
        LODOP.ADD_PRINT_HTM(0, 0, '100%', '100%', document.getElementById('print-box').innerHTML);
        LODOP.PREVIEW();
        // LODOP.PRINT();
      } else {
        setTimeout(() => {
          jQuery('font:first').attr('style', 'position: absolute;top: 50%;left: 50%;z-index: 1000;background: beige;padding: 10px;margin-top: -30px;margin-left: -227px;');
        }, 500);
      }
    },
    // 查看物流
    seeLogistics(item) {
      this.logisticsItem = item;
      if (item.abutmentFlag) { // 美团第三方订单
        this.MeituanLogisShow = true;
        getMeituanLogisticsData(item.channelOrderId).then(res => {
          this.MeituanLogisData = res;
        });
      } else { // 普通物流订单物流
        this.dialogStepVisible = true;
        if (item.orderTransport === '2') {
          getLogisticsData(item.logisticsNumber, item.logisticsType, item.orderId).then(res => {
            this.logisticsData = res;
          });
        } else if (item.orderTransport === '1' || item.orderTransport === '5') {
          getOrdLogisticsData(item.logisticsNumber, item.logisticsType).then(res => {
            this.logisticsData = res;
          });
        }
      }
    },
    // 第三方美团订单物流状态
    MeituanlogisticsStatus(status) {
      let a = '';
      switch (status) {
        case 0:
          a = '配送单发往配送';
          break;
        case 10:
          a = '配送单已确认';
          break;
        case 15:
          a = '骑手已到店';
          break;
        case 20:
          a = '骑手已取餐';
          break;
        case 40:
          a = '骑手已送达';
          break;
        case 100:
          a = '配送单已取消';
          break;
        default:
          a = status;
      }
      return a;
    },
    // 美团物流状态
    logisticsStatus(status) {
      let a = '';
      switch (status) {
        case 0:
          a = '待接单';
          break;
        case 20:
          a = '已接单';
          break;
        case 30:
          a = '已取货';
          break;
        case 50:
          a = '已送达';
          break;
        case 99:
          a = '已取消';
          break;
        default:
          a = status;
      }
      return a;
    },
    // 处理来自美团外卖的退款操作
    queryrefund(type, item) {
      this.refundType = type;
      this.refundTitle = type === 'query' ? '确认退款' : '驳回退款';
      this.refundLebel = type === 'query' ? '确认退款原因' : '驳回退款原因';
      this.cancelrefundShow = true;
      this.refundItem = item;
    },
    refundMeituanQuery() {
      let param = {
        orderId: this.refundItem.orderId,
        reason: this.refundMeituanInfo.reason,
        abutmentFlag: this.refundItem.abutmentFlag
      };
      let url = this.refundType === 'query' ? '/mall_manage_seller/back/order/confirmRefund' : '/mall_manage_seller/back/order/rejectRefund';
      this.$refs['refundMeituanOrderFrom'].validate((valid) => {
        if (valid) {
          this.cancelrefundShow = false;
          javaRequest.post(url, param).then(res => {
            // console.log(res);
            if (res.status === 200 && res.data.resultCode === '0') {
              let msg = res.data.msg;
              this.$message.success(msg);
              this.getOrderData();
            }
          });
        } else {
          return false;
        }
      });
    },
  },
  created() {
    this.getOrderData();
  }
};
</script>

<style lang="less" scoped>
.monitor{
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
  /deep/.el-input {
    width: 220px;
  }
  /deep/.el-form-item{
    margin-top: 18px;
  }
  .monitor_table_wrap{
    margin-top: 15px;
    .no_data{
      height: 400px;
      text-align: center;
      padding-top: 50px;
      .icon{
        display: inline-block;
        width: 150px;
        height: 150px;
        border-radius: 50%;
        font-size: 80px;
        color: #fff;
        background-color: #efefef;
        line-height: 150px;
      }
      .no_data_title{
        margin: 20px 0 10px 0;
        font-size: 18px;
        color: #666;
      }
      .no_data_submitTitle{
        color: #999;
      }
    }
  }
}
.order-item{
  border: 1px solid #edf1f2;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
  // padding: 15px;
  padding-top: 0;
  margin-bottom: 20px;
  .header{
    height: 50px;
    padding: 0 25px;
    // background: #f0f3f4;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    .header-right{
      // color: #f56c6c;
    }
    .header-left{
      .status{
        color: #f56c6c;
      }
      .serial{
        padding: 5px 12px;
        // border: 1px solid #e0e0e0;
        color: #000;
        border-radius: 50%;
      }
    }
    // .refund{
    //   background: #f56c6c;
    //   padding: 10px 12px;
    //   border-radius: 6px;
    //   color: #fff;
    //   margin-left: 10px;
    //   box-shadow: 0 1px 1px rgba(204, 18, 18, 0.4);
    // }
    .appointment{
      display: inline-block;
      height: 20px;
      padding: 0 4px;
      border-radius: 4px;
      color: #f76c6c;
      background: #fff3f3;
      line-height: 20px;
      vertical-align: 1px;
      box-shadow: 0 1px 1px rgba(204, 18, 18, 0.4);
      margin-right: 10px;
    }
  }
  .content{
    padding: 10px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    position: relative;
    // .test{
    //   width: 60px;
    //   height: 20px;
    //   position: absolute;
    //   top: 10px;
    //   right: 10px;
    //   background: #f00;
    //   opacity: .5;
    //   color: #fff;
    //   text-align: center;
    //   line-height: 60px;
    // }
    .channel-position{
      position: absolute;
      top: 0;
      left: 0;
      width: 70px;
      height: 60px;
      background: #409EFF;
      color: #fff;
      border-radius: 0 0 70px 0;
      padding: 14px 8px 0 8px;
    }
    .content-time{
      width: 220px;
      // height: 30px;
      text-align: center;
      display: flex;
      justify-content: space-around;
      .time{
        width: 100px;
        height: 100px;
        border: 1px solid #ccc;
        line-height: 100px;
        border-radius: 50%;
        background: #e6a23c;
        color: #fff;
        box-shadow: 0 1px 1px rgba(24, 23, 23, 0.4);
      }
    }
    .content-left{
      flex: 1;
    }
    .code{
      color: #f56c6c;
    }
    .info-item{
      line-height: 30px;
      &:nth-last-child(1){
        color: #f56c6c;
      }
      span{
        width: 110px;
        display: inline-block;
        text-align: right;
        margin-right: 15px;
      }
    }
    .right-item{
      line-height: 30px;
      span{
        width: 130px;
        display: inline-block;
        text-align: right;
        margin-right: 15px;
      }
    }
  }
  .foot{
    padding: 15px;
    display: flex;
    justify-content: space-between;
  }
}
.TipsInfo{
  .title{
    text-align: center;
    font-size: 24px;
    margin-bottom: 15px;
  }
  .text{
    text-align: center;
    font-size: 18px;
    margin-bottom: 10px;
    .red{
      color: #f00;
      font-size: 18px;
    }
  }
}
.Meituanlogistics{
  // width: 600px;
  height: 70px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  .logistitle-item{
    width: 130px;
    text-align: center;
  }
}
.logistics-node{
  padding-left: 50px;
  .item{
    margin-top: 20px;
    overflow: hidden;
    &:nth-child(1){
      color: green;
    }
    .item-left{
      float: left;
      width: 150px;
    }
    .item-right{
      float: left;
      width: 300px;
      margin-left: 30px;
    }
  }
}

</style>
