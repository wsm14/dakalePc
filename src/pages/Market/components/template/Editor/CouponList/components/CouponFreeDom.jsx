import { Badge } from 'antd';

// 商品样式
export const goodsDom = (item = {}, idArr = [], handleSelect, type) => {
  const {
    reduceObject = {},
    couponName,
    remain,
    buyPrice, // 售卖价格
    ownerCouponIdString,
    activeDate, //  使用有效期-固定时间-开始时间
    endDate, //  使用有效期-固定时间-结束时间
    delayDays = 0, // 使用有效期-领取后-延迟生效天数
    activeDays, // 使用有效期-领取后-有效天数
  } = item;
  const { couponPrice, thresholdPrice = '' } = reduceObject;
  return (
    <div style={{ width: 350 }} key={ownerCouponIdString}>
      <Badge.Ribbon text={{ free: '免费券', valuable: '抵扣券' }[type]}>
        <div
          className={`share_Coupon share_item ${
            idArr.findIndex((ci) => ci.ownerCouponIdString === ownerCouponIdString) > -1 && 'select'
          }`}
          onClick={() => handleSelect && handleSelect(item)}
        >
          <div className="share_left" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            价值
            <div>￥{couponPrice}</div>
            <div>{buyPrice ? `￥${buyPrice}` : ''}</div>
          </div>
          <div className="share_title">
            <div className="titile">{couponName}</div>
            <div className="share_tip">
              {activeDate && endDate
                ? `有效期：${activeDate} - ${endDate}`
                : delayDays != 0
                ? `领取后${delayDays}天生效｜有效期${activeDays}天`
                : `有效期：领取后${activeDays}天内`}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div className="share_tip">
                {thresholdPrice ? `满${thresholdPrice}元可用` : '无门槛'}
              </div>
              <div className="share_tip" style={{ color: '#b1b1b1' }}>
                剩余{remain}张
              </div>
            </div>
          </div>
          <div className="share_select_icon">
            <div className="share_select"></div>
          </div>
        </div>
      </Badge.Ribbon>
    </div>
  );
};
