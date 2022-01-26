import React from 'react';
import { Space, Form } from 'antd';
import { UpSquareOutlined, DownSquareOutlined, DeleteOutlined } from '@ant-design/icons';
import { goodsDom } from './CouponFreeDom';
import styles from './index.less';

const FormList = (props) => {
  const { type, form, fields, field, remove, move, handleType } = props;

  return (
    <Space key={field.key} className={styles.ifame_carouseal} align="baseline">
      {(() => {
        const goodsItem = form.getFieldValue(type)[field.name];
        return goodsDom(goodsItem, goodsItem?.specialGoodsId);

        // return (
        //   <>
        //     <div className={styles.listItem_img}>
        //       <img src={goodsItem.goodsImg} />
        //     </div>
        //     <div className={styles.listItem_info}>
        //       <div>商品名称：{goodsItem.goodsName}</div>
        //       <div>售价：{goodsItem.buyFlag === '0' ? '免费' : `￥${goodsItem.realPrice}`}</div>
        //       <div>
        //         <span className={styles.tip}>原价：￥{goodsItem.oriPrice}</span>
        //       </div>
        //     </div>
        //   </>
        // );
      })()}
      {handleType !== 'edit' && <DeleteOutlined onClick={() => remove(field.name)} />}
      <Form.Item
        name={['subRewardList', 'total']}
        rules={[{ required: true, message: '请输入每月奖品总量' }]}
        noStyle
      >
        <InputNumber min={0} placeholder="每月奖品总量" />
      </Form.Item>
    </Space>
  );
};

export default FormList;
