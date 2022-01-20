/*
 * bridge android桥接库
 * nativeOther 封装
 * this.ios，
 * this.android调用方法名称
 * getPhone 获取设备型号
 * dsBridgeSynchro 安卓同步桥接
 * dsBridgeAsyc 安卓异步桥接
 * nativeInit 安卓通用方法
 * */
var bridge = {
  default: this,
  call: function (b, a, c) {
    var e = '';
    'function' == typeof a && ((c = a), (a = {}));
    a = { data: void 0 === a ? null : a };
    if ('function' == typeof c) {
      var g = 'dscb' + window.dscb++;
      window[g] = c;
      a._dscbstub = g;
    }
    a = JSON.stringify(a);
    if (window._dsbridge) e = _dsbridge.call(b, a);
    else if (window._dswk || -1 != navigator.userAgent.indexOf('_dsbridge'))
      e = prompt('_dsbridge=' + b, a);
    return JSON.parse(e || '{}').data;
  },
  register: function (b, a, c) {
    c = c ? window._dsaf : window._dsf;
    window._dsInit ||
      ((window._dsInit = !0),
      setTimeout(function () {
        bridge.call('_dsb.dsinit');
      }, 0));
    'object' == typeof a ? (c._obs[b] = a) : (c[b] = a);
  },
  registerAsyn: function (b, a) {
    this.register(b, a, !0);
  },
  hasNativeMethod: function (b, a) {
    return this.call('_dsb.hasNativeMethod', { name: b, type: a || 'all' });
  },
  disableJavascriptDialogBlock: function (b) {
    this.call('_dsb.disableJavascriptDialogBlock', { disable: !1 !== b });
  },
};
!(function () {
  if (!window._dsf) {
    var b = {
        _dsf: { _obs: {} },
        _dsaf: { _obs: {} },
        dscb: 0,
        dsBridge: bridge,
        close: function () {
          bridge.call('_dsb.closePage');
        },
        _handleMessageFromNative: function (a) {
          var e = JSON.parse(a.data),
            b = { id: a.callbackId, complete: !0 },
            c = this._dsf[a.method],
            d = this._dsaf[a.method],
            h = function (a, c) {
              b.data = a.apply(c, e);
              bridge.call('_dsb.returnValue', b);
            },
            k = function (a, c) {
              e.push(function (a, c) {
                b.data = a;
                b.complete = !1 !== c;
                bridge.call('_dsb.returnValue', b);
              });
              a.apply(c, e);
            };
          if (c) h(c, this._dsf);
          else if (d) k(d, this._dsaf);
          else if (((c = a.method.split('.')), !(2 > c.length))) {
            a = c.pop();
            var c = c.join('.'),
              d = this._dsf._obs,
              d = d[c] || {},
              f = d[a];
            f && 'function' == typeof f
              ? h(f, d)
              : ((d = this._dsaf._obs),
                (d = d[c] || {}),
                (f = d[a]) && 'function' == typeof f && k(f, d));
          }
        },
      },
      a;
    for (a in b) window[a] = b[a];
    bridge.register('_hasJavascriptMethod', function (a, b) {
      b = a.split('.');
      if (2 > b.length) return !(!_dsf[b] && !_dsaf[b]);
      a = b.pop();
      b = b.join('.');
      return (b = _dsf._obs[b] || _dsaf._obs[b]) && !!b[a];
    });
  }
})();

