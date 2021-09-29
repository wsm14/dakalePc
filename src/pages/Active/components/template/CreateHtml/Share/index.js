export default (function (data, id) {
  function getPhone() {
    var u = navigator.userAgent.toLowerCase();
    if (/miniProgram/i.test(u)) return 'miniProgram';
    if (u.indexOf('ios/dakale') > -1) return 'dakaleIOS';
    if (u.indexOf('android/dakale') > -1) return 'dakaleAndroid';
    return false;
  }

  if (['dakaleIOS', 'dakaleAndroid'].includes(getPhone())) showShare(data);

  // 默认50%
  function showShare(data) {
    const { img, width, height, x, y } = data;
    const vw = (px) => (px / 2 / 375) * 100 + 'vw';

    const getUrlParam = (shareKey) => {
      const query = window.location.search.substring(1);
      const vars = query.split('&');
      for (let i = 0; i < vars.length; i++) {
        const pair = vars[i].split('=');
        if (pair[0] == shareKey) {
          return pair[1];
        }
      }
      return false;
    };

    document.getElementById(id).innerHTML = `<img src="${img}" style="width: ${vw(width)};
    height: ${vw(height)};
    position: absolute;
    top: ${vw(y)};
    left: ${vw(x)};
    zIndex: 10"
    data-native="goShare"
    data-key="shareType,operateItem,subType,callType,nativeShowPlatform,sharePlatform" 
    data-shareType="${getUrlParam('shareType')}"
    data-subType="${getUrlParam('shareKey')}"
    data-callType="native"
    data-operateItem="savePhoto"
    data-nativeShowPlatform="wechatFriend,wechatMoment"
    data-sharePlatform="SharePlatformDialog"
    class="handleGoNative"></img>`;
  }
}.toString());
