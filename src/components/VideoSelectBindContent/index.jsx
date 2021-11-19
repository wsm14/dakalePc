import React, { useState } from 'react';
import { notification } from 'antd';
import { couponsDom, goodsDom, commerceDom } from './CouponFreeDom';
import BuyContactModal from './BuyContactModal';
import FreeCouponModal from './FreeCouponModal';
import './coupon.less';

/**
 * 选择券
 */
const ShareCoupon = (props) => {
  const {
    data = {},
    merchantIdKey = 'merchantIdStr',
    show = 'free',
    ownerType = 'merchant',
    type,
    onDel,
    onOk,
    form,
  } = props;

  const [visibleSelect, setVisibleSelect] = useState(false); // 免费券选择
  const [visibleContact, setVisibleContact] = useState(false); // 优惠选择

  const selectProps = {
    merchantId: form.getFieldValue(merchantIdKey),
    ownerType,
  };

  const {
    // 券
    couponName,
    buyFlag,
    // 商品
    goodsName,
  } = data;

  // 券
  return (
    <>
      {type === 'coupon' && couponName ? (
        couponsDom(data, '', '', buyFlag == 0 ? 'free' : 'valuable', onDel)
      ) : type === 'goods' && goodsName ? (
        data.paymentModeObject ? (
          commerceDom(data, '', '', onDel)
        ) : (
          goodsDom(data, '', '', onDel)
        )
      ) : (
        <div
          className="share_Coupon share_add"
          onClick={() => {
            if (!form.getFieldValue(merchantIdKey)) {
              notification.info({
                message: '温馨提示',
                description: '请选择店铺',
              });
              return;
            }
            if (show === 'free') {
              setVisibleSelect(true);
            } else setVisibleContact(true);
          }}
        >
          +
        </div>
      )}
      {/* 免费券选择 */}
      <FreeCouponModal
        {...selectProps}
        visible={visibleSelect}
        onOk={onOk}
        onClose={() => setVisibleSelect(false)}
      ></FreeCouponModal>
      {/* 优惠选择 */}
      <BuyContactModal
        {...selectProps}
        visible={visibleContact}
        onOk={onOk}
        onClose={() => setVisibleContact(false)}
      ></BuyContactModal>
    </>
  );
};

export default ShareCoupon;
