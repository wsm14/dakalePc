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
    ios: 'DKLAroundDiscountGoodsDetailViewController',
    android: 'SpecialGoodPage',
    miniProgram: 'pages/perimeter/favourableDetails/index',
  },
};

class nativeOther {
  constructor() {
    this.ios = {
      close: 'finish',
      hideTitle: 'hideTitle',
      linkTo: 'goNativePage',
      getToken: 'getToken',
      getCode: 'goNativePage',
      goShare: 'callUpShare',
      getUserLocationInfo: 'getUserLocationInfo', //获取用户定位信息，
    };
    this.android = {
      close: 'finish',
      hideTitle: 'hideTitle',
      linkTo: 'goNativePage',
      getToken: 'getToken',
      getCode: 'openScan',
      goShare: 'share',
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
    this.urlGet = (url, params) => url + queryParams(params);
    // 判断浏览器环境
    this.getPhone = function () {
      var u = navigator.userAgent.toLowerCase();
      if (/miniProgram/i.test(u)) return 'miniProgram'; // 小程序
      if (/ios\/dakale/i.test(u)) return 'dakaleIOS'; // 用户端ios
      if (/android\/dakale/i.test(u)) return 'dakaleAndroid'; // 用户端android
      return false;
    };
    // 检查环境获取参数
    this.checkAppParams = function (fnNames, paramObj = {}) {
      const checkApp = that.getPhone();
      let fnKey = '';
      let param = {};
      const { params = {}, path } = paramObj;
      switch (checkApp) {
        case 'dakaleIOS':
          let paramIos = { param: params };
          if (fnNames === 'linkTo') {
            paramIos = { path: pathNative[path].ios, param: params };
          }
          fnKey = that.ios[fnNames];
          param = paramIos;
          break;
        case 'dakaleAndroid':
          let paramAndroid = { ...params };
          if (fnNames === 'linkTo') {
            paramAndroid = { path: pathNative[path].android, ...params };
          }
          fnKey = that.android[fnNames];
          param = paramAndroid;
          break;
        case 'miniProgram':
          fnKey = that.miniProgram[fnNames];
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
      const checkApp = that.getPhone();
      if (!checkApp) return;
      let that = this;
      if (checkApp === 'dakaleIOS') {
        const { fnKey, param } = this.checkAppParams(fnName, paramObj.ios);
        if (callback && typeof callback == 'function') {
          callback(window.prompt(fnKey, JSON.stringify(param)));
        } else {
          window.webkit.messageHandlers[fnKey].postMessage(JSON.stringify(param));
        }
      } else if (checkApp === 'dakaleAndroid') {
        const { fnKey, param } = this.checkAppParams(fnName, paramObj.android);
        if (callback && typeof callback == 'function') {
          that.dsBridgeAsyc(fnName, param, callback);
        } else {
          window['AndroidObj'][fnKey](Object.values(param)).bind(window);
          that.dsBridgeSynchro(fnKey, param);
        }
      } else if (checkApp === 'miniProgram') {
        const { fnKey, param } = this.checkAppParams(fnName, paramObj.miniProgram);
        const { params, path } = param;
        wx.miniProgram[fnKey]({ url: this.urlGet(path, params) });
      }
    };
  }
}

const native = new nativeOther();

export default `var bridge={default:this,call:function(b,a,c){var e='';'function'==typeof a&&((c=a),(a={}));a={data:void 0===a?null:a};if('function'==typeof c){var g='dscb'+window.dscb++;window[g]=c;a._dscbstub=g}a=JSON.stringify(a);if(window._dsbridge)e=_dsbridge.call(b,a);else if(window._dswk||-1!=navigator.userAgent.indexOf('_dsbridge'))e=prompt('_dsbridge='+b,a);return JSON.parse(e||'{}').data},register:function(b,a,c){c=c?window._dsaf:window._dsf;window._dsInit||((window._dsInit=!0),setTimeout(function(){bridge.call('_dsb.dsinit')},0));'object'==typeof a?(c._obs[b]=a):(c[b]=a)},registerAsyn:function(b,a){this.register(b,a,!0)},hasNativeMethod:function(b,a){return this.call('_dsb.hasNativeMethod',{name:b,type:a||'all'})},disableJavascriptDialogBlock:function(b){this.call('_dsb.disableJavascriptDialogBlock',{disable:!1!==b})},};!(function(){if(!window._dsf){var b={_dsf:{_obs:{}},_dsaf:{_obs:{}},dscb:0,dsBridge:bridge,close:function(){bridge.call('_dsb.closePage')},_handleMessageFromNative:function(a){var e=JSON.parse(a.data),b={id:a.callbackId,complete:!0},c=this._dsf[a.method],d=this._dsaf[a.method],h=function(a,c){b.data=a.apply(c,e);bridge.call('_dsb.returnValue',b)},k=function(a,c){e.push(function(a,c){b.data=a;b.complete=!1!==c;bridge.call('_dsb.returnValue',b)});a.apply(c,e)};if(c)h(c,this._dsf);else if(d)k(d,this._dsaf);else if(((c=a.method.split('.')),!(2>c.length))){a=c.pop();var c=c.join('.'),d=this._dsf._obs,d=d[c]||{},f=d[a];f&&'function'==typeof f?h(f,d):((d=this._dsaf._obs),(d=d[c]||{}),(f=d[a])&&'function'==typeof f&&k(f,d))}},},a;for(a in b)window[a]=b[a];bridge.register('_hasJavascriptMethod',function(a,b){b=a.split('.');if(2>b.length)return!(!_dsf[b]&&!_dsaf[b]);a=b.pop();b=b.join('.');return(b=_dsf._obs[b]||_dsaf._obs[b])&&!!b[a]})}})();const pathNative={goods:{ios:'DKLAroundDiscountGoodsDetailViewController',android:'SpecialGoodPage',miniProgram:'pages/perimeter/favourableDetails/index',},};class nativeOther{constructor(){this.ios={close:'finish',hideTitle:'hideTitle',linkTo:'goNativePage',getToken:'getToken',getCode:'goNativePage',goShare:'callUpShare',getUserLocationInfo:'getUserLocationInfo',};this.android={close:'finish',hideTitle:'hideTitle',linkTo:'goNativePage',getToken:'getToken',getCode:'openScan',goShare:'share',getUserLocationInfo:'getLatAndLnt',};this.miniProgram={linkTo:'navigateTo',};this.queryParams=(data)=>{if(!data)return'';let _result=[];for(let key in data){let value=data[key];if(['',undefined,null].includes(value)){continue}if(Array.isArray(value)){value=value.toString()}_result.push(key+'='+value)}console.log(_result.length?'?'+_result.join('&'):'');return _result.length?'?'+_result.join('&'):''};this.urlGet=(url,params)=>url+queryParams(params);this.getPhone=function(){var u=navigator.userAgent.toLowerCase();if(/miniProgram/i.test(u))return'miniProgram';if(/ios\/dakale/i.test(u))return'dakaleIOS';if(/android\/dakale/i.test(u))return'dakaleAndroid';return false};this.checkAppParams=function(fnNames,paramObj={}){const checkApp=that.getPhone();let fnKey='';let param={};const{params={},path}=paramObj;switch(checkApp){case'dakaleIOS':let paramIos={param:params};if(fnNames==='linkTo'){paramIos={path:pathNative[path].ios,param:params}}fnKey=that.ios[fnNames];param=paramIos;break;case'dakaleAndroid':let paramAndroid={...params};if(fnNames==='linkTo'){paramAndroid={path:pathNative[path].android,...params}}fnKey=that.android[fnNames];param=paramAndroid;break;case'miniProgram':fnKey=that.miniProgram[fnNames];param={path:pathNative[path].miniProgram,params};break;default:break}return{fnKey,param}};this.dsBridgeSynchro=function(fnName,params){bridge.call(fnName,params?JSON.stringify(params):'')};this.dsBridgeAsyc=function(fnName,params,callback){if(Object.keys(params).length>0){return bridge.call(fnName,JSON.stringify(params),function(res){callback(res)})}return bridge.call(fnName,function(res){callback(res)})};this.nativeInit=function(fnName,paramObj={},callback){const checkApp=that.getPhone();if(!checkApp)return;let that=this;if(checkApp==='dakaleIOS'){const{fnKey,param}=this.checkAppParams(fnName,paramObj.ios);if(callback&&typeof callback=='function'){callback(window.prompt(fnKey,JSON.stringify(param)))}else{window.webkit.messageHandlers[fnKey].postMessage(JSON.stringify(param))}}else if(checkApp==='dakaleAndroid'){const{fnKey,param}=this.checkAppParams(fnName,paramObj.android);if(callback&&typeof callback=='function'){that.dsBridgeAsyc(fnName,param,callback)}else{window['AndroidObj'][fnKey](Object.values(param)).bind(window);that.dsBridgeSynchro(fnKey,param)}}else if(checkApp==='miniProgram'){const{fnKey,param}=this.checkAppParams(fnName,paramObj.miniProgram);const{params,path}=param;wx.miniProgram[fnKey]({url:this.urlGet(path,params)})}}}}const native=new nativeOther();`;
