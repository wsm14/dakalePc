import React from 'react';
import dom from './dom.less';
import { PLATFORM_TICKET_TYPE } from '@/common/constant';

// 回显dom
export default ({ coupon_bag, list = [] }) => {
  return (
    <div>
      {list.map((item = {}) => {
        const {
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
          <div
            key={item.platformCouponId}
            className={dom.coupon_content}
            style={{
              backgroundImage: `url(${coupon_bag})`,
            }}
          >
            <div className={dom.coupon_title}>{couponName}</div>
            <div className={dom.coupon_time}>
              {(activeDateStr && endDateStr) || (activeDate && endDate)
                ? `限 ${activeDateStr || activeDate} 至 ${endDateStr || endDate} 使用`
                : delayDays != 0
                ? `领取后${delayDays}天生效｜有效期${activeDays}天`
                : `有效期：领取后${activeDays}天内`}
            </div>
            <div className={dom.coupon_price}>
              <span className={dom.coupon_price_tag}>¥</span>
              <span className={dom.coupon_price_num}>{couponValue}</span>
              <span className={dom.coupon_price_info}>满{thresholdPrice}可用</span>
            </div>
            <div className={dom.coupon_type_tag}>
              {PLATFORM_TICKET_TYPE[useScenesType][classType]}
            </div>
            {!remain && <div className={dom.coupon_end}></div>}
          </div>
        );
      })}
    </div>
  );
};
