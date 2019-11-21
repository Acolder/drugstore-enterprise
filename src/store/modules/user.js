import { setToken, setUserInfo, removeToken, removeUserInfo, removenetToken } from '@/utils/auth';
import { login, getSellerInfo, logout } from '@/api/user';

const user = {
  state: {
    id: '',
    name: '',
    mobile: '',
    status: '',
    token: '',
    avatar: '',
    introduction: '',
    roles: [],
    // 商户信息
    sellerInfo: {}
  },
  mutations: {
    SET_ID: (state, id) => {
      state.id = id;
    },
    SET_NAME: (state, name) => {
      state.name = name;
    },
    SET_MOBILE: (state, name) => {
      state.mobile = name;
    },
    SET_STATUS: (state, status) => {
      state.status = status;
    },
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar;
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction;
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    },
    SET_SELLERINFO: (state, data) => {
      state.sellerInfo = data;
    }
  },
  actions: {
    userLogin({ commit }, userInfo) {
      const username = userInfo.username.trim();
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(response => {
          const data = response.data;
          commit('SET_TOKEN', data.token);
          setToken(response.data.token);
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },
    // getUserInfo({ commit, state }) {
    //   return new Promise((resolve, reject) => {
    //     getUserInfo(state.token).then(response => {
    //       console.log(response);
    //       if (response.status === 200 && !response.data && response.data.resultCode !== '0') {
    //         let e = new Error('获取用户信息失败！');
    //         reject(e);
    //       }
    //       const data = response.data.resultData;
    //       // console.log(response);
    //       if (data) {
    //         commit('SET_ID', data.sellerUserId);
    //         commit('SET_NAME', data.sellerName);
    //         commit('SET_MOBILE', data.mobile);
    //         commit('SET_AVATAR', data.storePhotos);
    //         commit('SET_ROLES', data.roles);
    //         commit('SET_INTRODUCTION', data.introduction);
    //         let userStr = JSON.stringify(data);
    //         setUserInfo(userStr);
    //       }
    //       resolve(response);
    //     }).catch(error => {
    //       reject(error);
    //     });
    //   });
    // },
    getSellerInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getSellerInfo().then((response) => {
          if (response.status === 200 && !response.data && response.data.resultCode !== '0') {
            let e = new Error('获取商户信息失败！');
            reject(e);
          }
          let data = response.data.resultData;
          if (data) {
            commit('SET_ID', data.sellerUserId);
            commit('SET_NAME', data.sellerName);
            commit('SET_MOBILE', data.mobile);
            commit('SET_AVATAR', data.storePhotos);
            commit('SET_ROLES', data.roles);
            commit('SET_INTRODUCTION', data.introduction);
            commit('SET_SELLERINFO', data);
            let userStr = JSON.stringify(data);
            setUserInfo(userStr);
          }
          resolve(response);
        }).catch(error => {
          reject(error);
        });
      });
    },
    userLogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        /* logout(state.token).then(() => {
          commit('SET_TOKEN', '');
          commit('SET_ROLES', []);
          removeToken();
          resolve();
        }).catch(error => {
          reject(error);
        }); */
        logout();
        commit('SET_TOKEN', '');
        commit('SET_ROLES', []);
        removeToken();
        removeUserInfo();
        removenetToken();
        resolve();
      });
    },
  }
};

export default user;