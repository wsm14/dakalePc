import React, { useState } from 'react';
// import { notification } from 'antd';
import { Form, Button } from 'antd';
import { couponsDom, goodsDom } from './CouponFreeDom';
import BuyContactModal from './BuyContactModal';
import GoodsSelectModal from './GoodsSelectModal';
import FormList from './FormList';

import './coupon.less';

const ShareCoupon = (props) => {
  const { type, form } = props;

  const [visible, setVisible] = useState(false); // 特惠和权益商品多选

  // 券
  return (
    <>
      {
        <Form.List
          name={type}
          rules={[
            {
              validator: async (_, names) => {
                if (!names || names.length < 1) {
                  return Promise.reject(new Error('请至少选择1个商品'));
                }
              },
            },
          ]}
        >
          {(fields, { remove, move }, { errors }) => {
            // console.log(fields);
            return (
              <>
                {fields.map((field, i) => (
                  <FormList
                    type={type}
                    key={field.fieldKey}
                    form={form}
                    fields={fields}
                    field={field}
                    remove={remove}
                    move={move}
                  ></FormList>
                ))}
                <Form.ErrorList errors={errors} />
                <Form.Item>
                  <Button type="link" onClick={() => setVisible(true)}>
                    {'+ 新增'}
                  </Button>
                </Form.Item>
              </>
            );
          }}
        </Form.List>
      }
      {
        //  平台券、权益商品、权益券
        <GoodsSelectModal
          typeGoods={type}
          form={form}
          visible={visible}
          onClose={() => setVisible(false)}
        ></GoodsSelectModal>
      }
    </>
  );
};

export default ShareCoupon;
