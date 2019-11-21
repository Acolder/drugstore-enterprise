import Vue from 'vue';
import Router from 'vue-router';
import layout from '../views/layout/layout2.vue';
import { getRole, getType, getGive, getSupplement } from '../utils/auth';
// import { getUserPower } from '@/utils/auth';
const _import = require('./_import_' + process.env.NODE_ENV);
const role = getRole(); // 用户身份 店员or店主
const type = getType(); // 药店类型 1,商城2药店3药柜
const give = getGive(); // 药店是否礼品店 1是 其他 否
const supplement = getSupplement(); // 是否已开通补方 1是 其他否
// console.log(_import);
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading
// const power = getUserPower();
Vue.use(Router);

export const constantRouterMap = [
  { path: '/login', component: _import('login/index') },
  { path: '/excessive', component: _import('login/excessive') },
  { path: '/register', component: _import('app/register/index') },
  { path: '/success', component: _import('app/register/success') },
  { path: '/sellerAdd', component: _import('seller/sellerIndex') },
  { path: '/sellerTransition', component: _import('seller/sellerTransition') },
  { path: '/sellerInfo', component: _import('seller/sellerInfo') },
  {
    path: '/home',
    name: 'home',
    component: layout,
    children: [
      {
        path: 'index',
        name: 'index',
        redirect: '/order-control/list',
        meta: {
          title: '首页'
        },
        component: _import('home/index')
      }
    ]
  },
  {
    path: '/',
    name: 'default-name',
    redirect: '/home/index',
  },
  { path: '/401', component: _import('errorPage/401') },
  { path: '/404', component: _import('errorPage/404') },
];

export const systemRouterMap = [
  {
    path: '',
    component: layout,
    redirect: '/system/table/complex-table',
    name: 'system',
    meta: {
      title: 'System',
      icon: 'system'
    },
    children: [
      {
        path: '/system/dynamicTable',
        component: _import('system/table/dynamicTable/index'),
        name: 'dynamicTable',
        meta: {
          title: 'dynamicTable'
        }
      },
      {
        path: '/system/complexTable',
        component: _import('system/table/dynamicTable/complex-table'),
        name: 'complex-table',
        meta: {
          title: 'complex-table'
        }
      },
      {
        path: '/system/tabs',
        component: _import('system/tabs/index'),
        name: 'system-tabs',
        meta: {
          title: 'system-tabs'
        }
      }
    ]
  }
];
// export const mallRouterMap = for(let i = 0;i<power.menuList.length;i++) {
//   let arr = [
//     {
//       path: '/order-control',
//       redirect: 'noredirect',
//       component: layout,
//       meta: {
//         title: '订单管理',
//         show: true
//       },
//       children: [{
//         path: '/order-control/prescriptionList',
//         component: _import('mall/order-control/prescriptionList'),
//         name: 'prescriptionList',
//         meta: {
//           title: '处方订单'
//         }
//       },
//     ]
//     }
//   ]
// }

