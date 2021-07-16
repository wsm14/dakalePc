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
              <img src="https://img.alicdn.com/imgextra/i1/1030217383/O1CN015YnVHM24PSqOEpNNb_!!1030217383.jpg_100x100" />
            </div>
            <div className={styles.listItem_info}>
              <div>{goodsItem.name}</div>
              <div>店铺名层店铺名层店铺名层店铺名层店铺名层店铺名层</div>
              <div>￥124512</div>
              <div className={styles.tip}>￥124512</div>
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
