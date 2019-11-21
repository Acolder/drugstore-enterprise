import router, { /* systemRouterMap, */ mallRouterMap } from './router';
import store from './store';
import { Message } from 'element-ui';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { getToken } from '@/utils/auth';

NProgress.configure({ showSpinner: false });

// 路由白名单
const whiteList = ['/login', '/register', '/success'];

router.beforeEach((to, from, next) => {
  NProgress.start();
  let token = getToken();
  if (token) {
    // has token
    if (to.path === '/login') {
      next();
      NProgress.done();
    } else {
      if (store.getters.permissions.length === 0) {
        // TODO get Use rInfo from api
        let permission_data = [];
        /* permission_data.push({
          name: 'system',
          routers: systemRouterMap
        }); */
        permission_data.push({
          name: 'mall',
          routers: mallRouterMap
        });
        store.dispatch('setPermission', permission_data).then(() => {
          let p = permission_data;
          for (let index = 0; index < p.length; index++) {
            let item = p[index];
            // 动态加载路由
            router.addRoutes(item.routers);
          }
          // set the replace: true so the navigation will not leave a history record
          next({ ...to, replace: true });
        }).catch(() => {
          store.dispatch('userLogOut').then(() => {
            Message.error('身份验证失败，请重新登录');
            next({ path: '/login' });
          });
        });
      }
      else {
        next();
      }
    }
  } else {
    // has no token
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      next('/login');
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});
