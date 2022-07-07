import React, { useState } from 'react';
import { Form, Button } from 'antd';
import GoodsSelectModal from '@/components/GoodsSelectModal';
import FormList from './FormList';

const ShareCoupon = (props) => {
  const { type, form } = props;

  const [visible, setVisible] = useState(false); // 特惠和权益商品多选

  // 券
  return (
    <>
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
                <Button disabled={fields.length === 50} block onClick={() => setVisible(true)}>
                  + 选择特惠商品
                </Button>
              </Form.Item>
            </>
          );
        }}
      </Form.List>
      <GoodsSelectModal
        showTag={['specialGoods']}
        visible={visible}
        goodsValues={form.getFieldValue(type) || []}
        onSumbit={({ list }) => {
          form.setFieldsValue({ [type]: list });
        }}
        onClose={() => setVisible(false)}
      ></GoodsSelectModal>
    </>
  );
};

export default ShareCoupon;
