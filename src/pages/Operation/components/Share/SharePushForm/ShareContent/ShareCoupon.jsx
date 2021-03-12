import React from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import './coupon.less';

const ShareCoupon = (props) => {
  const { data = {}, type, onSelect, onDel } = props;

  const {
    // 券
    reduceObject = {},
    couponName,
    activeDate, //  使用有效期-固定时间-开始时间
    endDate, //  使用有效期-固定时间-结束时间
    delayDays = 0, // 使用有效期-领取后-延迟生效天数
    activeDays, // 使用有效期-领取后-有效天数
    // 商品
    goodsName,
  } = data;

  // 券
  const { couponPrice, thresholdPrice = 0 } = reduceObject;

  return type === 'coupon' && couponName ? (
    <div className="share_Coupon">
      <div className="share_left">价值¥{couponPrice}</div>
      <div className="share_title">
        <div>{couponName}</div>
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
      </div>
      <div className="share_del_icon" onClick={onDel}>
        <DeleteOutlined />
      </div>
    </div>
  ) : type === 'goods' && goodsName ? (
    <div className="share_Coupon">
      <div className="share_left" style={{ width: 80, height: 80 }}></div>
      <div className="share_title">
        <div>{couponName}</div>
        <div className="share_tip">{`有效期：${activeDate} - ${endDate}`}</div>
        <div className="share_tip" style={{ textAlign: 'right' }}>
          <span style={{ textDecoration: 'line-through', marginRight: 10 }}>¥20</span>
          ¥10.50
        </div>
      </div>
      <div className="share_del_icon" onClick={onDel}>
        <DeleteOutlined />
      </div>
    </div>
  ) : (
    <div className="share_Coupon share_add" onClick={onSelect}>
      +
    </div>
  );
};

export default ShareCoupon;
