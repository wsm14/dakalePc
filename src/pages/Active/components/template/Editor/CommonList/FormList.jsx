import React from 'react';
import { Space } from 'antd';
import { MinusCircleOutlined, UpSquareOutlined, DownSquareOutlined } from '@ant-design/icons';
import styles from './index.less';

// Banner跳转类型
export const BANNER_JUMP_TYPE = { '': '无', H5: 'H5', inside: '原生页面' };

const FormList = (props) => {
  const { form, fields, field, remove, move } = props;

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
        const goodsItem = form.getFieldValue('list')[field.name];
        return (
          <>
            <div className={styles.listItem_img}>
              <img src={goodsItem.goodsImg} />
            </div>
            <div className={styles.listItem_info}>
              <div>商品名称：{goodsItem.goodsName}</div>
              <div>原价：￥{goodsItem.realPrice}</div>
              <div>
                售价：<span className={styles.tip}>￥{goodsItem.oriPrice}</span>
              </div>
            </div>
          </>
        );
      })()}
      {fields.length > 1 && (
        <MinusCircleOutlined
          style={{ marginBottom: 12 }}
          onClick={() => {
            remove(field.name);
          }}
        />
      )}
    </Space>
  );
};

export default FormList;
