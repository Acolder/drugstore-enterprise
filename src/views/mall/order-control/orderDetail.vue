<template>
  <div class="detail">
    <div class="item-box">
      <div class="item-header detail-item-header">
        基本信息
        <span class="status">{{orderDetailData.orderStatus}}</span>
      </div>
      <div class="item-content">
        <el-row :gutter="20">
          <el-col :span="6">订单号：{{orderDetailData.orderId}}</el-col>
          <el-col :span="6" v-if="orderDetailData.userAddress">收货人：{{orderDetailData.userAddress.addressName}}<span v-if="orderDetailData.abutmentFlag !== 1">【{{orderDetailData.userAddress.gender === '男' ? '先生' : '女士'}}】</span></el-col>
          <el-col :span="6" v-if="orderDetailData.userAddress">手机号：{{orderDetailData.userAddress.addressPhone}}</el-col>
          <el-col :span="6" v-if="orderDetailData.userAddress"><el-tooltip class="item" effect="light" :content="orderDetailData.userAddress.totalAddress" placement="top"><p class="receivAddress">收货地址：{{orderDetailData.userAddress.totalAddress}}</p></el-tooltip></el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">付款方式：<span v-show="orderDetailData.payinfoPlatorm">{{orderDetailData.payinfoPlatorm ? orderDetailData.payinfoPlatorm === 'alipay' ? '支付宝' : '微信' : ''}}</span></el-col>
          <el-col :span="6">付款时间：{{orderDetailData.payTime}}</el-col>
          <el-col :span="6">商品总金额：{{orderDetailData.prdouctSumMoney ? Number(orderDetailData.prdouctSumMoney).toFixed(2) : orderDetailData.prdouctSumMoney}}元</el-col>
          <el-col :span="6">平台费：<span v-if="orderDetailData.foodShareFee || orderDetailData.foodShareFee === 0">{{Number(orderDetailData.foodShareFee).toFixed(2)}}元</span></el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">运费：<span v-if="orderDetailData.orderPostage || orderDetailData.orderPostage === 0">{{Number(orderDetailData.orderPostage).toFixed(2)}}元</span></el-col>
          <el-col :span="6">促销活动：<span v-if="orderDetailData.maTotalPrice || orderDetailData.maTotalPrice === 0">-{{Number(orderDetailData.maTotalPrice).toFixed(2)}}元</span></el-col>
          <el-col :span="6">优惠券：{{orderDetailData.couponBasicInformation}}</el-col>
          <el-col :span="6">实付金额：{{orderDetailData.realPayment ? Number(orderDetailData.realPayment).toFixed(2) : orderDetailData.realPayment}}元</el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6" v-if="orderDetailData.abutmentFlag">取货码：<span style="color: #f56c6c">{{orderDetailData.poiSeq}}</span></el-col>
          <!-- <el-col :span="6">订单总金额：<span v-if="orderDetailData.orderMoneySum || orderDetailData.orderMoneySum === 0">{{Number(orderDetailData.orderMoneySum).toFixed(2)}}元</span></el-col> -->
          <el-col :span="6">第三方优惠金额：<span v-if="orderDetailData.actOrderChargeByThird || orderDetailData.actOrderChargeByThird === 0">{{Number(orderDetailData.actOrderChargeByThird).toFixed(2)}}元</span></el-col>
          <el-col :span="6">商家优惠金额：<span v-if="orderDetailData.couponPrice || orderDetailData.couponPrice === 0">-{{Number(orderDetailData.couponPrice).toFixed(2)}}元</span></el-col>
          <el-col :span="6">商家应收金额：<span v-if="orderDetailData.wmPoiReceiveCent || orderDetailData.wmPoiReceiveCent === 0">{{Number(orderDetailData.wmPoiReceiveCent).toFixed(2)}}元</span></el-col>
        </el-row>
        <el-row :gutter="20" v-if="orderDetailData.invoiceInfo">
          <el-col :span="6">发票抬头：{{orderDetailData.invoiceInfo.invoiceType}}</el-col>
          <el-col :span="6" v-if="orderDetailData.invoiceInfo.invoiceType === '个人'">个人姓名：{{orderDetailData.invoiceInfo.invoiceTitle}}</el-col>
          <el-col :span="6" v-if="orderDetailData.invoiceInfo.invoiceType === '公司'">公司名称：{{orderDetailData.invoiceInfo.invoiceTitle}}</el-col>
          <el-col :span="6" v-if="orderDetailData.invoiceInfo.invoiceType === '公司'">纳税号：{{orderDetailData.invoiceInfo.taxNum}}</el-col>
          <el-col :span="6">收票邮箱：{{orderDetailData.invoiceInfo.email}}</el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">创建时间：{{orderDetailData.createDate}}</el-col>
          <el-col :span="6">商品件数：共<i v-if="orderDetailData.orderDetail">{{orderDetailData.productSum}}</i>件</el-col>
        </el-row>
      </div>
    </div>
    <div class="item-box">
      <div class="item-header detail-item-header">
        商品信息
      </div>
      <div class="item-content">
        <v-table ref="data_table" column-width-drag is-horizontal-resize style="width:100%" :columns="detailColumns" :table-data="orderDetailData.orderDetail" row-hover-color="#eee" row-click-color="#edf7ff"></v-table>
        <p class="sum-money">商品总金额：￥{{orderDetailData.prdouctSumMoney ? Number(orderDetailData.prdouctSumMoney).toFixed(2) : orderDetailData.prdouctSumMoney}}</p>
      </div>
    </div>
    <div class="item-box" v-if="orderDetailData.orderOtcAdd">
      <div class="item-header detail-item-header">
        处方信息
      </div>
      <div class="item-content">
        <img v-for="(item,index) in orderDetailData.orderOtcAdd.otcImages" :key="index" :src="item" alt="" @click="selectIMG(item)">
      </div>
    </div>
    <div class="item-box" v-if="orderDetailData.mtRefundPo">
      <div class="item-header detail-item-header">
        退款信息
      </div>
      <div class="item-content refund-content" v-for="(item,index) in orderDetailData.mtRefundPo" :key="index">
        <el-row :gutter="20">
          <el-col :span="6">退款类型：{{item.refundType === '0' ? '全部商品退款' : item.refundType === '1' ? '商户发起部分商品退款' : item.refundType === '2' ? '用户申请部分商品退款' : ''}}</el-col>
          <el-col :span="6">退款原因：{{item.reason}}</el-col>
          <el-col :span="6">退款状态：{{item.notifyType === 'apply' || item.notifyType === 'part'? '发起退款' :item.notifyType === 'agree' ? '商户同意退款' : item.notifyType === 'reject' ? '商户拒绝退款' : item.notifyType === 'cancelRefund' ? '用户取消退款申请': ''}}</el-col>
          <el-col :span="6" v-if="item.refundType !== '0'">退款金额：<span v-if="(item.money || item.money === 0)">{{item.money}}元</span></el-col>
        </el-row>
        <el-row :gutter="20" v-if="item.mtRefundDetailPoList">
          <el-col :span="6">退款商品：</el-col>
          <el-col :span="24">
             <v-table ref="data_table" column-width-drag is-horizontal-resize style="width:100%" :columns="columns" :table-data="item.mtRefundDetailPoList" row-hover-color="#eee" row-click-color="#edf7ff"></v-table>
          </el-col>
        </el-row>
        <el-row :gutter="20" v-if="(item.notifyType === 'apply' || item.notifyType === 'part') && (item.refundType === '0' || item.refundType === '2')">
          <el-col :span="6">
            <el-button class="button" type="success" size="small" @click.stop="queryrefund('query')">确认退款</el-button>
            <el-button class="button" type="danger" size="small" @click.stop="queryrefund('cancel')">驳回退款</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="item-box" v-if="orderDetailData.orderStatus !== '待确认'">
      <div class="item-header detail-item-header">
        物流信息
      </div>
      <div class="item-content">
        <div class="logistics-box" v-if="!orderDetailData.abutmentFlag && orderDetailData.orderTransport === '1' || orderDetailData.orderTransport === '5'">
          <el-row :gutter="20" v-if="!logisticsData">
            <div class="none-logistics"><i class="el-icon-info"></i>&nbsp;暂无物流信息</div>
          </el-row>
          <div class="is-logistics" v-else>
            <div class="pt-logistics">
              <el-row :gutter="20">
                <el-col :span="6">物流类型：{{logisticsData.ShipperCode}}</el-col>
                <el-col :span="6">物流单号：{{logisticsData.LogisticCode}}</el-col>
              </el-row>
              <el-row :gutter="20" v-if="logisticsData.Traces.length> 0">
                <div v-for="(item,index) in logisticsData.Traces" :key="index" class="pt-logistics-item" :class="index === 0 ? 'colorFication' : ''" v-show="index < 5">
                  <div class="pt-logistics-item-left">{{item.AcceptTime}}</div>
                  <div class="pt-logistics-item-right">{{item.AcceptStation}}</div>
                </div>
                <p class="seemore" v-if="logisticsData.Traces.length>5" @click="seeLogistics">查看更多<span class="el-icon-arrow-right"></span></p>
              </el-row>
              <el-row :gutter="20" v-else>
                <el-col :span="12"><i class="el-icon-info">&nbsp;</i>暂无更多详细物流信息</el-col>
              </el-row>
            </div>
          </div>
        </div>
        <div class="logistics-box" v-if="!orderDetailData.abutmentFlag && logisticsData && orderDetailData.orderTransport === '2'">
          <!-- <div class="none-logistics" v-if="logisticsData.status === '400'"><i class="el-icon-info"></i>暂无物流信息</div> -->
          <el-row :gutter="20" v-if="logisticsData.status === '400'">
            <div class="none-logistics" v-if="logisticsData.status === '400'"><i class="el-icon-info"></i>&nbsp;暂无物流信息</div>
          </el-row>
          <div class="is-logistics" v-else>
            <div class="mt-logistics" v-if="logisticsData.com === '美团'">
              <el-row :gutter="20">
                <el-col :span="6">配送类型：{{logisticsData.com}}</el-col>
                <el-col :span="6">配送单号：{{logisticsData.mt_peisong_id}}</el-col>
                <el-col :span="6">配送状态：{{logisticsData.status}}</el-col>
                <el-col :span="6">操作时间：{{logisticsData.operate_time}}</el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="6">配送员：{{logisticsData.courier_name}}</el-col>
                <el-col :span="6">配送员电话：{{logisticsData.courier_phone}}</el-col>
                <el-col :span="6" v-if="logisticsData.status === '已取消'">取消原因：{{logisticsData.cancel_reason}}</el-col>
              </el-row>
            </div>
            <!-- <div class="pt-logistics" v-else>
              <el-row :gutter="20">
                <el-col :span="6">物流类型：{{logisticsData.com}}</el-col>
                <el-col :span="6">物流单号：{{logisticsData.nu}}</el-col>
              </el-row>
              <el-row :gutter="20" v-if="logisticsData.data.length> 0">
                <div v-for="(item,index) in logisticsData.data" :key="index" class="pt-logistics-item" :class="index === 0 ? 'colorFication' : ''" v-show="index < 5">
                  <div class="pt-logistics-item-left">{{item.time}}</div>
                  <div class="pt-logistics-item-right">{{item.context}}</div>
                </div>
                <p class="seemore" v-if="logisticsData.data.length>5" @click="seeLogistics">查看更多<span class="el-icon-arrow-right"></span></p>
              </el-row>
              <el-row :gutter="20" v-else>
                <el-col :span="12"><i class="el-icon-info">&nbsp;</i>暂无更多详细物流信息</el-col>
              </el-row>
            </div> -->
          </div>
        </div>
        <div class="logistics-box" v-if="orderDetailData.abutmentFlag && MeituanLogisData">
          <el-row :gutter="20" v-if="MeituanLogisData.length < 1">
            <p class="none-logistics"><i class="el-icon-info"></i>&nbsp;暂无配送信息</p>
          </el-row>
          <div class="pt-logistics" v-else>
            <el-row :gutter="20">
              <el-col :span="6">配送员：{{MeituanLogisData[0].dispatcherName}}</el-col>
              <el-col :span="6">配送员电话：{{MeituanLogisData[0].dispatcherMobile}}</el-col>
            </el-row>
            <el-row :gutter="20">
              <div v-for="(item,index) in MeituanLogisData" :key="index" class="pt-logistics-item" :class="index === 0 ? 'colorFication' : ''">
                <div class="pt-logistics-item-left">{{item.createDate}}</div>
                <div class="pt-logistics-item-right">{{item.logisticsStatus}}</div>
              </div>
            </el-row>
          </div>
        </div>
      </div>
    </div>
    <div class="item-box" v-if="orderDetailData.orderStatus === '待确认'">
      <div class="item-header detail-item-header">
        配送方式
      </div>
      <div class="item-content refund-content">
        <el-row :gutter="20">
          <div>
            <el-radio v-model="Transport" label="0" v-if="orderDetailData.orderTransport === '2'">第三方配送</el-radio>
            <el-radio v-model="Transport" label="1" v-if="orderDetailData.orderTransport === '2'">自行配送</el-radio>
            <el-radio v-model="Transport" label="2" v-if="orderDetailData.orderTransport === '1' || orderDetailData.orderTransport === '5'">普通物流</el-radio>
          </div>
        </el-row>
      </div>
    </div>

    <div class="button-list">
      <el-button class="button" type="danger" v-if="orderDetailData.orderStatus === '待确认' || (orderDetailData.orderStatus === '配送中' && orderDetailData.abutmentFlag !== 0 && !orderDetailData.mtRefundPo)" @click="cancelMeituanOrder">取消订单</el-button>
      <!-- <el-button class="button" type="danger" v-if="orderDetailData.orderStatus === '配送中' && orderDetailData.abutmentFlag !== 0 && orderDetailData.mtRefundPo.length === 0" @click="cancelMeituanOrder">取消订单</el-button> -->
      <!-- <el-button class="button" v-if="orderDetailData.orderStatus === '配送中' && (orderDetailData.logistics.status !== 50 || orderDetailData.logistics.status !== 99) && orderDetailData.orderTransport === '2'" @click="cancelOrder(1)">取消订单</el-button> -->
      <el-button class="button" type="warning" v-if="orderDetailData.orderStatus === '配送中' && (orderDetailData.logistics.status !== 50 || orderDetailData.logistics.status !== 99) && orderDetailData.orderTransport !== '3' && orderDetailData.isNotice !== 3 && orderDetailData.abutmentFlag == 0" @click="cancelLogistics">取消配送</el-button>
      <!-- <el-button class="button" type="warning" v-if="(orderDetailData.orderStatus === '配送中' || orderDetailData.orderStatus === '待评价') && orderDetailData.logisticsType !== '自行配送' && orderDetailData.logisticsType !== '自行' && orderDetailData.abutmentFlag" @click="seeMeitaunLogistics()">查看物流</el-button> -->
      <!-- <el-button class="button" type="warning" v-if="(orderDetailData.orderStatus === '配送中' || orderDetailData.orderStatus === '待评价') && orderDetailData.logisticsType !== '自行配送' && orderDetailData.logisticsType !== '自行' && !orderDetailData.abutmentFlag" @click="seeLogistics()">查看物流</el-button> -->
      <el-button class="button" type="warning" v-if="orderDetailData.orderStatus === '配送中' && orderDetailData.sellerUser.isValidate === 1 && (orderDetailData.logisticsType === '自行配送' || orderDetailData.logisticsType === '自行')" @click="deliveredwrap()">已送达</el-button>
      <el-button class="button" type="warning" v-if="orderDetailData.orderStatus === '配送中' && orderDetailData.sellerUser.isValidate === 0 &&  (orderDetailData.logisticsType === '自行配送' || orderDetailData.logisticsType === '自行')" @click="delivered">已送达</el-button>
      <el-button class="button" type="success" v-if="orderDetailData.orderStatus === '待确认'"  @click="sendOrder">确认发货</el-button>
      <el-button class="button" type="warning" v-if="orderDetailData.orderStatus === '待审核'" @click="cancelXamine(orderDetailData.orderId)">审核不通过并退款</el-button>
      <el-button class="button" type="warning" v-if="orderDetailData.orderStatus === '待审核'" @click.stop="queryeXamineSelft(orderDetailData.orderId)">审核通过</el-button>
      <el-button class="button" type="warning" v-if="orderDetailData.isDelivery === 1" @click.stop="querySend(orderDetailData.orderId)">确认送达</el-button>
      <!-- 商品部分退款 -->
      <el-button class="button" type="warning" v-if="(orderDetailData.orderStatus === '待确认' || orderDetailData.orderStatus === '配送中' || orderDetailData.orderStatus === '已完成') && orderDetailData.abutmentFlag ===1 && !orderDetailData.mtRefundPo" @click.stop="goodsRefund">商品部分退款</el-button><!--  && orderDetailData.isPartRefund !== 2-->
      <el-button class="button" type="success" @click="prints">打印订单小票</el-button>
      <el-button class="button" type="success" @click="printsDetail">打印商品明细</el-button>
      <!-- 来自美团外卖的订单操作 -->
      <!-- <div v-if="orderDetailData.mtRefundPo">
        <el-button class="button" type="warning" v-if="orderDetailData.mtRefundPo.length > 0 && orderDetailData.isPartRefund === 0" @click.stop="queryrefund('query')">确认退款</el-button>
        <el-button class="button" type="warning" v-if="orderDetailData.mtRefundPo.length > 0 &&orderDetailData.isPartRefund === 0" @click.stop="queryrefund('cancel')">驳回退款</el-button>
      </div> -->
      <!-- <el-button class="button" type="warning" v-if="orderDetailData.mtRefundPo && orderDetailData.isPartRefund === 2 && (orderDetailData.mtRefundPo.notifyType === 'apply'|| orderDetailData.mtRefundPo.notifyType === 'part')" @click.stop="queryrefund('query')">确认退款</el-button>
      <el-button class="button" type="warning" v-if="orderDetailData.mtRefundPo && orderDetailData.isPartRefund === 2 && (orderDetailData.mtRefundPo.notifyType === 'apply'|| orderDetailData.mtRefundPo.notifyType === 'part')" @click.stop="queryrefund('cancel')">驳回退款</el-button> -->
    </div>
    <!-- 已送达提示 -->
    <el-dialog title="请输入收货码" custom-class="delivered" :visible.sync="deliveredshow" :center='true' :modal-append-to-body="false" width="350px" @close="deliveredclose">
      <el-form :inline="true" size="small" :rules="deliveredDataRules" ref="deliveredDataRules" :model="deliveredData">
        <el-form-item :style="'padding-left:60px;'" prop="vaildCode">
          <el-input v-model="deliveredData.vaildCode" placeholder="请输入取货码" style="width:211px;"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="warning" @click="deliveredshow = false">取 消</el-button>
        <el-button type="success" @click="delivered">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 确认配送提示 -->
    <el-dialog title="提示" custom-class="TipsInfo" :visible.sync="TipsInfo" :center='true' :modal-append-to-body="false" width="450px" @close="tips">
      <h2 class="title">订单已确认配送</h2>
      <!-- <p class="text" v-if="Transport == 0"><span class="red">美团</span>的骑手正在快马加鞭向您赶来</p> -->
      <span slot="footer" class="dialog-footer">
        <el-button type="warning" @click="prints">打印订单小票</el-button>
      </span>
    </el-dialog>
    <!-- 小票 -->
    <ticket :print="print"></ticket>
    <!-- 取消配送 -->
    <el-dialog title="取消配送" :visible.sync="cancelOrderShow" :center='true' :modal-append-to-body="false" width="450px"  @close="cancelClose">
      <el-form  ref="cencelFrom" :inline="true" :model="cancelInfo" size="small"  :rules="rules">
        <el-form-item label="取消原因:" prop="cancelID" :style="'padding-left:60px;'" v-if="orderDetailData.logisticsType === '美团'">
          <el-select v-model="cancelInfo.cancelID" placeholder="请选择">
            <el-option
              v-for="item in canaelOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="取消备注:" prop="cancelReason" :style="'padding-left:60px;'">
          <el-input v-model="cancelInfo.cancelReason" placeholder="请输入取消备注" style="width:211px;"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="warning" @click="cancelOrderShow = false">取 消</el-button>
        <!-- <el-button type="primary" @click="cencelQuery" v-if="canaelType == 1">确 定</el-button> -->
        <el-button type="success" @click="cencelLogisticsQuery">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 取消订单 -->
    <el-dialog title="取消订单" :visible.sync="cancelMeituanOrderShow" :center='true' :modal-append-to-body="false" width="450px"  @close="cancelMeituanClose">
      <el-form  ref="cancelMeituanOrderFrom" :inline="true" :model="cancelMeituanInfo" size="small"  :rules="rulesMeituan">
        <el-form-item label="取消原因:" prop="reasonCode" :style="'padding-left:60px;'" v-if="orderDetailData.abutmentFlag !== 0">
          <el-select v-model="cancelMeituanInfo.reasonCode" placeholder="请选择">
            <el-option
              v-for="item in canaelMeituanOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="取消备注:" prop="reason" :style="'padding-left:60px;'">
          <el-input v-model="cancelMeituanInfo.reason" placeholder="请输入取消备注" style="width:211px;"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="warning" @click="cancelMeituanOrderShow = false">取 消</el-button>
        <el-button type="success" @click="cencelMeituanQuery">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 处理来自美团的退款操作 -->
    <el-dialog :title="refundTitle" :visible.sync="cancelrefundShow" :center='true' :modal-append-to-body="false" width="450px"  @close="refundMeituanClose">
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
    <!-- 取消自行配送物流 -->
    <!-- <el-dialog :title="cancelTitle" :visible.sync="selfShow" :center='true' :modal-append-to-body="false" width="450px"  @close="selfClose">
      <el-form :inline="true" size="small" :rules="cancelOrderRules" ref="cancelOrderRules" :model="selfReasonInfo">
        <el-form-item label="取消备注:" :style="'padding-left:60px;'" prop="selfReason">
          <el-input v-model="selfReasonInfo.selfReason" placeholder="请输入取消备注" style="width:211px;"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="warning" @click="selfShow = false">取 消</el-button>
        <el-button type="success" @click="cencelSelf" v-if="canaelType == 1">确 定</el-button>
        <el-button type="success" @click="cencelLogisticsSelf" v-if="canaelType == 2">确 定</el-button>
      </span>
    </el-dialog> -->
     <!-- 录入物流 -->
    <el-dialog title="录入物流信息" :visible.sync="writeShow" :center='true' :modal-append-to-body="false" width='30%' @close="closeActive">
      <el-form size="medium" :rules="logisticsrules" ref="logisticsForm" :model="logisticsInfo">
        <el-form-item label="物流公司：" label-width="100px" prop="logisticsType">
          <el-select v-model="logisticsInfo.logisticsType" placeholder="请选择" style="width:100%">
            <el-option v-for="item in logistics" :key="item.type" :label="item.name" :value="item.type">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物流单号：" label-width="100px" prop="logisticsNumber">
          <el-input auto-complete="off" v-model="logisticsInfo.logisticsNumber"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="warning" @click="writeShow = false">取 消</el-button>
        <el-button type="success" @click="queryLogistics">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 查看大图 -->
    <div class="seeImg" v-show="seeIMG" ref="seeIMG">
      <span class="close" @click="closeIMG">x</span>
      <div class="heder" :style="'height:60px;cursor: move;'" @mousedown.prevent.stop="seeImgDown($event)">
      </div>
      <div class="img-body">
        <img v-if="orderDetailData.orderOtcAdd" :src="IMGS ? IMGS : orderDetailData.orderOtcAdd.otcImages[0]" alt="">
      </div>
    </div>
    <!-- 查看物流信息 -->
    <el-dialog title="物流信息" :visible.sync="dialogStepVisible" :center='true' :modal-append-to-body="false" width="800px">
      <div class="none" v-if="!logisticsData">
        <p style="text-align:center;font-weight:900"><i class="el-icon-info">&nbsp;</i>暂无物流信息</p>
      </div>
      <!-- <div class="logistics-detail" style="position:relative" v-else>
        <div class="num" :style="'margin-bottom:15px;'">
          <el-row>
            <el-col :span="12">
              <el-col :span="8" :style="'text-align:right;font-size:18px;font-weight:900;'">订单号：</el-col>
              <el-col :span="16" :style="'font-size:18px;font-weight:900;'">
                {{orderDetailData.orderId}}
              </el-col>
            </el-col>
            <el-col :span="12" v-if="logisticsData.mt_peisong_id">
              <el-col :span="8" :style="'text-align:right;font-size:18px;font-weight:900;'">配送单号：</el-col>
              <el-col :span="16" :style="'font-size:18px;font-weight:900;'">
                {{logisticsData.mt_peisong_id}}
              </el-col>
            </el-col>
            <el-col :span="12" v-else>
              <el-col :span="8" :style="'text-align:right;font-size:18px;font-weight:900;'">物流单号：</el-col>
              <el-col :span="16" :style="'font-size:18px;font-weight:900;'">
                {{logisticsData.nu}}
              </el-col>
            </el-col>
          </el-row>
        </div>
        <p class="status"  style="position:absolute;top:-25px;right:-10px;font-size:20px;color:#f00" v-if="logisticsData.com === '美团'">{{logisticsData.status}}</p>
        <div>
        <el-row>
          <el-col :span="12" style="margin-bottom:10px;">
            <el-col :span="8" :style="'text-align:right'">配送方式：</el-col>
            <el-col :span="16">
              <span>{{logisticsData.com}}</span>
            </el-col>
          </el-col>
          <el-col :span="12" style="margin-bottom:10px;" v-if="logisticsData.com === '美团'">
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
      </div> -->
      <div class="logistics-node" v-else>
        <div v-for="(item,index) in logisticsData.Traces" :key="index" class="item" v-if="logisticsData.Traces">
          <div class="item-left">{{item.AcceptTime}}</div>
          <div class="item-right">{{item.AcceptStation}}</div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="success" @click="dialogStepVisible = false">确 定</el-button>
      </span>
    </el-dialog>
     <!-- 查看来自美团物流信息 -->
    <!-- <el-dialog title="配送信息" :visible.sync="MeituanLogisShow" :center='true' :modal-append-to-body="false" width="700px">
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
    </el-dialog> -->
    <!-- 商品退款弹窗 -->
    <el-dialog title="商品退款" :visible.sync="goodsRefundShow" :center='true' :modal-append-to-body="false" width="1200px">
      <goodsRefund v-if="goodsRefundShow" ref="goodsRefundref" @Updatarefund="Updatarefund" :sumMoney="orderDetailData.prdouctSumMoney" :orderId="orderDetailData.orderId"></goodsRefund>
      <div slot="footer" class="dialog-footer">
        <el-button type="warning" @click="goodsRefundShow = false">取 消</el-button>
        <el-button type="success" @click="submitRefund">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import javaRequest from '@/utils/javaApiRequest';