// 路由映射
const pathNative = {
  kolCoupon: {
    // 有价券详情 ownerCouponId ownerId merchantId
    dakaleIOS: { path: 'DKLPurchaseCouponDetailViewController' },
    dakaleAndroid: {
      path: 'KolCoupon',
    },
    miniProgram: { path: '/pages/perimeter/payCouponDetails/index' },
  },
  group: {
    // 集团首页 id merchantName
    dakaleIOS: { path: 'DKLGroupMerchantDetailViewController', key: { id: 'merchantGroupId' } },
    dakaleAndroid: {
      path: 'GroupDetail',
    },
    miniProgram: {
      path: '/pages/perimeter/kaMerchantDetails/index',
      key: { id: 'merchantGroupId' },
    },
  },
  merchant: {
    // 单店首页 id
    dakaleIOS: { path: 'DKLShopDetailViewController', key: { id: 'shopId' } },
    dakaleAndroid: {
      path: 'shopDetailPage',
    },
    miniProgram: { path: '/pages/perimeter/merchantDetails/index', key: { id: 'merchantId' } },
  },
  goods: {
    // 特惠商品详情 specialActivityId ownerId
    dakaleIOS: {
      path: 'DKLAroundDiscountGoodsDetailViewController',
      key: { merchantId: 'ownerId' },
    },
    dakaleAndroid: { path: 'AroundGood', key: { merchantId: 'ownerId' } },
    miniProgram: { path: '/pages/perimeter/favourableDetails/index' },
  },
  commerceGoods: {
    // 电商商品详情 specialActivityId ownerId 小程序要merchantId
    dakaleIOS: {
      path: 'DKLAroundDiscountGoodsDetailViewController',
    },
    dakaleAndroid: { path: 'ECGood' },
    miniProgram: {
      path: '/pages/perimeter/favourableDetails/index',
      key: { ownerId: 'merchantId' },
    },
  },
  limited: {
    // 限时抢购
    dakaleIOS: { path: 'DKLLookAroundLimitTimeSnapUpViewController' },
    dakaleAndroid: { path: 'HotSellList' },
    miniProgram: { path: '/pages/perimeter/specialOffer/index' },
  },
  explode: {
    // 爆品福利
    dakaleIOS: { path: 'DKLLookAroundExplosiveWelfaveViewController' },
    dakaleAndroid: { path: 'TodaySellList' },
    miniProgram: { path: '/pages/perimeter/speciaMaterial/index?type=today' },
  },
  recommend: {
    // 特惠推荐
    dakaleIOS: { path: 'DKLLAGoodsListController' },
    dakaleAndroid: { path: 'AroundList' },
    miniProgram: { path: '/pages/perimeter/perimeterList/index' },
  },
};

// 原生方法
const nativeFunction = {
  dakaleIOS: {
    close: 'finish', //关闭
    finishAndPushH5: 'finishAndPushH5', // 关闭当前h5且跳转新h5
    hideTitle: 'hideTitle', //隐藏头部
    linkTo: 'goNativePage', //页面挑战
    getToken: 'getToken', //获取token
    getCode: 'goNativePage', //扫码打卡
    savePay: 'DKLOrderPayInfoController', //支付页 参数 marketCouponId
    goLogin: 'goNativePage', //qu登录
    goShare: 'callUpShare', //分享
    getClientVersion: 'getClientVersion', //获取版本号
    getUserLocationInfo: 'getUserLocationInfo', //获取用户定位信息，
    mapGo: 'showMerchantNavigationLatAndLnt', //调取 app地图
  },
  dakaleAndroid: {
    close: 'finish', //关闭
    hideTitle: 'hideTitle', //隐藏头部
    linkTo: 'goNativePage', //路径跳转
    getToken: 'getToken',
    getCode: 'openScan', //唤起扫码
    savePay: 'goNativePage', //支付页 参数 marketCouponId
    goLogin: 'goLogin', //登录
    goShare: 'share', //分享
    getClientVersion: 'getClientVersion', //获取版本号
    getUserLocationInfo: 'getLatAndLnt', //获取用户定位信息
    mapGo: 'getNavi', //调取 app地图
  },
  miniProgram: {
    linkTo: 'navigateTo', //路径跳转
  },
};

