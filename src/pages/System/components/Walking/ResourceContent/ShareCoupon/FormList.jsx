import React, { useState, useEffect } from 'react';
import { Space } from 'antd';
import { UpSquareOutlined, DownSquareOutlined } from '@ant-design/icons';
import { goodsDom, commerceDom } from '@/components/VideoSelectBindContent/CouponFreeDom';
import styles from './index.less';

const FormList = (props) => {
  const { type, form, field, remove, move } = props;
  const [goodsItem, setGoodsItem] = useState({});

  useEffect(() => {
    setGoodsItem(form.getFieldValue(type)[field.name]);
  }, [field]);

  return (
    <Space key={field.key} className={styles.ifame_carouseal} align="baseline">
      <div className={styles.ifame_btnArr}>
        <UpSquareOutlined
          onClick={() => {
            move(field.name, field.name - 1);
          }}
        />
        <DownSquareOutlined
          onClick={() => {
            move(field.name, field.name + 1);
          }}
        />
      </div>
      {
        {
          specialGoods: goodsDom({ ...goodsItem }, goodsItem?.activityGoodsId, '', () =>
            remove(field.name),
          ), // 特惠，自我游
          commerceGoods: commerceDom({ ...goodsItem }, goodsItem?.activityGoodsId, '', () =>
            remove(field.name),
          ), // 电商品
        }[goodsItem.goodsType]
      }
    </Space>
  );
};

export default FormList;
