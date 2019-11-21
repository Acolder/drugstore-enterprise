<template>
  <div id="order-list">
    <div class="search-wrapper">
      <!-- 搜索头部 -->
      <div class="header-top">
        <div class="right">
          <span class="take" @click="take">{{takeValue}}</span>
        </div>
      </div>
      <div class="header">
        <el-form :inline="true" :model="orderSearchData" size="small" label-width="72px">
          <div v-if="role === '店主'">
            <el-form-item label="选择药店">
              <el-select v-model="orderSearchData.screenInfo.sellerId" placeholder="请选择" filterable>
                <el-option v-for="(item,index) in sellerData" :key="index" :label="item.sellerName" :value="item.sellerUserId">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <el-form-item label="订单状态:">
            <el-select v-model="orderSearchData.screenInfo.status" placeholder="请选择" clearable>
              <el-option v-for="item in orderSearchData.ordeOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="收货人:">
            <el-input v-model="orderSearchData.screenInfo.addressName" placeholder="请输入收货人"></el-input>
          </el-form-item>
          <el-form-item label="收货人电话:" label-width="88px">
            <el-input v-model="orderSearchData.screenInfo.addressPhone" placeholder="请输入收货人手机号"></el-input>
          </el-form-item>
          <el-form-item label="创建时间:">
            <el-date-picker
              v-model="orderSearchData.screenInfo.createStart"
              align="right"
              type="date"
              placeholder="选择开始日期"
              :picker-options="pickerOptions"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width:200px">>
            </el-date-picker>至
            <el-date-picker
              v-model="createEnd"
              align="right"
              type="date"
              placeholder="选择结束日期"
              :picker-options="pickerOptions2"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              style="width:200px">
            </el-date-picker>
            <p style="color:red" v-if="errorShow">结束时间必须大于开始时间</p>
          </el-form-item>
          <div class="senior" v-if="takeShow">
            <el-form-item label="订单类型:">
              <el-select v-model="orderSearchData.screenInfo.isOtc" placeholder="请选择">
                <el-option label="全部" value=""></el-option>
                <el-option label="处方订单" value="2"></el-option>
                <el-option label="非处方订单" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="收货地址:">
              <el-input v-model="orderSearchData.screenInfo.totalAddress" placeholder="请输入收货地址"></el-input>
            </el-form-item>
            <el-form-item label="订单号:" label-width="88px">
              <el-input v-model="orderSearchData.screenInfo.orderId" placeholder="请输入订单号"></el-input>
            </el-form-item>
            <!-- <el-form-item label="流水号:">
              <el-input v-model="orderSearchData.screenInfo.poiSeq" placeholder="请输入流水号"></el-input>
            </el-form-item> -->
          </div>
          <el-form-item>
            <el-button type="default" @click="clean">清空</el-button>
            <el-button type="primary" @click="queryByOrder">查询</el-button>
            <el-button @click="exportActive">导出</el-button>
          </el-form-item>
        </el-form>
        <el-form :model="orderSearchData" size="small">
      </el-form>
      </div>
    </div>
    <div class="orderPaySum table-wrapper">金额合计：<span class="redMoney">￥{{orderPaySum}}</span></div>
    <!-- 表格区域 -->
    <div class="table-wrapper">
      <v-table ref="data_table" :is-loading="isLoding" column-width-drag is-horizontal-resize style="width:100%" :columns="columns" :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff" @on-custom-comp="customCompFunc"></v-table>
    </div>
    <!-- 分页区域 -->
    <div class="pagin-wrapper">
      <v-pagination @page-change="pageChange" @page-size-change="pageSizeChange" :total="total" :page-size="orderSearchData.screenInfo.pageSize" :page-index="orderSearchData.screenInfo.pageNum" :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']">
      </v-pagination>
    </div>
  </div>
</template>

