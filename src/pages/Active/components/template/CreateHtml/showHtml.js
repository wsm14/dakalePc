// 单张图片
const solaImg = ({ img }) =>
  (document.body.innerHTML += `<img src="${img}" style="width: 100vw" ></img>`);

// 商品列表
const commonList = (styleIndex) => {
  return [
    (list) => {
      var vw = (px) => (px / 375) * 100 + 'vw';
      document.body.innerHTML += `<div style="padding: ${vw(4)} ${vw(12)} ${vw(16)}"">
  ${list
    .map(
      (item) => `
    <div
      style="padding: ${vw(8)};border-radius: ${vw(4)};margin-top: ${vw(
        12,
      )}; background: #FFFFFF;display: flex;align-items: center;"
    >
      <div style="width: ${vw(112)};height: ${vw(112)};margin-right: ${vw(8)};border-radius: ${vw(
        4,
      )};background: url(${item.goodsImg});background-size: cover;"></div>
      <div style="flex: 1; overflow: hidden">
      <div style="font-size: ${vw(
        14,
      )};color: #333333; overflow: hidden; white-space:nowrap;text-overflow: ellipsis;">
      ${item.goodsName}
      </div>
      <div style="font-size: ${vw(12)};margin-top: ${vw(
        8,
      )};color: #999999; display: flex; align-items: center;">
          <img src="${item.ownerImg}" style="border-radius: 50%;width: ${vw(15)};height: ${vw(
        15,
      )};margin-right: ${vw(4)};background-color: #f5f5f5;"></img>
          ${item.ownerName}
      </div>
      <div style="width: 100%; display: flex; align-items: flex-end">
        <div style="flex: 1">
          <div style="font-size: ${vw(12)}; color: #999999; margin-top: ${vw(16)}">
            原价: <span style="text-decoration: line-through">¥${item.realPrice}</span>
          </div>
          <div style="font-size: ${vw(12)}; color: #333333; margin-top: ${vw(4)}">
            优惠价:<span style="font-size: ${vw(14)}; font-weight: bold">¥${item.oriPrice}</span>
          </div></div>
        <div data-key="specialActivityId,merchantId" data-specialActivityId=${
            item.specialGoodsId
          } data-merchantId=${
        item.ownerIdString
      } data-path="goods" onclick="handleGoNative(this)" style="width: ${vw(52)};height: ${vw(
        27,
      )};border-radius: ${vw(13)};font-size: ${vw(
        14,
      )};background: #EF476F;color: #FFFFFF;display: flex;align-items: center;justify-content: center;">
      抢购</div></div></div></div>`,
    )
    .join('')}</div>`;
    },
  ][styleIndex];
};

export default { solaImg, commonList };
