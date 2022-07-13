import React, { useState } from 'react';
import { commerceDom, platformCouponsDom } from '@/components/VideoSelectBindContent/CouponFreeDom';
import GoodsSelectModal from '@/components/GoodsSelectModal';
import './index.less';

const ShareCoupon = (props) => {
  const { data, type, onDel, onOk } = props;

  const [visible, setVisible] = useState(false); // 特惠和权益商品选择

  const { goodsId } = data || {};

  const showDom =
    type == 'commerceGoods'
      ? commerceDom(data, '', '', onDel)
      : platformCouponsDom(data, '', '', onDel);

  return (
    <>
      {goodsId ? (
        showDom
      ) : (
        <div className="share_Coupon share_add" onClick={() => setVisible(true)}>
          +
        </div>
      )}
      <GoodsSelectModal
        showTag={[type]}
        visible={visible}
        goodsValues={Object.keys(data).length ? [data] : []}
        selectType="radio"
        searchParams={{ useScenesType: 'goodsBuy,virtual,commerce' }}
        onSumbit={({ list }) => onOk(list[0])}
        onClose={() => setVisible(false)}
      ></GoodsSelectModal>
    </>
  );
};

export default ShareCoupon;
