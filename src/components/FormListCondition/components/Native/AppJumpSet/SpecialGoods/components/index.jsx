import React, { useState } from 'react';
import { goodsDom } from './CouponFreeDom';
import GoodsSelectModal from './GoodsSelectModal';
// import FreeCouponModal from './FreeCouponModal';
import '../index.less';

/**
 * 选择商品或者券
 * @param {Object} data 商品数据
 * @param {String} merchantIdKey 商家id
 * @param {Function} onDel 删除方法
 * @param {Function} onOk 确认选择
 */
const ShareCoupon = (props) => {
  const { data = {}, merchantIdKey = 'merchantId', onDel, onOk, form } = props;

  const [visibleContact, setVisibleContact] = useState(false); // 优惠选择

  const { goodsName } = data; // 商品

  const selectProps = {
    merchantId: form.getFieldValue(['param', merchantIdKey]),
    ownerType: 'merchant',
  };

  // 券
  return (
    <>
      {goodsName ? (
        goodsDom(data, '', '', onDel)
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
      <GoodsSelectModal
        {...selectProps}
        visible={visibleContact}
        onOk={onOk}
        onClose={() => setVisibleContact(false)}
      ></GoodsSelectModal>
    </>
  );
};

export default ShareCoupon;