import { formatDate } from '@/utils/date';
import { getTransport, getType } from '@/utils/auth';
import jQuery from 'jquery';
// import jqp from '@static/jquery.jqprint-0.3.js';
import { getLodop } from '@static/LodopFuncs.js';
import goodsRefund from './compoent/goodsRefund';
import partRefund from './compoent/partRefund';
import ticket from './compoent/ticket';
import { getLogistics, submitLogisticsInfo, submitMeituanInfo, getLogisticsData, getMeituanLogisticsData, getOrdLogisticsData, cancelOrderAs, querySend } from './api/operation.js';
import { mapGetters } from 'vuex';
export default {
  // name: 'detail',
  // beforeRouteEnter(to, from, next) {
  //   console.log(to, from);
  //   next(vm => {
  //     if (from.name === 'list') {
  //       let view = {
  //         name: 'detail',
  //         path: '/order-control/orderDetail',
  //         title: '订单详情'
  //       };
  //       vm.$store.dispatch('delOthersViews', view);
  //     }
  //   });
  // },
  data() {
    return {
      goodsRefundShow: false, // 商品退款弹窗显示隐藏标识
      MeituanLogisShow: false, // 来自美团订单的物流弹框标识
      MeituanLogisData: [], // 来自美团订单的物流数据
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
      cancelMeituanOrderShow: false, // 取消订单弹窗标识
      cancelMeituanInfo: { // 取消订单接口入参
        reason: '',
        reasonCode: ''
      },
      canaelMeituanOptions: [ // 取消订单原因
        { label: '客服取消，用户下错单', value: '1201' },
        { label: '客服取消，用户测试', value: '1202' },
        { label: '客服取消，重复订单', value: '1203' },
        { label: '客服取消，其他原因', value: '1204' },
        { label: '其他原因', value: '1301' },
      ],
      rulesMeituan: { // 取消表单验证
        reasonCode: [
          { required: true, message: '请选择取消原因', trigger: 'change' }
        ],
        reason: [
          { required: true, message: '请输入取消备注', trigger: 'blur' },
        ]
      },
      deliveredDataRules: { // 已送达验证码表单验证
        vaildCode: [
          { required: true, message: '请输入收货码', trigger: 'blur' }
        ],
      },
      deliveredshow: false, // 已送达验证码弹窗标识
      deliveredData: { // 已送达接口入参
        vaildCode: ''
      },
      searchDetail: { // 查看详情接口入参
        orderId: sessionStorage.getItem('orderId')
      },
      orderDetailData: {}, // 详情数据
      seeIMG: false, // 处方图片显示标识
      IMGS: '', // 处方图片大图
      Transport: '', // 配送方式 0 美团 1 自行 2 普通
      TipsInfo: false, // 确认配送成功显示标识
      print: {}, // 小票数据
      canaelType: '', // 取消类型 1 取消订单 2取消配送
      cancelOrderShow: false, // 取消弹窗
      canaelOptions: [ // 取消原因
        { label: '其他接入方原因', value: '199' },
        { label: '其他配送原因 ', value: '299' },
        { label: '其他原因', value: '399' },
        { label: '顾客主动取消', value: '101' },
        { label: '顾客更改配送时间/地址', value: '102' },
        { label: '备货、包装、货品质量问题取消', value: '103' },
        { label: '配送服务态度问题取消   ', value: '201' },
        { label: '骑手配送不及时  ', value: '202' },
        { label: '骑手取货不及时', value: '203' },
      ],
      cancelInfo: { // 取消接口入参
        cancelID: '',
        cancelReason: ''
      },
      cancelTitle: '', // 取消弹窗标题
      rules: { // 取消表单验证
        cancelID: [
          { required: true, message: '请选择取消原因', trigger: 'change' }
        ],
        cancelReason: [
          { required: true, message: '请输入取消备注', trigger: 'blur' },
        ]
      },
      writeShow: false, // 录入物流弹窗
      logistics: '', // 屋里字典数据
      logisticsInfo: { // 录入物流接口入参
        orderId: '',
        logisticsType: '',
        logisticsNumber: ''
      },
      logisticsrules: { // 录入物流表单验证
        logisticsType: [{ required: true, message: '请选择物流公司', trigger: 'change' }],
        logisticsNumber: [{ required: true, message: '请输入运单号', trigger: 'blur' }]
      },
      cancelOrderRules: { // 取消自行配送表单验证
        selfReason: [{ required: true, message: '请输入取消原因', trigger: 'blur' }]
      },
      selfShow: false, // 取消自行配送物流弹窗显示标识
      selfReasonInfo: { // 取消自行配送物流原因
        selfReason: '',
      },
      dialogStepVisible: false, // 查看物流弹窗标识
      logisticsData: '', // 查看物流数据
      // type: getType() // 药店类型  1,商城2药店3药柜
    };
  },
  components: {
    'goodsRefund': goodsRefund,
    'partRefund': partRefund,
    'ticket': ticket
  },
  watch: {
    'sidebarStatus': function (value, oldValue) {
      this.$refs['data_table'].resize();
    },
  },
  computed: {
    ...mapGetters([
      'sidebarStatus'
    ]),
    columns() {
      let columns = [
        // { width: 60, titleAlign: 'center', columnAlign: 'center', type: 'selection', isFrozen: true },
        { field: 'foodName', title: '药品名称', width: 140, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'url', title: '药品图片', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'refundPrice', title: '药品金额', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'count', title: '药品数量', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'productSpecification', title: '药品规格', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'productDosageForm', title: '药品剂型', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'productProducingPlace', title: '生产厂商', width: 120, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
      ];
      for (let i = 0; i < columns.length; i++) {
        let item = columns[i];
        if (i === 0) {
          continue;
        }
        item.formatter = function (rowData, rowIndex, pagingIndex, field) {
          let value = rowData[field];
          if (value) {
            return value;
          } else {
            return '-';
          }
        };
        if (item.field === 'url') {
          let defaultImg = 'https://uploads.kangmei.com.cn/Files/20180627/fwkomaog.xzb.jpg';
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              return `<img src="${value}" alt="" width="40px" height="35px" style="margin-top:5px;" />`;
            } else {
              return `<img src="${defaultImg}" alt="" width="40px" height="35px" style="margin-top:5px;" />`;
            }
          };
        }
      }
      return columns;
    },
    // 详情
    detailColumns() {
      // let _self = this;
      let columns = [
        {
          field: 'custome', title: '序号', width: 10, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = rowIndex + 1;
            return index;
          }, isFrozen: true, isResize: true
        },
        { field: 'productName', title: '药品名称', width: 140, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'productMainImage', title: '药品图片', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'oldPrice', title: '药品金额', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'quantity', title: '药品数量', width: 50, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'productSpecification', title: '药品规格', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'productDosageForm', title: '药品剂型', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'productProducingPlace', title: '生产厂商', width: 120, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
      ];
      for (let i = 0; i < columns.length; i++) {
        let item = columns[i];
        if (i === 0) {
          continue;
        }
        item.formatter = function (rowData, rowIndex, pagingIndex, field) {
          let value = rowData[field];
          if (value) {
            return value;
          } else {
            return '-';
          }
        };
        if (item.field === 'productMainImage') {
          let defaultImg = 'https://uploads.kangmei.com.cn/Files/20180627/fwkomaog.xzb.jpg';
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value) {
              return `<img src="${value}" alt="" width="40px" height="35px" style="margin-top:5px;" />`;
            } else {
              return `<img src="${defaultImg}" alt="" width="40px" height="35px" style="margin-top:5px;" />`;
            }
          };
        }
        if (item.field === 'oldPrice') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (rowData['productType'] === 6) {
              return '0.00';
            } else {
              return value;
            }
          };
        }
      }
      return columns;
    },
  },
  methods: {
    querySend(orderId) {
      // 饿百自配送确认送达
      this.$confirm('此操作将确认送达该订单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let param = {
          orderId: orderId
        };
        querySend(param).then(res => {
          this.getDetailData();
          this.$message({
            message: res,
            type: 'success'
          });
        });
      });
    },
    Updatarefund() {
      this.goodsRefundShow = false;
      setTimeout(() => {
        this.getDetailData();
        // console.log(this.$refs);
        // if (this.$refs.partRefundref) {
        //   this.$refs.partRefundref.getData();
        // }
      }, 1000);
    },
    goodsRefund() {
      // 商品退款
      this.goodsRefundShow = true;
    },
    submitRefund() {
      // 提交退款信息
      this.$refs.goodsRefundref.submit();
    },
    // seeMeitaunLogistics() {
    //   // 查看来自美团订单的物流
    //   console.log(this.$refs);
    //   let param = {
    //     thirdOrderId: this.orderDetailData.channelOrderId
    //   };
    //   javaRequest.post('/mall_manage_seller/shipment/selectShipment', param).then(res => {
    //     console.log(res);
    //     if (res.status === 200 && res.data.resultCode === '0') {
    //       for (let i = 0; i < res.data.resultData.length; i++) {
    //         res.data.resultData[i].createDate = formatDate(res.data.resultData[i].createDate);
    //         res.data.resultData[i].logisticsStatus = this.MeituanlogisticsStatus(res.data.resultData[i].logisticsStatus);
    //       }
    //       this.MeituanLogisShow = true;
    //       this.MeituanLogisData = res.data.resultData;
    //     }
    //   });
    // },
    // // 美团物流状态
    // MeituanlogisticsStatus(status) {
    //   let a = '';
    //   switch (status) {
    //     case 0:
    //       a = '配送单发往配送';
    //       break;
    //     case 10:
    //       a = '配送单已确认';
    //       break;
    //     case 15:
    //       a = '骑手已到店';
    //       break;
    //     case 20:
    //       a = '骑手已取餐';
    //       break;
    //     case 40:
    //       a = '骑手已送达';
    //       break;
    //     case 100:
    //       a = '配送单已取消';
    //       break;
    //     default:
    //       a = status;
    //   }
    //   return a;
    // },
    // 处理来自第三方平台的退款操作
    queryrefund(type) {
      this.refundType = type;
      this.refundTitle = type === 'query' ? '确认退款' : '驳回退款';
      this.refundLebel = type === 'query' ? '确认退款原因' : '驳回退款原因';
      this.cancelrefundShow = true;
    },
    refundMeituanQuery() {
      let param = {
        orderId: this.orderDetailData.orderId,
        reason: this.refundMeituanInfo.reason,
        abutmentFlag: this.orderDetailData.abutmentFlag
      };
      let url = this.refundType === 'query' ? '/mall_manage_seller/back/order/confirmRefund' : '/mall_manage_seller/back/order/rejectRefund';
      this.$refs['refundMeituanOrderFrom'].validate((valid) => {
        if (valid) {
          javaRequest.post(url, param).then(res => {
            // console.log(res);
            this.cancelrefundShow = false;
            if (res.status === 200 && res.data.resultCode === '0') {
              let msg = res.data.msg;
              this.$message.success(msg);
              this.getDetailData();
              // this.$refs.partRefundref.getData();
            }
          });
        } else {
          return false;
        }
      });
    },
    // 关闭第三方退款弹窗
    refundMeituanClose() {
      this.$refs['refundMeituanOrderFrom'].resetFields();
    },
    // 取消订单（药葫芦或者第三方平台订单）
    cancelMeituanOrder() {
      this.cancelMeituanOrderShow = true;
    },
    cencelMeituanQuery() { // 确认取消订单按钮
      this.$refs['cancelMeituanOrderFrom'].validate((valid) => {
        if (valid) {
          this.cancelMeituanOrderShow = false;
          let param = null;
          let url = '';
          if (this.orderDetailData.abutmentFlag === 0) {
            param = {
              orderId: this.orderDetailData.orderId,
              logisticsType: '',
              content: this.cancelMeituanInfo.reason,
            };
            url = '/mall_manage_seller/back/order/cancelOrder';
          } else {
            param = {
              orderId: this.orderDetailData.orderId,
              reason: this.cancelMeituanInfo.reason,
              reasonCode: this.cancelMeituanInfo.reasonCode
            };
            url = '/mall_manage_seller/back/order/cancleMTOrder';
          }
          cancelOrderAs(url, param).then((res) => {
            this.$message.success(res);
            this.getDetailData();
          });
        } else {
          return false;
        }
      });
    },
    // 取消订单（药葫芦或者第三方平台订单）关闭弹窗
    cancelMeituanClose() {
      this.$refs['cancelMeituanOrderFrom'].resetFields();
    },
    // 自行配送验证开启时的弹窗显示
    deliveredwrap() {
      this.deliveredshow = true;
    },
    // 自行配送验证开启时的已送达
    delivered() {
      let info = {
        orderId: this.orderDetailData.orderId,
        vaildCode: this.deliveredData.vaildCode
      };
      if (this.orderDetailData.sellerUser.isValidate === 1) {
        this.$refs['deliveredDataRules'].validate((valid) => {
          if (valid) {
            javaRequest.post('/mall_manage_seller/back/logistics/confirmationOfDelivery', info).then(res => {
            // console.log(res);
              if (res.status === 200 && res.data.resultCode === '0') {
                this.deliveredshow = false;
                let msg = res.data.msg;
                this.$message.success(msg);
                this.getDetailData();
              }
            });
          } else {
            return false;
          }
        });
      } else {
        javaRequest.post('/mall_manage_seller/back/logistics/confirmationOfDelivery', info).then(res => {
          // console.log(res);
          if (res.status === 200 && res.data.resultCode === '0') {
            this.deliveredshow = false;
            let msg = res.data.msg;
            this.$message.success(msg);
            this.getDetailData();
          }
        });
      }
    },
    // 自行配送验证开启时的弹窗关闭
    deliveredclose() {
      this.deliveredData.vaildCode = '';
    },
    // 取消订单
    // cancelOrder(type) {
    //   this.canaelType = type;
    //   this.cancelTitle = '取消订单';
    //   this.selfShow = true;
    // },
    // 确定取消订单
    // cencelSelf() {
    //   console.log(1);
    //   console.log(this.$refs['cancelOrderRules']);
    //   this.$refs['cancelOrderRules'].validate((valid) => {
    //     console.log(valid);
    //     if (valid) {
    //       let param = {
    //         orderId: this.orderDetailData.orderId,
    //         logisticsType: '',
    //         // cancelReason: '不想要了',
    //         // cancelOrderReasonId: 399,
    //         content: this.selfReasonInfo.selfReason,
    //       };
    //       this.selfShow = false;
    //       javaRequest.post('/mall_manage_seller/back/order/cancelOrder', param).then(res => {
    //         // console.log(res);
    //         if (res.status === 200 && res.data.resultCode === '0') {
    //           this.$message.success(res.data.msg);
    //           this.getDetailData();
    //         } else {
    //           this.$message.error('退款失败，请重新操作');
    //           this.getDetailData();
    //         }
    //       });
    //     } else {
    //       return false;
    //     }
    //   });
    // },
    // 取消物流(美团配送以及其他（普通物流及自行）)弹窗开启
    cancelLogistics() {
      // console.log(1);

      this.cancelOrderShow = true;
      // this.canaelType = type;
      // this.cancelTitle = '取消物流';
      // if (this.orderDetailData.logisticsType === '美团') {
      //   this.cancelOrderShow = true;
      // } else if (this.orderDetailData.logisticsType === '自行配送' || this.orderDetailData.logisticsType === '自行') {
      //   this.selfShow = true;
      // }
    },
    // 确定取消物流(美团配送以及（普通物流及自行）)
    cencelLogisticsQuery() {
      this.$refs['cencelFrom'].validate((valid) => {
        if (valid) {
          this.cancelOrderShow = false;
          let param = null;
          let url = '';
          if (this.orderDetailData.logisticsType === '美团') {

            param = {
              orderId: this.orderDetailData.orderId,
              cancelReason: this.cancelInfo.cancelReason,
              cancelOrderReasonId: this.cancelInfo.cancelID
            };
            url = '/mall_manage_seller/back/logistics/deleteLogistics';
          } else {
            param = {
              orderId: this.orderDetailData.orderId,
              logisticsType: this.orderDetailData.logisticsType
            };
            url = '/mall_manage_seller/back/order/cancelLogistics';
          }
          javaRequest.post(url, param).then(res => {
            // console.log(res);
            if (res.status === 200 && res.data.resultCode === '0') {
              this.$message.success(res.data.msg);
              this.getDetailData();
            }
          });
        } else {
          return false;
        }
      });
    },
    // 取消物流(美团配送以及其他（普通物流及自行）)弹窗关闭
    cancelClose() {
      this.cancelInfo = {
        cancelReason: '',
        cancelID: ''
      };
      this.$refs['cencelFrom'].clearValidate();
    },
    // 确定取消物流(自行配送)
    // cencelLogisticsSelf() {
    //   let param = {
    //     orderId: this.orderDetailData.orderId,
    //     logisticsType: '自行配送'
    //   };
    //   this.selfShow = false;
    //   javaRequest.post('/mall_manage_seller/back/order/cancelLogistics', param).then(res => {
    //     // console.log(res);
    //     if (res.status === 200 && res.data.resultCode === '0') {
    //       this.$message.success(res.data.msg);
    //       this.getDetailData();
    //     }
    //   });
    // },
    // 关闭弹窗
    // selfClose() {
    //   this.selfReason = '';
    // },
    tips() {
      // console.log(1);
      this.getDetailData();
    },
    // 确认发货
    sendOrder() {
      if (this.Transport === '0') { // 美团发货
        let param = {
          orderId: this.orderDetailData.orderId
        };
        submitMeituanInfo(param).then(() => {
          this.TipsInfo = true;
          this.getDetailData();
          this.$message({
            message: '发货成功',
            type: 'success'
          });
        });
        // javaRequest.post('/mall_manage_seller/back/logistics/updateLogisticsOrder', param).then(res => {
        //   // console.log(res);
        //   if (res.status === 200 && res.data.resultCode === '0') {
        //     this.TipsInfo = true;
        //     this.getDetailData();
        //   }
        // });
      } else if (this.Transport === '1') { // 自行配送发货
        let info = {
          orderId: this.orderDetailData.orderId,
          logisticsNumber: '-',
          logisticsType: '自行配送'
        };
        submitLogisticsInfo(info).then(() => {
          this.TipsInfo = true;
          this.$message({
            message: '发货成功',
            type: 'success'
          });
          this.getDetailData();
        });
        // javaRequest.post('/mall_manage_seller/back/order/sendOrder', info).then(res => {
        //   // console.log(res);
        //   if (res.status === 200 && res.data.resultCode === '0') {
        //     this.TipsInfo = true;
        //     this.getDetailData();
        //   }
        // });
      } else if (this.Transport === '2') { // 普通物流发货 需开启录入物流弹窗
        this.writeShow = true;
        // this.getLogistics();
        getLogistics().then(res => { // 获取物流字典
          this.logistics = res;
        });
      } else {
        this.$message({
          message: '请选择配送方式',
          type: 'warning'
        });
      }
    },
    // 获取物流字典
    // getLogistics() {
    //   javaRequest.post('/mall_manage_seller/back/express/getExpressAll').then(res => {
    //     // console.log(res);
    //     if (res.status === 200 && res.data.resultCode === '0') {
    //       this.logistics = res.data.resultData;
    //     }
    //   });
    // },
    // 提交录入普通物流信息
    queryLogistics() {
      let _self = this;
      this.$refs['logisticsForm'].validate((valid) => {
        if (valid) {
          this.writeShow = false;
          _self.logisticsInfo.orderId = this.orderDetailData.orderId;
          submitLogisticsInfo(_self.logisticsInfo).then(() => {
            this.TipsInfo = true;
            _self.$message({
              message: '发货成功',
              type: 'success'
            });
            _self.getDetailData();
          });
          // javaRequest.post('/mall_manage_seller/back/order/sendOrder', _self.logisticsInfo).then(res => {
          //   // console.log(res);
          //   if (res.status === 200 && res.data.resultCode === '0') {
          //     this.$message({
          //       message: res.data.msg,
          //       type: 'success'
          //     });
          //   }
          //   this.getDetailData();
          // });
        } else {
          return false;
        }
      });
    },
    // 录入物流弹窗关闭
    closeActive() {
      this.logisticsInfo.logisticsType = '';
      this.logisticsInfo.logisticsNumber = '';
      this.$refs['logisticsForm'].resetFields();
    },
    // 普通物流节点长度过多是需开启查看更多物流信息弹窗
    seeLogistics() {
      // this.getLogisticsData();
      this.dialogStepVisible = true;
    },
    // 物流状态
    // logisticsStatus(status) {
    //   let a = '';
    //   switch (status) {
    //     case 0:
    //       a = '待接单';
    //       break;
    //     case 20:
    //       a = '已接单';
    //       break;
    //     case 30:
    //       a = '已取货';
    //       break;
    //     case 50:
    //       a = '已送达';
    //       break;
    //     case 99:
    //       a = '已取消';
    //       break;
    //     default:
    //       a = status;
    //   }
    //   return a;
    // },
    // // 获取物流数据
    // getLogisticsData() {
    //   this.logisticsData = '';
    //   let info = {
    //     logisticsNumber: this.orderDetailData.logisticsNumber,
    //     logisticsType: this.orderDetailData.logisticsType,
    //     orderId: this.orderDetailData.orderId
    //   };
    //   javaRequest.post('/mall_manage_seller/back/order/logisticsInfo', info).then(res => {
    //     // console.log(res);
    //     if (res.status === 200 && res.data.resultCode === '0') {
    //       // console.log(res.data.resultData.status);
    //       this.dialogStepVisible = true;
    //       this.logisticsData = res.data.resultData;
    //       this.logisticsData.status = this.logisticsStatus(this.logisticsData.status);
    //       this.logisticsData.operate_time = this.logisticsData.operate_time ? formatDate(this.logisticsData.operate_time) : this.logisticsData.operate_time;
    //     }
    //   });
    // },
    // 获取订单详情数据
    getDetailData() {
      this.orderDetailData = '';
      javaRequest.post('/mall_manage_seller/back/order/queryOrderDetailByOrderId', this.searchDetail).then(res => {
        // console.log(res);
        if (res.status === 200 && res.data.resultCode === '0') {
          this.orderDetailData = res.data.resultData;
          // 更新退款信息
          // this.$refs.partRefundref.getData();

          this.orderDetailData.createDate = formatDate(this.orderDetailData.createDate);
          this.orderDetailData.payTime = this.orderDetailData.payTime ? formatDate(this.orderDetailData.payTime) : '';
          this.orderDetailData.orderStatus = this.HandleOrder(this.orderDetailData);
          // if (this.orderDetailData.orderTransport === '1' || this.orderDetailData.orderTransport === '5') {
          //   this.Transport = '2';
          // }
          this.switchSeller();
          this.orderDetailData.orderOtcAdd ? this.orderDetailData.orderOtcAdd.otcImages = this.orderDetailData.orderOtcAdd.otcImages.split(',') : this.orderDetailData.orderOtcAdd = this.orderDetailData.orderOtcAdd;
          this.print = this.orderDetailData;
          // if ((this.orderDetailData.orderStatus === '配送中' || this.orderDetailData.orderStatus === '待评价' || this.orderDetailData.orderStatus === '已完成') && this.orderDetailData.logisticsType !== '自行配送' && this.orderDetailData.logisticsType !== '自行' && this.orderDetailData.abutmentFlag) {
          if (this.orderDetailData.abutmentFlag) {
            getMeituanLogisticsData(this.orderDetailData.channelOrderId).then(res => {
              this.MeituanLogisData = res;
            });
          } else {
            if ((this.orderDetailData.orderTransport === '1' || this.orderDetailData.orderTransport === '5') && this.orderDetailData.logisticsType) {
              getOrdLogisticsData(this.orderDetailData.logisticsNumber, this.orderDetailData.logisticsType).then(res => {
                this.logisticsData = res;
              // console.log(this.logisticsData);
              });
            } else if (this.orderDetailData.orderTransport === '2') {
              getLogisticsData(this.orderDetailData.logisticsNumber, this.orderDetailData.logisticsType, this.orderDetailData.orderId).then(res => {
                this.logisticsData = res;
              // console.log(res);
              });
            }
          }
          // }
          // (this.orderDetailData.orderStatus === '配送中' || this.orderDetailData.orderStatus === '待评价') &&
          // if ((this.orderDetailData.orderStatus === '配送中' || this.orderDetailData.orderStatus === '待评价' || this.orderDetailData.orderStatus === '已完成') && this.orderDetailData.logisticsType !== '自行配送' && this.orderDetailData.logisticsType !== '自行' && !this.orderDetailData.abutmentFlag) {
          console.log(getType());

          // }
        }
      });
    },
    // 处理药店订单状态
    HandleOrder(detail) {
      if (detail.orderStatus === '90') {
        return '待审核';
      } else if (detail.orderStatus === '20') {
        return '待确认';
      } else if (detail.orderStatus === '50') {
        return '已退款';
      } else if (detail.orderStatus === '30') {
        return '配送中';
      } else if (detail.orderStatus === '40') {
        return '已完成';
      } else if (detail.orderStatus === '60') {
        return '部分退款';
      } else if (detail.orderStatus === '80') {
        return '待评价';
      } else if (detail.orderStatus === '0') {
        return '已取消';
      } else if (detail.orderStatus === '10') {
        return '待付款';
      } else if (detail.orderStatus === '70') {
        return '退款中';
      } else if (detail.orderStatus === '100') {
        return '审核未通过';
      }
    },
    // 拖拽处方图片
    seeImgDown(e) {
      this.imgX = e.offsetX;
      this.imgY = e.offsetY;
      let _self = this;
      document.onmousemove = function(e) {
        _self.$refs.seeIMG.style.left = e.clientX - _self.imgX + 'px';
        _self.$refs.seeIMG.style.top = e.clientY - _self.imgY + 'px';
      };
      document.onmouseup = function() {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    },
    // 切换处方图片
    selectIMG(url) {
      this.IMGS = url;
      this.seeIMG = true;
    },
    // 关闭处方图片
    closeIMG() {
      this.seeIMG = false;
    },
    // 审核未通过
    cancelXamine(id) {
      this.seeIMG = false;
      let info = {
        orderId: id,
        orderStatus: '2'
      };
      javaRequest.post('/mall_manage_seller/back/order/orderAudit', info).then(res => {
        // console.log(res);
        if (res.status === 200 && res.data.resultCode === '0') {
          let msg = res.data.msg;
          this.$message.success(msg);
          this.getDetailData();
        } else {
          this.$message.error('退款失败，请重新操作');
          this.getDetailData();
        }
      });
    },
    // 审核通过
    queryeXamineSelft(id) {
      this.seeIMG = false;
      let info = {
        orderId: id,
        orderStatus: '1'
      };
      javaRequest.post('/mall_manage_seller/back/order/orderAudit', info).then(res => {
        // console.log(res);
        if (res.status === 200 && res.data.resultCode === '0') {
          let msg = res.data.msg;
          this.$message.success(msg);
          this.getDetailData();
        }
      });
    },
    // 打印商品明细小票
    printsDetail() {
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
      // 打印明细小票
      // let printHtml = '';
      // printHtml = document.getElementById('print-box3').innerHTML;
      // document.body.innerHTML = printHtml;
      // window.print();
      // location.reload();
      // return false;
    },
    // 打印订单小票
    prints() {
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
      // this.prints3();
      // let printHtml = '';
      // if (this.orderDetailData.orderTransport === '1' || this.orderDetailData.orderTransport === '5') {
      //   // console.log(1);
      //   printHtml = document.getElementById('print-box2').innerHTML;
      // } else {
      //   printHtml = document.getElementById('print-box').innerHTML;
      // }
      // document.body.innerHTML = printHtml;
      // window.print();
      // location.reload();
      // return false;
    },
    // 打印小票-使用插件jqprint
    // prints2() {
    //   if (this.orderDetailData.orderTransport === '1' || this.orderDetailData.orderTransport === '5') {
    //     jqp('#print-box2').jqprint();
    //   } else {
    //     jqp('#print-box').jqprint();
    //   }
    // },
    // // 打印小票-使用Lodop
    // prints3() {
    //   let LODOP = getLodop();
    //   if (LODOP) {
    //     if (this.orderDetailData.orderTransport === '1' || this.orderDetailData.orderTransport === '5') {
    //       LODOP.PRINT_INIT('');
    //       LODOP.ADD_PRINT_HTM(0, 0, '100%', '100%', document.getElementById('print-box2').innerHTML);
    //       LODOP.PREVIEW();
    //       // LODOP.PRINT();
    //     } else {
    //       LODOP.PRINT_INIT('');
    //       LODOP.ADD_PRINT_HTM(0, 0, '100%', '100%', document.getElementById('print-box').innerHTML);
    //       LODOP.PREVIEW();
    //       // LODOP.PRINT();
    //     }
    //   } else {
    //     setTimeout(() => {
    //       jQuery('font:first').attr('style', 'position: absolute;top: 50%;left: 50%;z-index: 1000;background: beige;padding: 10px;margin-top: -30px;margin-left: -227px;');
    //     }, 500);
    //   }
    // },
    // 切换药店
    switchSeller() {
      let param = {
        sellerUserId: this.orderDetailData.sellerUserId
      };
      javaRequest.post('/mall_manage_seller/authority/updateSellerId', param).then(res => {
        // console.log(res);
        if (res.status === 200 && res.data.resultCode === '0') {
          // this.getDetail();
        }
      });
    }
  },
  created() {
    this.getDetailData();
    let orderTransport = sessionStorage.getItem('orderTransport') ? sessionStorage.getItem('orderTransport') : getTransport();
    // console.log(getTransport());
    // console.log(orderTransport);
    if (orderTransport === '美团配送') {
      this.Transport = '0';
    } else if (orderTransport === '自行配送') {
      this.Transport = '1';
    } else if (orderTransport === '普通物流') {
      this.Transport = '2';
    }
  }
};
</script>

