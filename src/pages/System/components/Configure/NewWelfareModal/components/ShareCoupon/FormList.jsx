import React from 'react';
import { Space } from 'antd';
import { MinusCircleOutlined, UpSquareOutlined, DownSquareOutlined } from '@ant-design/icons';
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
        return (
          <>
            <div className={styles.listItem_img}>
              <img src={goodsItem.goodsImg} />
            </div>
            <div className={styles.listItem_info}>
              <div>商品名称：{goodsItem.goodsName}</div>
              <div>售价：{goodsItem.buyFlag === '0' ? '免费' : `￥${goodsItem.realPrice}`}</div>
              <div>
                <span className={styles.tip}>原价：￥{goodsItem.oriPrice}</span>
              </div>
            </div>
          </>
        );
      })()}
      {fields.length > 1 && <MinusCircleOutlined onClick={() => remove(field.name)} />}
    </Space>
  );
};

export default FormList;
