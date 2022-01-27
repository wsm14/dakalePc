export default (function (platformCouponIds, uid, coupon_end, coupon_bag) {
  // 判断是否已经全部领完
  function checkCouponRemain(list) {
    if (list.every((i) => Number(i.remain) == 0 || i.couponStatus !== '1')) {
      document.getElementById(`btnGetCoupon`).setAttribute('src', coupon_end);
    }
  }

  function getCouponList() {
    HTTP_GET('/common/platform/coupon/listPlatformCouponByIds', {
      platformCouponIds: platformCouponIds.toString(),
    })
      .then((res) => {
        const { content } = res;
        const { platformCouponList = [] } = content;
        showList(platformCouponList);
        checkCouponRemain(platformCouponList);
        document.getElementById(`btnGetCoupon`).setAttribute(
          'data-idList',
          platformCouponList
            .filter((i) => i.remain && i.couponStatus === '1')
            .map((i) => i.platformCouponId)
            .toString(),
        );
      })
      .catch(() => {
        showList([]);
      });
  }

  getCouponList();

  function showList(source) {
    console.log('source', source);
    const PLATFORM_TICKET_TYPE = {
      goodsBuy: {
        universal: '商品通用券',
        category: '行业商品券',
        merchant: '店铺商品券',
        goods: '指定商品券',
      },
      // scan: '扫码',
      virtual: {
        universal: '虚拟通用券',
        goods: '指定虚拟券',
      },
      commerce: {
        universal: '电商通用券',
        goods: '指定电商券',
      },
      // community: '团购',
    };

    document.getElementById(uid).innerHTML = `${source
      .map((item) => {
        const {
          couponValue, // 券价值
          thresholdPrice, // 门槛
          useScenesType,
          classType,
          couponName,
          remain,
          couponStatus,
          activeDateStr, //  使用有效期-固定时间-开始时间
          activeDate,
          endDateStr, //  使用有效期-固定时间-结束时间
          endDate,
          delayDays = 0, // 使用有效期-领取后-延迟生效天数
          activeDays, // 使用有效期-领取后-有效天数
        } = item;
        return `<div class="coupon_content" style="background-image: url(${coupon_bag});">
          <div class="coupon_title">${couponName}</div>
          <div class="coupon_time">${
            (activeDateStr && endDateStr) || (activeDate && endDate)
              ? `限 ${activeDateStr || activeDate} 至 ${endDateStr || endDate} 使用`
              : delayDays != 0
              ? `领取后${delayDays}天生效｜有效期${activeDays}天`
              : `有效期：领取后${activeDays}天内`
          }</div>
          <div class="coupon_price">
            <span class="coupon_price_tag">¥</span>
            <span class="coupon_price_num">${couponValue}</span>
            <span class="coupon_price_info">满${thresholdPrice}可用</span>
          </div>
          <div class="coupon_type_tag">${PLATFORM_TICKET_TYPE[useScenesType][classType]}</div>
          ${!remain || couponStatus !== '1' ? `<div class="coupon_end"></div>` : ''}
        </div>`;
      })
      .join('')}`;
  }
}.toString());

// 领取券
export const userGetCoupon = `<script>
$('body').on('click', "#btnGetCoupon", function() {
  var evn = native.getPhone();
  if (evn) {
    native.nativeInit('getToken', {}, (val) => {
      // token 存在
      if (val && val.length > 0) {
        HTTP_POST('',{ids:$(this).attr("data-idList")}).then((res) => {
          // 领取成功 关闭
          native.nativeInit('close');
        })
        .catch(() => {
          // 没有获取到 关闭
          native.nativeInit('close');
        });
      }
    });   
  }
});
</script>`;

const vwGet = (px) => (px / 375) * 100 + 'vw';

export const couponStyle = () => {
  return [
    `<style>
  .globalModal_coupon {
    position: relative;
    width: ${vwGet(270)};
    border-radius: ${vwGet(20)};
  }
  .globalModal_coupon_head {
    position: absolute;
    top: -${vwGet(35)};
  }
  .globalModal_coupon_title {
    display: flex;
    justify-content: center;
    margin-bottom: ${vwGet(12)};
  }
  .globalModal_coupon_group {
    max-height: ${vwGet(192)};
    padding: 0 ${vwGet(16)};
    overflow-y: auto;
  }
  .globalModal_coupon_footer {
    display: flex;
    justify-content: center;
    padding: ${vwGet(12)} 0;
  }

  .coupon_content {
    position: relative;
    height: ${vwGet(84)};
    padding: ${vwGet(12)} 0 0 ${vwGet(16)};
    background-size: 100% 100%;
  }

  .coupon_content + .coupon_content {
    margin-top: ${vwGet(8)};
  }

  .coupon_title {
    overflow: hidden;
    color: #333333;
    font-weight: bold;
    font-size: ${vwGet(14)};
    line-height: ${vwGet(14)};
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .coupon_time {
    margin-top: ${vwGet(8)};
    color: #999999;
    font-size: ${vwGet(10)};
    line-height: ${vwGet(10)};
  }

  .coupon_price {
    margin-top: ${vwGet(8)};
  }

  .coupon_price .coupon_price_tag {
    color: #ef476f;
    font-weight: bold;
    font-size: ${vwGet(12)};
    line-height: ${vwGet(12)};
  }

  .coupon_price .coupon_price_num {
    color: #ef476f;
    font-weight: bold;
    font-size: ${vwGet(20)};
    line-height: ${vwGet(20)};
  }

  .coupon_price .coupon_price_info {
    color: #999999;
    font-size: ${vwGet(10)};
    line-height: ${vwGet(10)};
  }

  .coupon_type_tag {
    position: absolute;
    right: ${vwGet(8)};
    bottom: ${vwGet(8)};
    padding: ${vwGet(3)} ${vwGet(6)};
    color: #ef476f;
    font-size: ${vwGet(10)};
    line-height: ${vwGet(10)};
    background-color: #fdecf0;
    border-radius: ${vwGet(4)};
  }

  .coupon_end {
    position: absolute;
    top: ${vwGet(6)};
    right: ${vwGet(6)};
    width: ${vwGet(40)};
    height: ${vwGet(40)};
    background-image: url('https://resource-new.dakale.net/admin/image/globalModal/end_icon.png');
    background-size: 100% 100%;
  }
</style>`,
  ];
};
