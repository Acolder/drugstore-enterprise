'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')


module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // 测试环境
  // 站点域名
  WEB_HOST: '"http://localhost:8187/#"',
  // // .net 接口 默认host
  // BASE_HOST: '"https://tyao.kangmei.com.cn"',
  // // java 电商模块 默认host
  // MALL_BASE_HOST: '"https://tmall.kangmei.com.cn"',
  // // java 电商模块 默认host
  // ES_BASE_HOST: '"https://tsearch.kangmei.com.cn"',
  // // 文件上传 HOST
  // UPLOAD_HOST: '"https://uploads.kangmei.com.cn"',

  // .net 接口 默认host
  BASE_HOST: '"https://tyao.kangmeiyaohulu.com"',
  // java 电商模块 默认host
  MALL_BASE_HOST: '"https://tdmall.kangmeiyaohulu.com"',
  // java 电商模块 默认host
  ES_BASE_HOST: '"https://tsearch.kangmeiyaohulu.com"',
  // 医林api 默认host
  DOCTOR_BASE_HOST: '"https://tdocapi.kangmei.com.cn"',
  // 文件上传 HOST
  UPLOAD_HOST: '"https://uploads.kangmei.com.cn"',
  // 融云appKey
  RONGYUN_APPKEY:'"lmxuhwagli3md"',

  // 正式环境
  // 站点域名
  // WEB_HOST: '"https://store.kangmei.com.cn/#"',
  // .net 接口 默认host
  // BASE_HOST: '"https://yao.kangmei.com.cn"',
  // // java 电商模块 默认host
  // MALL_BASE_HOST: '"https://dmall.kangmei.com.cn"',
  // // java 电商模块 默认host
  // ES_BASE_HOST: '"https://search.kangmei.com.cn"',
  // // 医林api 默认host
  // DOCTOR_BASE_HOST: '"https://docapi.kangmei.com.cn"',
  // // 文件上传 HOST
  // UPLOAD_HOST: '"https://uploads.kangmei.com.cn"',
  // 融云appKey
  // RONGYUN_APPKEY:'"z3v5yqkbz1g30"' // 正式
})
