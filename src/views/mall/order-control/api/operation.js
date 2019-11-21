import javaRequest from '@/utils/javaApiRequest';
import { formatDate } from '@/utils/date';
// 药葫芦美团物流状态
function logisticsStatus(status) {
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
}
// 获取药葫芦物流数据
export function getLogisticsData(logisticsNumber, logisticsType, orderId) {
  let logisticsData = '';
  let info = {
    logisticsNumber: logisticsNumber,
    logisticsType: logisticsType,
    orderId: orderId
  };
  return new Promise((resolve, reject) => {
    javaRequest.post('/mall_manage_seller/back/order/logisticsInfo', info).then(res => {
    // console.log(res);
      if (res.status === 200 && res.data.resultCode === '0') {
      // console.log(res.data.resultData.status);
        logisticsData = res.data.resultData;
        logisticsData.status = logisticsStatus(logisticsData.status);
        logisticsData.operate_time = logisticsData.operate_time ? formatDate(logisticsData.operate_time) : logisticsData.operate_time;
        resolve(logisticsData);
      }
    });
  });
}
// 获取普通物流数据
export function getOrdLogisticsData(logisticsNumber, logisticsType) {
  let logisticsData = '';
  let info = {
    logisticsNumber: logisticsNumber,
    logisticsType: logisticsType,
  };
  return new Promise((resolve, reject) => {
    javaRequest.post('mall_manage_seller/back/logistics/logisticsInfo', info).then(res => {
    // console.log(res);
      if (res.status === 200 && res.data.resultCode === '0') {
      // console.log(res.data.resultData.status);
        logisticsData = res.data.resultData;
        // logisticsData.status = logisticsStatus(logisticsData.status);
        // logisticsData.operate_time = logisticsData.operate_time ? formatDate(logisticsData.operate_time) : logisticsData.operate_time;
        resolve(logisticsData);
      }
    });
  });
}
// 第三方对接物流状态
function MeituanlogisticsStatus(status) {
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
      a = '骑手已取药';
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
}
// 获取第三方对接物流数据
export function getMeituanLogisticsData(channelOrderId) {
  let logisticsData = '';
  let info = {
    thirdOrderId: channelOrderId
  };
  return new Promise((resolve, reject) => {
    javaRequest.post('/mall_manage_seller/shipment/selectShipment', info).then(res => {
    // console.log(res);
      if (res.status === 200 && res.data.resultCode === '0') {
      // console.log(res.data.resultData.status);
        for (let i = 0; i < res.data.resultData.length; i++) {
          res.data.resultData[i].createDate = formatDate(res.data.resultData[i].createDate);
          res.data.resultData[i].logisticsStatus = MeituanlogisticsStatus(res.data.resultData[i].logisticsStatus);
        }
        logisticsData = res.data.resultData;
        resolve(logisticsData);
      }
    });
  });
}
// 获取物流字典
export function getLogistics() {
  return new Promise((resolve, reject) => {
    javaRequest.post('/mall_manage_seller/back/express/getExpressAll').then(res => {
    // console.log(res);
      if (res.status === 200 && res.data.resultCode === '0') {
        resolve(res.data.resultData);
      }
    });
  });
}
// 普通物流以及自行配送发货
export function submitLogisticsInfo(info) {
  return new Promise((resolve, reject) => {
    javaRequest.post('/mall_manage_seller/back/order/sendOrder', info).then(res => {
    // console.log(res);
      if (res.status === 200 && res.data.resultCode === '0') {
        resolve();
      }
    });
  });
}
// 美团配送发货发货
export function submitMeituanInfo(info) {
  return new Promise((resolve, reject) => {
    javaRequest.post('/mall_manage_seller/back/logistics/updateLogisticsOrder', info).then(res => {
    // console.log(res);
      if (res.status === 200 && res.data.resultCode === '0') {
        resolve();
      }
    });
  });
}
// 取消订单（药葫芦订单以及第三方订单）
export function cancelOrderAs(url, param) {
  return new Promise((resolve, reject) => {
    javaRequest.post(url, param).then(res => {
      if (res.status === 200 && res.data.resultCode === '0') {
        resolve(res.data.msg);
      }
    });
  });
}
// 饿百自配送确认送达
export function querySend(param) {
  return new Promise((resolve, reject) => {
    javaRequest.post('/mall_manage_seller/eleme/order/confirmService', param).then(res => {
      if (res.status === 200 && res.data.resultCode === '0') {
        resolve(res.data.msg);
      }
    });
  });
}