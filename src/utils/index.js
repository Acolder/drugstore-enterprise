export function urlParse() {
  let url = window.location.search;
  let obj = {};
  let reg = /[?&][^?&]+=[^?&]+/g;
  let arr = url.match(reg);
  // ['?id=12345', '&a=b']
  if (arr) {
    arr.forEach((item) => {
      let tempArr = item.substring(1).split('=');
      /* 编码decodeURIComponent */
      let key = decodeURIComponent(tempArr[0]);
      let val = decodeURIComponent(tempArr[1]);
      obj[key] = val;
    });
  }
  return obj;
}
/**
 * 获取URL请求参数
 * @param {string} name
 */
export function getQueryString(name) {
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  let url = window.location.href;
  let r = url.substr(url.indexOf('?') + 1).match(reg);
  if (r != null) return decodeURI(r[2]); return null;
}

/**
 * 获取URL参数
 */
export function getRequest() {
  let url = location.search; // 获取url中"?"符后的字串
  /* eslint-disable */
  let theRequest = new Object();
  if (url.indexOf('?') !== -1) {
    let str = url.substr(1);
    let strs = str.split('&');
    for (let i = 0; i < strs.length; i++) {
      theRequest[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1]);
    }
  }
  return theRequest;
}

/**
 * 生成URL参数字符串
 * @param {object} opt
 */
export function getParamString(opt) {
  var url = "";
  if (opt) {
      $.each(opt, function (i, item) {
          url += i + "=" + item + "&";
      });
  }
  if (url != "") { url = "?" + url.substring(0, url.length - 1); }
  return url;
}

/**
 * 去掉所有的html标记
 * @param {*} str 
 */
export function delHtmlTag(str) {
  return str.replace(/<[^>]+>/g, "");
}