export default (function (list, id) {
  showList(list);

  // 默认50%
  function showList(source) {
    const vw = (px) => (px / 375) * 100 + 'vw';
    document.getElementById(id).innerHTML = `<div style="padding: ${vw(4)} ${vw(12)} ${vw(16)}">
${source
  .map(
    (item) =>
      `<div class="handleGoNative"  data-key="merchantName,id" data-merchantName=${
        item.merchantName
      } data-id=${item.userMerchantIdString} data-path=${
        item.merchantType
      } data-linkType="inside" style="padding: ${vw(8)};border-radius: ${vw(4)};margin-top: ${vw(
        12,
      )}; background: #FFFFFF;"><div style="display: flex;align-items: center;width: 100%"><div style="width: ${vw(
        88,
      )};height: ${vw(88)};margin-right: ${vw(8)};border-radius: ${vw(2)};background: url(${
        item.coverImg
      }) center/cover;background-color: #f5f5f5;"></div><div style="font-size:${vw(
        12,
      )};flex:1;overflow: hidden"><div style="font-size: ${vw(
        14,
      )};font-weight: bold;color: #333333;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">${
        item.merchantName
      }</div>${
        item.businessTime
          ? `<div style="font-size: ${vw(
              12,
            )};color: #108588;background-color: rgba(16,133,136,0.09);padding: ${vw(3)} ${vw(
              4,
            )};margin-top: ${vw(
              10,
            )};width: fit-content;"><span style="font-weight: bold">营业时间</span><span style="display: inline-block; width: 1px;height: ${vw(
              10,
            )}; background: rgba(16,133,136,0.3);margin: ${vw(0)} ${vw(
              4,
            )};"></span><span style="color: #108588">${item.businessTime}</span></div>`
          : ''
      }${
        item.perCapitaConsumption
          ? `<div style="color: #999999; margin-top: ${vw(10)}">人均￥${
              item.perCapitaConsumption
            }</div>`
          : ''
      }
      <div style="color: #999999; margin-top:${vw(10)}; display: flex">${
        item.topCategoryName
          ? `<div style="margin-right: ${vw(10)}">${item.topCategoryName}</div>`
          : ''
      }<div style="flex: 1;overflow: hidden;white-space: nowrap; text-overflow: ellipsis;">${
        item.address
      }</div></div></div></div><div style="font-size: ${vw(12)}; color: #333333; display: flex">${
        item.totalMarkBean
          ? `<div style="margin: ${vw(12)} 0 ${vw(
              4,
            )};display: flex;align-items: center;"><img style="width: ${vw(
              15,
            )}" src="https://resource-new.dakale.net/admin/image/merchant/beans.png"></img><span style="color: #EF476F;margin: 0 ${vw(
              8,
            )} 0 ${vw(4)}">打卡捡豆${item.totalMarkBean}</span></div>`
          : ''
      }${
        item.onSellGoodsNum
          ? `<div style="margin:  ${vw(12)} 0  ${vw(
              4,
            )}; display: flex;align-items: center;"><img style="width: ${vw(
              16,
            )}"src="https://resource-new.dakale.net/admin/image/merchant/odds.png"></img><span style="margin: 0 ${vw(
              8,
            )} 0 ${vw(4)}">${item.onSellGoodsNum}款特惠热卖中</span></div>`
          : ''
      }
      ${
        item.onSellCouponList
          ? `<div style="margin: ${vw(12)} 0 ${vw(
              4,
            )}; flex: 1; overflow: hidden; display: flex;align-items: center;"><img style="width: ${vw(
              16,
            )}" src="https://resource-new.dakale.net/admin/image/merchant/bond.png"
          ></img><span style="margin: 0 ${vw(8)} 0 ${vw(
              4,
            )};flex: 1;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;"
          >${item.onSellCouponList
            .filter((i) => i.buyPrice)
            .map((i) => `${i.buyPrice}元代${i?.reduceObject?.couponPrice}元`)
            .join('，')}</span></div>`
          : ''
      }</div></div>`,
  )
  .join('')}</div>`;
  }
}.toString());
