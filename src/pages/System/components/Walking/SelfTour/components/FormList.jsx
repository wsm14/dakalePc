import React, { useState, useEffect } from 'react';
import { Space, InputNumber } from 'antd';
import { MinusCircleOutlined, UpSquareOutlined, DownSquareOutlined } from '@ant-design/icons';
import Ellipsis from '@/components/Ellipsis';
import styles from './index.less';

const FormList = (props) => {
  const { type, form, fields, field, remove, move } = props;
  const [nameIndex, setNameIndex] = useState(Number);

  useEffect(() => {
    setNameIndex(field.name + 1);
  }, [field]);

  const goodsItem = form.getFieldValue(type)[field.name];

  return (
    <div className={styles.productContent}>
      <div className={styles.ownerName}>
        <Ellipsis length={10} tooltip>
          {goodsItem.ownerName}
        </Ellipsis>
      </div>
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
          return (
            <>
              <div className={styles.listItem_img}>
                <img src={goodsItem.goodsImg} />
              </div>
              <div className={styles.listItem_info}>
                <div>商品名称：{goodsItem.goodsName}</div>
                <div>售价：{goodsItem.buyFlag === '0' ? '免费' : `￥${goodsItem.sellPrice}`}</div>
                <div>
                  <span className={styles.tip}>原价：￥{goodsItem.oriPrice}</span>
                </div>
                <div className={styles.sheets}>剩余{goodsItem.remain}张</div>
              </div>
            </>
          );
        })()}
        {fields.length > 1 && (
          <div>
            <InputNumber
              size="small"
              value={nameIndex}
              onChange={(val) => setNameIndex(val)}
              onPressEnter={() => move(field.name, nameIndex - 1)}
              precision={0}
              min={1}
              max={fields.length}
              style={{ width: 60, marginRight: 10 }}
            ></InputNumber>
            <MinusCircleOutlined onClick={() => remove(field.name)} />
          </div>
        )}
      </Space>
    </div>
  );
};

export default FormList;
