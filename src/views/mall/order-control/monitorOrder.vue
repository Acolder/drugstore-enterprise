<template>
  <div class="monitor">
    <div class="search-wrapper">
      <el-form :inline="true" :model="orderSearchData" size="small" label-width="100px" ref="seaarchForm">
        <div v-if="role === '店主'">
          <el-form-item label="选择药店">
            <el-select v-model="orderSearchData.sellerId" placeholder="请选择" filterable>
              <el-option v-for="(item,index) in sellerData" :key="index" :label="item.sellerName" :value="item.sellerUserId">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <el-form-item label="订单编号" prop="orderId">
          <el-input v-model="orderSearchData.orderId" placeholder="请输入订单号"></el-input>
        </el-form-item>
        <el-form-item label="收货人电话" prop="addressPhone">
          <el-input v-model="orderSearchData.addressPhone" placeholder="请输入收货人电话"></el-input>
        </el-form-item>
        <el-form-item label="收货人地址" prop="totalAddress">
          <el-input v-model="orderSearchData.totalAddress" placeholder="请输入收货人地址"></el-input>
        </el-form-item>
        <el-form-item label="订单渠道" prop="abutmentFlag">
          <el-select v-model="orderSearchData.abutmentFlag" placeholder="请选择" clearable>
            <el-option v-for="item in abutmentOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
            <!-- <el-form-item label="配送方式:" prop="orderTransport">
              <el-select v-model="orderSearchData.orderTransport" placeholder="请选择" clearable>
                <el-option v-for="item in transportOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item> -->
          <el-form-item>
            <el-button type="default" @click="clean">清空</el-button>
            <el-button type="primary" @click="queryByOrder">查询</el-button>
          </el-form-item>
      </el-form>
    </div>
    <div class="table-wrapper monitor_table_wrap" v-loading="loading" element-loading-text="拼命加载中">
      <div v-if="tabData.length > 0">
        <div class="order-item" v-for="(item,index) in tabData" :key="index">
          <div class="header item-header">
            <div class="header-left">
              <span class="serial">{{(orderSearchData.pageNum - 1) * orderSearchData.pageSize + index + 1}}.</span>
              <span>订单状态：<span class="status">{{item.orderStatus === '20' ? '待确认' : '配送中'}}</span></span>
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
              <p class="info-item" v-if="item.orderStatus === '20'"><span>配送方式：</span>
                <el-radio v-model="item.Transport" label="0" v-if="item.orderTransport === '2'">第三方配送</el-radio>
                <el-radio v-model="item.Transport" label="1" v-if="item.orderTransport === '2'">自行配送</el-radio>
                <el-radio v-model="item.Transport" label="2" v-if="item.orderTransport === '1' || item.orderTransport === '5'">普通物流</el-radio>
              </p>
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
              <el-button type="warning" size="small" @click="sendOrder(item)" v-if="item.orderStatus === '20'">确认发货</el-button>
              <el-button type="danger" size="small" @click="cancel(item)" v-if="item.orderStatus === '20' || (item.orderStatus === '30' && item.abutmentFlag !== 0 && item.mtRefund === '无')">取消订单</el-button> <!--&& (item.logistics.status !== 50 || item.logistics.status !== 99) && item.orderTransport === '2' && item.isNotice !== 3  -->
              <el-button type="danger" size="small" @click="cancelLogistics(item)" v-if="item.orderStatus === '30' && (item.logistics.status !== 50 || item.logistics.status !== 99) && item.orderTransport !== '3' && item.isNotice !== 3 && item.abutmentFlag === 0">取消配送</el-button>
              <el-button type="warning" size="small" @click="delivered(item)" v-if="item.orderStatus === '30' && (item.logisticsType === '自行配送' || item.logisticsType === '自行')">已送达</el-button>
              <el-button class="button" size="small" type="warning" v-if="item.orderStatus === '30' && item.logisticsType !== '自行配送' && item.logisticsType !== '自行'" @click="seeLogistics(item)">查看物流</el-button>
              <!-- 饿百自配送确认送达 -->
              <el-button class="button" size="small" type="warning" v-if="item.isDelivery === 1" @click="querySend(item)">确认送达</el-button>
             <!-- 来自美团外第三方订单操作 -->
            <!-- <el-button class="button" type="warning" v-if="item.mtRefundPo && item.mtRefundPo.notifyType === 'apply'" @click.stop="queryrefund('query',item)">确认退款</el-button>
            <el-button class="button" type="warning" v-if="item.mtRefundPo && item.mtRefundPo.notifyType === 'apply'" @click.stop="queryrefund('cancel',item)">驳回退款</el-button> -->
            </div>
            <div class="foot-right">
              <el-button type="success" size="small" @click="searchNumberPhone(item)" v-if="item.abutmentFlag === 2">查询号码</el-button>
              <el-button type="success" size="small" @click="prints(item)">打印订单小票</el-button>
              <el-button type="success" size="small" @click="printsDetail(item)">打印商品明细</el-button>
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
    <!-- 录入物流 -->
    <el-dialog title="录入物流信息" :visible.sync="writeShow" :center='true' :modal-append-to-body="false" width='30%' @close="closeActive('logisticsForm')">
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
    <!-- 确认配送提示 -->
    <el-dialog title="提示" custom-class="TipsInfo" :visible.sync="TipsInfo" :center='true' :modal-append-to-body="false" width="450px">
      <h2 class="title">订单已确认配送</h2>
      <!-- <p class="text" v-if="Transport == 0"><span class="red">美团</span>的骑手正在快马加鞭向您赶来</p> -->
      <span slot="footer" class="dialog-footer">
        <el-button type="warning" @click="prints(print)">打印订单小票</el-button>
      </span>
    </el-dialog>
    <!-- 取消订单 -->
    <el-dialog title="取消订单" :visible.sync="cancelShow" :center='true' :modal-append-to-body="false" width="450px" @close="closeActive('cencelFrom')">
      <el-form  ref="cencelFrom" :inline="true" :model="cancelInfo" size="small"  :rules="cancelrules">
        <el-form-item v-if="cancelItem.abutmentFlag === 1" label="取消原因:" prop="cancelID" :style="'padding-left:60px;'">
          <el-select v-model="cancelInfo.cancelID" placeholder="请选择">
            <el-option
              v-for="item in canaelMeituanOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="取消备注:" prop="content" :style="'padding-left:60px;'">
          <el-input v-model="cancelInfo.content" placeholder="请输入取消备注" style="width:211px;"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="warning" @click="cancelShow = false">取 消</el-button>
        <el-button type="success" @click="cencelQuery">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 取消配送 -->
    <el-dialog title="取消配送" :visible.sync="cancelLogisticsShow" :center='true' :modal-append-to-body="false" width="450px" @close="closeActive('cencelLogisFrom')">
      <el-form  ref="cencelLogisFrom" :inline="true" :model="cancelInfo" size="small"  :rules="cancelrules">
        <el-form-item v-if="cancelLogisItem.logisticsType === '美团'" label="取消原因:" prop="cancelID" :style="'padding-left:60px;'">
          <el-select v-model="cancelInfo.cancelID" placeholder="请选择">
            <el-option
              v-for="item in canaelLogisOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="取消备注:" prop="content" :style="'padding-left:60px;'">
          <el-input v-model="cancelInfo.content" placeholder="请输入取消备注" style="width:211px;"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="warning" @click="cancelLogisticsShow = false">取 消</el-button>
        <el-button type="success" @click="cencelLogisQuery">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 已送达提示 -->
    <el-dialog title="请输入收货码" custom-class="delivered" :visible.sync="deliveredshow" :center='true' :modal-append-to-body="false" width="350px" @close="closeActive('deliveredDataRules')">
      <el-form :inline="true" size="small" :rules="deliveredDataRules" ref="deliveredDataRules" :model="deliveredData">
        <el-form-item :style="'padding-left:60px;'" prop="vaildCode">
          <el-input v-model="deliveredData.vaildCode" placeholder="请输入取货码" style="width:211px;"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="warning" @click="deliveredshow = false">取 消</el-button>
        <el-button type="success" @click="deliveredQuery">确 定</el-button>
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
    <el-dialog :title="refundTitle" :visible.sync="cancelrefundShow" :center='true' :modal-append-to-body="false" width="450px"  @close="closeActive('closeActive')">
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
import { getRole, getTransport } from '@/utils/auth';
import javaRequest from '@/utils/javaApiRequest';
import { formatDate } from '@/utils/date';
import jQuery from 'jquery';
import jqp from '@static/jquery.jqprint-0.3.js';
import { getLodop } from '@static/LodopFuncs.js';
import ticket from './compoent/ticket';
import { getLogistics, submitLogisticsInfo, submitMeituanInfo, getLogisticsData, getMeituanLogisticsData, getOrdLogisticsData, cancelOrderAs, querySend } from './api/operation.js';
export default {
  data() {
    return {
      loading: true,
      role: getRole(), // 身份
      orderSearchData: {
        orderId: '',
        addressPhone: '',
        totalAddress: '',
        abutmentFlag: '',
        orderTransport: '',
        sellerId: '',
        pageNum: 1,
        pageSize: 5
      },
      // Transport: '0', // 配送方式 0 美团 1 自行 2 普通
      writeShow: false, // 物流弹窗
      logisticsInfo: { // 提交物流参数
        logisticsType: '',
        logisticsNumber: ''
      },
      logisticsrules: { // 录入物流表单验证
        logisticsType: [{ required: true, message: '请选择物流公司', trigger: 'change' }],
        logisticsNumber: [{ required: true, message: '请输入运单号', trigger: 'blur' }]
      },
      logistics: [], // 物流字典
      sendOrderid: '',
      TipsInfo: false, // 打印小票提示弹窗
      print: {}, // 小票内容
      cancelShow: false, // 取消订单弹窗
      cancelInfo: {
        content: '',
        cancelID: ''
      },
      cancelrules: {
        content: [{ required: true, message: '请输入取消备注', trigger: 'blur' }],
        cancelID: [{ required: true, message: '请选择取消原因', trigger: 'change' }],
      },
      cancelItem: '',
      canaelMeituanOptions: [ // 取消来自美团第三方订单原因
        { label: '客服取消，用户下错单', value: '1201' },
        { label: '客服取消，用户测试', value: '1202' },
        { label: '客服取消，重复订单', value: '1203' },
        { label: '客服取消，其他原因', value: '1204' },
        { label: '其他原因', value: '1301' },
      ],
      cancelLogisticsShow: false, // 取消物流弹窗
      canaelLogisOptions: [ // 取消美团物流原因
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
      cancelLogisItem: '',
      deliveredshow: false, // 已送达弹窗
      deliverItem: '',
      deliveredData: {
        vaildCode: ''
      },
      deliveredDataRules: {
        vaildCode: [{ required: true, message: '请输入取货码', trigger: 'blur' }],
      },
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
      sellerData: [], // 药店
      abutmentOptions: [
        { label: '全部', value: '' },
        { label: '药葫芦', value: 0 },
        { label: '美团', value: 1 },
        { label: '饿了么', value: 2 },
        { label: '京东到家', value: 3 }
      ],
      transportOptions: [
        { label: '全部', value: '' },
        { label: '普通物流', value: 1 },
        { label: '28分钟达', value: 2 },
        { label: '自提', value: 3 },
      ]
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
    querySend(item) {
      // 饿百自配送确认送达
      this.$confirm('此操作将确认送达该订单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let param = {
          orderId: item.orderId
        };
        querySend(param).then(res => {
          this.getOrderData();
          this.$message({
            message: res,
            type: 'success'
          });
        });
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
    // 获取药店列表
    getSellerData() {
      let screenInfo = {
        pageSize: 500,
        pageIndex: 1,
      };
      javaRequest.post(`/mall_manage_seller/authority/queryPharmacies`, screenInfo).then((res) => {
        // console.log(res);
        if (res.status === 200 && res.data.resultCode === '0') {
          console.log(res);
          this.sellerData = res.data.resultData.data.map(res => {
            return {
              sellerUserId: res.sellerUserId,
              sellerName: res.sellerName
            };
          });
          let array = this.sellerData.map(res => {
            return res.sellerUserId;
          }).join(',');
          let obj = {
            sellerUserId: array,
            sellerName: '全部'
          };
          /* eslint-disable */
          this.sellerData.length > 0 ? this.sellerData.push(obj) : this.sellerData;
          console.log(this.sellerData);
          this.orderSearchData.sellerId = array;
          // this.getOrderData();
          this.getOrderData();
        }
      });
    },
    // 获取监控订单
    getOrderData() {
      let _this = this;
      javaRequest.post(`/mall_manage_seller/back/order/orderMonitor`, this.orderSearchData).then((res) => {
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
    // 查询
    queryByOrder() {
      this.loading = true;
      this.orderSearchData.pageNum = 1;
      this.getOrderData();
    },
    // 清除
    clean() {
      this.$refs['seaarchForm'].resetFields();
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
    // 发货
    sendOrder(item) {
      this.print = item;
      if (item.Transport === '0') { // 美团发货
        let param = {
          orderId: item.orderId
        };
        submitMeituanInfo(param).then(() => {
          this.TipsInfo = true;
          this.getOrderData();
          this.$message({
            message: '发货成功',
            type: 'success'
          });
        });
      } else if (item.Transport === '1') { // 自行配送发货
        let info = {
          orderId: item.orderId,
          logisticsNumber: '-',
          logisticsType: '自行配送'
        };
        submitLogisticsInfo(info).then(() => {
          this.TipsInfo = true;
          this.$message({
            message: '发货成功',
            type: 'success'
          });
          this.getOrderData();
        });
      } else if (item.Transport === '2') { // 普通物流发货
        this.writeShow = true;
        this.sendOrderid = item.orderId;
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
    queryLogistics() {
      // 普通物流确认发货
      let _self = this;
      this.$refs['logisticsForm'].validate((valid) => {
        if (valid) {
          _self.writeShow = false;
          _self.logisticsInfo.orderId = this.sendOrderid;
          submitLogisticsInfo(_self.logisticsInfo).then(() => {
            this.TipsInfo = true;
            _self.$message({
              message: '发货成功',
              type: 'success'
            });
            _self.getOrderData();
          });
        } else {
          return false;
        }
      });
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
    // 普通物流以及自行配送发货
    // submitLogisticsInfo(info) {
    //   let _self = this;
    //   javaRequest.post('/mall_manage_seller/back/order/sendOrder', info).then(res => {
    //     // console.log(res);
    //     if (res.status === 200 && res.data.resultCode === '0') {
    //       console.log(this.print);
    //       this.TipsInfo = true;
    //       _self.$message({
    //         message: '发货成功',
    //         type: 'success'
    //       });
    //       _self.getOrderData();
    //     }
    //   });
    // },
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
        // let printHtml = '';
        // if (this.print.orderTransport === '1' || this.print.orderTransport === '5') {
        // // console.log(1);
        //   printHtml = document.getElementById('print-box2').innerHTML;
        // } else {
        //   printHtml = document.getElementById('print-box').innerHTML;
        // }
        // document.body.innerHTML = printHtml;
        // window.print();
        // location.reload();
        // return false;
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
    // 取消订单（药葫芦或者第三方平台订单）
    cancel(item) {
      this.cancelItem = item;
      this.cancelShow = true;
    },
    cencelQuery() { // 确认取消订单按钮
      this.$refs['cencelFrom'].validate((valid) => {
        if (valid) {
          console.log(this.cancelItem);
          let param = {};
          let url = '';
          if (this.cancelItem.abutmentFlag === 0) {
            param = {
              orderId: this.cancelItem.orderId,
              logisticsType: '',
              // cancelReason: '不想要了',
              // cancelOrderReasonId: 399,
              content: this.cancelInfo.content,
            };
            url = '/mall_manage_seller/back/order/cancelOrder';
          } else {
            param = {
              orderId: this.cancelItem.orderId,
              reason: this.cancelInfo.content,
              reasonCode: this.cancelInfo.cancelID
            };
            url = '/mall_manage_seller/back/order/cancleMTOrder';
          }
          this.cancelShow = false;
          cancelOrderAs(url, param).then((res) => { // 取消订单
            this.$message.success(res);
            this.getOrderData();
          });
        } else {
          return false;
        }
      });
    },
    // 取消配送
    cancelLogistics(item) {
      this.cancelLogisticsShow = true;
      this.cancelLogisItem = item;
    },
    cencelLogisQuery() {
      this.$refs['cencelLogisFrom'].validate((valid) => {
        if (valid) {
          let param = {};
          let url = '';
          if (this.cancelLogisItem.logisticsType === '美团') {
            param = {
              orderId: this.cancelLogisItem.orderId,
              cancelReason: this.cancelInfo.cancelReason,
              cancelOrderReasonId: this.cancelInfo.cancelID
            };
            url = '/mall_manage_seller/back/logistics/deleteLogistics';
          } else {
            param = {
              orderId: this.cancelLogisItem.orderId,
              logisticsType: this.cancelLogisItem.logisticsType,
              // cancelReason: '不想要了',
              // cancelOrderReasonId: 399,
              // content: this.cancelrules.content,
            };
            url = '/mall_manage_seller/back/order/cancelLogistics';
          }
          this.cancelLogisticsShow = false;
          javaRequest.post(url, param).then(res => {
            // console.log(res);
            if (res.status === 200 && res.data.resultCode === '0') {
              this.$message.success(res.data.msg);
              this.getOrderData();
            }
          });
        } else {
          return false;
        }
      });
    },
    // 已送达
    delivered(item) {
      if (item.sellerUser.isValidate === 1) {
        this.deliveredshow = true;
        this.deliverItem = item;
      } else {
        this.$confirm('此操作将执行已送达, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let info = {
            orderId: item.orderId,
            vaildCode: ''
          };
          this.sendDeliver(info);
        });
      }
    },
    deliveredQuery() {
      let info = {
        orderId: this.deliverItem.orderId,
        vaildCode: this.deliveredData.vaildCode
      };
      this.$refs['deliveredDataRules'].validate((valid) => {
        if (valid) {
          this.sendDeliver(info);
        } else { return false }
      });
    },
    sendDeliver(info) {
      javaRequest.post('/mall_manage_seller/back/logistics/confirmationOfDelivery', info).then(res => {
        // console.log(res);
        if (res.status === 200 && res.data.resultCode === '0') {
          this.deliveredshow = false;
          let msg = res.data.msg;
          this.$message.success(msg);
          this.$store.dispatch('getOrderSum');
          this.getOrderData();
        }
      });
    },
    // 查看物流
    seeLogistics(item) {
      this.logisticsItem = item;
      if (item.abutmentFlag) { // 美团第三方订单
        // let param = {
        //   thirdOrderId: item.channelOrderId
        // };
        // javaRequest.post('/mall_manage_seller/shipment/selectShipment', param).then(res => {
        //   console.log(res);
        //   if (res.status === 200 && res.data.resultCode === '0') {
        //     for (let i = 0; i < res.data.resultData.length; i++) {
        //       res.data.resultData[i].createDate = formatDate(res.data.resultData[i].createDate);
        //       res.data.resultData[i].logisticsStatus = this.MeituanlogisticsStatus(res.data.resultData[i].logisticsStatus);
        //     }
        //     this.MeituanLogisShow = true;
        //     this.MeituanLogisData = res.data.resultData;
        //   }
        // });
        this.MeituanLogisShow = true;
        getMeituanLogisticsData(item.channelOrderId).then(res => {
          this.MeituanLogisData = res;
        });
      } else { // 普通物流订单物流
        // let info = {
        //   logisticsNumber: item.logisticsNumber,
        //   logisticsType: item.logisticsType,
        //   orderId: item.orderId
        // };
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
        // javaRequest.post('/mall_manage_seller/back/order/logisticsInfo', info).then(res => {
        // // console.log(res);
        //   if (res.status === 200 && res.data.resultCode === '0') {
        //   // console.log(res.data.resultData.status);
        //     this.dialogStepVisible = true;
        //     this.logisticsData = res.data.resultData;
        //     this.logisticsData.status = this.logisticsStatus(this.logisticsData.status);
        //     this.logisticsData.operate_time = this.logisticsData.operate_time ? formatDate(this.logisticsData.operate_time) : this.logisticsData.operate_time;
        //   }
        // });
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
    if (this.role === '店主') {
      this.getSellerData();
    } else {
      this.getOrderData();
    }
    if (this.$route.query.rest) {
      this.$router.push('/order-control/monitorOrder');
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
    // let orderTransport = sessionStorage.getItem('orderTransport') ? sessionStorage.getItem('orderTransport') : getTransport();
    // if (orderTransport === '美团配送') {
    //   this.Transport = '0';
    // } else if (orderTransport === '自行配送') {
    //   this.Transport = '1';
    // } else if (orderTransport === '普通物流') {
    //   this.Transport = '2';
    // }
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