function nativeOther() {
  // 对象转url参数
  this.queryParams = (data) => {
    if (!data) return '';
    let _result = [];
    for (let key in data) {
      let value = data[key];
      // 去掉为空的参数
      if (['', undefined, null].includes(value)) {
        continue;
      }
      if (Array.isArray(value)) {
        value = value.toString();
      }
      _result.push(key + '=' + value);
    }
    console.log(_result.length ? '?' + _result.join('&') : '');
    return _result.length ? '?' + _result.join('&') : '';
  };
  // 路由拼接
  this.urlGet = (url, params) => url + this.queryParams(params);
  // 判断浏览器环境
  this.getPhone = function () {
    var u = navigator.userAgent.toLowerCase();
    if (/miniProgram/i.test(u)) return 'miniProgram';
    if (u.indexOf('ios/dakale') > -1) return 'dakaleIOS';
    if (u.indexOf('android/dakale') > -1) return 'dakaleAndroid';
    return false;
  };
  /**
   * 检查路由所需参数键名 nativeSet
   * @param {*} nativeSet pathNative 内配置的端口方法 path key映射 path 为linkTo跳转页面时使用
   * @param {*} params 点击时获取到的参数键值对
   * @param {*} checkApp 当前浏览器环境
   * @returns
   */
  this.checkParamsKey = function (nativeSet, params, checkApp) {
    let nativeUrl = '';
    let nativeParam = params;
    if (nativeSet) {
      const { path, key } = nativeSet[checkApp];
      nativeUrl = path;
      if (key) {
        Object.keys(key).forEach((item) => {
          nativeParam[key[item]] = params[item];
        });
      }
    }
    return { nativeUrl, nativeParam };
  };
  /**
   * 检查环境获取参数
   * @param {*} fnNames nativeOther 桥接方法名映射
   * @param {*} paramObj 不同端点击时获取到的参数
   * @returns {*} fnKey 桥接方法名称 param 桥接方法传递的参数
   */
  this.checkAppParams = function (fnNames, paramObj = {}) {
    const checkApp = this.getPhone();
    const fnKey = nativeFunction[checkApp][fnNames]; // 获取桥接方法名称
    let param = {};
    const { params = {}, path, hideCurrent = 0 } = paramObj;
    // 兼容不同端参数名不同校验
    const { nativeUrl, nativeParam } = this.checkParamsKey(pathNative[path], params, checkApp);
    switch (checkApp) {
      case 'dakaleIOS':
        let paramIos = { param: nativeParam };
        if (fnNames === 'linkTo') {
          paramIos = { path: nativeUrl, hideCurrent, param: nativeParam };
        }
        param = paramIos;
        break;
      case 'dakaleAndroid':
        let paramAndroid = nativeParam;
        if (fnNames === 'linkTo') {
          paramAndroid = { path: nativeUrl, ...nativeParam };
        }
        param = paramAndroid;
        break;
      case 'miniProgram':
        param = { path: nativeUrl, params: nativeParam };
        break;
      default:
        break;
    }
    return { fnKey, param };
  };
  // 同步调用安卓
  this.dsBridgeSynchro = function (fnName, params) {
    bridge.call(fnName, params ? JSON.stringify(params) : '');
  };
  // 异步调用安卓
  this.dsBridgeAsyc = function (fnName, params, callback) {
    if (Object.keys(params).length > 0) {
      return bridge.call(fnName, JSON.stringify(params), function (res) {
        callback(res);
      });
    }
    return bridge.call(fnName, function (res) {
      callback(res);
    });
  };
  // 桥接内容
  this.nativeInit = function (fnName, paramObj = {}, callback) {
    let that = this;
    const checkApp = that.getPhone();
    if (!checkApp) return;
    if (paramObj.linkType === 'H5') {
      const path = paramObj.path;
      if (!path) return;
      if (['dakaleIOS', 'dakaleAndroid'].includes(checkApp)) {
        window.location.href = path;
      } else {
        wx.miniProgram.navigateTo({
          url: '/pages/share/webView/index?link=' + path,
        });
      }
    } else {
      // 检查参数
      const { fnKey, param } = that.checkAppParams(fnName, paramObj);
      if (checkApp === 'dakaleIOS') {
        if (callback && typeof callback == 'function') {
          callback(window.prompt(fnKey, JSON.stringify(param)));
        } else {
          window.webkit.messageHandlers[fnKey].postMessage(JSON.stringify(param));
        }
      } else if (checkApp === 'dakaleAndroid') {
        if (callback && typeof callback == 'function') {
          that.dsBridgeAsyc(fnKey, param, callback);
        } else {
          that.dsBridgeSynchro(fnKey, param);
        }
      } else if (checkApp === 'miniProgram') {
        const { params, path } = param;
        wx.miniProgram[fnKey]({ url: that.urlGet(path, params) });
      }
    }
  };
}

const native = new nativeOther();

