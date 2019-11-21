import axios from 'axios';
import router from '@/router';
import { getToken, base64Encrypt, base64Decrypt, serializeData, getAccount, removeToken, removenetToken } from '@/utils/auth';
import { Message, MessageBox } from 'element-ui';

// create an axios instance
const service = axios.create({
  baseURL: process.env.MALL_BASE_HOST,
  timeout: 15000
});

// request interceptor
service.interceptors.request.use(config => {
  // Do something before request is sent
  config.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
  let token = getToken();
  let account = getAccount();
  if (token) {
    config.headers['usertoken'] = token;
    config.headers['account'] = account;
  }
  if (config.method.toLowerCase() === 'post') {
    if (config.data) {
      let dataStr = JSON.stringify(config.data);
      let base64Str = base64Encrypt(dataStr);
      config.data = serializeData({ param: base64Str });
    }
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
    if (response.data) {
      try {
        let str = base64Decrypt(response.data);
        let res_data = JSON.parse(str);
        response.data = res_data;
        if (res_data.resultCode === '-2') {
          let returnUrl = location.href;
          sessionStorage.setItem('returnUrl', returnUrl);
          router.push('/login');
          removeToken();
          removenetToken();
          MessageBox.confirm(response.data.msg, '提示', {
            confirmButtonText: '确定',
            showClose: false,
            type: 'warning',
            center: true,
            showCancelButton: false
            // callback: action => {
            //   console.log(1);
            //   router.push('/login');
            // }
          });
        } else
        if (response.data && response.data.resultCode !== '0') {
          let errorMsg = response.data.msg;
          errorMsg = errorMsg ? errorMsg : '网络错误，请稍后再试。';
          Message({
            showClose: true,
            duration: 3000,
            message: errorMsg,
            type: 'warning'
          });
        }
      } catch (e) {
        console.log('出错了，' + e + '，接口返回数据：' + response.data);
      }
    }
    return response;
  },
  error => {
    console.log('error' + error);
    console.log();
    if ('error' + error === 'errorError: timeout of 5000ms exceeded') {
      console.log(1);
      Message({
        showClose: true,
        duration: 3000,
        message: '网络不好~，请您稍后重试',
        type: 'error'
      });
    }
  }
);

export default service;
