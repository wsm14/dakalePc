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
  goods: {
    // 特惠商品详情
    ios: 'DKLAroundDiscountGoodsDetailViewController',
    android: 'SpecialGoodPage',
    miniProgram: '/pages/perimeter/favourableDetails/index',
  },
  limited: {
    // 限时抢购
    ios: 'DKLLookAroundLimitTimeSnapUpViewController',
    android: 'HotSellList',
    miniProgram: '/pages/perimeter/specialOffer/index',
  },
  explode: {
    // 爆品福利
    ios: 'DKLLookAroundExplosiveWelfaveViewController',
    android: 'TodaySellList',
    miniProgram: '/pages/perimeter/speciaMaterial/index?type=today',
  },
  recommend: {
    // 特惠推荐
    ios: 'DKLBaseTableViewController',
    android: 'AroundList',
    miniProgram: '/pages/perimeter/perimeterList/index',
  },
};

function nativeOther() {
  this.ios = {
    close: 'finish', //关闭
    hideTitle: 'hideTitle', //隐藏头部
    linkTo: 'goNativePage', //页面挑战
    getToken: 'getToken', //获取token
    getCode: 'goNativePage', //扫码打卡
    goShare: 'callUpShare', //分享
    getUserLocationInfo: 'getUserLocationInfo', //获取用户定位信息，
  };
  this.android = {
    close: 'finish', //关闭
    hideTitle: 'hideTitle', //隐藏头部
    linkTo: 'goNativePage', //路径跳转
    getToken: 'getToken',
    getCode: 'openScan', //唤起扫码
    goShare: 'share', //分享
    getUserLocationInfo: 'getLatAndLnt', //获取用户定位信息
  };
  this.miniProgram = {
    linkTo: 'navigateTo', //路径跳转
  };
  /**
   * 对象转url参数
   * @param {*} data
   */
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
    if (/miniProgram/i.test(u)) return 'miniProgram'; // 小程序
    if (u.indexOf('ios/dakale') > -1) return 'dakaleIOS'; // 用户端ios
    if (u.indexOf('android/dakale') > -1) return 'dakaleAndroid'; // 用户端android
    return false;
  };
  // 检查环境获取参数
  this.checkAppParams = function (fnNames, paramObj = {}) {
    const checkApp = this.getPhone();
    let fnKey = '';
    let param = {};
    const { params = {}, path } = paramObj;
    switch (checkApp) {
      case 'dakaleIOS':
        let paramIos = { param: params };
        if (fnNames === 'linkTo') {
          paramIos = { path: pathNative[path].ios, param: params };
        }
        fnKey = this.ios[fnNames];
        param = paramIos;
        break;
      case 'dakaleAndroid':
        let paramAndroid = { ...params };
        if (fnNames === 'linkTo') {
          paramAndroid = { path: pathNative[path].android, ...params };
        }
        fnKey = this.android[fnNames];
        param = paramAndroid;
        break;
      case 'miniProgram':
        fnKey = this.miniProgram[fnNames];
        param = { path: pathNative[path].miniProgram, params };
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
  this.nativeInit = function (fnName, paramObj = {}, callback) {
    let that = this;
    const checkApp = that.getPhone();
    if (!checkApp) return;
    if (checkApp === 'dakaleIOS') {
      const { linkType } = paramObj.ios;
      if (linkType === 'H5') {
        const { path } = paramObj.ios;
        window.location.href = path;
        return;
      }
      const { fnKey, param } = this.checkAppParams(fnName, paramObj.ios);
      if (callback && typeof callback == 'function') {
        callback(window.prompt(fnKey, JSON.stringify(param)));
      } else {
        window.webkit.messageHandlers[fnKey].postMessage(JSON.stringify(param));
      }
    } else if (checkApp === 'dakaleAndroid') {
      const { linkType } = paramObj.android;
      if (linkType === 'H5') {
        const { path } = paramObj.android;
        window.location.href = path;
        return;
      }
      const { fnKey, param } = this.checkAppParams(fnName, paramObj.android);
      if (callback && typeof callback == 'function') {
        that.dsBridgeAsyc(fnKey, param, callback);
      } else {
        that.dsBridgeSynchro(fnKey, param);
      }
    } else if (checkApp === 'miniProgram') {
      const { linkType } = paramObj.miniProgram;
      if (linkType === 'H5') {
        const { path } = paramObj.miniProgram;
        wx.miniProgram.navigateTo({ url: '/pages/share/webView/index?link=' + path });
        return;
      }
      const { fnKey, param } = this.checkAppParams(fnName, paramObj.miniProgram);
      const { params, path } = param;
      wx.miniProgram[fnKey]({ url: this.urlGet(path, params) });
    }
  };
}

function handleGoNative(e) {
  if (!e.getAttribute('data-linkType')) return;
  let keyObj = {};
  (e.getAttribute('data-key') ? e.getAttribute('data-key').split(',') : []).map((item) => {
    keyObj[item] = e.getAttribute('data-' + item);
  });
  const path = e.getAttribute('data-path');
  const params = { path, params: keyObj, linkType: e.getAttribute('data-linkType') };
  new nativeOther().nativeInit('linkTo', { ios: params, android: params, miniProgram: params });
}

export default `var bridge={default:this,call:function(b,a,c){var e='';'function'==typeof a&&((c=a),(a={}));a={data:void 0===a?null:a};if('function'==typeof c){var g='dscb'+window.dscb++;window[g]=c;a._dscbstub=g;}a=JSON.stringify(a);if(window._dsbridge)e=_dsbridge.call(b,a);else if(window._dswk||-1!=navigator.userAgent.indexOf('_dsbridge'))e=prompt('_dsbridge='+b,a);return JSON.parse(e||'{}').data;},register:function(b,a,c){c=c?window._dsaf:window._dsf;window._dsInit||((window._dsInit=!0),setTimeout(function(){bridge.call('_dsb.dsinit');},0));'object'==typeof a?(c._obs[b]=a):(c[b]=a);},registerAsyn:function(b,a){this.register(b,a,!0);},hasNativeMethod:function(b,a){return this.call('_dsb.hasNativeMethod',{name:b,type:a||'all'});},disableJavascriptDialogBlock:function(b){this.call('_dsb.disableJavascriptDialogBlock',{disable:!1!==b});},};!(function(){if(!window._dsf){var b={_dsf:{_obs:{}},_dsaf:{_obs:{}},dscb:0,dsBridge:bridge,close:function(){bridge.call('_dsb.closePage');},_handleMessageFromNative:function(a){var e=JSON.parse(a.data),b={id:a.callbackId,complete:!0},c=this._dsf[a.method],d=this._dsaf[a.method],h=function(a,c){b.data=a.apply(c,e);bridge.call('_dsb.returnValue',b);},k=function(a,c){e.push(function(a,c){b.data=a;b.complete=!1!==c;bridge.call('_dsb.returnValue',b);});a.apply(c,e);};if(c)h(c,this._dsf);else if(d)k(d,this._dsaf);else if(((c=a.method.split('.')),!(2>c.length))){a=c.pop();var c=c.join('.'),d=this._dsf._obs,d=d[c]||{},f=d[a];f&&'function'==typeof f?h(f,d):((d=this._dsaf._obs),(d=d[c]||{}),(f=d[a])&&'function'==typeof f&&k(f,d));}},},a;for(a in b)window[a]=b[a];bridge.register('_hasJavascriptMethod',function(a,b){b=a.split('.');if(2>b.length)return!(!_dsf[b]&&!_dsaf[b]);a=b.pop();b=b.join('.');return(b=_dsf._obs[b]||_dsaf._obs[b])&&!!b[a];});}})();const pathNative={goods:{ios:'DKLAroundDiscountGoodsDetailViewController',android:'SpecialGoodPage',miniProgram:'/pages/perimeter/favourableDetails/index',},limited:{ios:'DKLLookAroundLimitTimeSnapUpViewController',android:'HotSellList',miniProgram:'/pages/perimeter/specialOffer/index',},explode:{ios:'DKLLookAroundExplosiveWelfaveViewController',android:'TodaySellList',miniProgram:'/pages/perimeter/speciaMaterial/index?type=today',},recommend:{ios:'DKLBaseTableViewController',android:'AroundList',miniProgram:'/pages/perimeter/perimeterList/index',},};function nativeOther(){this.ios={close:'finish',hideTitle:'hideTitle',linkTo:'goNativePage',getToken:'getToken',getCode:'goNativePage',goShare:'callUpShare',getUserLocationInfo:'getUserLocationInfo',};this.android={close:'finish',hideTitle:'hideTitle',linkTo:'goNativePage',getToken:'getToken',getCode:'openScan',goShare:'share',getUserLocationInfo:'getLatAndLnt',};this.miniProgram={linkTo:'navigateTo',};this.queryParams=(data)=>{if(!data)return'';let _result=[];for(let key in data){let value=data[key];if(['',undefined,null].includes(value)){continue;}if(Array.isArray(value)){value=value.toString();}_result.push(key+'='+value);}console.log(_result.length?'?'+_result.join('&'):'');return _result.length?'?'+_result.join('&'):'';};this.urlGet=(url,params)=>url+this.queryParams(params);this.getPhone=function(){var u=navigator.userAgent.toLowerCase();if(/miniProgram/i.test(u))return'miniProgram';if(u.indexOf('ios/dakale')>-1)return'dakaleIOS';if(u.indexOf('android/dakale')>-1)return'dakaleAndroid';return false;};this.checkAppParams=function(fnNames,paramObj={}){const checkApp=this.getPhone();let fnKey='';let param={};const{params={},path}=paramObj;switch(checkApp){case'dakaleIOS':let paramIos={param:params};if(fnNames==='linkTo'){paramIos={path:pathNative[path].ios,param:params};}fnKey=this.ios[fnNames];param=paramIos;break;case'dakaleAndroid':let paramAndroid={...params};if(fnNames==='linkTo'){paramAndroid={path:pathNative[path].android,...params};}fnKey=this.android[fnNames];param=paramAndroid;break;case'miniProgram':fnKey=this.miniProgram[fnNames];param={path:pathNative[path].miniProgram,params};break;default:break;}return{fnKey,param};};this.dsBridgeSynchro=function(fnName,params){bridge.call(fnName,params?JSON.stringify(params):'');};this.dsBridgeAsyc=function(fnName,params,callback){if(Object.keys(params).length>0){return bridge.call(fnName,JSON.stringify(params),function(res){callback(res);});}return bridge.call(fnName,function(res){callback(res);});};this.nativeInit=function(fnName,paramObj={},callback){let that=this;const checkApp=that.getPhone();if(!checkApp)return;if(checkApp==='dakaleIOS'){const{linkType}=paramObj.ios;if(linkType==='H5'){const{path}=paramObj.ios;window.location.href=path;return;}const{fnKey,param}=this.checkAppParams(fnName,paramObj.ios);if(callback&&typeof callback=='function'){callback(window.prompt(fnKey,JSON.stringify(param)));}else{window.webkit.messageHandlers[fnKey].postMessage(JSON.stringify(param));}}else if(checkApp==='dakaleAndroid'){const{linkType}=paramObj.android;if(linkType==='H5'){const{path}=paramObj.android;window.location.href=path;return;}const{fnKey,param}=this.checkAppParams(fnName,paramObj.android);if(callback&&typeof callback=='function'){that.dsBridgeAsyc(fnKey,param,callback);}else{that.dsBridgeSynchro(fnKey,param);}}else if(checkApp==='miniProgram'){const{linkType}=paramObj.miniProgram;if(linkType==='H5'){const{path}=paramObj.miniProgram;wx.miniProgram.navigateTo({url:'/pages/share/webView/index?link='+path});return;}const{fnKey,param}=this.checkAppParams(fnName,paramObj.miniProgram);const{params,path}=param;wx.miniProgram[fnKey]({url:this.urlGet(path,params)});}};}function handleGoNative(e){if(!e.getAttribute('data-linkType'))return;let keyObj={};(e.getAttribute('data-key')?e.getAttribute('data-key').split(','):[]).map((item)=>{keyObj[item]=e.getAttribute('data-'+item);});const path=e.getAttribute('data-path');const params={path,params:keyObj,linkType:e.getAttribute('data-linkType')};new nativeOther().nativeInit('linkTo',{ios:params,android:params,miniProgram:params});}`;
