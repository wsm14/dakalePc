import React from 'react';
import { Space } from 'antd';
import { UpSquareOutlined, DownSquareOutlined, DeleteOutlined } from '@ant-design/icons';
import { goodsDom, commerceDom } from './CouponFreeDom';
import styles from './index.less';

const FormList = (props) => {
  const { type, form, fields, field, remove, move } = props;

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

      {(() => {
        const goodsItem = form.getFieldValue(type)[field.name];
        console.log('goodsItem', goodsItem);
        return {
          specialGoods: goodsDom(goodsItem, goodsItem?.activityGoodsId),
          commerceGoods: commerceDom(goodsItem, goodsItem?.activityGoodsId),
          selfTourGoods: goodsDom(goodsItem, goodsItem?.activityGoodsId),
        }[type];
      })()}
      <DeleteOutlined onClick={() => remove(field.name)} />
    </Space>
  );
};

export default FormList;
