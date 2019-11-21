// import ajax from '@/utils/ajax';
import javaAjax from '@/utils/javaApiRequest';
export function login(username, password, code) {
  let param = {
    account: username,
    password: password,
    code: code
  };
  return javaAjax.post('/mall_manage_seller/back/login/getWebLogin', param);
}

export function register(user) {
  let param = {
    realName: user.realName,
    userName: user.userName,
    password: user.password,
    phone: user.phone,
    email: user.email,
    phoneCode: user.phoneCode
  };
  return javaAjax.post('/mall_manage_seller/back/login/getRegistered', param);
}

export function logout() {
  return javaAjax.post('mall_manage_seller/back/login/getExitLogin');
}

// export function getUserInfo() {
//   return javaAjax.get('mall_manage_seller/back/seller/getSellerInfo');
// }

export function getSellerInfo() {
  return javaAjax.get(`/mall_manage_seller/back/seller/getSellerInfo`);
}
export function resetPassword(user) {
  let param = {
    account: user.account,
    onePassword: user.onePassword,
    twoPassword: user.twoPassword,
    // phoneCode: user.phoneCode
  };
  return javaAjax.post('/mall_manage_seller/back/login/forgotPassword', param);
}
// 获取。net用户信息
export function getNetInfo(data) {
  return new Promise((resolve, reject) => {
    javaAjax.post('/mall_manage_seller/back/getLoginId', data).then(res => {
      if (res.status === 200 && res.data.resultCode === '0') {
        resolve(res.data.resultData.data);
      } else {
        resolve(null);
      }
    });
  });
}