<style lang="less" scoped>
  .item-box{
    // border: 1px solid #E4E7ED;
    // margin-bottom: 10px;
    // background: #fff;
    // box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
    .detail-item-header{
      height: 50px;
      padding: 0 25px;
      border-top: 1px solid #E4E7ED;
      font-size:18px;
      font-weight: 900;
      line-height: 50px;
      color: #303133;
      .status{
        color: #f56c6c;
        float: right;
      }
    }
    .refund-content{
      border-bottom: 1px solid #E4E7ED;
    }
    .item-content{
      background: #fff;
      color: #606266;
      padding: 10px 0;
      /deep/ .el-row{
        margin-bottom: 10px;
        // text-align: center;
        padding: 0 25px;
      }
      .sum-money{
        text-align:right;
        line-height: 30px;
      }
      img{
        width: 100px;
        height: 120px;
        margin-right: 10px;
      }
      .receivAddress{
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        width: 350px;
        cursor: pointer;
      }
      .pt-logistics{
        .colorFication{
          color: green;
        }
        .seemore{
          color: #409EFF;
          padding-left:400px;
          margin-top: 10px;
          cursor: pointer;
        }
        .pt-logistics-item{
          margin-top: 20px;
          overflow: hidden;
          .pt-logistics-item-left{
            float: left;
            width: 150px;
          }
          .pt-logistics-item-right{
            float: left;
            width: 300px;
            margin-left: 30px;
          }
        }
      }
    }
    &:nth-child(2){
      .item-content{
        padding:10px 25px 0 25px;
      }
    }
  }


