import React, { useState } from 'react';
import { notification } from 'antd';
import GoodsSelectModal from '@/components/GoodsSelectModal';
import { couponsDom, goodsDom, commerceDom } from './CouponFreeDom';
import './coupon.less';

/**
 * 选择券
 */
const ShareCoupon = (props) => {
  const {
    data = {},
    merchantIdKey = 'merchantIdStr',
    show = 'free',
    ownerName,
    ownerType = 'merchant',
    newShowTag,
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
        data.activityType === 'commerceGoods' ? (
          commerceDom(data, '', '', onDel)
        ) : (
          goodsDom(data, '', '', onDel)
        )
      ) : (
        <div
          className="share_Coupon_box share_Coupon share_add"
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
      <GoodsSelectModal
        selectType={'radio'}
        showTag={['freeReduceCoupon']}
        searchParams={{ ownerId: selectProps.merchantId, ...selectProps }}
        visible={visibleSelect}
        onSumbit={({ list }) => onOk(list[0])}
        onClose={() => setVisibleSelect(false)}
      ></GoodsSelectModal>
      {/* 优惠选择 */}
      <GoodsSelectModal
        selectType={'radio'}
        showTag={newShowTag || ['reduceCoupon', 'specialGoods', 'commerceGoods']}
        searchParams={{ id: selectProps.merchantId, relateName: ownerName }} // id 有价券搜索 ownerName 特惠商品搜索
        visible={visibleContact}
        onSumbit={({ list }) => onOk(list)}
        onClose={() => setVisibleContact(false)}
      ></GoodsSelectModal>
    </>
  );
};

export default ShareCoupon;
