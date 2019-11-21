<template>
  <div class="ticket">
    <!-- 小票外部包装用 -->
    <div id="print-box" v-show="false">
      <div style="font-size:10px;padding:30px 3px 3px 3px">
        <p style="fontSize:28px;text-align:center;font-weight:600">收货信息</p>
        <div style="border-bottom:1px solid #333;padding-bottom:7px" v-if="print.addressPo">
          <div>
            <span style="width:42px;display:inline-block">客户姓名</span>
            <span style="margin-left:20px">{{print.addressPo ? print.addressPo.addressName : ''}}</span>
          </div>
          <div>
            <span style="width:42px;display:inline-block">联系方式</span>
            <span style="margin-left:20px">{{print.addressPo ? print.addressPo.addressPhone : ''}}</span>
          </div>
          <div>
            <span style="width:42px;display:inline-block">收货地址</span>
            <span style="margin-left:20px">{{print.addressPo ? print.addressPo.totalAddress : ''}}</span>
          </div>
        </div>
        <div style="border-bottom:1px solid #333;padding-bottom:7px" v-if="print.userAddress">
          <div>
            <span style="width:42px;display:inline-block">客户姓名</span>
            <span style="margin-left:20px">{{print.userAddress ? print.userAddress.addressName : ''}}</span>
          </div>
          <div>
            <span style="width:42px;display:inline-block">联系方式</span>
            <span style="margin-left:20px">{{print.userAddress ? print.userAddress.addressPhone : ''}}</span>
          </div>
          <div>
            <span style="width:42px;display:inline-block">收货地址</span>
            <span style="margin-left:20px">{{print.userAddress ? print.userAddress.totalAddress : ''}}</span>
          </div>
        </div>
        <div style="border-bottom:1px solid #333;padding:7px 0px;">
          <div style="display:flex;justify-content:space-between;">
            <span>时间</span>
            <span>{{print.createDate}}</span>
          </div>
          <div style="display:flex;justify-content:space-between;">
            <span>订单号</span>
            <span>{{print.orderId}}</span>
          </div>
          <div style="display:flex;justify-content:space-between;">
            <span>商品总金额</span>
            <span>{{print.prdouctSumMoney || print.prdouctSumMoney === 0 ? Number(print.prdouctSumMoney).toFixed(2) : ''}}元</span>
          </div>
          <div style="display:flex;justify-content:space-between;">
            <span>配送金额</span>
            <span>{{print.orderPostage || print.orderPostage === 0 ? Number(print.orderPostage).toFixed(2) : ''}}元</span>
          </div>
          <div style="display:flex;justify-content:space-between;">
            <span>优惠金额</span>
            <span>{{print.couponBasicInformation}}</span>
          </div>
          <div style="display:flex;justify-content:space-between;">
            <span>订单金额</span>
            <span>{{print.orderPayment || print.orderPayment === 0  ? Number(print.orderPayment).toFixed(2) : ''}}元</span>
          </div>
        </div>
        <div style="border-bottom:1px solid #333;padding:7px 0px;">
          <div>
            <span style="width:42px;display:inline-block">药店名称</span>
            <span style="margin-left:20px">{{print.sellerUser ? print.sellerUser.sellerName : ''}}</span>
          </div>
          <div>
            <span style="width:42px;display:inline-block">药店地址</span>
            <span style="margin-left:20px">{{print.sellerUser ? print.sellerUser.sellerAddress : ''}}</span>
          </div>
          <div>
            <span style="width:42px;display:inline-block">服务热线</span>
            <span style="margin-left:20px">{{print.sellerUser ? print.sellerUser.mobile : ''}}</span>
          </div>
        </div>
        <div style="border-bottom:1px solid #333;">
          <p>
            <span style="width:46px;display:inline-block">温馨提示:</span>
            <span style="margin-left:20px">商品非质量问题，一经出售，不予退还。</span>
          </p>
        </div>
        <p style="text-align:center;padding-bottom:6px;">药葫芦,药多多,医多多,健康多</p>
        <div style="text-align:center;">
          <img style="width:120px;height:110px" src="../img/QRcode.png" alt="">
        </div>
      </div>
    </div>
    <!-- 小票包装内部用 -->
    <div id="print-box2" v-show="false">
      <div style="font-size:10px;padding:30px 3px 3px 3px">
        <p style="fontSize:28px;text-align:center;font-weight:600">商品清单</p>
        <p style="text-align:center;padding-bottom:6px;border-bottom:1px solid #333">药葫芦,药多多,医多多,健康多</p>
        <div style="border-bottom:1px solid #333;padding-bottom:7px;">
          <div>
            <span style="width:42px;display:inline-block">时间</span>
            <span style="margin-left:20px">{{print.createDate}}</span>
          </div>
          <div>
            <span style="width:42px;display:inline-block">订单号</span>
            <span style="margin-left:20px">{{print.orderId}}</span>
          </div>
          <div>
            <span style="width:42px;display:inline-block">药店名称</span>
            <span style="margin-left:20px">{{print.sellerUser ? print.sellerUser.sellerName : ''}}</span>
          </div>
          <div>
            <span style="width:42px;display:inline-block">药店地址</span>
            <span style="margin-left:20px">{{print.sellerUser ? print.sellerUser.sellerAddress : ''}}</span>
          </div>
          <div>
            <span style="width:42px;display:inline-block">服务热线</span>
            <span style="margin-left:20px">{{print.sellerUser ? print.sellerUser.mobile : ''}}</span>
          </div>
        </div>
        <div style="border-bottom:1px solid #333;padding:7px 0px;" v-for="(item,index) in print.orderDetail" :key="index">
          <div>
            <span style="width:42px;display:inline-block">[商品{{index + 1}}]</span>
            <span style="margin-left:20px">{{item.productName}}</span>
          </div>
          <div>
            <span style="width:42px;display:inline-block">厂 &nbsp;&nbsp;  商</span>
            <span style="margin-left:20px">{{item.productProducingPlace}}</span>
          </div>
          <div style="display:flex;justify-content:space-between;">
            <span>规 &nbsp;&nbsp;  格</span>
            <span>{{item.productSpecification}}</span>
          </div>
          <div style="display:flex;justify-content:space-between;">
            <span>数 &nbsp;&nbsp;  量</span>
            <span>{{item.quantity}}</span>
          </div>
          <div style="display:flex;justify-content:space-between;">
            <span>单 &nbsp;&nbsp;  价</span>
            <span>{{Number(item.price).toFixed(2)}}元</span>
          </div>
          <div style="display:flex;justify-content:space-between;">
            <span>金 &nbsp;&nbsp;  额</span>
            <span>{{(Number(item.price) *Number(item.quantity)).toFixed(2)}}元</span>
          </div>
        </div>
        <div style="border-bottom:1px solid #333;padding:7px 0px;">
          <div style="display:flex;justify-content:space-between;">
            <span>商品总金额</span>
            <span>{{print.prdouctSumMoney || print.prdouctSumMoney === 0 ? Number(print.prdouctSumMoney).toFixed(2) : ''}}元</span>
          </div>
          <div style="display:flex;justify-content:space-between;">
            <span>配送金额</span>
            <span>{{print.orderPostage || print.orderPostage === 0 ? Number(print.orderPostage).toFixed(2) : ''}}元</span>
          </div>
          <div style="display:flex;justify-content:space-between;">
            <span>优惠金额</span>
            <span>{{print.couponBasicInformation}}</span>
          </div>
          <div style="display:flex;justify-content:space-between;">
            <span>订单金额</span>
            <span>{{print.orderPayment || print.orderPayment === 0  ? Number(print.orderPayment).toFixed(2) : ''}}元</span>
          </div>
        </div>
        <p>
          <span style="width:46px;display:inline-block">温馨提示:</span>
          <span style="margin-left:20px">商品非质量问题，一经出售，不予退还。</span>
        </p>
        <p>如有用药疑问，请联系药房或药师，药葫芦将竭诚为您服务</p>
      </div>
    </div>
    <!-- 明细小票 -->
    <div id="print-box3" v-show="false">
      <div style="font-size:10px;padding:30px 3px 3px 3px">
        <p style="fontSize:28px;text-align:center;font-weight:600">商品明细</p>
        <p style="text-align:center;padding-bottom:6px;border-bottom:1px solid #333">药葫芦,药多多,医多多,健康多</p>
        <div style="border-bottom:1px solid #333" v-for="(item,index) in print.orderDetail" :key="index">
          <!-- display:flex;justify-content:space-between; -->
          <p>
            <span style="width:42px;display:inline-block">[商品{{index + 1}}]</span>
            <span style="margin-left:20px">{{item.productName}}</span>
          </p>
          <p>
            <span style="width:42px;display:inline-block">厂 &nbsp;&nbsp;  商</span>
            <span style="margin-left:20px">{{item.productProducingPlace}}</span>
          </p>
          <p style="display:flex;justify-content:space-between;">
            <span>规 &nbsp;&nbsp;  格</span>
            <span>{{item.productSpecification}}</span>
          </p>
          <p style="display:flex;justify-content:space-between;">
            <span>数 &nbsp;&nbsp;  量</span>
            <span>{{item.quantity}}</span>
          </p>
          <p style="display:flex;justify-content:space-between;">
            <span>单 &nbsp;&nbsp;  价</span>
            <span>{{Number(item.price).toFixed(2)}}元</span>
          </p>
          <p style="display:flex;justify-content:space-between;">
            <span>金 &nbsp;&nbsp;  额</span>
            <span>{{(Number(item.price) *Number(item.quantity)).toFixed(2)}}元</span>
          </p>
        </div>
        <div style="border-bottom:1px solid #333">
          <p style="display:flex;justify-content:space-between;">
            <span>商品总金额</span>
            <span>{{print.prdouctSumMoney || print.prdouctSumMoney === 0 ? Number(print.prdouctSumMoney).toFixed(2) : ''}}元</span>
          </p>
        </div>
        <p style="">
          <span style="width:46px;display:inline-block">温馨提示:</span>
          <span style="margin-left:20px">商品非质量问题，一经出售，不予退还。</span>
        </p>
        <p>如有用药疑问，请联系药房或药师，药葫芦将竭诚为您服务</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  // data() {
  //   return {
  //     print: {}
  //   };
  // }
  props: {
    print: Object
  }
};
</script>

<style>

</style>
