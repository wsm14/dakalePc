import React from 'react';
import { couponsDom, goodsDom } from './CouponFreeDom';
import './coupon.less';

const ShareCoupon = (props) => {
  const { data = {}, type, onSelect, onDel } = props;

  const {
    // 券
    couponName,
    buyFlag,
    // 商品
    goodsName,
  } = data;

  // 券
  return type === 'coupon' && couponName ? (
    couponsDom(data, '', '', buyFlag == 0 ? 'free' : 'valuable', onDel)
  ) : type === 'goods' && goodsName ? (
    goodsDom(data, '', '', onDel)
  ) : (
    <div className="share_Coupon share_add" onClick={onSelect}>
      +
    </div>
  );
};

export default ShareCoupon;