export const nativeText = `"use strict";function nativeOther(){var e=this;this.queryParams=function(e){if(!e)return"";var a=[];for(var i in e){var t=e[i];["",void 0,null].includes(t)||(Array.isArray(t)&&(t=t.toString()),a.push(i+"="+t))}return console.log(a.length?"?"+a.join("&"):""),a.length?"?"+a.join("&"):""},this.urlGet=function(a,i){return a+e.queryParams(i)},this.getPhone=function(){var e=navigator.userAgent.toLowerCase();return/miniProgram/i.test(e)?"miniProgram":e.indexOf("ios/dakale")>-1?"dakaleIOS":e.indexOf("android/dakale")>-1&&"dakaleAndroid"},this.checkParamsKey=function(e,a,i){var t="",n=a;if(e){var o=e[i],r=o.path,d=o.key;t=r,d&&Object.keys(d).forEach(function(e){n[d[e]]=a[e]})}return{nativeUrl:t,nativeParam:n}},this.checkAppParams=function(e){var a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},i=this.getPhone(),t=nativeFunction[i][e],n={},o=a.params,r=void 0===o?{}:o,d=a.path,s=a.hideCurrent,l=void 0===s?0:s,p=this.checkParamsKey(pathNative[d],r,i),h=p.nativeUrl,c=p.nativeParam;switch(i){case"dakaleIOS":var g={param:c};"linkTo"===e&&(g={path:h,hideCurrent:l,param:c}),n=g;break;case"dakaleAndroid":var f=c;"linkTo"===e&&(f=_extends({path:h},c)),n=f;break;case"miniProgram":n={path:h,params:c}}return{fnKey:t,param:n}},this.dsBridgeSynchro=function(e,a){bridge.call(e,a?JSON.stringify(a):"")},this.dsBridgeAsyc=function(e,a,i){return Object.keys(a).length>0?bridge.call(e,JSON.stringify(a),function(e){i(e)}):bridge.call(e,function(e){i(e)})},this.nativeInit=function(e){var a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},i=arguments[2],t=this,n=t.getPhone();if(n)if("H5"===a.linkType){var o=a.path;if(!o)return;["dakaleIOS","dakaleAndroid"].includes(n)?window.location.href=o:wx.miniProgram.navigateTo({url:"/pages/share/webView/index?link="+o})}else{var r=t.checkAppParams(e,a),d=r.fnKey,s=r.param;if("dakaleIOS"===n)i&&"function"==typeof i?i(window.prompt(d,JSON.stringify(s))):window.webkit.messageHandlers[d].postMessage(JSON.stringify(s));else if("dakaleAndroid"===n)i&&"function"==typeof i?t.dsBridgeAsyc(d,s,i):t.dsBridgeSynchro(d,s);else if("miniProgram"===n){var l=s.params,p=s.path;wx.miniProgram[d]({url:t.urlGet(p,l)})}}}}var _extends=Object.assign||function(e){for(var a=1;a<arguments.length;a++){var i=arguments[a];for(var t in i)Object.prototype.hasOwnProperty.call(i,t)&&(e[t]=i[t])}return e},_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},bridge={default:void 0,call:function(e,a,i){var t="";if("function"==typeof a&&(i=a,a={}),a={data:void 0===a?null:a},"function"==typeof i){var n="dscb"+window.dscb++;window[n]=i,a._dscbstub=n}return a=JSON.stringify(a),window._dsbridge?t=_dsbridge.call(e,a):(window._dswk||-1!=navigator.userAgent.indexOf("_dsbridge"))&&(t=prompt("_dsbridge="+e,a)),JSON.parse(t||"{}").data},register:function(e,a,i){i=i?window._dsaf:window._dsf,window._dsInit||(window._dsInit=!0,setTimeout(function(){bridge.call("_dsb.dsinit")},0)),"object"==(void 0===a?"undefined":_typeof(a))?i._obs[e]=a:i[e]=a},registerAsyn:function(e,a){this.register(e,a,!0)},hasNativeMethod:function(e,a){return this.call("_dsb.hasNativeMethod",{name:e,type:a||"all"})},disableJavascriptDialogBlock:function(e){this.call("_dsb.disableJavascriptDialogBlock",{disable:!1!==e})}};!function(){if(!window._dsf){var e,a={_dsf:{_obs:{}},_dsaf:{_obs:{}},dscb:0,dsBridge:bridge,close:function(){bridge.call("_dsb.closePage")},_handleMessageFromNative:function(e){var a=JSON.parse(e.data),i={id:e.callbackId,complete:!0},t=this._dsf[e.method],n=this._dsaf[e.method],o=function(e,t){i.data=e.apply(t,a),bridge.call("_dsb.returnValue",i)},r=function(e,t){a.push(function(e,a){i.data=e,i.complete=!1!==a,bridge.call("_dsb.returnValue",i)}),e.apply(t,a)};if(t)o(t,this._dsf);else if(n)r(n,this._dsaf);else if(t=e.method.split("."),!(2>t.length)){e=t.pop();var t=t.join("."),n=this._dsf._obs,n=n[t]||{},d=n[e];d&&"function"==typeof d?o(d,n):(n=this._dsaf._obs,n=n[t]||{},(d=n[e])&&"function"==typeof d&&r(d,n))}}};for(e in a)window[e]=a[e];bridge.register("_hasJavascriptMethod",function(e,a){return a=e.split("."),2>a.length?!(!_dsf[a]&&!_dsaf[a]):(e=a.pop(),a=a.join("."),(a=_dsf._obs[a]||_dsaf._obs[a])&&!!a[e])})}}();var pathNative={kolCoupon:{dakaleIOS:{path:"DKLPurchaseCouponDetailViewController"},dakaleAndroid:{path:"KolCoupon"},miniProgram:{path:"/pages/perimeter/payCouponDetails/index"}},group:{dakaleIOS:{path:"DKLGroupMerchantDetailViewController",key:{id:"merchantGroupId"}},dakaleAndroid:{path:"GroupDetail"},miniProgram:{path:"/pages/perimeter/kaMerchantDetails/index",key:{id:"merchantGroupId"}}},merchant:{dakaleIOS:{path:"DKLShopDetailViewController",key:{id:"shopId"}},dakaleAndroid:{path:"shopDetailPage"},miniProgram:{path:"/pages/perimeter/merchantDetails/index",key:{id:"merchantId"}}},goods:{dakaleIOS:{path:"DKLAroundDiscountGoodsDetailViewController",key:{merchantId:"ownerId"}},dakaleAndroid:{path:"AroundGood",key:{merchantId:"ownerId"}},miniProgram:{path:"/pages/perimeter/favourableDetails/index"}},commerceGoods:{dakaleIOS:{path:"DKLAroundDiscountGoodsDetailViewController"},dakaleAndroid:{path:"ECGood"},miniProgram:{path:"/pages/perimeter/favourableDetails/index",key:{ownerId:"merchantId"}}},limited:{dakaleIOS:{path:"DKLLookAroundLimitTimeSnapUpViewController"},dakaleAndroid:{path:"HotSellList"},miniProgram:{path:"/pages/perimeter/specialOffer/index"}},explode:{dakaleIOS:{path:"DKLLookAroundExplosiveWelfaveViewController"},dakaleAndroid:{path:"TodaySellList"},miniProgram:{path:"/pages/perimeter/speciaMaterial/index?type=today"}},recommend:{dakaleIOS:{path:"DKLLAGoodsListController"},dakaleAndroid:{path:"AroundList"},miniProgram:{path:"/pages/perimeter/perimeterList/index"}}},nativeFunction={dakaleIOS:{close:"finish",finishAndPushH5:"finishAndPushH5",hideTitle:"hideTitle",linkTo:"goNativePage",getToken:"getToken",getCode:"goNativePage",savePay:"DKLOrderPayInfoController",goLogin:"goNativePage",goShare:"callUpShare",getClientVersion:"getClientVersion",getUserLocationInfo:"getUserLocationInfo",mapGo:"showMerchantNavigationLatAndLnt"},dakaleAndroid:{close:"finish",hideTitle:"hideTitle",linkTo:"goNativePage",getToken:"getToken",getCode:"openScan",savePay:"goNativePage",goLogin:"goLogin",goShare:"share",getClientVersion:"getClientVersion",getUserLocationInfo:"getLatAndLnt",mapGo:"getNavi"},miniProgram:{linkTo:"navigateTo"}},native=new nativeOther;`;

export const nativeClick = `<script>$('body').on('click','.handleGoNative',function(){if(!$(this).attr('data-linkType')&&!$(this).attr('data-native'))return;let keyObj={};($(this).attr('data-key')?$(this).attr('data-key').split(','):[]).map((item)=>{keyObj[item]=$(this).attr('data-'+item)});const path=$(this).attr('data-path');const params={path,params:keyObj,linkType:$(this).attr('data-linkType'),};native.nativeInit($(this).attr('data-native')||'linkTo',params)})</script>`;
