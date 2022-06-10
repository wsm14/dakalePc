export default (function (data, id) {
  function getPhone() {
    var u = navigator.userAgent.toLowerCase();
    if (/miniProgram/i.test(u)) return 'miniProgram';
    if (u.indexOf('ios/dakale') > -1) return 'dakaleIOS';
    if (u.indexOf('android/dakale') > -1) return 'dakaleAndroid';
    return false;
  }

  if (['dakaleIOS', 'dakaleAndroid'].includes(getPhone())) showShare(data);

  function getUrlParam(shareKey) {
    const query = window.location.search.substring(1);
    const vars = query.split('&');
    for (let i = 0; i < vars.length; i++) {
      const pair = vars[i].split('=');
      if (pair[0] == shareKey) {
        return pair[1];
      }
    }
    return false;
  }

  function vw(px) {
    return (px / 2 / 375) * 100 + 'vw';
  }

  // 默认50%
  function showShare(data) {
    const { img, width, height, x, y } = data;

    document.getElementById(id).innerHTML = `<img src="${img}" style="width: ${vw(width)};
    height: ${vw(height)};
    position: absolute;
    top: ${vw(y)};
    left: ${vw(x)};
    zIndex: 10"
    data-native="goShare"
    data-key="shareId,subType,shareType,operateItem,callType,nativeShowPlatform,sharePlatform,wechatType" 
    data-shareType="activityH5"
    data-subType="activity"
    data-shareId="${getUrlParam('shareKey')}"
    data-callType="native"
    data-wechatType="h5"
    data-operateItem="savePhoto"
    data-nativeShowPlatform="wechatFriend,wechatMoment"
    data-sharePlatform="SharePlatformDialog"
    class="handleGoNative"></img>`;
  }
}.toString());