<script>
import javaRequest from '@/utils/javaApiRequest';
import { formatDate } from '@/utils/date';
import { mapGetters } from 'vuex';
import { getToken, getRole } from '@/utils/auth';
// import { mallRouterMap } from '@/router';
// import observer from '@/utils/observer';
export default {
  // name: 'detail',
  // beforeRouteEnter(to, from, next) {
  //   console.log(to, from);
  //   next(vm => {
  //     let permission_data = [];
  //     permission_data.push({
  //       name: 'mall',
  //       routers: mallRouterMap
  //     });
  //     console.log(mallRouterMap);
  //     vm.$store.dispatch('setPermission', permission_data);
  //     // if (from.path.indexOf('C') > -1) {
  //     //   vm.$store.commit('SET_KEEP_ALIVE', ['B']);
  //     // }
  //   });
  // },
  data() {
    return {
      orderSearchData: {
        screenInfo: { // 搜索
          sellerId: '', // 药店ID
          status: '', // 订单状态
          orderTransport: '',
          createStart: '', // 开始时间
          createEnd: '', // 结束时间
          orderId: '', // 订单ID
          orderBy: 'desc', // 排序
          isOtc: '', // 订单类型 1非处方 2处方
          addressName: '', // 收货人姓名
          totalAddress: '', // 收货人地址
          addressPhone: '', // 收货人电话
          poiSeq: '',
          pageNum: 1,
          pageSize: 10
        },
        ordeOptions: [ // 状态选项
          { value: '', label: '全部' },
          { value: '0', label: '已取消' }, // //订单状态 0-已取消 10-待付款 20-待发货 30 -待收货 40-交易成功 50-已退款 60-部分退款 70-退款中 80-待评价
          // { value: '10', label: '待付款' },
          { value: '90', label: '待审核' },
          { value: '20', label: '待确认' },
          { value: '30', label: '配送中' },
          { value: '40', label: '已完成' },
          { value: '50', label: '已退款' },
          { value: '60', label: '部分退款' },
          { value: '70', label: '退款中' },
          { value: '100', label: '审核未通过' },
          { value: '80', label: '待评价' }
        ],
        // hisOrderOption: [
        //   { value: '90,20,30', label: '全部' },
        //   { value: '90', label: '待审核' },
        //   { value: '20', label: '待确认' },
        //   { value: '30', label: '配送中' },
        // ]
        // modeOptions: [
        //   { value: '1', label: '普通物流' }, // //配送方式 1-普通物流 2-28分钟达 3-自提
        //   { value: '2', label: '28分钟达' },
        //   { value: '3', label: '自提' }
        // ],
      },
      role: getRole(), // 身份 *店员*店主
      sellerData: [], // 药店数据列表
      takeShow: '', // 高级搜索
      takeValue: '展开高级搜索',
      // value: '',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      pickerOptions2: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      total: 0,
      orderPaySum: 0,
      tableData: [],
      print: {},
      exportInfo: {},
      isLoding: true,
      errorShow: false,
      createEnd: ''
    };
  },
  watch: {
    'sidebarStatus': function (value, oldValue) {
      this.$refs['data_table'].resize();
    },
  },
  props: {
    isHis: Boolean
  },
  computed: {
    columns() {
      let _self = this;
      let columns = [
        {
          field: 'custome', title: '序号', width: 50, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = (_self.orderSearchData.screenInfo.pageNum - 1) * _self.orderSearchData.screenInfo.pageSize + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'orderId', title: '订单号', width: 160, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'abutmentFlag', title: '订单渠道', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'wmPoiReceiveCent', title: '药店收益', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'orderStatus', title: '订单状态', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'sellerUser', title: '商户名称', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        // { field: 'orderStatus', title: '用户订单状态', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'isOtc', title: '订单类型', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'foodShareFee', title: '平台费', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'logisticsType', title: '配送物流', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'addressPo1', title: '收货人', width: 80, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'addressPo2', title: '收货人电话', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'addressPo3', title: '收货人地址', width: 160, titleAlign: 'center', columnAlign: 'center', isResize: true, overflowTitle: true },
        { field: 'createDate', title: '创建时间', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'operation', title: '操作', width: 150, titleAlign: 'center', columnAlign: 'center', componentName: 'operation', isResize: true }
      ];
      for (let i = 0; i < columns.length; i++) {
        let item = columns[i];
        if (i === 0) {
          continue;
        }
        item.formatter = function (rowData, rowIndex, pagingIndex, field) {
          let value = rowData[field];
          if (value || value === 0) {
            return value;
          } else {
            return '-';
          }
        };
        // 处理订单渠道
        if (item.field === 'abutmentFlag') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            // let value = rowData[field];
            let value = rowData[field];
            if (value === 0) {
              return '药葫芦';
            } else if (value === 1) {
              return '美团';
            } else if (value === 2) {
              return '饿了么';
            } else if (value === 4) {
              return '京东到家';
            }
          };
        }
        // 订单金额
        if (item.field === 'wmPoiReceiveCent') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            // let value = rowData[field];
            let value = '￥' + rowData[field].toFixed(2);
            return '<span style="color:#f56c6c">' + value + '</span>';
          };
        }
        // 订单状态
        if (item.field === 'orderStatus') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            // let value = rowData[field];
            let value = _self.orderStatus(rowData[field]);
            if (value === '待确认' || value === '待审核') {
              return `<span style='color:#f00'>${value}</span>`;
            } else {
              return value;
            }
          };
        }
        // 药店订单状态
        // if (item.field === 'isNotice') {
        //   item.formatter = function (rowData, rowIndex, pagingIndex, field) {
        //     if (rowData[field] === 1 && rowData['orderStatus'] === '90') {
        //       return '待确认';
        //     } else if (rowData['orderStatus'] === '50' || rowData['orderStatus'] === '70' || rowData['orderStatus'] === '100') {
        //       return '已退款';
        //     } else if (rowData[field] === '30' && (rowData['logistics'].status === 20 || rowData['logistics'].status === 0)) {
        //       return '待取货';
        //     } else if (rowData['orderStatus'] === '30' && rowData[field] === 2) {
        //       return '配送中';
        //     } else if (rowData['orderStatus'] === '30' && rowData[field] === 3) {
        //       return '已完成';
        //     } else if (rowData['orderStatus'] === '40') {
        //       return '已完成';
        //     } else if (rowData['orderStatus'] === '60') {
        //       return '部分退款';
        //     } else if (rowData['orderStatus'] === '80') {
        //       return '待评价';
        //     } else if (rowData['orderStatus'] === '0') {
        //       return '已取消';
        //     } else if (rowData['orderStatus'] === '10') {
        //       return '待付款';
        //     }
        //   };
        // }
        // 配送方式
        if (item.field === 'orderTransport') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = _self.orderMode(rowData[field]);
            return value;
          };
        }
        // 创建时间
        if (item.field === 'createDate') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = formatDate(rowData[field]);
            return value;
          };
        }
        // 收货人
        if (item.field === 'sellerUser') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData['sellerUser'].sellerName;
            if (value) {
              return value;
            } else {
              return '-';
            }
          };
        }
        // 收货人
        if (item.field === 'addressPo1' && item.title === '收货人') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData['addressPo'].addressName;
            if (value) {
              return value;
            } else {
              return '-';
            }
          };
        }
        // 收货人电话
        if (item.field === 'addressPo2' && item.title === '收货人电话') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData['addressPo'].addressPhone;
            if (value) {
              return value;
            } else {
              return '-';
            }
          };
        }
        // 收货人地址
        if (item.field === 'addressPo3' && item.title === '收货人地址') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData['addressPo'].totalAddress;
            if (value) {
              return value;
            } else {
              return '-';
            }
          };
        }
        // 订单类型
        if (item.field === 'isOtc') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            if (value === 1) {
              return '非处方';
            } else if (value === 2) {
              return `<span style='color:#f00'>处方</span>`;
            } else {
              return value;
            }
          };
        }
        // 物流类型
        if (item.field === 'logisticsType') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let value = rowData[field];
            let a = '';
            if (value) {
              switch (value) {
                case 'yunda':
                  a = '韵达';
                  break;
                case 'shunfeng':
                  a = '顺丰';
                  break;
                case 'huitongkuaidi':
                  a = '百世汇通';
                  break;
                case 'zhongtong':
                  a = '中通';
                  break;
                case 'yuantong':
                  a = '圆通';
                  break;
                case 'guotongkuaidi':
                  a = '国通';
                  break;
                case 'tianitan':
                  a = '天天';
                  break;
                case 'youshuwuliu':
                  a = '优速';
                  break;
                case 'kuaijiesudi':
                  a = '快捷';
                  break;
                case 'quanfengkuaidi':
                  a = '全峰';
                  break;
                case 'youzhengguonei':
                  a = '邮政包裹';
                  break;
                default:
                  a = value;
              }
            } else {
              a = '-';
            }

            return a;
          };
        }
        // 平台费
        if (item.field === 'foodShareFee') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            // let value = rowData[field];
            let value = rowData[field];
            if (value || value === 0) {
              return '￥' + value.toFixed(2);
            }
          };
        }
      }
      return columns;
    },
    ...mapGetters([
      'sidebarStatus'
    ])
  },
  methods: {
    searehSeller(e) {
      console.log(e);
    },
    // 导出按钮
    exportActive() {
      let token = getToken();
      let sellerId = this.exportInfo.sellerId;
      let status = this.exportInfo.status;
      let orderTransport = this.exportInfo.orderTransport;
      let createStart = this.exportInfo.createStart;
      let createEnd = this.exportInfo.createEnd;
      let orderId = this.exportInfo.orderId;
      let orderBy = this.exportInfo.orderBy;
      let isOtc = this.exportInfo.isOtc;
      let addressName = this.exportInfo.addressName;
      let totalAddress = this.exportInfo.totalAddress;
      let addressPhone = this.exportInfo.addressPhone;
      console.log(this.exportInfo);
      window.open(`${process.env.MALL_BASE_HOST}/mall_manage_seller/back/order/exportExcleOrder?usertoken=` + token + '&sellerId=' + sellerId + '&status=' + status +
      '&orderTransport=' + orderTransport + '&createStart=' + createStart + '&createEnd=' + createEnd + '&orderId=' + orderId +
      '&orderBy=' + orderBy + '&isOtc=' + isOtc + '&addressName=' + addressName + '&totalAddress=' + totalAddress + '&addressPhone=' + addressPhone);
    },
    // 时间格式化
    formatDatetime(timevlaue) {
      let dt = new Date(timevlaue);
      let date = dt.toLocaleDateString();
      let hours = dt.getHours() >= 10 ? dt.getHours().toString() : '0' + dt.getHours();
      let minutes = dt.getMinutes() >= 10 ? dt.getMinutes().toString() : '0' + dt.getMinutes();
      let seconds = dt.getSeconds() >= 10 ? dt.getSeconds().toString() : '0' + dt.getSeconds();
      return date + ' ' + hours + ':' + minutes + ':' + seconds;
    },
    // 获取订单列表
    getOrderData() {
      let _self = this;
      let data = {};
      /* eslint-disable */
      console.log( _self.orderSearchData.screenInfo);
      for (let key in _self.orderSearchData.screenInfo) {
        data[key] = _self.orderSearchData.screenInfo[key];
      }
      _self.exportInfo = data;
      javaRequest.post('/mall_manage_seller/back/order/queryBySeller',
        _self.orderSearchData.screenInfo
      ).then(res => {
        console.log(res);
        this.isLoding = false;
        if (res.status === 200 && res.data.resultCode === '0') {
          this.total = res.data.resultData.total;
          this.orderPaySum = res.data.resultData.orderPoiMoneySum;
          this.tableData = res.data.resultData.data;
        }
      });
    },
    orderStatus(status) {
      let a = '';
      switch (status) {
        case '0':
          a = '已取消';
          break;
        case '10':
          a = '待付款';
          break;
        case '20':
          a = '待确认';
          break;
        case '30':
          a = '配送中';
          break;
        case '40':
          a = '已完成';
          break;
        case '50':
          a = '已退款';
          break;
        case '60':
          a = '部分退款';
          break;
        case '70':
          a = '退款中';
          break;
        case '80':
          a = '待评价';
          break;
        case '90':
          a = '待审核';
          break;
        case '100':
          a = '审核未通过';
          break;
      }
      return a;
    },
    orderMode(status) {
      let a = '';
      switch (status) {
        case '1':
          a = '普通物流';
          break;
        case '2':
          a = '28分钟达';
          break;
        case '3':
          a = '自提';
          break;
      }
      return a;
    },
    // 订单事件
    customCompFunc(params) {
      if (params.type === 'seeDetail') { // 查看详情
        this.$router.push('/order-control/orderDetail');
        sessionStorage.setItem('orderId', params.rowData.orderId);
      }
    },
    // 切换分页
    pageChange(pageIndex) {
      this.isLoding = true;
      this.orderSearchData.screenInfo.pageNum = pageIndex;
      this.getOrderData();
    },
    // 切换每页显示的数量
    pageSizeChange(pageSize) {
      this.isLoding = true;
      this.orderSearchData.screenInfo.pageNum = 1;
      this.orderSearchData.screenInfo.pageSize = pageSize;
      this.getOrderData();
    },
    // 高级搜索
    take() {
      this.takeShow = !this.takeShow;
      if (this.takeShow === true) {
        this.takeValue = '收起高级搜索';
      } else {
        this.takeValue = '展开高级搜索';
      }
    },
    // 根据条件查询订单
    queryByOrder() {
      this.isLoding = true;
      this.orderSearchData.screenInfo.pageNum = 1;
      this.orderSearchData.screenInfo.createEnd = this.createEnd ? this.createEnd + ' 23:59:59' : '';
      if(this.orderSearchData.screenInfo.createEnd < this.orderSearchData.screenInfo.createStart) {
        this.errorShow = true;
      } else {
        this.errorShow = false;
      }
      this.getOrderData();
    },
    // 清除查询条件
    clean() {
      // this.value = '';
      this.createEnd = '';
      this.orderSearchData.screenInfo = {
        sellerId: '',
        status: '',
        orderTransport: '',
        createStart: '',
        createEnd: '',
        orderId: '',
        orderBy: 'desc',
        isOtc: '',
        addressName: '',
        totalAddress: '',
        addressPhone: '',
        pageNum: 1,
        pageSize: 10
      };
       if(this.role === '店主') {
         this.getSellerData();
       }
      this.queryByOrder();
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
          this.sellerData = res.data.resultData.data.map(res => {
            return {
              sellerUserId: res.sellerUserId,
              sellerName: res.sellerName
            }
          });
           let array = this.sellerData.map(res => {
            return res.sellerUserId
          }).join(',')
          let obj = {
            sellerUserId: array,
            sellerName: '全部'
          }
          this.sellerData.length > 0 ?this.sellerData.push(obj) : this.sellerData;
          console.log(this.sellerData);
          this.orderSearchData.screenInfo.sellerId = array;
          this.getOrderData();
        }
      });
    }
  },
  created() {
    this.getOrderData();
    if(this.role === '店主') {
      this.getSellerData();
    }
    // if(this.$route.query.rest) {
    //   this.$router.push('/order-control/list');
    //   setTimeout(() => {
    //     window.location.reload();
    //   },100)
    // }
  }
};
</script>

<style lang="less" scoped>
#order-list{
  box-shadow: 0 1px 1px rgba(0, 0, 0, .05);
  .orderPaySum{
    margin-top: 15px;
  }
}
.senior{
    display: inline-block;
  }
.header-top{
  height: 30px;
  .left{
    float: left;
    span{
      color: #999;
    }
    i{
      color: #999;
    }
  }
  .right{
    float: right;
    .take{
      color: #333;
      text-decoration: underline;
      cursor: pointer;
    }
  }
}
.redMoney{
  font-size: 18px;
  color: #f56c6c;
}
</style>

