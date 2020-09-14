import md5 from 'md5';
import { parse } from 'querystring';
import pathRegexp from 'path-to-regexp';
import { AUTH_SECRET_KEY } from '@/common/constant';

// 设置随机字符串
function setString(randomFlag, min, max) {
  var str = '',
    range = min,
    arr = [
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      'a',
      'b',
      'c',
      'd',
      'e',
      'f',
      'g',
      'h',
      'i',
      'j',
      'k',
      'l',
      'm',
      'n',
      'o',
      'p',
      'q',
      'r',
      's',
      't',
      'u',
      'v',
      'w',
      'x',
      'y',
      'z',
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
      'U',
      'V',
      'W',
      'X',
      'Y',
      'Z',
    ];

  // 随机产生
  if (randomFlag) {
    range = Math.round(Math.random() * (max - min)) + min;
  }
  for (var i = 0; i < range; i++) {
    let pos = Math.round(Math.random() * (arr.length - 1));
    str += arr[pos];
  }
  return str;
}

// 数据ASCII 排序
function sort(obj) {
  if (window.sessionStorage.getItem('token')) {
    obj.token = window.sessionStorage.getItem('token');
  }
  let setObj = {
    ...obj,
  };
  let Array = Object.keys(setObj).sort();
  let NewObject = {};
  Array.forEach((item) => {
    NewObject[item] = setObj[item];
  });
  return NewObject;
}

// 请求数据加密处理
function Conversion(obj) {
  let newObj = JSON.stringify(obj);
  Object.keys(obj).forEach((item) => {
    if (obj[item] instanceof Array === false) {
      newObj = newObj.replace(`"${obj[item]}"`, `${obj[item]}`);
      if (item === 'couponDesc') {
        let filterObj = JSON.stringify({ couponDesc: obj.couponDesc });
        filterObj = filterObj.split(':')[1].substring(1, filterObj.length - 2);
        let filter = filterObj.replace(/\\n/g, '\n');
        newObj = newObj.replace(`"${filterObj}"`, filter);
      }
    }

    newObj = newObj
      .replace(`"${item}"`, `${item}`)
      .replace(`,${item}`, `&${item}`)
      .replace(`${item}:`, `${item}=`);
  });
  newObj = newObj.slice(1, newObj.length - 1);
  return newObj;
}

// 处理完成后返回加密数据
export const encrypt = (data) => {
  let setMd5 = { ...sort(data) };
  setMd5.auth_time_stamp = new Date().getTime().toString();
  setMd5.auth_nonce = setString(true, 10, 28);
  setMd5.auth_secret_key = AUTH_SECRET_KEY;
  let setStringMd5 = Conversion(setMd5);
  setStringMd5 = setStringMd5.toLowerCase();
  let Md5data = md5(setStringMd5);
  delete setMd5.auth_secret_key;
  setMd5.auth_sign = Md5data;
  return setMd5;
};

export const getPageQuery = () => parse(window.location.href.split('?')[1]);

export const getRouteAuthority = (path, routeData) => {
  let authorities = false;
  routeData.forEach((route) => {
    // match prefix
    if (pathRegexp(`${route.path}/(.*)`).test(`${path}/`)) {
      if (route.path === path) {
        authorities = true;
        return;
      } // get children authority recursively

      if (route.routes) {
        authorities = getRouteAuthority(path, route.routes) || authorities;
      }
    }
  });
  return authorities;
};

// 设置uuid
export const uuid = () => {
  var s = [];
  var hexDigits = '0123456789abcdef';
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = '-';

  var uuid = s.join('');
  return uuid;
};
