export default `var evn = native.getPhone();
  if (evn === 'wxChatWebView') {
  HTTP_GET('/user/wechat/fetchWechatTicket', { url: location.href.split('#')[0] })
    .then((data) => {
      wx.config({
        debug: false, // 如果分享失败，把0改成1开启错误提示看看
        appId: data.appId,
        timestamp: data.timestamp,
        nonceStr: data.nonceStr,
        signature: data.signature,
        openTagList: ['wx-open-launch-weapp'],
      });
    })
    .catch(() => {});
  }`;
