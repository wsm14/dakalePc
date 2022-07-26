import React from 'react';
import { Space } from 'antd';
import { BUSINESS_TYPE } from '@/common/constant';
import { MinusCircleOutlined, UpSquareOutlined, DownSquareOutlined } from '@ant-design/icons';
import styles from './index.less';

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
        const item = form.getFieldValue('list')[field.name];
        return (
          <>
            <div className={styles.listItem_img}>
              <img src={item.coverImg} />
            </div>
            <div className={styles.listItem_info}>
              <div>店铺名称：{item.merchantName}</div>
              <div>店铺类型：{BUSINESS_TYPE[item.merchantType]}</div>
            </div>
          </>
        );
      })()}
      {fields.length > 1 && <MinusCircleOutlined onClick={() => remove(field.name)} />}
    </Space>
  );
};

export default FormList;
