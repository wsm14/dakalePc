import React, { useState, useEffect } from 'react';
import { Space, InputNumber } from 'antd';
import { UpSquareOutlined, DownSquareOutlined, DeleteOutlined } from '@ant-design/icons';
import { goodsDom, commerceDom } from './CouponFreeDom';
import styles from './index.less';

const FormList = (props) => {
  const { type, form, fields, field, remove, move } = props;
  const [nameIndex, setNameIndex] = useState(Number);

  useEffect(() => {
    setNameIndex(field.name + 1);
  }, [field]);

  const inputDom = () => {
    return (
      <InputNumber
        size="small"
        value={nameIndex}
        onChange={(val) => setNameIndex(val)}
        onPressEnter={() => move(field.name, nameIndex - 1)}
        precision={0}
        min={1}
        max={fields.length}
        style={{ width: 60 }}
      ></InputNumber>
    );
  };

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
        return {
          specialGoods: goodsDom({ ...goodsItem, inputDom }, goodsItem?.activityGoodsId), // 特惠，自我游
          commerceGoods: commerceDom({ ...goodsItem, inputDom }, goodsItem?.activityGoodsId), // 电商品
        }[goodsItem.activityType];
      })()}
      <DeleteOutlined onClick={() => remove(field.name)} />
    </Space>
  );
};

export default FormList;