.detail{
  // padding-right: 20px;
  background: #fff;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
  padding-bottom: 30px;
  .order-info{
    padding-bottom: 10px;
  }
  .goods-list{
    padding-right: 20px;
    .sum-money{
      text-align:right;
      font-size:18px;
      line-height: 60px;
    }
  }
  .operation{
    padding-bottom: 15px;
  }
  .list{
    background: #fff;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .05);
    padding-left: 30px;
    margin-bottom: 30px;
    overflow: hidden;
    .header-status{
      font-size:18px;
      font-weight: 900;
      line-height: 62px;
    }
    .subtitle{
      font-size:18px;
      font-weight: 900;
      line-height: 45px;
    }
    .info-list{
      padding-bottom: 10px;
    }
    p{
      line-height: 30px;
    }
    img{
      width: 100px;
      height: 120px;
      margin-right: 10px;
    }
    .con{
      float: left;
    }
    .pay{
      margin-right: 500px;
    }
    .white{
      width: 15px;
      background-color: #f6f8f8;
      height: auto;
    }
    .invo{
      margin-left: 30px;
    }
  }
  .header{
    height: 62px;
    width: 100%;
    .subtitle{
    line-height: 62px;
    }
  }
  .button-list{
    width: 800px;
    margin: 0 auto;
    display: flex;
    justify-content: space-around;
    margin-top: 30px;
  }
}
.seeImg{
  width: 500px;
  background: #fff;
  position: fixed;
  z-index: 3000;
  top: 10%;
  left: 40%;
  border: 1px solid #000;
  padding: 20px;
  .close{
    display: block;
    position: absolute;
    top: 15px;
    right: 25px;
    cursor: pointer;
    width: 25px;
    height: 25px;
    line-height: 25px;
    text-align: center;
    border-radius: 50%;
    &:hover{
      background: #c0c4cc;
      color: #fff;
    }
  }
  .title{
    img{
      width:50px;
      height: 50px;
    }
  }
  .img-body{
    text-align: center;
    margin-bottom: 35px;
    img{
      width: 400px;
      height: 500px;
    }
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
.logistics-node{
  padding-left: 50px;
  .item{
    margin-top: 20px;
    overflow: hidden;
    &:nth-child(1) {
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
.Meituanlogistics{
  display: block;
  width: 600px;
  height: 70px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  .logistitle-item{
    width: 100px;
    text-align: center;
  }
}
</style>
