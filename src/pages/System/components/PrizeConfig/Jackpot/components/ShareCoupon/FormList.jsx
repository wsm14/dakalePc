import React from 'react';
import { Space } from 'antd';
import { UpSquareOutlined, DownSquareOutlined, DeleteOutlined } from '@ant-design/icons';
import { goodsDom, couponsDom, platformCouponsDom } from './CouponFreeDom';
import styles from './index.less';

const FormList = (props) => {
  const { type, form, field, remove } = props;
  return (
    <Space key={field.key} className={styles.ifame_carouseal} align="baseline">
      {(() => {
        const goodsItem = form.getFieldValue(type)[field.name];
        return {
          platformCoupon: platformCouponsDom(goodsItem, goodsItem?.platformCouponId),
          rightGoods: goodsDom(goodsItem, goodsItem?.specialGoodsId),
          rightCoupon: couponsDom(goodsItem, goodsItem?.ownerCouponIdString),
        }[goodsItem?.tagType || 'platformCoupon'];
      })()}
       <DeleteOutlined onClick={() => remove(field.name)} />
    </Space>
  );
};

export default FormList;
