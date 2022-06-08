import { Badge } from 'antd';
import { PLATFORM_TICKET_TYPE } from '@/common/constant';
import '../index.less';

// 平台券样式
export const couponDom = (item = {}, idArr = [], handleSelect) => {
  const {
    platformCouponId = '',
    couponValue, // 券价值
    thresholdPrice, // 门槛
    useScenesType,
    classType,
    couponName,
    remain,
    activeDateStr, //  使用有效期-固定时间-开始时间
    activeDate,
    endDateStr, //  使用有效期-固定时间-结束时间
    endDate,
    delayDays = 0, // 使用有效期-领取后-延迟生效天数
    activeDays, // 使用有效期-领取后-有效天数
  } = item;
  return (
    <div className='GlobalModalPlatformCoupon' style={{ width: 350 }} key={platformCouponId}>
      <Badge.Ribbon text={PLATFORM_TICKET_TYPE[useScenesType][classType]}>
        <div
          className={`share_Coupon share_item ${
            idArr.findIndex((ci) => ci.platformCouponId === platformCouponId) > -1 && 'select'
          }`}
          onClick={() => handleSelect && handleSelect(item)}
        >
          <div className="share_left" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            <div className='price'>￥{couponValue}</div>
            <div>满{thresholdPrice}元可用</div>
          </div>
          <div className="share_title">
            <div className="titile">{couponName}</div>
            <div className="share_tip">
              {(activeDateStr && endDateStr) || (activeDate && endDate)
                ? `${activeDateStr || activeDate} - ${endDateStr || endDate}`
                : delayDays != 0
                ? `领取后${delayDays}天生效｜有效期${activeDays}天`
                : `有效期：领取后${activeDays}天内`}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div className="share_tip">{platformCouponId}</div>
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
