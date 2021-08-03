import md5 from 'md5';
import moment from 'moment';
import lodash from 'lodash';
import cityJson from '@/common/cityJson';
import { parse } from 'querystring';
import { AUTH_SECRET_KEY } from '@/common/constant';

export const store = {
  save: (name, value, type = 'localtorage') => {
    if ((type || '').toLocaleLowerCase() === 'localstorage') {
      localStorage.setItem(name, JSON.stringify(value));
    } else if ((type || '').toLocaleLowerCase() === 'sessionstorage') {
      sessionStorage.setItem(name, JSON.stringify(value));
    }
  },
  get: (name, type = 'localStorage') => {
    if ((type || '').toLocaleLowerCase() === 'localstorage') {
      return JSON.parse(localStorage.getItem(name) || '{}');
    } else if ((type || '').toLocaleLowerCase() === 'sessionstorage') {
      return JSON.parse(sessionStorage.getItem(name) || '{}');
    }
  },
};

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
  var newArr = [],
    newObj = {};
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      //判断自身中是否存在该属性
      newArr.push(key);
    }
  }
  //排序
  newArr = newArr.sort();
  newArr.forEach(function (key) {
    key && obj[key] !== undefined && obj[key] !== null && (newObj[key] = obj[key]);
  });
  newArr = null;
  return newObj;
}

/**
 * 遍历数组并进行json字符化转义
 * @param arr array 数组内容
 * @returns string
 */
function judge(arr) {
  var a = [];
  [].forEach.call(arr, function (ar) {
    typeof ar === 'object'
      ? a.push(JSON.stringify(ar))
      : typeof ar === 'number'
      ? a.push(ar)
      : a.push('"' + ar.toString() + '"');
  });
  return a.join(',');
}

/**
 * 对参数进行签名
 * @param obj object 传入参数
 * @returns string 签名字符串
 */
function getStr(obj) {
  // 定义一个数组存放keyValue
  var str = [];
  // 定义一个value存放处理后的键值
  var value = '';
  // 定义emoji正则表达式
  // var regRule = /\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2600-\u27FF]/g;
  // var regRule = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]/gi;
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (Array.isArray(obj[key])) {
        // 数组
        value = '[' + judge(obj[key]) + ']';
      } else if (Object.prototype.toString.call(obj[key]) == '[object Object]') {
        // 对象
        value = JSON.stringify(obj[key]);
        // if (value.match(regRule)) {
        //   value = value.replace(regRule, ''); //旧的js emoji正则表达式
        // }
      } else {
        // 其他格式
        value = obj[key]; //先复制一份值
        // 如果变量是文本类型且存在emoji则过滤emoji再签名
        // if (
        //   Object.prototype.toString.call(obj[key]) == '[object String]' &&
        //   obj[key].match(regRule)
        // ) {
        //   value = value.replace(regRule, ''); // 旧的js emoji正则表达式
        // }
      }
      str.push(key + '=' + value);
    }
  }
  //console.log(str.join('&').toLowerCase());
  return md5(str.join('&').toLowerCase());
}

// 处理完成后返回加密数据
export const encrypt = (data) => {
  let setMd5 = { ...sort(data) };
  setMd5.auth_time_stamp = new Date().getTime().toString();
  setMd5.auth_nonce = setString(true, 10, 28);
  setMd5.auth_secret_key = AUTH_SECRET_KEY;
  // let setStringMd5 = Conversion(setMd5);
  // setStringMd5 = setStringMd5.toLowerCase();
  // let Md5data = md5(setStringMd5);
  setMd5.auth_sign = getStr(setMd5);
  delete setMd5.auth_secret_key;
  return setMd5;
};

export const getPageQuery = () => parse(window.location.href.split('?')[1]);

// 设置uuid
export const uuid = () => {
  var s = [];
  var hexDigits = `${new Date().getTime()}abcdef`;
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = '-';

  var uuid = s.join('');
  return uuid;
};

// 参数大小排序
export const checkSorterData = (old, next, key, type = 'number') => {
  const oldData = old[key];
  const nextData = next[key];
  switch (type) {
    case 'time':
      return moment(oldData).diff(moment(nextData));

    default:
      return Number(oldData) - Number(nextData);
  }
};

// 检查数据类型
export const checkDataType = (data) => {
  let checkType = undefined;
  if (Array.isArray(data)) {
    checkType = 'Array'; // 数组
  } else if (lodash.isPlainObject(data)) {
    checkType = 'Object'; // 对象
  } else if (lodash.isString(data)) {
    checkType = 'String'; // 字符串
  } else if (lodash.isBoolean(data)) {
    checkType = 'Boolean'; // 布尔
  } else if (lodash.isArguments(data)) {
    checkType = 'arguments'; // arguments对象
  } else if (lodash.isFunction(data)) {
    checkType = 'Function'; // 函数
  } else if (lodash.isInteger(data)) {
    checkType = 'Int'; // 整数
  } else if (lodash.isNaN(data)) {
    checkType = 'NaN'; // 于 undefined 和其他非数字的值返回 false
  } else if (lodash.isNil(data)) {
    checkType = 'Nil'; // 是 null 或者 undefined
  } else if (lodash.ArrayBuffer(data)) {
    checkType = 'ArrayBuffer'; // buffer数组
  } else if (lodash.isBuffer(data)) {
    checkType = 'buffer'; // buffer文件
  } else if (lodash.isDate(data)) {
    checkType = 'Date'; // 时间
  } else if (lodash.isEmpty(data)) {
    checkType = 'empty'; // 空对象，集合，映射或者set
  } else if (lodash.isError(data)) {
    checkType = 'error'; // Error, EvalError, RangeError, ReferenceError,SyntaxError, TypeError, 或者 URIError对象
  }
  return checkType;
};

// 检查文件上传格式
export const checkFileData = (fileData) => {
  let aimg = [];
  switch (typeof fileData) {
    case 'undefined':
      break;
    case 'object':
      aimg = fileData.fileList.map((item) => {
        if (item.originFileObj) return item.originFileObj;
        return item.url;
      });
      break;
    default:
      aimg = [fileData];
      break;
  }
  return aimg;
};

// 获取城市名
const getCityName = (code) => {
  const cityIndex = cityJson.findIndex((item) => item.id === code);
  return cityJson[cityIndex]?.name;
};

// 根据城市code获取城市名称
export const checkCityName = (code) => {
  if (!code) return;
  const codeStr = `${code}`;
  if (codeStr.length === 2) {
    return getCityName(codeStr);
  } else if (codeStr.length === 4) {
    return `${getCityName(codeStr.slice(0, 2))}-${getCityName(codeStr)}`;
  } else if (codeStr.length === 6) {
    return `${getCityName(codeStr.slice(0, 2))}-${getCityName(codeStr.slice(0, 4))}-${getCityName(
      codeStr,
    )}`;
  }
};
