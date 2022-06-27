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
  function showList(source, payC = 50, shareC) {
    const domShow = (item) => {
      const cellDom = `<div class="handleGoNative"  data-key="goodsId,ownerId" data-goodsId=${
        item.goodsId
      } data-ownerId=${item.ownerId} data-path="goods" data-linkType="inside" 
        style="height: inherit;width: ${vw(172)};border-radius: ${vw(4)};margin-bottom: ${vw(
        8,
      )}; background-color: #FFFFFF;overflow: hidden;">
        <div style="height: ${vw(137)};background: url(${item.goodsImg}) center / cover;"></div>
        <div style="padding:${vw(5)} ${vw(8)} ${
        item.paymentModeType === 'defaultMode' ? vw(12) : vw(15)
      }">
        <div style="height:${vw(43)};font-size: ${vw(16)};line-height:${vw(
        22,
      )};color: #333333;display: -webkit-box;overflow: hidden; white-space:normal;text-overflow: clip;word-wrap:break-word;-webkit-line-clamp:2;-webkit-box-orient:vertical">${
        item.goodsName
      }</div>
      <div style="margin-top: ${vw(12)};font-size: ${vw(
        16,
      )};font-weight: bold;color: #333333;line-height: initial;display: flex; align-items: center;">
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
  
      <div style="display: flex; align-items: center;">
     ${
       item.paymentModeType === 'defaultMode'
         ? `<div
        style="height: ${vw(18)};
          margin-top: ${vw(6)};
          max-width:${vw(97)};
          margin-right: ${vw(4)};
          border-radius:${vw(2)};
          display: inline-flex;align-items: center;overflow: hidden;position: relative;background-color: #FEF1F4;"
      >
        <div
          style="width: ${vw(34)};
          height: inherit;background-image: url(https://wechat-config.dakale.net/miniprogram/image/icon895.png);background-size: 100% 100%;background-repeat: no-repeat;flex-shrink: 0;"></div>
        <div
          style="font-size: ${vw(14)};
          padding: 0 ${vw(4)};
          font-weight: bold;color: #ef476f;overflow: hidden;white-space: nowrap;text-overflow: ellipsis">
          ¥${computedPrice(item.sellPrice, payC)}
        </div>
      </div>`
         : ''
     }
     ${
       shareC
         ? `<div
           style="height: ${vw(18)};
          margin-top: ${vw(6)};
          border-radius: ${vw(2)};
          margin-right: ${vw(4)};
          display: inline-flex;align-items: center;overflow: hidden;position: relative;background-color: #FEF1F4;flex: 1;max-width: fit-content;"
         >
           <div
             style="width: ${vw(18)};
            background-size: ${vw(12)} ${vw(10)};
            height: inherit;background-image: url(https://wechat-config.dakale.net/miniprogram/image/z_icon.png);background-color: #FCE2E8;background-repeat: no-repeat;background-position: center;flex-shrink: 0"
           ></div>
           <div
             style="padding: 0 ${vw(4)};
            font-size: ${vw(14)};
            font-weight: bold;color: #ef476f;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;"
           >
           ¥${computedPrice(item.sellPrice - item.settlePrice, shareC)}
           </div>
         </div>`
         : ''
     }
    </div>
       </div></div>`;
      if (native.getPhone() === 'wxChatWebView') {
        return wxOpenLaunchWeapp(cellDom, item.ownerId, item.goodsId);
      }
      return cellDom;
    };

    document.getElementById(
      id,
    ).innerHTML = `<div style="display: flex;justify-content: space-between;flex-wrap: wrap;padding:${vw(
      8,
    )} ${vw(12)};">
    <div>${source
      .filter((item, i) => i % 2 == 0)
      .map((item) => domShow(item))
      .join('')}</div>
    <div>${source
      .filter((item, i) => i % 2 != 0)
      .map((item) => domShow(item))
      .join('')}</div>
    </div>`;
  }
}.toString());
