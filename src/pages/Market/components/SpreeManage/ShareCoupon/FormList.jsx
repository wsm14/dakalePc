import React from 'react';
import { Space } from 'antd';
import { UpSquareOutlined, DownSquareOutlined, DeleteOutlined } from '@ant-design/icons';
import { platformCouponsDom } from './CouponFreeDom';
import styles from './index.less';

const FormList = (props) => {
  const { type, form, fields, field, remove, move, handleType } = props;

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
        return platformCouponsDom(goodsItem, goodsItem?.platformCouponId);
      })()}
      {handleType !== 'edit' && <DeleteOutlined onClick={() => remove(field.name)} />}
    </Space>
  );
};

export default FormList;