export const mallRouterMap = [
  {
    path: '/outMallList',
    component: _import('mall/stock-control/outMallList')
  },
  {
    path: '/order-control',
    redirect: 'noredirect',
    component: layout,
    meta: {
      title: '订单管理',
      icon: 'icon-dingdan'
    },
    children: [
      // {
      //   path: '/order-control/noPrescriptionList',
      //   component: _import('mall/order-control/noPrescriptionList'),
      //   name: 'noPrescriptionList',
      //   meta: {
      //     title: '非处方订单'
      //   }
      // }, {
      //   path: '/order-control/prescriptionList',
      //   component: _import('mall/order-control/prescriptionList'),
      //   name: 'prescriptionList',
      //   meta: {
      //     title: '处方订单'
      //   }
      // },
      // {
      //   path: '/order-control/selectDistribution',
      //   component: _import('mall/order-control/selectDistribution'),
      //   name: 'selectDistribution',
      //   meta: {
      //     title: '选择配送方式',
      //     show: false
      //   }
      // }
      {
        path: '/order-control/monitorOrder',
        component: _import('mall/order-control/monitorOrder'),
        name: 'monitorOrder',
        meta: {
          title: '待处理订单'
        }
      },
      {
        path: '/order-control/refundOrder',
        component: _import('mall/order-control/refundOrder'),
        name: 'refundOrder',
        meta: {
          title: '退款订单'
        }
      },
      {
        path: '/order-control/list',
        component: _import('mall/order-control/list'),
        name: 'list',
        meta: {
          title: '历史订单'
        }
      },
      {
        path: '/order-control/orderDetail',
        component: _import('mall/order-control/orderDetail'),
        name: 'detail',
        meta: {
          title: '订单详情',
          show: false
        }
      },
      {
        path: '/order-control/giftList',
        component: _import('mall/order-control/giftList'),
        name: 'giftlist',
        meta: {
          title: '礼品订单',
          show: role === '店员' && give === '1' ? true : false
        }
      },
      {
        path: '/order-control/giftDetail',
        component: _import('mall/order-control/giftDetail'),
        name: 'giftDetail',
        meta: {
          title: '礼包详情',
          show: false
        }
      },
      {
        path: '/order-control/giftOrderDetail',
        component: _import('mall/order-control/giftOrderDetail'),
        name: 'giftOrderDetail',
        meta: {
          title: '礼品订单详情',
          show: false
        }
      },
      {
        path: '/order-control/bill',
        component: _import('mall/order-control/bill'),
        name: 'bill',
        meta: {
          title: '结算账单',
          show: role === '店主' ? true : false
        }
      },
      {
        path: '/order-control/reconciliationList',
        component: _import('mall/order-control/reconciliationList'),
        name: 'reconciliationList',
        meta: {
          title: '报表列表',
          show: role === '店主' ? true : false
        }
      },
      {
        path: '/order-control/billDetail',
        component: _import('mall/order-control/billDetail'),
        name: 'billDetail',
        meta: {
          title: '账单明细',
          show: false
        }
      },
      {
        path: '/order-control/settlement',
        component: _import('mall/order-control/settlement'),
        name: 'settlement',
        meta: {
          title: '结算明细',
          show: false
        }
      },
    ]
  },
  // 员工管理
  // {
  //   path: '/employee',
  //   redirect: 'noredirect',
  //   component: layout,
  //   meta: {
  //     title: '员工管理',
  //     show: false
  //   },
  //   children: [
  //     {
  //       path: '/employee/employeeList',
  //       component: _import('mall/employee/employeeList'),
  //       name: 'employeeList',
  //       meta: {
  //         title: '员工列表',
  //         show: false
  //       }
  //     }
  //   ]
  // },
  // 药品管理
  {
    path: '/stock-control',
    redirect: 'noredirect',
    component: layout,
    meta: {
      title: '商品管理',
      show: role === '店员' && type !== '3' ? true : false,
      icon: 'icon-yaoping'
    },
    children: [{
      path: '/stock-control/list',
      component: _import('mall/stock-control/list'),
      name: 'drug',
      meta: {
        title: '库存列表'
      }
    }, {
      path: '/stock-control/failList',
      component: _import('mall/stock-control/failList'),
      name: 'failList',
      meta: {
        title: '导入失败列表'
      }
    }]
  },
  // 运营管理
  {
    path: '/service-control',
    redirect: 'noredirect',
    component: layout,
    meta: {
      title: '运营管理',
      show: role === '店员' && type !== '3' ? true : false,
      icon: 'icon-shezhi'
    },
    children: [{
      path: '/service-control/index',
      component: _import('mall/service-control/index'),
      name: 'service',
      meta: {
        title: '营业管理'
      }
    }]
  },
  // 在线补方
  {
    path: '/invigorationRecipe',
    redirect: 'noredirect',
    component: layout,
    meta: {
      title: '处方服务',
      show: role === '店员' && type === '2' ? true : false,
      icon: 'icon-fuwu'
    },
    children: [{
      path: '/invigorationRecipe/index',
      component: _import('mall/invigorationRecipe/index'),
      name: 'invigorationRecipe',
      meta: {
        title: '在线问诊',
        show: supplement === '1' ? false : true
      },
    },
    {
      path: '/invigorationRecipe/invigorationRecipe',
      component: _import('mall/invigorationRecipe/invigorationRecipe'),
      name: 'invigorationRecipes',
      meta: {
        title: '在线问诊',
        show: supplement === '1' ? true : false
      },
    },
    {
      path: '/invigorationRecipe/historicalOct',
      component: _import('mall/invigorationRecipe/historicalOct'),
      name: 'historicalOct',
      meta: {
        title: '历史处方',
        show: false
      },
    },
    {
      path: '/invigorationRecipe/member',
      component: _import('mall/invigorationRecipe/member'),
      name: 'member',
      meta: {
        title: '就诊人管理',
        show: false
      },
    },
    {
      path: '/invigorationRecipe/trialParty',
      component: _import('mall/invigorationRecipe/trialParty'),
      name: 'trialParty',
      meta: {
        title: '拍方审核',
        show: supplement === '1' ? true : false
      },
    },
    {
      path: '/invigorationRecipe/patSquare',
      component: _import('mall/invigorationRecipe/patSquare/index'),
      name: 'patSquare',
      meta: {
        title: '开方审核',
        show: supplement === '1' ? true : false
      },
    },
    {
      path: '/invigorationRecipe/DrugList',
      component: _import('mall/invigorationRecipe/patSquare/drugList'),
      name: 'DrugList',
      meta: {
        title: '处方商品管理',
        show: supplement === '1' ? true : false
      },
    },
    {
      path: '/invigorationRecipe/prescription',
      component: _import('mall/invigorationRecipe/prescription'),
      name: 'prescription',
      meta: {
        title: 'e抓药'
      },
    },
    {
      path: '/invigorationRecipe/consultChat',
      component: _import('mall/invigorationRecipe/consultChat/consultChat'),
      name: 'consultChat',
      meta: {
        title: '在线问诊',
        show: false
      },
    }
    ]
  },
  // 药店管理
  {
    path: '/seller-control',
    redirect: 'noredirect',
    component: layout,
    meta: {
      title: '药店管理',
      show: role === '店主' ? true : false,
      icon: 'icon-shezhi'
    },
    children: [{
      path: '/seller-control/toExamine',
      component: _import('mall/seller-control/toExamine'),
      name: 'toExamine',
      meta: {
        title: '审核列表',
        show: false
      }
    }, {
      path: '/seller-control/EditInfo',
      component: _import('mall/seller-control/EditInfo'),
      name: 'EditInfo',
      meta: {
        title: '修改信息',
        show: true
      }
    }, {
      path: '/seller-control/sellerList',
      component: _import('mall/seller-control/sellerList'),
      name: 'sellerList',
      meta: {
        title: '药店列表'
      }
    }, {
      path: '/seller-control/addSeller',
      component: _import('mall/seller-control/addSeller'),
      name: 'addSeller',
      meta: {
        title: '新增药店',
        show: false
      }
    }, {
      path: '/seller-control/editSeller',
      component: _import('mall/seller-control/editSeller'),
      name: 'editSeller',
      meta: {
        title: '编辑药店',
        show: false
      }
    }, {
      path: '/seller-control/sellerDetail',
      component: _import('mall/seller-control/detail'),
      name: 'sellerDetail',
      meta: {
        title: '药店详情',
        show: false
      }
    },
    {
      path: '/employee/employeeList',
      component: _import('mall/employee/employeeList'),
      name: 'employeeList',
      meta: {
        title: '员工列表',
        show: false
      }
    }]
  },
  // o2o营销活动
  {
    path: '/marketo2o-control',
    redirect: 'noredirect',
    component: layout,
    meta: {
      title: '营销管理',
      show: role === '店主' || type === '2' ? true : false,
      icon: 'icon-yingxiao'
    },
    children: [{
      path: '/marketo2o-control/list',
      component: _import('mall/market-control/o2oactivities/list'),
      name: 'marketo2oList',
      meta: {
        title: '营销活动列表'
      }
    },
    {
      path: '/marketo2o-control/add',
      component: _import('mall/market-control/o2oactivities/add'),
      name: 'marketo2oAdd',
      meta: {
        title: '新增全店满减',
        show: false
      }
    },
    {
      path: '/marketo2o-control/detail',
      component: _import('mall/market-control/o2oactivities/detail'),
      name: 'marketo2oDetail',
      meta: {
        title: '全店满减详情',
        show: false
      }
    }]
  },
  // 商城营销活动
  {
    path: '/market-control',
    redirect: 'noredirect',
    component: layout,
    meta: {
      title: '营销管理',
      show: role === '店员' && type === '1' ? true : false,
      icon: 'icon-yingxiao'
    },
    children: [{
      path: '/market-control/list',
      component: _import('mall/market-control/list'),
      name: 'marketList',
      meta: {
        title: '优惠券列表'
      }
    }, {
      path: '/market-control/addGoodsCoupon',
      component: _import('mall/market-control/addGoodsCoupon'),
      name: 'addGoodsCoupon',
      meta: {
        title: '创建商品优惠券',
        show: false
      }
    }, {
      path: '/market-control/editGoodsCoupon',
      component: _import('mall/market-control/editGoodsCoupon'),
      name: 'editGoodsCoupon',
      meta: {
        title: '编辑商品优惠券',
        show: false
      }
    }, {
      path: '/market-control/addShopCoupon',
      component: _import('mall/market-control/addShopCoupon'),
      name: 'addShopCoupon',
      meta: {
        title: '创建店铺优惠券',
        show: false
      }
    }, {
      path: '/market-control/editShopCoupon',
      component: _import('mall/market-control/editShopCoupon'),
      name: 'editShopCoupon',
      meta: {
        title: '编辑店铺优惠券',
        show: false
      }
    }, {
      path: '/market-control/marketDetail',
      component: _import('mall/market-control/couponDetail'),
      name: 'couponDetail',
      meta: {
        title: '优惠券详情',
        show: false
      }
    }, {
      path: '/market-control/activities/list',
      component: _import('mall/market-control/activities/list'),
      name: 'activitiesList',
      meta: {
        title: '营销活动列表',
        show: true
      }
    }, {
      path: '/market-control/activities/detail',
      component: _import('mall/market-control/activities/detail'),
      name: 'activitiesDetail',
      meta: {
        title: '营销活动详情',
        show: false
      }
    }, {
      path: '/market-control/activities/offerlist',
      component: _import('mall/market-control/activities/OfferList'),
      name: 'OfferList',
      meta: {
        title: '新增特价商品活动',
        show: false
      }
    }, {
      path: '/market-control/activities/offerrEdit',
      component: _import('mall/market-control/activities/offerrEdit'),
      name: 'offerrEdit',
      meta: {
        title: '修改特价商品活动',
        show: false
      }
    }, {
      path: '/market-control/activities/addfull',
      component: _import('mall/market-control/activities/addfull'),
      name: 'addfull',
      meta: {
        title: '新增满减商品活动',
        show: false
      }
    }, {
      path: '/market-control/activities/fullEdit',
      component: _import('mall/market-control/activities/fullEdit'),
      name: 'fullEdit',
      meta: {
        title: '修改满减商品活动',
        show: false
      }
    }, {
      path: '/market-control/activities/adddiscount',
      component: _import('mall/market-control/activities/adddiscount'),
      name: 'adddiscount',
      meta: {
        title: '新增折扣商品活动',
        show: false
      }
    }, {
      path: '/market-control/activities/discountEdit',
      component: _import('mall/market-control/activities/discountEdit'),
      name: 'discountEdit',
      meta: {
        title: '修改折扣商品活动',
        show: false
      }
    }, {
      path: '/market-control/activities/addchase',
      component: _import('mall/market-control/activities/addchase'),
      name: 'addchase',
      meta: {
        title: '新增换购商品活动',
        show: false
      }
    }, {
      path: '/market-control/activities/chaseEdit',
      component: _import('mall/market-control/activities/chaseEdit'),
      name: 'chaseEdit',
      meta: {
        title: '修改换购商品活动',
        show: false
      }
    }, {
      path: '/market-control/activities/giftEdit',
      component: _import('mall/market-control/activities/giftEdit'),
      name: 'giftEdit',
      meta: {
        title: '修改买赠商品活动',
        show: false
      }
    }, {
      path: '/market-control/activities/addgift',
      component: _import('mall/market-control/activities/addgift'),
      name: 'addgift',
      meta: {
        title: '新增买赠商品活动',
        show: false
      }
    }]
  }
  /* {
    path: '/drug-control',
    redirect: 'noredirect',
    component: layout,
    meta: {
      title: '药品管理'
    },
    children: [{
      path: '/drug-control/index',
      component: _import('mall/drug-control/index'),
      name: 'drug',
      meta: {
        title: '药品'
      }
    },
    {
      path: '/drug-control/list',
      component: _import('mall/drug-control/list'),
      name: 'drugList',
      meta: {
        title: '商品列表'
      }
    },
    {
      path: '/drug-control/add',
      component: _import('mall/drug-control/add'),
      name: 'add',
      meta: {
        title: '添加'
      }
    },
    {
      path: '/drug-control/modify',
      component: _import('mall/drug-control/modify'),
      name: 'modify',
      meta: {
        title: '修改'
      }
    }]
  } */
];

export default new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});
