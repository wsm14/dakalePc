import React, { useState } from 'react';
// import { notification } from 'antd';
import { Form, Button } from 'antd';
import { platformCouponsDom, couponsDom, goodsDom } from './CouponFreeDom';
import GoodsSelectModal from './GoodsSelectModal';
import FormList from './FormList';

import './coupon.less';

const ShareCoupon = (props) => {
  const { type = '', form, data = [], handleType } = props;

  const [visible, setVisible] = useState(false); // 平台券、权益商品和权益券多选

  // 券
  return (
    <>
      <Form.Item label="指定商品" required>
        <Form.List
          name="ruleConditions"
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
            return (
              <>
                <Form.Item>
                  <Button type="link" onClick={() => setVisible(true)}>
                    {'+ 新增'}
                  </Button>
                </Form.Item>
                <Form.ErrorList errors={errors} />

                {fields.map((field, i) => (
                  <FormList
                    handleType={handleType}
                    key={field.fieldKey}
                    form={form}
                    fields={fields}
                    field={field}
                    remove={remove}
                    move={move}
                  ></FormList>
                ))}
              </>
            );
          }}
        </Form.List>
      </Form.Item>

      {
        //  平台券、权益商品、权益券
        <GoodsSelectModal
          form={form}
          visible={visible}
          onClose={() => setVisible(false)}
        ></GoodsSelectModal>
      }
    </>
  );
};

export default ShareCoupon;
