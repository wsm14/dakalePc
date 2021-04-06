// 优惠券样式
export const couponsDom = (item = {}, id, setSelectItem) => {
  const {
    reduceObject = {},
    couponName,
    remain,
    ownerCouponId = 1,
    activeDate, //  使用有效期-固定时间-开始时间
    endDate, //  使用有效期-固定时间-结束时间
    delayDays = 0, // 使用有效期-领取后-延迟生效天数
    activeDays, // 使用有效期-领取后-有效天数
  } = item;
  const { couponPrice, thresholdPrice = 0 } = reduceObject;
  return (
    <div
      key={ownerCouponId}
      className={`share_Coupon share_item ${id === ownerCouponId && 'select'}`}
      style={{ marginBottom: 6 }}
      onClick={() => setSelectItem(item)}
    >
      <div className="share_left">价值¥{couponPrice}</div>
      <div className="share_title">
        <div className="titile">{couponName}</div>
        <div className="share_tip">
          {activeDate && endDate
            ? `有效期：${activeDate} - ${endDate}`
            : delayDays != 0
            ? `领取后${delayDays}天生效｜有效期${activeDays}天`
            : `有效期：领取后${activeDays}天内`}
        </div>
        <div className="share_tip">
          {thresholdPrice == 0 ? `满${thresholdPrice}元可用` : '无门槛'}
        </div>
        <div className="share_tip">剩余{remain}张</div>
      </div>
      <div className="share_select_icon">
        <div className="share_select"></div>
      </div>
    </div>
  );
};

// 商品样式
export const goodsDom = (item = {}, id, setSelectItem) => {
  const { couponName, remain, ownerCouponId = 2 } = item;
  return (
    <div
      key={ownerCouponId}
      className={`share_Coupon share_item ${id === ownerCouponId && 'select'}`}
      style={{ marginBottom: 6, height: 78 }}
      onClick={() => setSelectItem(item)}
    >
      <div className="share_left" style={{ width: 60, height: 60 }}></div>
      <div className="share_title">
        <div className="titile">{couponName}</div>
        <div className="share_tip">¥12</div>
        <div className="share_tip">剩余{remain}张</div>
      </div>
      <div className="share_select_icon">
        <div className="share_select"></div>
      </div>
    </div>
  );
};
