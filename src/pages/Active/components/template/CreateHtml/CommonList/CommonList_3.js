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
    document.getElementById(
      id,
    ).innerHTML = `<div style="display: flex;justify-content: space-between;padding: 0 ${vw(
      12,
    )};flex-wrap: wrap">
${source
  .map(
    (
      item,
    ) => `<div class="handleGoNative"  data-key="specialActivityId,merchantId" data-specialActivityId=${
      item.specialGoodsId
    } data-merchantId=${item.ownerIdString} data-path="goods" data-linkType="inside" 
    style="width: ${vw(115)};border-radius: ${vw(3)};margin-bottom: ${vw(
      4,
    )}; background: #FFFFFF;padding:${vw(4)} ${vw(4)} ${vw(8)}">
    <div style="width: ${vw(106)};height: ${vw(79)};border-radius: ${vw(1)};background: url(${
      item.goodsImg
    }) center / cover;"></div>
    <div style="padding:${vw(12)} ${vw(2)} 0">
    <div style="font-size: ${vw(
      13,
    )};color: #333333; white-space:nowrap;text-overflow: ellipsis;overflow: hidden;">${
      item.goodsName
    }</div>
    <div style="font-size: ${vw(12)};margin-top: ${vw(
      8,
    )};color: #999999; display: flex; align-items: center;">
    <img src="${item.ownerImg}" style="border-radius: 50%;width: ${vw(12)};height: ${vw(
      12,
    )};margin-right: ${vw(4)};background-color: #f5f5f5;"></img>
    <div style="flex: 1;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;line-height: initial">${
      item.ownerName
    }</div>
    </div><div style="font-size: ${vw(12)}; color: #999999; margin-top: ${vw(
      12,
    )};white-space: nowrap;text-overflow: ellipsis;overflow: hidden;line-height: initial">原价: <span style="text-decoration: line-through">¥${
      item.oriPrice
    }</span></div>
    <div style="font-size: ${vw(12)}; color: #333333; margin-top: ${vw(
      5,
    )};white-space: nowrap;text-overflow: ellipsis;overflow: hidden;line-height: initial">优惠价: <span style="font-size: ${vw(
      14,
    )}; font-weight: bold">¥${item.realPrice}</span></div>
    <div style="height: ${vw(16)};border-radius: ${vw(8)};margin-top: ${vw(
      4,
    )};display: inline-flex;align-items: center;overflow: hidden;position: relative;">
      <div style="font-size: ${vw(10)};padding-left: ${vw(4)};padding-right: ${vw(3)};height: ${vw(
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
    )};display: flex;align-items: center;max-width: ${vw(
      60,
    )}">￥<div style="white-space: nowrap;text-overflow: ellipsis;overflow: hidden;">${computedPrice(
      item.realPrice,
      payC,
    )}</div>
    </div>
    ${
      shareC
        ? `<div style="margin-top: ${vw(4)};font-size: ${vw(
            10,
          )};color: #EF476F;">赚￥${computedPrice(
            item.realPrice - item.merchantPrice,
            shareC,
          )}</div>`
        : ''
    }
    </div></div>`,
  )
  .join('')}</div>`;
  }
}.toString());
