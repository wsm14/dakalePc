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

  // 默认50%
  function showList(source, payC = 50, shareC) {
    const vw = (px) => (px / 375) * 100 + 'vw';
    const wxOpenLaunchWeapp = (html, mid, sid) =>
      `<wx-open-launch-weapp 
        username="gh_7ffa23a2dcd1" 
        path="pages/perimeter/favourableDetails/index.html?merchantId=${mid}&specialActivityId=${sid}">
        <script type="text/wxtag-template">${html}<\\/script>
      </wx-open-launch-weapp>`;
    document.getElementById(
      id,
    ).innerHTML = `<div style="display: flex;justify-content: space-between;padding: 0 ${vw(
      12,
    )};flex-wrap: wrap">
${source
  .map((item) => {
    const cellDom = `<div class="handleGoNative"  data-key="specialActivityId,merchantId" data-specialActivityId=${
      item.specialGoodsId
    } data-merchantId=${item.ownerIdString} data-path="goods" data-linkType="inside" 
      style="width: ${vw(172)};border-radius: ${vw(4)};margin-bottom: ${vw(
      12,
    )}; background: #FFFFFF;padding:${vw(4)} ${vw(4)} ${vw(12)}">
      <div style="width: ${vw(164)};height: ${vw(122)};border-radius: ${vw(2)};background: url(${
      item.goodsImg
    }) center / cover;"></div>
      <div style="padding:${vw(12)} ${vw(4)} 0">
      <div style="font-size: ${vw(
        14,
      )};color: #333333; white-space:nowrap;text-overflow: ellipsis;overflow: hidden;">${
      item.goodsName
    }</div>
      <div style="font-size: ${vw(12)};margin-top: ${vw(
      8,
    )};color: #999999; display: flex; align-items: center;">
      <img src="${item.ownerImg}" style="border-radius: 50%;width: ${vw(15)};height: ${vw(
      15,
    )};margin-right: ${vw(4)};background-color: #f5f5f5;"></img>
      <div style="flex: 1;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;line-height: initial">${
        item.ownerName
      }</div>
      </div>
      <div style="margin-top: ${vw(
        12,
      )};white-space: nowrap;text-overflow: ellipsis;overflow: hidden;line-height: initial">
      <span style="font-size: ${vw(12)}; color: #333333; margin-top: ${vw(
      7,
    )}">优惠价: <span style="font-size: ${vw(14)}; font-weight: bold">¥${
      item.realPrice
    }</span></span><span style="font-size: ${vw(12)}; color: #999999; margin-left: ${vw(
      4,
    )}">原价: <span style="text-decoration: line-through">¥${item.oriPrice}</span></span></div>
      <div style="height: ${vw(16)};border-radius: ${vw(8)};margin-top: ${vw(
      4,
    )};display: inline-flex;align-items: center;overflow: hidden;position: relative;">
        <div style="font-size: ${vw(10)};padding-left: ${vw(4)};padding-right: ${vw(
      3,
    )};height: ${vw(
      16,
    )};background: #ef476f;display: flex;align-items: center;color: #ffffff;;z-index: 1;width: max-content;">卡豆再省</div>
        <div style="width: 0;height: 0;border-top: ${vw(16)} solid #ef476f;border-right:${vw(
      2,
    )} solid transparent;;z-index: 1"></div>
        <div style="font-size: ${vw(12)};border-radius: 0 ${vw(50)} ${vw(50)} 0;padding-right: ${vw(
      4,
    )};font-weight: bold;color: #ef476f;background: #ffffff;padding-left: ${vw(
      10,
    )};margin-left: -${vw(10)};border: 1px solid #ef476f;height: ${vw(
      16,
    )};display: flex;align-items: center;max-width:max-content;">￥<div style="white-space: nowrap;text-overflow: ellipsis;overflow: hidden;">${computedPrice(
      item.realPrice,
      payC,
    )}</div>
      </div>
      </div>
      <div style="width: ${vw(154)};height: ${vw(27)};border-radius: ${vw(13)};font-size: ${vw(
      14,
    )}; margin-top: ${vw(
      16,
    )};background: #EF476F;color: #FFFFFF;display: flex;align-items: center;justify-content: center;line-height: normal;white-space: nowrap;">
      ${
        shareC ? `分享赚￥${computedPrice(item.realPrice - item.merchantPrice, shareC)}` : '抢购'
      }</div></div></div>`;
    if (native.getPhone() === 'wxChatWebView') {
      return wxOpenLaunchWeapp(cellDom, item.ownerIdString, item.specialGoodsId);
    }
    return cellDom;
  })
  .join('')}</div>`;
  }
}.toString());
