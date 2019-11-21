import axios from 'axios';
import router from '@/router';
import { MessageBox } from 'element-ui';

import {
  getnetToken,
  removeToken,
  aesEncrypt,
  getNoncestr,
  getTimestamp,
  getSign,
  setDoAccesstoken,
  getDocAccesstoken,
  removeDoAccesstoken,
  removenetToken
} from '@/utils/auth';

const appid = '8145955969';
const appSecret = 'l8y70yhm8vonwc904i6ugjs3s1zfqo77';

function getAccessToken() {
  let accessToken = '';
  accessToken = getDocAccesstoken();
  if (accessToken) {
    return accessToken;
  }
  let requestObj;
  if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
    requestObj = new XMLHttpRequest();
  } else { // code for IE6, IE5
    /* eslint-disable */
    requestObj = new ActiveXObject('Microsoft.XMLHTTP');
  }
  let url = `${process.env.DOCTOR_BASE_HOST}/api/system/Token?appid=${aesEncrypt(appid)}&appSecret=${aesEncrypt(appSecret)}`;
  requestObj.open('get', url, false);
  requestObj.send('');
  let obj = requestObj.response;
  if (typeof obj !== 'object') {
    obj = JSON.parse(obj);
  }
  if (obj.code === 0) {
    accessToken = obj.data.accesstoken;
  }
  if (accessToken) {
    setDoAccesstoken(accessToken);
  }
  return accessToken;
}


// create an axios instance
const service = axios.create({
  baseURL: process.env.DOCTOR_BASE_HOST,
  timeout: 5000
});


// request interceptor
service.interceptors.request.use(config => {
  // Do something before request is sent
  let token = getnetToken();
  let accessToken = getAccessToken();
  let timestamp = getTimestamp();
  let noncestr = getNoncestr();
  let sign = getSign(accessToken, appid, appSecret, noncestr, timestamp);
  if (token) {
    config.headers['usertoken'] = token;
  }
  if (accessToken) {
    config.headers['accesstoken'] = accessToken;
  }
  if (timestamp) {
    config.headers['timestamp'] = timestamp;
  }
  if (noncestr) {
    config.headers['noncestr'] = noncestr;
  }
  if (sign) {
    config.headers['sign'] = sign;
  }
  return config;
}, error => {
  // Do something with request error
  console.log(error);
  Promise.reject(error);
});

// respone interceptor
service.interceptors.response.use(
  response => {
    if (response.data && response.data.code === -2) {
      removeToken();
      removeDoAccesstoken();
      router.push('/login');
    }
    if (response.data && response.data.code === -3) {
      removeToken();
      removeDoAccesstoken();
      removenetToken();
    }
    if (response.data && response.data.code !== 0) {
      let errorMsg = response.data.message;
      errorMsg = !!errorMsg ? errorMsg : '网络错误，请稍后再试。';
      // MessageBox.alert('您的信息有误', '', {
      //   showClose: false,
      //   confirmButtonText: '确定',
      //   confirmButtonClass: 'cinfirmBtn',
      //   customClass: 'prompt'
      // });
      MessageBox.alert(errorMsg, '', {
        showClose: false,
        confirmButtonText: '确定',
        confirmButtonClass: 'cinfirmBtn',
        customClass: 'prompt'
      });
    }
    return response
  },
  error => {
    console.log('error' + error);
  }
);

export default service;
