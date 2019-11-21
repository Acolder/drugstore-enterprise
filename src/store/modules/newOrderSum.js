import javaRequest from '@/utils/javaApiRequest';
const orderSum = {
  state: {
    sum: ''
  },
  mutations: {
    SET_SUM: (state, sum) => {
      state.sum = sum;
    }
  },
  actions: {
    getOrderSum({ commit }) {
      javaRequest.post('/mall_manage_seller/back/order/queryRedOrderCount'
      ).then(res => {
        // console.log(res);
        if (res.status === 200 && res.data.resultCode === '0') {
          this.treatedNum = res.data.resultData.RedOrderCount;
          commit('SET_SUM', res.data.resultData.RedOrderCount);
        }
      });
    }
  }
};
export default orderSum;