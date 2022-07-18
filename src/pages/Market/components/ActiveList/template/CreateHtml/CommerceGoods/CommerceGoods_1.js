export default (function (list, id) {
  function getUrlKey(name) {
    return (
      decodeURIComponent(
        (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [
          ,
          '',
        ])[1].replace(/\+/g, '%20'),
      ) || null
    );
  }

  function getCommission(token) {
    HTTP_GET('/user/userInfo/getUserShareCommission', { token })
      .then((res) => {
        const { content } = res;
        const { configUserLevelInfo } = content;
        // payBeanCommission 省钱比例 shareCommission 分享赚比例
        const { payBeanCommission, shareCommission } = configUserLevelInfo;
        showList(list, payBeanCommission, shareCommission);
      })
      .catch(() => {
        // 没有获取到 直接渲染
        showList(list);
      });
  }

  // 赚多少 特惠价格realPrice-商家结算价merchantPrice*比例payBeanCommission
  // 省多少 特惠价格realPrice*shareCommission
  const computedPrice = (price, scale) => {
    let size = (price * (scale / 100)).toFixed(3);
    size = size.substring(0, size.length - 1);
    if (size === '0.00') {
      return 0.01;
    } else return size;
  };

  var evn = native.getPhone();
  if (evn) {
    if (evn === 'miniProgram') {
      getCommission(getUrlKey('token'));
    } else if (evn === 'wxChatWebView') {
      showList(list);
    } else {
      native.nativeInit('getToken', {}, (val) => {
        if (val && val.length > 0) {
          getCommission(val);
        } else {
          // 直接渲染
          showList(list);
        }
      });
    }
  } else {
    // 直接渲染
    showList(list);
  }

  function getUrlParam(shareKey) {
    const query = window.location.search.substring(1);
    const vars = query.split('&');
    for (let i = 0; i < vars.length; i++) {
      const pair = vars[i].split('=');
      if (pair[0] == shareKey) {
        return pair[1];
      }
    }
    return '';
  }

  function wxOpenLaunchWeapp(html, mid, sid) {
    const path = `pages/perimeter/favourableDetails/index.html?ownerId=${mid}&goodsId=${sid}&shareUserId=${getUrlParam(
      'shareUserId',
    )}&shareUserType=${getUrlParam('shareUserType')}&activityType=commerceGoods`;

    return `<div style="position: relative">
    ${html}
    <wx-open-launch-weapp 
      username="gh_7ffa23a2dcd1" 
      path="${path}"
      style="position: absolute;width: 100%;height: 100%;top:0"
    >
    <template>
      <style>
        .weappArea{
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 10
        }
      </style>
      <div class="weappArea"></div>
    </template>
    </wx-open-launch-weapp>
  </div>`;
  }

  function vw(px) {
    return (px / 375) * 100 + 'vw';
  }

  // 默认50%
  function showList(source, payC = 20, shareC) {
    document.getElementById(id).innerHTML = `<div style="padding: ${vw(12)} ${vw(
      12,
    )}; background-color: #FFFFFF">
${source
  .map((item, index) => {
    const cellDom = `<div class="handleGoNative"  data-key="goodsId,ownerId,activityType" data-goodsId=${
      item.goodsId
    } data-ownerId=${
      item.ownerId
    } data-activityType="commerceGoods" data-path="commerceGoods" data-linkType="inside" style="margin-bottom: ${
      source.length - 1 === index ? 0 : vw(12)
    };border-radius: ${vw(
      4,
    )};display: flex;align-items: center;position: relative;background-color: #FFFFFF;">
    <div style="width: ${vw(112)};height: ${vw(112)};margin-right: ${vw(8)};border-radius: ${vw(
      4,
    )};background: url(${item.goodsImg}) center / cover;" ></div>
    <div style="flex: 1;overflow: hidden;height: ${vw(112)};">
    <div style="height: ${vw(31)};font-size: ${vw(14)};lineHeight: ${vw(
      20,
    )};display: -webkit-box;color: #333333;overflow: hidden; white-space:normal;text-overflow: clip;word-wrap:break-word;-webkit-line-clamp:2;-webkit-box-orient:vertical">${
      item.goodsName
    }</div>
    <div style="width: 100%; display: flex; align-items: flex-end;margin-top: ${vw(42)};">
    <div style="flex: 1">
    <div style="font-size: ${vw(
      16,
    )}; line-height: 1;font-weight:bold;color: #333333;; display: flex; align-items: center;">
    ${
      {
        defaultMode: `¥${item.sellPrice}`,
        cashMode: `¥${item.sellPrice}`,
        self: `<span>
              ¥${item.sellPrice}+${item.sellBean}
            </span>
            <span style="font-size: ${vw(12)}; margin-left: ${vw(2)};">卡豆</span>`,
        free: '¥0',
      }[item.paymentModeType]
    }
    </div>
   ${
     item.paymentModeType === 'defaultMode'
       ? `<div style="height: ${vw(18)};margin-top: ${vw(4)};border-radius: ${vw(
           2,
         )};display: inline-flex;align-items: center;overflow: hidden;position: relative;background-color: #FEF1F4;">
  <div style="width: ${vw(
    34,
  )};height: inherit;background-image:url(https://wechat-config.dakale.net/miniprogram/image/icon895.png);background-size: contain;">
    </div>
    <div style="font-size: ${vw(14)};font-weight: bold;color: #ef476f;padding: 0 ${vw(4)};">
    ¥${computedPrice(item.sellPrice, payC)}
    </div>
    </div>`
       : ''
   }</div><div style=" min-width:${vw(60)};padding: 0 ${vw(8)};height: ${vw(
      26,
    )};border-radius: ${vw(13)};font-size: ${vw(
      14,
    )};background: #EF476F;color: #FFFFFF;display: flex;align-items: center;justify-content: center;position: absolute;right: 0;bottom: 0;">
      ${
        item.paymentModeType == 'defaultMode' && shareC
          ? `分享赚￥${computedPrice(item.sellPrice - item.settlePrice, shareC)}`
          : '抢购'
      }</div></div></div></div>`;
    if (native.getPhone() === 'wxChatWebView') {
      return wxOpenLaunchWeapp(cellDom, item.ownerId, item.goodsId);
    }
    return cellDom;
  })
  .join('')}</div>`;
  }
}.toString());
