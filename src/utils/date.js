// export function formatDate(date, time) {
//   let fmt = time;
//   if (/(y+)/.test(fmt)) {
//     fmt = fmt.replace(RegExp.$1, (`${date.getFullYear()}`).substr(4 - RegExp.$1.length));
//   }
//   let o = {
//     'M+': date.getMonth() + 1,
//     'd+': date.getDate(),
//     'h+': date.getHours(),
//     'm+': date.getMinutes(),
//     's+': date.getSeconds()
//   };
//   console.log(o);
//   for (let k in o) {
//     if (new RegExp(`(${k})`).test(fmt)) {
//       console.log(k);
//       let str = `${o[k]}`;
//       fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
//     }
//   }
//   console.log(fmt);
//   return fmt;
// }

// function padLeftZero(str) {
//   return ('00' + str).substr(str.length);
// }
function add0(m) { return m < 10 ? '0' + m : m }
// 时间戳转化成时间格式
export function formatDate(timestamp) {
  let time = new Date(timestamp);
  let year = time.getFullYear();
  let month = time.getMonth() + 1;
  let date = time.getDate();
  let hours = time.getHours();
  let minutes = time.getMinutes();
  let seconds = time.getSeconds();
  return year + '-' + add0(month) + '-' + add0(date) + ' ' + add0(hours) + ':' + add0(minutes) + ':' + add0(seconds);
}

export function timestampToTime(timestamp, noSecond) {
  /* eslint-disable */
  // 不需要秒noSecond传1
  noSecond = noSecond ? noSecond : 0;
  console.log(noSecond);
  let date = new Date(timestamp);
  let Y = date.getFullYear() + '/';
  let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
  let D = date.getDate() + ' ';
  let h = date.getHours() + ':';
  let m = toTwo(date.getMinutes());
  if (noSecond === 1) {
    return Y + M + D + h + m;
  }
  else {
    console.log(noSecond);
    let s = ':' + toTwo(date.getSeconds());
    return Y + M + D + h + m + s;
  }
}

function toTwo(num) {
  if (Number(num) < 10) {
    return '0' + num;
  }
  else {
    return num;
  }
}