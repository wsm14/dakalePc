import React, { useState } from 'react';
import { couponsDom } from './CouponFreeDom';
import CoupomSelectModal from './CoupomSelectModal';
import '../../SpecialGoods/index.less';

/**
 * 选择优惠券
 * @param {Object} data 商品数据
 * @param {String} merchantIdKey 商家id
 * @param {Function} onDel 删除方法
 * @param {Function} onOk 确认选择
 */
const ShareCoupon = (props) => {
  const { data = {}, merchantIdKey = 'merchantId', onDel, onOk, form } = props;

  const [visibleContact, setVisibleContact] = useState(false); // 优惠选择

  const { couponName, buyFlag } = data; // 商品

  const selectProps = {
    merchantId: form.getFieldValue(['param', merchantIdKey]),
    ownerType: 'merchant',
  };

  // 券
  return (
    <>
      {couponName ? (
        couponsDom(data, '', '', buyFlag == 0 ? 'free' : 'valuable', onDel)
      ) : (
        <div
          className="share_Coupon share_add"
          onClick={() => {
            form.validateFields([['param', merchantIdKey]]).then(() => {
              setVisibleContact(true);
            });
          }}
        >
          +
        </div>
      )}
      {/* 优惠选择 */}
      <CoupomSelectModal
        {...selectProps}
        visible={visibleContact}
        onOk={onOk}
        onClose={() => setVisibleContact(false)}
      ></CoupomSelectModal>
    </>
  );
};

export default ShareCoupon;
