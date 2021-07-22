// vw 计算
const vw = (px) => (px / 375) * 100 + 'vw';

// script
const scriptTag = (dom, data) => `<script>(${dom.toString()})(${JSON.stringify(data)})</script>`;

// 单张图片
const solaImg = (data) => {
  const dom = ({ img, linkType, url, path }) => {
    document.body.innerHTML += `<img src="${img}" data-linkType="${linkType}" data-path="${
      url || path
    }" style="width: 100vw;display: block;" onclick="handleGoNative(this)"></img>`;
  };

  return scriptTag(dom, data);
};

// 轮播图片
const carouseal = ({ list }) => {
  const dom = (list) => {
    document.body.innerHTML += `<div class="swiper-container"><div class="swiper-wrapper">${list
      .map(
        ({ img, linkType, url, path }) =>
          `<div class="swiper-slide"><img src="${img}" data-linkType="${linkType}" data-path="${
            url || path
          }" style="width: 100%;display: block;" onclick="handleGoNative(this)"></img></div>`,
      )
      .join('')}</div><div class="swiper-pagination"></div></div>`;
  };
  return scriptTag(dom, list);
};

// 商品列表
const commonList = ({ styleIndex, list }) => {
  const domClass = [
    (source) => {
      const vw = (px) => (px / 375) * 100 + 'vw';
      document.body.innerHTML += `<div style="padding: ${vw(4)} ${vw(12)} ${vw(16)}">
  ${source
    .map(
      (item) => `<div style="padding: ${vw(8)};border-radius: ${vw(4)};margin-top: ${vw(
        12,
      )}; background: #FFFFFF;display: flex;align-items: center;"><div style="width: ${vw(
        112,
      )};height: ${vw(112)};margin-right: ${vw(8)};border-radius: ${vw(4)};background: url(${
        item.goodsImg
      });background-size: cover;"></div><div style="flex: 1"><div style="font-size: ${vw(
        14,
      )};color: #333333; white-space:nowrap;text-overflow: ellipsis;">${
        item.goodsName
      }</div><div style="font-size: ${vw(12)};margin-top: ${vw(
        10,
      )};color: #999999; display: flex; align-items: center;"><img src="${
        item.ownerImg
      }" style="border-radius: 50%;width: ${vw(15)};height: ${vw(15)};margin-right: ${vw(
        4,
      )};background-color: #f5f5f5;"></img>${
        item.ownerName
      }</div><div style="width: 100%; display: flex; align-items: flex-end"><div style="flex: 1"><div style="font-size: ${vw(
        12,
      )}; color: #999999; margin-top: ${vw(
        17,
      )}">原价：<span style="text-decoration: line-through">¥${
        item.oriPrice
      }</span></div><div style="font-size: ${vw(12)}; color: #333333; margin-top: ${vw(
        7,
      )}">优惠价：<span style="font-size: ${vw(14)}; font-weight: bold">¥${
        item.realPrice
      }</span></div></div><div data-key="specialActivityId,merchantId" data-specialActivityId=${
        item.specialGoodsId
      } data-merchantId=${
        item.ownerIdString
      } data-path="goods" data-linkType="inside" onclick="handleGoNative(this)" style="width: ${vw(
        52,
      )};height: ${vw(27)};border-radius: ${vw(13)};font-size: ${vw(
        14,
      )};background: #EF476F;color: #FFFFFF;display: flex;align-items: center;justify-content: center;line-height: normal;">
      抢购</div></div></div></div>`,
    )
    .join('')}</div>`;
    },
  ][styleIndex];

  return scriptTag(domClass, list);
};

export default { solaImg, commonList, carouseal };
